const NUM_CHANCES = 6
const LETTER_COUNT = 5

const game = document.getElementById("game")
const board = document.querySelector(".board")

let currentChance = 0
let currentLetter = 0

const chosenWord = "TERMO"

let wordEls
let currentWord
let currentNode

const highlightLetter = () => {
  cleanHighlight()

  const letters = currentWord.querySelectorAll(".word__letter")
  currentNode = letters[currentLetter]
  currentNode.classList.toggle("word__letter--selected")
}

const clearSelectedWord = () => {
  currentWord.classList.toggle("word--selected")
}

const cleanHighlight = () => {
  const highlighted = document.querySelector(".word__letter--selected")

  if (highlighted) {
    highlighted.classList.toggle("word__letter--selected")
  }
}

const highlightForwards = () => {
  if (currentLetter >= LETTER_COUNT - 1) {
    currentLetter = 0
  } else {
    currentLetter++
  }
  highlightLetter()
}
const highlightBackwards = () => {
  if (currentLetter <= 0) {
    currentLetter = LETTER_COUNT - 1
  } else {
    currentLetter--
  }
  highlightLetter()
}

const checkIfIsCompleted = () => {
  const lettersNodes = currentWord.querySelectorAll(".word__letter")

  let letterString = ""
  lettersNodes.forEach((node) => {
    letterString += node.innerText
  })

  return letterString.length === LETTER_COUNT ? true : false
}

const checkWord = () => {
  if (!checkIfIsCompleted()) {
    currentWord.classList.toggle("word--uncompleted")
    setTimeout(() => {
      currentWord.classList.toggle("word--uncompleted")
    }, 500)

    return
  }

  cleanHighlight()
  clearSelectedWord()

  const lettersNodes = currentWord.querySelectorAll(".word__letter")

  let chosenWordArr = chosenWord.split("")

  let rightLetters = 0

  lettersNodes.forEach((node, index) => {
    const { innerText } = node
    if (innerText === chosenWordArr[index]) {
      rightLetters++
      node.classList.toggle("word__letter--right")
    } else if (
      innerText !== chosenWordArr[index] &&
      chosenWordArr.includes(node.innerText)
    ) {
      node.classList.toggle("word__letter--wrong-place")
    } else {
      node.classList.toggle("word__letter--wrong")
    }
  })

  if (rightLetters !== LETTER_COUNT) {
    currentChance++
    currentLetter = 0
    startRound()
  }
}

const startRound = () => {
  currentWord = wordEls[currentChance]

  currentWord.classList.toggle("word--selected")

  highlightLetter()
}

const handleKeyPress = (ev) => {
  const { key } = ev

  if (!ev.repeat) {
    switch (key) {
      case "ArrowRight":
        highlightForwards()
        break
      case "ArrowLeft":
        highlightBackwards()
        break

      case "Enter":
        checkWord()
        break

      case "Backspace":
        highlightBackwards()
        currentNode.innerText = ""
        break

      default:
        if (
          (ev.keyCode >= 65 && ev.keyCode <= 90) ||
          (ev.keyCode >= 97 && ev.keyCode <= 122)
        ) {
          currentNode.innerText = key.toUpperCase()
          highlightForwards()
        }
        break
    }
  }
}

const buildWordContainer = () => {
  const wordEl = document.createElement("div")
  wordEl.classList.add("word")

  for (let index = 0; index < LETTER_COUNT; index++) {
    const letterEl = document.createElement("div")
    letterEl.classList.add("word__letter")
    wordEl.append(letterEl)
  }

  return wordEl
}

const buildBoard = () => {
  for (let index = 0; index < NUM_CHANCES; index++) {
    board.append(buildWordContainer())
  }

  wordEls = document.querySelectorAll(".word")
  startRound()
}

buildBoard()

window.addEventListener("keydown", handleKeyPress)
