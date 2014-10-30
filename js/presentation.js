import factory from 'js/repl';
import { cons } from 'js/dom-console';

let slides = document.querySelector('.slides');
let height = parseInt(window.getComputedStyle(slides, null).getPropertyValue('height'), 10);
let width = parseInt(window.getComputedStyle(slides, null).getPropertyValue('width'), 10);

Reveal.initialize({
  height: height,
  width: width,

  history: true,
  margin: 0,

  transition: 'linear',
  dependencies: [
    { src: 'plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },
    { src: 'plugin/notes/notes.js', async: true, condition: function() { return !!document.body.classList; } }
  ]
});

Reveal.configure({
  keyboard: {
    27: function () {
      if (cons.elem === null) {
        Reveal.toggleOverview();
      } else {
        handlers.clear();
      }
    }
  }
});

let currentSlide = null;
Reveal.addEventListener('slidechanged', e => {
  currentSlide = e.currentSlide;
  let consolio = currentSlide.querySelector('.editor-container > .console-container > .console');
  cons.install(consolio);
});

let handlers = {
  run(content) {
    if (!cons.elem) {
      return;
    }
    if (currentSlide.id === 'module-evaluator') {
      content = "var System = traceur.System;\n" + content;
    }
    cons.elem.parentNode.classList.add('show');
    let evaluator = factory(() => currentSlide.getAttribute('data-native'));
    evaluator(content, (e, m) => {
      if (e) {
        cons.error(e);
      }
      if (currentSlide.id === 'module-creator') {
        let name = document.getElementById('module-name').value;
        traceur.System.register(name, [], function () {
          return m;
        });
      }
    });
  },

  clear() {
    if (!cons.elem) {
      return;
    }
    cons.elem.parentNode.classList.remove('show');
  }
}

for(let editor of Array.from(document.querySelectorAll('.editor'))) {
  editor = ace.edit(editor);
  editor.setTheme('ace/theme/twilight');
  editor.getSession().setMode("ace/mode/javascript");
  editor.setValue(editor.getValue().trim() + '\n');
  editor.gotoLine(editor.session.getLength());
  editor.getSession().setTabSize(2);
  editor.container.getElementsByTagName('textarea')[0].addEventListener('keydown', e => {
    if (e.which === 83 && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handlers.run(editor.getValue());
    } else if (e.which === 27) {
      e.preventDefault();
      handlers.clear();
    }
  });
}

document.body.addEventListener('click', e => {
  let target = e.target;
  if (target.tagName.toLowerCase() === 'button' && target.className === 'clear-console') {
    cons.clear();
  }
});
