import asdfjkl from 'asdfjkl'
import React, { useEffect, useRef, useState } from 'react'

export default function TypingSpeed() {
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
    'this is a fox simple paragraph that is meant to be nice and easy to type which is why there will be mommas no periods or any capital letters so i guess this means that it cannot really be considered a paragraph but just a series of run on sentences this should help you get faster at typing as im trying not to use too many difficult words in it.'
  const testTextArr = testText.split(' ')

  // Save user input in state
  const changeHandler = (event) => {
    setText(event.target.value)
  }

  // Start the test
  const startTest = () => {
    setTimeRemaining(TEST_DURATION)
    setHasTestStarted(true)
    setText('')
  }

  const goBack = () => {
    setShouldModalOpen(false)
  }

  // Calculate mistakes
  const calculateMistakes = () => {
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
  }

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
  }, [text])

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
    if (nonsensicalWords.length > 3) {
      setShouldModalOpen(true)
      textareaRef.current.blur()
    }
  }, [nonsensicalWords])

  return (
    <div className="typing_container">
      <div className="overlay" style={{ display: shouldModalOpen ? 'block' : 'none' }}>
        <div className="modal">
          <h2>Please focus on your accuracy and try again</h2>
          <button type="button" className="typing_container__btn" onClick={goBack}>
            Go back
          </button>
        </div>
      </div>
      <h1 className="typing_container__title">Typing Speed Test</h1>
      <p className="typing_container__test">{testText}</p>
      <p className="typing_container__speed">
        Speed <strong>{wpm}</strong> WPM
      </p>
      <p className="typing_container__accuracy">
        Accuracy <strong>{accuracy}%</strong>
      </p>
      <button
        type="button"
        className="typing_container__btn"
        onClick={startTest}
        disabled={hasTestStarted}
      >
        start
      </button>
      <p className="typing_container__time">{timeRemaining}s</p>
      <textarea
        className="typing_container__textarea"
        value={text}
        onChange={changeHandler}
        disabled={!hasTestStarted}
        ref={textareaRef}
      />
    </div>
  )
}
