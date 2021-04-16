import asdfjkl from 'asdfjkl'
import { useCallback, useEffect, useRef, useState } from 'react'

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
  const testText =
    'this is a simple paragraph that is meant to be nice and easy to type which is why there will be mommas no periods or any capital letters so i guess this means that it cannot really be considered a paragraph but just a series of run on sentences this should help you get faster at typing as im trying not to use too many difficult words in it.'
  const testTextArr = testText.split(' ')

  // Save user input in state
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
  }

  const goBack = () => {
    setShouldModalOpen(false)
  }

  // Calculate mistakes
  const calculateMistakes = useCallback(() => {
    let mistakes = 0
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
    const hasPressedSpace = text[text.length - 1] === ' '
    if (hasPressedSpace) {
      const grossWpm = Math.ceil(text.length / 5 / (TEST_DURATION / 60))
      const mistakes = calculateMistakes()
      const netWpm = grossWpm - mistakes / (TEST_DURATION / 60)
      setWpm(netWpm)
      const currentAccuracy = Math.ceil((netWpm / grossWpm) * 100)
      setAccuracy(currentAccuracy || 0)
    }
  }, [calculateMistakes, text])

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

  useEffect(() => {
    if (shouldModalOpen) {
      setTimeRemaining(0)
      setHasTestStarted(false)
      setWpm(0)
      setAccuracy(0)
    }
  }, [shouldModalOpen])

  useEffect(() => {
    // Give focus to textarea
    if (hasTestStarted) {
      textareaRef.current.focus()
    }
  }, [hasTestStarted])

  useEffect(() => {
    if (nonsensicalWords.length > 2) {
      setShouldModalOpen(true)
      textareaRef.current.blur()
    }
  }, [nonsensicalWords])

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
