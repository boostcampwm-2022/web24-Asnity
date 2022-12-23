export const pipe =
  (...functions) =>
  (dataToConvert) =>
    functions.reduce((acc, fn) => fn(acc), dataToConvert);

export const pipeAsync =
  (...fns) =>
  (arg) =>
    fns.reduce((p, f) => p.then(f), Promise.resolve(arg));
