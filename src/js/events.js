export function onPageLoaded (callback) {
  document.addEventListener('DOMContentLoaded', (event) => {
    callback()
  })
}

export default {
  page: {
    onLoaded: onPageLoaded
  }
}
