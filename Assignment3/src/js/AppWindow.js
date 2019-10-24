/**
 * The class Appwindow creates all of the application windows,
 * as well as all of the functionality that the different applications have in common.
 * Such as a close-icon, the similar styling, stackability and moveability
 */
class AppWindow {
  constructor (callback) {
    this.callback = callback
    this.deltaX = 0
    this.deltaY = 0
    this.focus = true
    this.container = document.createElement('div')
    this.container.setAttribute('class', 'container')
    this.container.setAttribute('draggable', ' true')
    this.innerContainer = document.createElement('div')
    this.innerContainer.setAttribute('class', 'innerContainer')
    this.nav = document.createElement('nav')
    this.nav.setAttribute('class', 'navBar')
    this.closeIcon = document.createElement('div')
    this.closeIcon.setAttribute('class', 'closeIcon')
    this.closeIcon.innerHTML = '&#x2613;'
    this.nav.appendChild(this.closeIcon)
    /**
     * Creates the tiny icon elements in each application window
     */
    this.memIcon = document.createElement('img')
    this.memIcon.setAttribute('class', 'memIcon')
    this.memIcon.src = './../image/MemoryIcons/memory.png'
    this.nav.appendChild(this.memIcon)
    this.chatIcon = document.createElement('img')
    this.chatIcon.setAttribute('class', 'chatIcon')
    this.chatIcon.src = './../image/MemoryIcons/chat.png'
    this.nav.appendChild(this.chatIcon)
    this.jokeIcon = document.createElement('img')
    this.jokeIcon.setAttribute('class', 'jokeIcon')
    this.jokeIcon.src = './../image/MemoryIcons/jester.png'
    this.nav.appendChild(this.jokeIcon)

    this.container.appendChild(this.nav)
    this.container.appendChild(this.innerContainer)
    document.body.appendChild(this.container)

    /**
     * Binding all of the functions that have eventhandlers,
     * otherwise it will show undefined
     */
    this.closeWindow = this.closeWindow.bind(this)
    this.dragStart = this.dragStart.bind(this)
    this.dragMove = this.dragMove.bind(this)
    this.dragStop = this.dragStop.bind(this)
    this.setToFront = this.setToFront.bind(this)

    this.addListeners()
  }
  /**
   * Listeners for the close icon, stackability and moveability
   */
  addListeners () {
    this.closeIcon.addEventListener('click', this.closeWindow)
    this.nav.addEventListener('mousedown', this.dragStart)
    this.container.addEventListener('click', this.setToFront)
  }
  /**
   * If x icon is clicked, the application window will be removed and the listeners also
   */
  closeWindow (e) {
    document.body.removeChild(this.container)
    console.log(this.container)
    this.closeIcon.removeEventListener('click', this.closeWindow)
  }
  /**
   * Function for moving the application window
   */
  dragStart (e) {
    // returns window coordinates for container rectangle as an object with properties, starts in upper left corner
    let containerRect = this.container.getBoundingClientRect()
    // coordinates
    this.deltaX = e.clientX - containerRect.left // Gets the distance that a mouse has rotated around the x-axis (horizontal).
    this.deltaY = e.clientY - containerRect.top/// Gets the distance that a mouse has rotated around the y-axis (vertical).
    document.addEventListener('mousemove', this.dragMove)
    document.addEventListener('mouseup', this.dragStop)
    // calling the function for stackability
    this.setToFront()
    console.log('mouse down')
  }
  /**
   * Handles the coordinates when the user moves the application window, does this in pixels
  */
  dragMove (e) {
    this.container.style.left = e.clientX - this.deltaX + 'px'
    this.container.style.top = e.clientY - this.deltaY + 'px'
  }
  /**
   * Handles the functionality for the new "place" of the application window,
   * aka where the user released the mouse
    */
  dragStop (e) {
    let containerRect = this.container.getBoundingClientRect()
    // Checking if the appwindow is outside of the desktop, if it is "bounce back"
    if (containerRect.left < 0) {
      console.log('under 0')
      this.container.style.left = '0px'
    } else if (containerRect.left + containerRect.width > window.innerWidth) {
      this.container.style.left = window.innerWidth - containerRect.width
    }

    console.log('works')
    document.removeEventListener('mousemove', this.dragMove)
    document.removeEventListener('mouseup', this.dragStop)
  }
  /*
   * Everytime the navbar is clicked, the setToFron function is called, it gets a value (z-index)
   * by assigning a date for it.Date = time value that is milliseconds since 1970
   */
  setToFront (e) {
    this.callback()
    this.setFocus()
    let index = new Date().getTime() / 1000
    this.container.style.zIndex = Math.floor(index) // largest integer less than or equal to a given number
  }

  unFocus () {
    this.focus = false
  }

  setFocus () {
    this.focus = true
  }
}

module.exports = AppWindow
