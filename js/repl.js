function nativeEval (content, cb) {
  try {
    eval('"use strict";' + content);
    cb();
  } catch (e) {
    cb(e);
  }
}

function noopEval() {
  console.error('cannot evaluate this functionality...');
}

function traceurEval (content, cb) {
  traceur.options.experimental = true;
  let options = {
    address: 'foo',
    name: 'foo',
    referrer: window.location.href,
    tracuerOptions: traceur.options
  };
  traceur.System.module(content, options)
    .then(() => cb())
    .catch(e => cb(e));
}

export default function (testFn) {
  let test = testFn();

  if (test) {
    return nativeEval;
  } else {
    return traceurEval;
  }
};
