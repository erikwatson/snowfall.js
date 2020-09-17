function create(_x, _y) {
  let x = _x
  let y = _y

  const add = v => {
    x += v.x
    y += v.y
  }

  const addScalar = s => {
    x += s
    y += s
  }

  const divide = v => {
    x /= v.x
    y /= v.y
  }

  const divideScalar = s => {
    x /= s
    y /= s
  }

  const dot = v => {
    return x * v.x + y * v.y
  }

  const getLength = () => {
    return Math.sqrt(x * x + y * y)
  }

  const getOpposite = v => {
    return create(-v.x, -v.y)
  }

  const getPerp = () => {
    return create(-y, x)
  }

  const isEqualTo = v => {
    return x == v.x && y == v.y
  }

  const multiply = v => {
    x *= v.x
    y *= v.y
  }

  const multiplyScalar = s => {
    x *= s
    y *= s
  }

  const normalise = () => {
    let l = getLength()

    x = x / l
    y = y / l
  }

  const setLength = l => {
    normalise()
    multiplyScalar(l)
  }

  const subtract = v => {
    x -= v.x
    y -= v.y
  }

  const subtractScalar = s => {
    x -= s
    y -= s
  }

  return {
    add,
    addScalar,
    clone,
    divide,
    divideScalar,
    dot,
    getLength,
    getOpposite,
    getPerp,
    isEqualTo,
    multiply,
    multiplyScalar,
    normalise,
    setLength,
    subtract,
    subtractScalar,
    set x(_x) {
      x = _x
    },
    get x() {
      return x
    },
    set y(_y) {
      y = _y
    },
    get y() {
      return y
    }
  }
}

const fromDegrees = degrees => {
  const rad = degrees * (Math.PI / 180)
  return create(Math.cos(rad), Math.sin(rad))
}

const clone = v => {
  return create(v.x, v.y)
}

module.exports = {
  clone,
  create,
  fromDegrees
}
