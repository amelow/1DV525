
const Memory = require('./Memory.js')
const Chat = require('./Chat.js')
const Joke = require('./Joke.js')

let windows = []

function init () {
  initListeners()
}
/**
 * Function for initializing all of the buttons in the Navigation-bar,
 * as well as adding eventlisterners to them.
 */
function initListeners () {
  let memoryButton = document.querySelector('#memButton')
  memoryButton.addEventListener('click', createMemory)
  let chatButton = document.querySelector('#chatButton')
  chatButton.addEventListener('click', createChat)
  document.addEventListener('keydown', handleKeypress)
  let jokeButton = document.querySelector('#jokeButton')
  jokeButton.addEventListener('click', createJoke)
}
/**
 * Function for the Memory application,when pressed a new memory window is opened
 */
function createMemory (e) {
  unFocus()
  let memory = new Memory(unFocus)
  windows.push(memory)
}
/**
 * Function for the Chat application,when pressed a new chat window is opened
 */
function createChat (e) {
  unFocus()
  let chat = new Chat(unFocus)
  windows.push(chat)
  console.log(window)
}
/**
 * Function for the Developer joke  application,when pressed a new "joke" window is opened
 */
function createJoke (e) {
  unFocus()
  let joke = new Joke(unFocus)
  windows.push(joke)
}

function handleKeypress (e) {
  if (windows.length >= 1) {
    let focusedWindow = getFocusedWindow()
    if (focusedWindow.hasOwnProperty('cards')) focusedWindow.handleKeypress(e)
  }
}

function getFocusedWindow () { // the window that should be in front "focused on right now"
  for (let window of windows) {
    if (window.focus) return window
  }
}

function unFocus () {
  for (let window of windows) {
    window.unFocus()
  }
}

window.addEventListener('load', init)
