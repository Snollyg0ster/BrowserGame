const gameInput = (callback: (typed: [string, null] | [null, string]) => any) => {
  document.addEventListener('keydown', (key) => {
    callback([key.code, null]);
  });
  document.addEventListener('keyup', (key) => {
    callback([null, key.code]);
  });
}

export default gameInput;