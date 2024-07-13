document.addEventListener('DOMContentLoaded', function () {
  const barsIcon = document.getElementById('bars-icon')
  const closeIcon = document.getElementById('close-icon')
  const navigationMenu = document.querySelector('.menu-section-column')

  barsIcon.addEventListener('click', function (event) {
    event.preventDefault()
    this.style.display = 'none'
    closeIcon.style.display = 'block'
    navigationMenu.style.display = 'block'
  })

  closeIcon.addEventListener('click', function (event) {
    event.preventDefault()
    this.style.display = 'none'
    barsIcon.style.display = 'block'
    navigationMenu.style.display = 'none'
  })
})
