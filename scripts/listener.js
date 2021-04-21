function Listener({ move: moveFn, start: startFn }) {
  window.addEventListener('keyup', function(e) {
    switch (e.keyCode) {
      case 38:
        moveFn({ row: -1, column: 0 });
        break;
      case 37:
        moveFn({ row: 0, column: -1 });
        break;
      case 39:
        moveFn({ row: 0, column: 1 });
        break;
      case 40:
        moveFn({ row: 1, column: 0 });
        break;
    }
  });

  const buttons = document.querySelectorAll('button');
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function() {
      startFn();
    });
  }
}
