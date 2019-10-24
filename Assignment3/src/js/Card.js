class Card {
  // handles the functionality for each card
  constructor (id, parent, callback) {
    this.id = id
    this.parent = parent
    this.callback = callback
    this.isAllowedToTurn = true
    this.container = document.createElement('img')
    this.container.setAttribute('class', 'memoryCard')
    this.container.classList.add('hidden')
    this.parent.appendChild(this.container)
    this.hide()
    this.handleClick = this.handleClick.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.container.addEventListener('click', this.handleClick)
  }

  handleClick (e) { // handles if a card is clicked on
    e.preventDefault()
    if (this.isAllowedToTurn) {
      this.show()
      this.callback(this)
    }
  }

  handleKeyPress () { // handles if the space key is pressed  to allow it to turn
    if (this.isAllowedToTurn) {
      this.show()
      this.callback(this)
    }
  }

  removeClick () {
    this.container.removeEventListener('click', this.handleClick)
  }

  show () {
    this.isAllowedToTurn = false
    let src = './../image/MemoryIcons/' + this.id + '.png' // shows one of the cards
    this.rotate(src) // starts rotating
  }
  hide () { // if not the right card hide it again and show questionmark card
    let src = './../image/MemoryIcons/0.png'
    this.container.classList.add('hidden')
    this.rotate(src)
  }

  rotate (src) {
    this.container.classList.add('rotate')
    setTimeout(() => {
      this.container.setAttribute('src', src)
      this.container.classList.remove('rotate')
      this.container.classList.add('rotateBack')
      setTimeout(() => this.container.classList.remove('rotateBack'), 200) // calls upon the rotate back after 2 seconds
    }, 200)
  }

  disable () {
    this.isAllowedToTurn = false
  }

  enable () {
    this.isAllowedToTurn = true
  }
}
module.exports = Card
