document.addEventListener('DOMContentLoaded', function () {
  const barsIcon = document.getElementById('open-menu-icon')
  const mobileMenu = document.querySelector('.mobile-menu')
  const homeButton = document.getElementById('#home')
  const mobileHomeButton = document.getElementById('#mobile-home')

  barsIcon.addEventListener('click', function (event) {
    event.preventDefault()

    // Toggle between 'fa-bars' and 'fa-times' classes
    this.classList.toggle('fa-bars')
    this.classList.toggle('fa-times')

    // Toggle the display of the mobile menu
    mobileMenu.classList.toggle('active')
  })

  homeButton.addEventListener('click', function (event) {
    event.preventDefault()

    window.scrollTo({ top: 0, behavior: 'smooth' })
  })

  mobileHomeButton.addEventListener('click', function (event) {
    event.preventDefault()

    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
})
