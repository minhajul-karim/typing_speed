import asdfjkl from 'asdfjkl'
import { useCallback, useEffect, useRef, useState } from 'react'

const testText =
  'this is a simple paragraph that is meant to be nice and easy to type which is why there will be commas no periods or any capital letters so i guess this means that it cannot really be considered a paragraph but just a series of run on sentences this should help you get faster at typing as im trying not to use too many difficult words in it.'

export default function useTypingCalculation() {
  const TEST_DURATION = 60
  const [text, setText] = useState('')
  const [timeRemaining, setTimeRemaining] = useState(TEST_DURATION)
  const [hasTestStarted, setHasTestStarted] = useState(false)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(0)
  const [nonsensicalWords, setNonsensicalWords] = useState([])
  const [shouldModalOpen, setShouldModalOpen] = useState(false)
  const textareaRef = useRef(null)
  const testTextArr = testText.split(' ')

  // Save user input
  const changeHandler = (event) => {
    setText(event.target.value)
  }

  // Start the test
  const startTest = () => {
    setWpm(0)
    setAccuracy(0)
    setTimeRemaining(TEST_DURATION)
    setHasTestStarted(true)
    setText('')
    setNonsensicalWords([])
  }

  // Close modal
  const goBack = () => {
    setShouldModalOpen(false)
  }

  // Calculate mistakes
  const calculateMistakes = useCallback(() => {
    let mistakes = 0
    // Remove unnecessary spaces from text
    const filteredText = text
      .trim()
      .split(' ')
      .filter((word) => word !== '')
    filteredText.forEach((word, index) => {
      // Check for nonsensical words
      if (asdfjkl(word) && !nonsensicalWords.includes(word)) {
        setNonsensicalWords((prevWords) => [...prevWords, word])
      } else if (word !== testTextArr[index]) {
        mistakes += 1
      }
    })
    return mistakes
  }, [nonsensicalWords, testTextArr, text])

  // Calculate WPM and accuracy
  useEffect(() => {
    // Check if user has pressed space
    const hasPressedSpace = text[text.length - 1] === ' '
    // Calculate wpm, accuracy after each space
    if (hasPressedSpace) {
      const grossWpm = Math.ceil(text.length / 5 / (TEST_DURATION / 60))
      const mistakes = calculateMistakes()
      const netWpm = grossWpm - mistakes / (TEST_DURATION / 60)
      setWpm(netWpm)
      const currentAccuracy = Math.ceil((netWpm / grossWpm) * 100)
      setAccuracy(currentAccuracy || 0)
    }
  }, [calculateMistakes, text])

  // Handle the countdown timer
  useEffect(() => {
    let timeoutId = null
    if (hasTestStarted && timeRemaining > 0) {
      timeoutId = setTimeout(() => {
        setTimeRemaining((prevTime) => prevTime - 1)
      }, 1000)
    } else if (hasTestStarted && timeRemaining === 0) {
      // When the timer ends
      setHasTestStarted(false)
    }
    return () => clearTimeout(timeoutId)
  }, [hasTestStarted, shouldModalOpen, timeRemaining])

  // Give focus to textarea when user clicks start button
  useEffect(() => {
    if (hasTestStarted) {
      textareaRef.current.focus()
    }
  }, [hasTestStarted])

  // Open modal when user writes more than 2 nonsensical words
  useEffect(() => {
    if (nonsensicalWords.length > 2) {
      setShouldModalOpen(true)
      textareaRef.current.blur()
    }
  }, [nonsensicalWords])

  // Reset test when the modal is open
  useEffect(() => {
    if (shouldModalOpen) {
      setTimeRemaining(0)
      setHasTestStarted(false)
      setWpm(0)
      setAccuracy(0)
    }
  }, [shouldModalOpen])

  return {
    startTest,
    hasTestStarted,
    timeRemaining,
    testText,
    text,
    wpm,
    accuracy,
    textareaRef,
    changeHandler,
    shouldModalOpen,
    goBack,
  }
}
