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
  this.to = 100;
  this.tox = 200;
  this.duration = duration || 1000; // milliseconds
  this.delay = delay || 0; // milliseconds
  this.y = 0;
  this.x = 500;
  this.yDirection = this.to > this.y;
  this.xDirection = this.tox > this.x;
}

Movement.prototype.moveTo = function (y, x) {
  const offsetY = this.yDirection ? y : this.y - y;
  const offsetX = this.xDirection ? x : this.x - x;
  console.log("x");
  this[0].style.transform =
    "translate3d(" + offsetX + "px, " + offsetY + "px, 0)";
};

Movement.prototype.update = function (t, dt) {
  var to = this.yDirection ? this.to : this.y,
    tox = this.xDirection ? this.tox : this.x,
    duration = this.duration,
    delay = this.delay,
    x = this.xDirection ? this.x : this.tox,
    y = this.yDirection ? this.y : this.to;

  t -= delay;

  if (t >= 0) {
    y += getStep(
      this.yDirection ? this.to : this.y,
      this.duration,
      t,
      dt,
      function (t) {
        return 2 * t;
      }
    );
    x += getStep(
      this.xDirection ? this.tox : this.x,
      this.duration,
      t,
      dt,
      function (t) {
        return 2 * t;
      }
    );
    y = Math.min(y, to);
    x = Math.min(x, tox);
    if (this.yDirection) {
      this.y = y;
    } else {
      this.to = y;
    }
    if (this.xDirection) {
      this.x = x;
    } else {
      this.tox = x;
    }
    this.moveTo(y, x);
  }

  return y < to || x < tox;
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
