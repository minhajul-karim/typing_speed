import React, { useEffect, useRef, useState } from 'react'

// Calculate Errors
const calculateErrors = (testText, text) => {
  let errorCount = 0
  for (let i = 0; i < text.length; i++) {
    if (text[i] !== testText[i]) {
      errorCount += 1
    }
  }
  return errorCount
}

export default function TypingSpeed() {
  const TEST_DURATION = 60
  const [text, setText] = useState('')
  const [timeRemaining, setTimeRemaining] = useState(TEST_DURATION)
  const [hasTestStarted, setHasTestStarted] = useState(false)
  const [wpm, setWpm] = useState(0)
  const textareaRef = useRef(null)
  const testText = 'Long time ago, there lived four cows in a jungle. They were best friends. They always grazed together and saved each other in danger. Due to this unity, even the tigers and lions could not kill and eat them. A lion had indeed an eye upon these cows. But he could never find the right opportunity to make them his prey. One day, the cows had a fight among themselves. Each one grazed separately her own way. The lion and the tiger got to know about the fight of the cows. So, they planned to trick all the cows. One day, lion and the tiger found the right opportunity to attack them.'

  // Save user input in state
  const changeHandler = event => {
    setText(event.target.value)
  }

  // Start the test
  const clickHandler = () => {
    setTimeRemaining(TEST_DURATION)
    setHasTestStarted(true)
    setText('')
  }

  // Calculate WPM
  useEffect(() => {
    const grossWpm = Math.ceil((text.length / 5) / (TEST_DURATION / 60))
    const numOfErrors = calculateErrors(testText, text)
    console.log(grossWpm, numOfErrors)
    const currentWpm = grossWpm - numOfErrors
    setWpm(currentWpm >= 0 ? currentWpm : 0)
  }, [text])

  useEffect(() => {
    // Give focus to textarea
    textareaRef.current.focus()
    // Create counter
    if (hasTestStarted && timeRemaining > 0) {
      setTimeout(() => {
        setTimeRemaining(prevTime => prevTime - 1)
      }, 1000)
    } else {
      setHasTestStarted(false)
    }
  }, [hasTestStarted, timeRemaining])

  return (
    <div className="typing_container">
      <h1 className="typing_container__title">Typing Speed Test</h1> 
      <p className="typing_container__test">{testText}</p>
      <p className="typing_container__speed">Speed <strong>{wpm}</strong> WPM</p>
      <p className="typing_container__accuracy">Accuracy <strong>0%</strong></p>
      <button 
        className="typing_container__btn"
        onClick={clickHandler}
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