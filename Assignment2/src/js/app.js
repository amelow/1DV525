'use strict'
/* Global variables initialized */
let counter
let timer
let totalTime = 0
let nickname = 'John Doe'

/* Intializes the program */
function init () {
  handleNick()
}
/* Function for the nickname */
function handleNick () {
  document.querySelector('#nickBtn').addEventListener('click', function listeners (e) {
    this.removeEventListener('click', listeners)
    nickname = document.querySelector('#nickname').value
    document.querySelector('#startPage').style.display = 'none'
    document.querySelector('#container').style.display = 'inline-block'
    getHighscore()
    fetchData()
  })
} /* Function for getting the questions, using the fetch api */
function fetchData (url = 'http://vhost3.lnu.se:20080/question/1') { // url=default, otherwise overwritten with other url
  fetch(url)
    .then(result => result.json())// sets response from server as result
    .then(result => handleResult(result))
    .catch(error => console.log(error))
}
/* Handles the result of the fetch call */
function handleResult (result) {
  timerStart() // starting the timer
  let questionField = document.querySelector('#question')
  questionField.innerHTML = result.question

  if (result.hasOwnProperty('alternatives')) {
    handleAlternatives(result) // Has radio button answers
  } else {
    handleSingle(result) // Has a inputfield answer
  }
}
/* Handles questions with multiple alternatives */

function handleAlternatives (result) {
  let index = 0
  for (let key in result.alternatives) { // we use a for in loop. for each key-value pair, iterate
    let element = document.querySelectorAll('.radioBtn')[index] // select all the radiobuttonsbut choose the one at index
    element.style.display = 'inline-block'
    element.setAttribute('value', key) // key = alt1,alt2 etc
    element.nextElementSibling.innerHTML = result.alternatives[key] // <label>, value for the key
    element.nextElementSibling.style.display = 'inline-block'
    index++
  }
  document.querySelector('#submit').addEventListener('click', function listeners (e) { // eventlisterner for the submit button
    this.removeEventListener('click', listeners) // remove eventlisterner ech time
    e.preventDefault()
    handleButton(result)
  })
}
/* function for questions with single answer in a userfield */
function handleSingle (result) {
  document.querySelector('#userInput').value = '' // clear the userfield
  document.querySelector('#userInput').style.display = 'block'
  document.querySelector('#submit').addEventListener('click', function listeners (e) {
    this.removeEventListener('click', listeners)
    e.preventDefault()
    handleButton(result)
  })
}
/* when the submit button is clicked the handleButton function is called */
function handleButton (result) {
  totalTime += (20 - counter) // amount of seconds used from when the question is asked to submitted answer.
  timerEnd()
  let answer
  if (!result.hasOwnProperty('alternatives')) { // checks the userinput fields value
    answer = document.querySelector('#userInput').value
  } else {
    answer = document.querySelector('input[name="alternative"]:checked').value // checks which radiobutton is checked
  }
  hideElements() // hides the alternative buttons
  let options = { // format
    method: 'POST',
    headers: {
      'Content-Type': 'application/json '
    },
    body: JSON.stringify({ 'answer': answer }) // key value pairs, parsed to string
  }

  fetch(result.nextURL, options) // sending answer, post request to next url
    .then(result => result.json())
    .then(result => checkAnswer(result))
    .catch(error => console.log(error))
}
function hideElements () {
  let children = document.querySelector('#userAlternatives').children
  for (let i = 0; i < children.length; i++) {
    children[i].style.display = 'none'
    children[i].checked = false// Un-checks all radiobuttons and the inputfield(children)
  }
}

function checkAnswer (result) {
  if (result.hasOwnProperty('nextURL')) { // if it has a next url, it keeps on fetching the question
    fetchData(result.nextURL)
  } else if (result.message == 'Wrong answer! :(') { // loosing the game
    gameOver()
  } else {
    gameOver(true) // winning the game Win is set to true
  }
}

function timerStart () {
  counter = 20
  timer = setInterval(() => {
    counter--
    document.querySelector('#timer').innerHTML = 'TIME: ' + counter + ' seconds left' // countdown text
    if (counter == 0) { // if the timer is zero, the game is over
      gameOver()
    }
  }, 1000) // updates every second
}

function timerEnd () {
  clearInterval(timer)// terminates the interval
}

function gameOver (win = false) {
  timerEnd()
  document.querySelector('#submit').disabled = true
  document.querySelector('#question').innerHTML = 'Game over'
  hideElements()
  restart()
  if (win) setHighScore() // if win== true
}
/* Restarts the game */
function restart () {
  document.querySelector('#submit').style.display = 'none'
  document.querySelector('#reloadButton').style.display = 'inline-block'
  document.querySelector('#reloadButton').addEventListener('click', function listeners (e) {
    this.removeEventListener('click', listeners)
    e.preventDefault()
    fetchData() // calls the fetchdata function again to restart the process
    document.querySelector('#submit').style.display = 'inline-block'
    document.querySelector('#reloadButton').style.display = 'none'
    document.querySelector('#submit').disabled = false
  })
}
function getHighscore () {
  // if the highscore object is empty, return a new empty array, else return the highscore
  let score = localStorage.getItem('highscore') == null ? [] : localStorage.getItem('highscore')
  if (score.length > 0) {
    let input = JSON.parse(score) // Parse the data to become a JSON object
    input.sort((a, b) => a[1] - b[1]) // sorting the arrays [1]=totaltime
    printHighScore(input)
  } else {
    localStorage.setItem('highscore', JSON.stringify(score)) // store it as a string in the localstorage
  }
}
function setHighScore () {
  let highscore = JSON.parse(localStorage.getItem('highscore'))
  let newScore = [nickname, totalTime]
  highscore.push(newScore)// push in newscore in highscore array
  window.localStorage.setItem('highscore', JSON.stringify(highscore))// updated highscore gets set as highscore in storage
  clearHighScore()
}
function printHighScore (input) {
  let index = input.length > 5 ? 5 : input.length // more values than five = returns five
  // less than five = show all values in input array
  let parent = document.querySelector('#highScoreList') // get the higscorelist
  for (let i = 0; i < index; i++) { // either 5 or less
    let listItem = document.createElement('li')// creating the listelement
    listItem.innerHTML = input[i][1] + ' seconds, ' + ' Nickname: ' + input[i][0] // listing the time and the nickname
    parent.appendChild(listItem)
  }
}
/* Clearing the Highscore */
function clearHighScore () {
  let list = document.querySelector('#highScoreList') // removed from the DOM
  while (list.hasChildNodes()) {
    list.removeChild(list.firstChild)
  }
  getHighscore()
}

window.addEventListener('load', init) // when page loads, start the init function
