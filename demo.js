"use strict";

var divs = document.querySelectorAll("div");

var movements = [];

for (var i = 0; i < divs.length; ++i)
  movements.push(new Movement(divs[i], 5000, Math.pow(2, i + 1) * 5));

function getStep(totalstep, duration, t, dt, timing) {
  return (totalstep / duration) * timing(t / duration) * dt;
}

function Movement(el, duration, delay) {
  this[0] = el;
  this.to = 500;
  this.tox = 0;
  this.duration = duration || 1000; // milliseconds
  this.delay = delay || 0; // milliseconds
  this.y = 0;
  this.x = 500;
  this.direction = this.to > this.y;
}

Movement.prototype.moveTo = function (y) {
  const offsetY = this.direction ? y : this.y - y;
  this[0].style.transform = "translate3d(0, " + offsetY + "px, 0)";
};

Movement.prototype.update = function (t, dt) {
  var to = this.direction ? this.to : this.y,
    duration = this.duration,
    delay = this.delay,
    y = this.direction ? this.y : this.to;

  t -= delay;

  if (t >= 0) {
    y += getStep(
      this.direction ? this.to : this.y,
      this.duration,
      t,
      dt,
      function (t) {
        return 2 * t;
      }
    );
    y = Math.min(y, to);
    if (this.direction) {
      this.y = y;
    } else {
      this.to = y;
    }

    this.moveTo(y);
  }

  return y < to;
};

movements.update = function (t, dt) {
  var running = false;

  for (var i = 0, n = this.length; i < n; ++i)
    running = this[i].update(t, dt) || running;

  return running;
};

requestAnimationFrame(function (t) {
  var t0 = t,
    t1 = 0;
  requestAnimationFrame(function frame(t) {
    // console.log(t);
    movements.update(t - t0, -t1 + (t1 = t)) && requestAnimationFrame(frame);
  });
});
