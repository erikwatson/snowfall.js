'use strict';

var appContainer = document.querySelector('#snow-container');

var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');

var gravity = 0.2;
var wind = 0;

var snowflakes = [];

function start() {
  canvas.width = appContainer.offsetWidth;
  canvas.height = appContainer.offsetHeight;
  appContainer.appendChild(canvas);

  snowflakes = makeSnowflakes(requiredSnowflakes());

  window.onresize = onResize;
  window.requestAnimationFrame(onEnterFrame);
}

function onResize() {
  canvas.width = appContainer.offsetWidth;
  canvas.height = appContainer.offsetHeight;

  snowflakes = makeSnowflakes(requiredSnowflakes());
}

function onEnterFrame() {
  update();
  render();

  window.requestAnimationFrame(onEnterFrame);
}

function update() {
  snowflakes.forEach(function (snowflake) {
    var frequency = snowflake.size / 5000;

    var waveLength = snowflake.size / 10;
    var waveHeight = snowflake.size / 8;

    var sineWaveOffset = sineWave(snowflake.pos.y, waveLength, waveHeight, frequency);

    snowflake.pos.x += sineWaveOffset;
    snowflake.pos.y += gravity * (snowflake.size + snowflake.random);

    snowflake.pos.x += wind;

    if (snowflake.pos.y > window.innerHeight + snowflake.size) {
      snowflake.pos.y = -snowflake.size;
    }

    if (snowflake.pos.x < -snowflake.size) {
      snowflake.pos.x = window.innerWidth + snowflake.size;
      snowflake.pos.y = Math.random() * window.innerHeight;
    }

    if (snowflake.pos.x > window.innerWidth + snowflake.size) {
      snowflake.pos.x = -snowflake.size;
      snowflake.pos.y = Math.random() * window.innerHeight;
    }
  });
}

function render() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  var bgSize = 7;

  var foreground = snowflakes.filter(function (x) {
    return x.size >= bgSize;
  });
  var background = snowflakes.filter(function (x) {
    return x.size < bgSize;
  });

  ctx.fillStyle = '#8d90b7';
  background.forEach(function (snowflake) {
    ctx.beginPath();
    drawCircle(snowflake.pos, snowflake.size);
    ctx.fill();
  });

  ctx.fillStyle = 'white';
  foreground.forEach(function (snowflake) {
    ctx.beginPath();
    drawCircle(snowflake.pos, snowflake.size);
    ctx.fill();
  });
}

function makeSnowflakes(num) {
  var result = [];

  while (num--) {
    result.push({
      pos: {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight
      },
      size: 3 + Math.random() * 5,
      random: Math.random() * 10
    });
  }

  return result;
}

function requiredSnowflakes() {
  var tenEightyPee = 1920 * 1080;
  var thisScreen = canvas.width * canvas.height;
  var snowflakeCount = Math.round(250 * (thisScreen / tenEightyPee));

  return snowflakeCount;
}

function sineWave(yPos, waveLength, waveHeight, frequency) {
  return waveLength * Math.sin(frequency * (yPos / waveHeight) * 2 * Math.PI);
}

function drawCircle(position, radius) {
  ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI, false);
}

module.exports = start;
