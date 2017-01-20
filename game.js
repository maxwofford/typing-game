'use strict'

var game = {}
game.words = []
game.activeWord
game.board = document.body
game.init = function() {
  createWord('loading')
}

function removeClass(el, names) {
  if (typeof names === 'string') {
    names = [names]
  }
  el.className = el.className.split(' ').filter(c => {
    return !names.includes(c)
  }).join(' ')
}

function addClass(el, names) {
  var classNames = {}
  el.className.split(' ').concat(names).forEach(names => {
    classNames[names] = true
  })
  el.className = Object.keys(classNames).join(' ')
}

function hasTyped(wordObj) {
  console.log(`'${wordObj.word}' has been typed`)
  wordObj.el.remove()
  game.activeWord = null
  game.words.splice(game.words.indexOf(wordObj), 1)
  game.words.forEach(wordObj => {
    wordObj.index = 0
    wordObj.el.childNodes.forEach(el => {
      removeClass(el, ['grey', 'black'])
    })
  })
}

function createWord(word, cb) {
  var spans = word.split('').map(letter => {
    return `<span class="letter">${letter}</span>`
  }).join('')
  var el = document.createElement('div')
  el.innerHTML = `<p class="word">${spans}</p>`
  el = el.children[0]
  game.words.push({
    word,
    el,
    index: 0
  })
  document.body.appendChild(el)
  return el
}

function keydownHandler(e) {
  // Skip non-alphabetical keycodes for this version
  if (e.which > 90 || e.which < 65) {
    return
  }
  var c = String.fromCharCode(e.which)
  // using some() so I can break out of this loop if I need to
  game.words.some(wordObj => {
    var nextLetter = wordObj.word.charAt(wordObj.index)
    var validNextLetter = nextLetter.toUpperCase() == c
    if (nextLetter.toUpperCase() == c) {
      // Increment the word's index if we have a valid next letter
      wordObj.index++
      // If this completes the word, remove it
      if (wordObj.index == wordObj.word.length) {
        hasTyped(wordObj)
        return true
      }
      // If no activeWord, or current word has more typed letters than activeWord, set it as the new activeWord
      if (!game.activeWord || wordObj.index >= game.activeWord.index) {
        game.activeWord = wordObj
      }
    }
  })

  // render the changes on the screen
  game.words.forEach(wordObj => {
    var color = (wordObj == game.activeWord ? 'black' : 'grey')
    for (var i = 0; i < wordObj.index; i++) {
      var el = wordObj.el.childNodes[i]
      removeClass(el, ['black', 'grey'])
      addClass(el, color)
    }

  })
}
document.addEventListener('keydown', keydownHandler, false)

game.init()
