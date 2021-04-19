var $ = document.querySelector.bind(document);
const TPS = 20;
const KEY_SPACE = 32,
      KEY_W = 87,
      KEY_A = 65,
      KEY_S = 83,
      KEY_D = 68,
      KEY_UP = 38,
      KEY_LEFT = 37,
      KEY_DOWN = 40,
      KEY_RIGHT = 39
  ;

class Game {
  constructor() {
	this.paused = false;
	/* --- GAME CONTENT GOES HERE --- */
  }

  draw(canvas, context) {
	context.clearRect(0, 0, canvas.width, canvas.height);
	/* --- DRAW HERE --- */
  }

  /* Note: dt value is in s */
  update(dt) {
	if (this.paused) {
	  return;
	}
	/* --- UPDATE GAME STATE HERE --- */
  }
}

function run() {
  var tick_duration = 1000 / TPS;
  var canvas = $("#main-canvas");
  var context = canvas.getContext("2d");

  var game = new Game();

  /* --- SET CALLBACKS HERE --- */
  $("body").addEventListener("keydown", (evt) => {
	if (event.isComposing || event.keyCode == 229) {
	  return;
	}
	if (event.keyCode == KEY_SPACE) {
	  game.pause = ! game.pause;
	}
  });
  /* --- /callbacks --- */

  /* main loop */
  var then = Date.now(), now, dt_acc = 0;
  (function loop() {
	now = Date.now();
	dt_acc += now - then;

	/* fixed time step */
	while (dt_acc >= tick_duration) {
	  game.update(tick_duration / 1000.);
	  dt_acc -= tick_duration;
	}
	then = now;
	game.draw(canvas, context);
	window.requestAnimationFrame(loop);
  })();
}

