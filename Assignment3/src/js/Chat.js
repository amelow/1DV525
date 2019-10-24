
const AppWindow = require('./AppWindow.js')
/**
 * Chat.js inherits part of its functionality and style from the Appwindow Application
 */
class Chat extends AppWindow {
  constructor (callback) {
    super(callback)
    this.container.classList.add('chat')
    this.userName = ''
    // extra feature : adding emojis to chat borrowed from unicode.org
    this.emojis = ['😃', '😄', '😁', '😆', '😅', '😂', '😉', '😊', '😇', '😍', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '😝', '😐', '😑', '😶', '😏', '😒', '😬', '😌', '😔', '😪', '😴', '😷', '😵', '😎', '😕', '😟', '😲', '😳', '😦', '😧', '😨', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '😤', '😡', '😠', '😈', '👿', '💩']
    this.webSocket = new window.WebSocket('ws://vhost3.lnu.se:20080/socket/') // connecting to socket, server address
    // binding the functions
    this.sendMessage = this.sendMessage.bind(this)
    this.saveUser = this.saveUser.bind(this)
    this.handleSocketConnection = this.handleSocketConnection.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleMessage = this.handleMessage.bind(this)
    this.toggleEmojis = this.toggleEmojis.bind(this)
    this.handleEmojiClick = this.handleEmojiClick.bind(this)
    this.container.querySelector('.chatIcon').style.display = 'inline-block' // displaying the chat bubble icon in the window
    this.checkStorage()
  }
  /**
  * Checks if the user already stored a Username in the localstorage, if yes: it gets the name and set up the chat.
  * If not it calls the createuser function
   */
  checkStorage () {
    this.createElements()
    if (window.localStorage.getItem('chatCredentials')) {
      this.userName = window.localStorage.getItem('chatCredentials')
      this.setUpChat()
      this.addChatListeners()
    } else {
      this.createUser()
    }
  }
  /**
 * create the user, aka the Nickname
*/
  createUser () {
    this.sendButton.textContent = 'Go'
    this.form.setAttribute('class', 'userContainer')
    this.form.addEventListener('submit', this.saveUser)
  }
  /**
 * Saves the user, unless its empty.
*/
  saveUser (e) {
    e.preventDefault()
    this.form.removeEventListener('submit', this.saveUser)
    console.log(this)
    if (this.inputField.value !== '') {
      this.userName = this.inputField.value
      window.localStorage.setItem('chatCredentials', this.userName)
      this.setUpChat()
    }
  }
  /**
 * Creating all of the elements necessary for the chat and then appending them to the container
*/
  createElements () {
    this.form = document.createElement('form')
    this.emojiIcon = document.createElement('div')
    this.emojiIcon.setAttribute('class', 'emojiIcon')
    this.emojiIcon.innerHTML = '😃' // emoji icon enabling choosing of a emoji
    this.emojiContainer = document.createElement('div')
    this.emojiContainer.setAttribute('class', 'emojiContainer')
    this.sendButton = document.createElement('button')
    this.sendButton.setAttribute('type', 'submit')
    this.sendText = document.createTextNode('Send')
    this.inputField = document.createElement('input')
    this.inputField.setAttribute('type', 'text')
    this.form.appendChild(this.inputField)
    this.sendButton.appendChild(this.sendText)
    this.form.appendChild(this.emojiIcon)
    this.form.appendChild(this.sendButton)
    this.container.appendChild(this.emojiContainer)
    this.container.appendChild(this.form)
    this.populateEmojiContainer()
  }

  setUpChat () {
    this.innerContainer.classList.add('chatMessages')
    this.form.setAttribute('class', 'sendForm')
    this.messageList = document.createElement('ul') // makes an list for all of the messages
    this.innerContainer.appendChild(this.messageList)
  }
  /*
  *Listener for all of the functionality: the toggling of the emoji container, getting and sending messages
  */
  addChatListeners () {
    this.webSocket.onopen = () => console.log('open channel')
    this.webSocket.addEventListener('open', this.handleSocketConnection)
    this.webSocket.onmessage = (e) => this.handleMessage(JSON.parse(e.data))
    this.form.addEventListener('submit', this.handleSubmit)
    this.emojiIcon.addEventListener('click', this.toggleEmojis)
  }
  handleSocketConnection (e) { // shows is connection works
    console.log('socket connected')
    e.preventDefault()
  }
  handleSubmit (e) { // triggered when submit button is pressed
    console.log('submit')
    e.preventDefault()
    this.sendMessage()
  }
  /**
 * Handles the functionality when a message is sent.
 */
  sendMessage () {
    console.log('send msg')
    let msg = this.inputField.value
    if (msg !== '') { // message can not be empty
      this.webSocket.send(JSON.stringify({
        'type': 'message',
        'data': msg, // the message of the user
        'username': this.userName, // users nickname , which is stored
        'channel': 'my, not so secret, channel',
        'key': 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd' // 1dv525 API-key
      }))
      this.inputField.value = '' // removing the message from the input field after sending
    }
  }
  /**
   * Checks if the recieved message is in fact a message, then creating a li for it to be displayed, in the chat window
   */
  handleMessage (data) {
    console.log(data)
    if (data.type === 'message') {
      console.log('is message')
      let sender = data.username
      let listItem = document.createElement('li')
      listItem.innerText = sender + ': ' + data.data // syntax : first username then message
      this.messageList.appendChild(listItem)
    }
  }
  /**
   * Extra feature- enabling emojis, creates a container for all of them
   */
  populateEmojiContainer () {
    for (let emoji of this.emojis) {
      const container = document.createElement('div')
      container.setAttribute('class', 'emoji')
      container.innerHTML = emoji
      this.emojiContainer.appendChild(container)
      container.addEventListener('click', this.handleEmojiClick) // makes the emojis clickable
    }
  }
  /*
  * Displaying first the message already in the messagefield, then the chosen emoji
  */
  handleEmojiClick (e) {
    this.inputField.value += e.target.innerHTML
  }
  /**
   * Toggle on the emoji icon in the container.(for display purposes
   */
  toggleEmojis (e) {
    console.log(this.emojiContainer)
    let display = this.emojiContainer.style.display === 'none' ? 'block' : 'none'
    this.emojiContainer.style.display = display
  }
}
module.exports = Chat
