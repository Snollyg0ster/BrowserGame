const gameInput = (callback: (typed: [string | null, string | null]) => void) => {
  document.addEventListener('keydown', (key) => {
    callback([key.code, key.code]);
  });
  document.addEventListener('keyup', (key) => {
    callback([null, key.code]);
  });
}

export default gameInput;