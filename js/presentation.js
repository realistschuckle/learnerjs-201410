import factory from 'js/repl';
import { cons } from 'js/dom-console';

Reveal.initialize({
  // height: 768,
  // width: 1024,

  height: 600,
  width: 800,

  history: true,
  margin: 0,

  transition: 'linear',
  dependencies: [
    { src: 'plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },
    { src: 'plugin/notes/notes.js', async: true, condition: function() { return !!document.body.classList; } }
  ]
});

Reveal.addEventListener('slidechanged', e => {
  cons.install(document.querySelector('.present .console'));
});

let handlers = {
  run(content) {
    let consolio = document.querySelector('.present .console');
    cons.install(consolio);
    consolio.classList.add('show');
    let evaluator = factory(() => true);
    evaluator(content, e => {
      if (e) {
        cons.error(e);
      }
    });
  },

  clear() {
    document.querySelector('.present .console').classList.remove('show');
  }
}

let editors = Array.from(document.querySelectorAll('.editor'));
for(let editor of editors) {
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
