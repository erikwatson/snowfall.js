var snowfall = (function () {
'use strict';

function create(_x, _y) {
  var x = _x;
  var y = _y;

  var add = function add(v) {
    x += v.x;
    y += v.y;
  };

  var addScalar = function addScalar(s) {
    x += s;
    y += s;
  };

  var divide = function divide(v) {
    x /= v.x;
    y /= v.y;
  };

  var divideScalar = function divideScalar(s) {
    x /= s;
    y /= s;
  };

  var dot = function dot(v) {
    return x * v.x + y * v.y;
  };

  var getLength = function getLength() {
    return Math.sqrt(x * x + y * y);
  };

  var getOpposite = function getOpposite(v) {
    return create(-v.x, -v.y);
  };

  var getPerp = function getPerp() {
    return create(-y, x);
  };

  var isEqualTo = function isEqualTo(v) {
    return x == v.x && y == v.y;
  };

  var multiply = function multiply(v) {
    x *= v.x;
    y *= v.y;
  };

  var multiplyScalar = function multiplyScalar(s) {
    x *= s;
    y *= s;
  };

  var normalise = function normalise() {
    var l = getLength();

    x = x / l;
    y = y / l;
  };

  var setLength = function setLength(l) {
    normalise();
    multiplyScalar(l);
  };

  var subtract = function subtract(v) {
    x -= v.x;
    y -= v.y;
  };

  var subtractScalar = function subtractScalar(s) {
    x -= s;
    y -= s;
  };

  return {
    add: add,
    addScalar: addScalar,
    clone: clone,
    divide: divide,
    divideScalar: divideScalar,
    dot: dot,
    getLength: getLength,
    getOpposite: getOpposite,
    getPerp: getPerp,
    isEqualTo: isEqualTo,
    multiply: multiply,
    multiplyScalar: multiplyScalar,
    normalise: normalise,
    setLength: setLength,
    subtract: subtract,
    subtractScalar: subtractScalar,
    set x(_x) {
      x = _x;
    },
    get x() {
      return x;
    },
    set y(_y) {
      y = _y;
    },
    get y() {
      return y;
    }
  };
}

var fromDegrees = function fromDegrees(degrees) {
  var rad = degrees * (Math.PI / 180);
  return create(Math.cos(rad), Math.sin(rad));
};

var clone = function clone(v) {
  return create(v.x, v.y);
};

var vec2 = {
  clone: clone,
  create: create,
  fromDegrees: fromDegrees
};

var appContainer = document.querySelector('#snow-container');

var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');

var gravity = vec2.create(0, 0);
var wind = vec2.create(0, 0);
var density = 250;

var snowflakes = [];

// const primary = '#8d90b7'
// const secondary = '#ffffff'

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

var t = 0;

function update() {
  snowflakes.forEach(function (snowflake) {
    var w = vec2.clone(wind);
    w.multiplyScalar(snowflake.size + snowflake.random);
    snowflake.pos.add(w);

    var g = vec2.clone(gravity);
    g.multiplyScalar(snowflake.size + snowflake.random);
    snowflake.pos.add(g);

    // TODO: Make a nicer way to change these
    // const amplitude = 1
    // const frequency = 0.05
    var phase = snowflake.noise;

    var sine = vec2.create(amplitude * Math.sin(frequency * t + phase), 0);

    snowflake.pos.add(sine);

    if (snowflake.pos.x > canvas.width) {
      snowflake.pos.x = 0;
    }

    if (snowflake.pos.x < 0) {
      snowflake.pos.x = canvas.width;
    }

    if (snowflake.pos.y > canvas.height) {
      snowflake.pos.y = 0;
      snowflake.pos.x = Math.random() * canvas.width;
    }

    if (snowflake.pos.y < 0) {
      snowflake.pos.y = canvas.height;
      snowflake.pos.x = Math.random() * canvas.width;
    }
  });

  t += 1;
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  var bgSize = 7;

  var foreground = snowflakes.filter(function (x) {
    return x.size >= bgSize;
  });
  var background = snowflakes.filter(function (x) {
    return x.size < bgSize;
  });

  ctx.fillStyle = primary;
  background.forEach(function (snowflake) {
    ctx.beginPath();
    drawCircle(snowflake.pos, snowflake.size);
    ctx.fill();
  });

  ctx.fillStyle = secondary;
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
      pos: vec2.create(Math.random() * canvas.width, Math.random() * canvas.height),
      size: 3 + Math.random() * 5,
      // Random value, just to add some uncertainty
      noise: Math.random() * 10,
      amplitude: Math.random() * 2,
      frequency: Math.random() * 0.01,
      random: Math.random()
    });
  }

  return result;
}

// This function figures out how many snowflakes we should use for our given canvas size
// Just setting a fixed number of snowflakes would give an uneven distribution of
// snowflakes across different screen sizes, for example.
function requiredSnowflakes() {
  var tenEightyPee = 1920 * 1080;
  var thisScreen = canvas.width * canvas.height;
  var snowflakeCount = Math.round(density * (thisScreen / tenEightyPee));

  return snowflakeCount;
}

function drawCircle(position, radius) {
  ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI, false);
}

function restart() {
  snowflakes = makeSnowflakes(requiredSnowflakes());
}

var snowfall = {
  start: start,
  setGravity: function setGravity(degrees, strength) {
    gravity = vec2.fromDegrees(degrees);
    gravity.multiplyScalar(strength);
  },
  setWind: function setWind(degrees, strength) {
    wind = vec2.fromDegrees(degrees);
    wind.multiplyScalar(strength);
  },
  setDensity: function setDensity(d) {
    density = d;
    restart();
  }
};

return snowfall;

}());
