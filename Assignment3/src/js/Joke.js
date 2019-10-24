const AppWindow = require('./AppWindow.js')
const devpun = require('devpun')
/**
 * Joke.js class inherits part of its functionality and style from the Appwindow Application
 * Apologizing for the extremely bad developer puns in advance :D
 */

class Joke extends AppWindow {
  // Uses the node js package devpun
  constructor (callback) {
    super(callback)
    this.container.classList.add('Joke')
    this.container.classList.add('jokeField')
    this.innerContainer.innerHTML = devpun.random() // A collection of developer jokes, gives back a random one
    this.container.querySelector('.jokeIcon').style.display = 'inline-block' // shows the jester icon in the upper left corner
  }
}
module.exports = Joke
