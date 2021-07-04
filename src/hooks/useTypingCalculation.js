import { useEffect, useReducer, useRef } from 'react'
import { reducer, calculateMistakes, testTextArr, testText, TEST_DURATION } from '../helpers'

export function useTypingCalculation() {
  const audio = new Audio('https://www.typingclub.com/m/audio/error.mp3')
  const textareaRef = useRef(null)
  const [state, dispatch] = useReducer(reducer, {
    text: '',
    timeRemaining: 0,
    hasTestStarted: false,
    wpm: 0,
    accuracy: 0,
    nonsensicalWordsCount: 0,
    shouldModalOpen: false,
    highlightIndex: 0,
    hasPressedSpace: false,
    highlightClassName: 'hightlight',
    modalText: '',
  })

  const {
    text,
    timeRemaining,
    hasTestStarted,
    wpm,
    accuracy,
    nonsensicalWordsCount,
    shouldModalOpen,
    modalText,
    highlightIndex,
    hasPressedSpace,
    highlightClassName,
  } = state

  const testTextSpans = testTextArr.map((word, index) => (
    <span
      key={index}
      className={index === highlightIndex ? highlightClassName : undefined}
    >{`${word} `}</span>
  ))

  // Save user input
  const changeHandler = (event) => {
    dispatch({ type: 'CHANGE_TEXT', text: event.target.value })
  }

  // Start the test
  const startTest = () => {
    dispatch({ type: 'START_TEST' })
  }

  // Close modal
  const goBack = () => {
    dispatch({ type: 'CLOSE_MODAL' })
  }

  // Calculate wpm, accuracy after each space
  useEffect(() => {
    if (hasPressedSpace) {
      const grossWpm = Math.ceil(text.length / 5 / (TEST_DURATION / 60))
      const { mistakes, nonsensicalWords } = calculateMistakes(text)
      const netWpm = grossWpm - mistakes / (TEST_DURATION / 60)
      const currentAccuracy = Math.ceil((netWpm / grossWpm) * 100)
      dispatch({
        type: 'CALCULATE_MISTAKES',
        wpm: netWpm,
        accuracy: currentAccuracy,
        count: nonsensicalWords,
      })
    }
  }, [text, hasPressedSpace])

  // Handle the countdown timer
  useEffect(() => {
    let timeoutId = null
    if (hasTestStarted && timeRemaining > 0) {
      timeoutId = setTimeout(() => {
        dispatch({ type: 'CHANGE_REMAINING_TIME' })
      }, 1000)
    } else if (hasTestStarted && timeRemaining === 0) {
      // When the timer ends
      dispatch({ type: 'CHANGE_START_TEST_STATUS', status: false })
    }
    return () => clearTimeout(timeoutId)
  }, [hasTestStarted, timeRemaining])

  // Focus to textarea when user clicks start button
  useEffect(() => {
    if (hasTestStarted) {
      textareaRef.current.focus()
    }
  }, [hasTestStarted])

  // Reset test when the modal is open
  useEffect(() => {
    if (shouldModalOpen) {
      dispatch({ type: 'RESET' })
    }
  }, [nonsensicalWordsCount, shouldModalOpen])

  // Increment highlight index only if user has typed correct word
  useEffect(() => {
    const wordNeedsToType = testTextArr[state.highlightIndex]
    if (hasPressedSpace) {
      const userHasTypedArr = text.split(' ')
      const userHasTypedLastWord = userHasTypedArr[userHasTypedArr.length - 2]
      if (userHasTypedLastWord === wordNeedsToType) {
        dispatch({
          type: 'INCREMENT_HIGHLIGHT_INDEX',
          className: 'hightlight',
        })
      } else {
        audio.play()
        dispatch({
          type: 'CHANGE_HIGHLIGHT_COLOR',
          className: 'hightlight__red',
        })
      }
    }
  }, [hasPressedSpace])

  // When user has finished typing the given text
  useEffect(() => {
    if (highlightIndex === testTextArr.length - 1) {
      // Delay showing the congrats message to let the user see the full text in textarea
      setTimeout(() => {
        dispatch({ type: 'END_TEST' })
      }, 1000)
    }
  }, [highlightIndex])

  // Detect if user has pressed space or not
  useEffect(() => {
    textareaRef.current.addEventListener('keyup', (e) => {
      if (e.key === ' ') {
        dispatch({ type: 'PRESSED_SPACE', hasPressedSpace: true })
      } else {
        dispatch({ type: 'PRESSED_SPACE', hasPressedSpace: false })
      }
    })
  }, [])

  return {
    startTest,
    hasTestStarted,
    timeRemaining,
    testText,
    testTextSpans,
    text,
    wpm,
    accuracy,
    textareaRef,
    changeHandler,
    shouldModalOpen,
    modalText,
    goBack,
  }
}
