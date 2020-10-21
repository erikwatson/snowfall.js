function lerp(start, end, alpha) {
  return start * (1 - alpha) + end * alpha
}

module.exports = {
  lerp
}
