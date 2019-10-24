
const AppWindow = require('./AppWindow.js')
const Card = require('./Card.js')
/**
 * Memory class inherits parts of its functionality and style from the Appwindow Application.
 * It also uses the Card.js class for each specific card in the memory game
 */
class Memory extends AppWindow {
  constructor (callback) {
    super(callback)
    this.cards = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8] // array all of the pictures but twice
    this.turnedCards = []
    this.turns = 0
    this.cardObjects = []
    this.selectedCard = null
    this.container.classList.add('memory')
    this.handleClick = this.handleClick.bind(this)
    this.enableCards = this.enableCards.bind(this)
    this.loadCards()
  }
  /**
 * Function for looping thru all of the cards, and calling the class Card for each picture,
 * which then gets pushed into the cardObject array
 */
  loadCards () {
    this.container.querySelector('.memIcon').style.display = 'inline-block' // displaying the memory-icon
    this.shuffleCards()
    for (let i = 0; i < this.cards.length; i++) {
      let card = new Card(this.cards[i], this.innerContainer, this.handleClick)
      this.cardObjects.push(card)
    }
    this.selectedCard = this.cardObjects[0] // the first png is selected, usefull for when using the keys
    this.selectedCard.container.classList.add('selectedCard')
  }
  /**
   * Handle the "game" part of the memory application
   */
  handleClick (cardObj) {
    this.turnedCards.push(cardObj)
    if (this.turns < 1) { // if only one turned card, increment the turns variable and continue
      this.turns++
    } else {
      for (let card of this.cardObjects) { // else find the card in the array and disable them
        card.disable()
      }
      if (this.turnedCards[0].id === this.turnedCards[1].id) { // check if same card
        this.turnedCards[0].removeClick() // if yes remove clickability
        this.turnedCards[1].removeClick()
        this.cardObjects.splice(this.cardObjects.indexOf(this.turnedCards[0]), 1)
        this.cardObjects.splice(this.cardObjects.indexOf(this.turnedCards[1]), 1)
        this.turnedCards.splice(0, 2)
      } else {
        setTimeout(() => { // after 2 seconds turn around again
          this.turnedCards[0].hide()
          this.turnedCards[1].hide()
          this.turnedCards.splice(0, 2)
        }, 2000)
      }
      this.turns = 0 // set turns to 0 again
      setTimeout(this.enableCards, 2000) // enable the cards after 2 seconds
    }
  }
  // looping thru the cardobject array to find the right cars to enable (turn)
  enableCards () {
    for (let card of this.cardObjects) {
      card.enable()
    }
  }
  // creates a random number for the cards (50 % its negative and 50 % it positive)
  shuffleCards () {
    this.cards.sort(() => Math.random() - 0.5)
  }

  /**
 * Function for the Key functionality in the memorygame.
 * Every key has a special keycode so when ex. number 39 is pressed the selected card should go one step right etc
 * Then i get the index of the card and update that to the new selectedcard(add it to the container)
 */
  handleKeypress (e) {
    console.log(e)
    if (e.keyCode === 39) {
      this.selectedCard.container.classList.remove('selectedCard')
      let index = this.cardObjects.indexOf(this.selectedCard) + 1
      this.selectedCard = this.cardObjects[index]
      this.selectedCard.container.classList.add('selectedCard')
      console.log('right')
    } else if (e.keyCode === 37) {
      console.log(e)
      this.selectedCard.container.classList.remove('selectedCard')
      let index = this.cardObjects.indexOf(this.selectedCard) - 1
      this.selectedCard = this.cardObjects[index]
      this.selectedCard.container.classList.add('selectedCard')
      console.log('left')
    } else if (e.keyCode === 38) {
      console.log(e)
      this.selectedCard.container.classList.remove('selectedCard')
      let index = this.cardObjects.indexOf(this.selectedCard) - 4
      this.selectedCard = this.cardObjects[index]
      this.selectedCard.container.classList.add('selectedCard')
      console.log('up')
    } else if (e.keyCode === 40) {
      console.log(e)
      this.selectedCard.container.classList.remove('selectedCard')
      let index = this.cardObjects.indexOf(this.selectedCard) + 4
      this.selectedCard = this.cardObjects[index]
      this.selectedCard.container.classList.add('selectedCard')
      console.log('down')
    } else if (e.keyCode === 32) { // turns the cards around
      this.selectedCard.handleKeyPress()
      console.log('turn')
    }
  }
}
module.exports = Memory
