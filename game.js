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

class Unit {
  constructor(x, y) {
	this.x = x || 0;
	this.y = y || 0;
	this.vx = 0;
	this.vy = 0;
	this.health = 3;
	this.base_speed = 50;
	this.input = new Array(255);
	for (var i = 0; i < this.input.length; ++i) {
	  this.input[i] = false;
	}
	this.control = 'ai';
	this.type = 'chad';
	this.targeting = false;
	this.target = {x : 0, y : 0};
	this.blocked = false;
  }

  update(dt) {
	if (this.control == 'ai') {
	  this.input[KEY_LEFT] = false;
	  this.input[KEY_RIGHT] = false;
	  this.input[KEY_UP] = false;
	  this.input[KEY_DOWN] = false;
	  if (this.targeting && ! this.blocked) {
		if (this.target.x > this.x) {
		  this.input[KEY_RIGHT] = true;
		  this.input[KEY_LEFT] = false;
		} else {
		  this.input[KEY_LEFT] = true;
		  this.input[KEY_RIGHT] = false;
		}

		if (this.target.y > this.y) {
		  this.input[KEY_DOWN] = true;
		  this.input[KEY_UP] = false;
		} else {
		  this.input[KEY_UP] = true;
		  this.input[KEY_DOWN] = false;
		}
	  }

	  if (Math.random() < .1) {
		this.blocked = true;
	  }

	  if (Math.random() < .05) {
		this.blocked = false;
	  }

	}

	this.vx = 0;
	this.vy = 0;

	if (this.input[KEY_RIGHT]) {
	  this.vx = this.base_speed;
	}
	if (this.input[KEY_LEFT]) {
	  this.vx = -this.base_speed;
	}
	if (this.input[KEY_UP]) {
	  this.vy = -this.base_speed;
	}
	if (this.input[KEY_DOWN]) {
	  this.vy = this.base_speed;
	}
	var speed_mod = Math.sqrt((this.vx * this.vx) + (this.vy * this.vy));
	if (speed_mod != 0) {
	  this.vx /= speed_mod;
	  this.vy /= speed_mod;
	  this.vx *= this.base_speed;
	  this.vy *= this.base_speed;
	}

	this.x += this.vx * dt;
	this.y += this.vy * dt;

	if (this.x > 500 - 16) {
	  this.x = 500 - 16;
	}
	if (this.x < 0) {
	  this.x = 0;
	}
	if (this.y < 0) {
	  this.y = 0;
	}
	if (this.y > 500 - 16) {
	  this.y = 500 - 16;
	}
  }

  draw(context) {
	context.drawImage($("#"+this.type), this.x, this.y);
  }
}

class Game {
  constructor() {
	this.paused = true;
	this.lost = false;
	/* --- GAME CONTENT GOES HERE --- */
	this.units = new Array(5);
	for (var i = 0; i < this.units.length; ++i) {
	  this.units[i] = new Unit(Math.random() * 200, Math.random() * 200);
	}
	this.player = this.units[0];
	this.player.type = 'player';
	this.player.control = 'player';
	this.player.base_speed *= 1.3;
	this.target_reset = 0;
	this.goal = {x : Math.random() * 100 + 300, y : Math.random() * 500 - 50}
  }

  draw(canvas, context) {
	context.clearRect(0, 0, canvas.width, canvas.height);
	if (this.paused) {
	  context.font = "50px Arial";
	  context.fillStyle = "red";
	  context.fillText("CLICK anywhere to start.", 50, 50);
	  return;
	}
	/* --- DRAW HERE --- */
	context.fillStyle = "#7575d0";
	context.fillRect(0, 0, 500 / 3, 500);
	context.fillStyle = "#7505d0";
	context.fillRect(500/3, 0, 500 / 3, 500);
	context.fillStyle = "#7575d0";
	context.fillRect(500/3 * 2, 0, 500 / 3, 500);
	context.lineWidth = 10;
	context.strokeStyle = "black";
	context.strokeRect(this.goal.x, this.goal.y, 50, 50);
	this.units.forEach( unit => {
	  unit.draw(context);
	})
  }

  /* Note: dt value is in s */
  update(dt) {
	if (this.paused) {
	  return;
	}
	/* --- UPDATE GAME STATE HERE --- */
	this.target_reset += dt;
	this.units.forEach( unit => {
	  unit.update(dt);
	  unit.targeting = true;
	  unit.target.x = this.player.x;
	  unit.target.y = this.player.y;
	  this.target_reset = 0;

	  if (unit.type != 'player') {
		if (unit.x > this.player.x
		&& unit.x < this.player.x + 16
		&& unit.y > this.player.y
		&& unit.y < this.player.y + 16
		&& ! (this.player.x > this.goal.x && this.player.x < this.goal.x + 50 && this.player.y > this.goal.y && this.player.y < this.goal.y + 50)) {
		  this.lost = true;
		  $("#lose").play();
		}
	  }
	});
  }
}

function run() {
  var tick_duration = 1000 / TPS;
  var canvas = $("#main-canvas");
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  var context = canvas.getContext("2d");

  var game = new Game();
  var started_playing = false;

  /* --- SET CALLBACKS HERE --- */
  $("body").addEventListener("click", (evt) => {
	  if (! started_playing) {
		$("#nerd").play();
		started_playing = true;
	  }
	  game.paused = ! game.paused;
  });
  $("body").addEventListener("keydown", (evt) => {
	if (event.isComposing || event.keyCode == 229) {
	  return;
	}
	game.player.input[event.keyCode] = true;
  });

  $("body").addEventListener("keyup", (evt) => {
	if (event.isComposing || event.keyCode == 229) {
	  return;
	}
	game.player.input[event.keyCode] = false;
  })
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
	  if (game.lost) {
		game = new Game();
	  }
	}
	then = now;
	game.draw(canvas, context);
	window.requestAnimationFrame(loop);
  })();
}

