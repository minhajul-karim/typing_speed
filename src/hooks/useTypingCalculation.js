import asdfjkl from 'asdfjkl'
import { useEffect, useReducer, useRef } from 'react'

const TEST_DURATION = 60
const testText =
  'this is a simple paragraph that is meant to be nice and easy to type which is why there will be commas no periods or any capital letters so i guess this means that it cannot really be considered a paragraph but just a series of run on sentences this should help you get faster at typing as im trying not to use too many difficult words in it.'
const testTextArr = testText.split(' ')

const reducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE_TEXT':
      return { ...state, text: action.text }
    case 'SET_REMAINING_TIME':
      return { ...state, timeRemaining: action.time }
    case 'CHANGE_REMAINING_TIME':
      return { ...state, timeRemaining: state.timeRemaining - 1 }
    case 'CHANGE_START_TEST_STATUS':
      return { ...state, hasTestStarted: action.status }
    case 'CHANGE_WPM':
      return { ...state, wpm: action.wpm }
    case 'CHANGE_ACCURACY':
      return { ...state, accuracy: action.accuracy }
    case 'CLOSE_MODAL':
      return { ...state, shouldModalOpen: false }
    case 'START_TEST':
      return {
        ...state,
        text: '',
        timeRemaining: TEST_DURATION,
        hasTestStarted: true,
        wpm: 0,
        accuracy: 0,
        nonsensicalWordsCount: 0,
      }
    case 'RESET': {
      return { ...state, timeRemaining: 0, hasTestStarted: false, wpm: 0, accuracy: 0 }
    }
    case 'CALCULATE_MISTAKES':
      if (action.count > 3) {
        return { ...state, shouldModalOpen: true, nonsensicalWordsCount: 0 }
      }
      return {
        ...state,
        wpm: action.wpm,
        accuracy: action.accuracy,
        nonsensicalWordsCount: action.count,
      }
    default:
      return state
  }
}

const calculateMistakes = (text) => {
  let mistakes = 0
  let nonsensicalWords = 0
  // Remove unnecessary spaces from text
  const filteredTextArr = text
    .trim()
    .split(' ')
    .filter((word) => word !== '')
  filteredTextArr.forEach((word, index) => {
    // Check for mistakes
    if (word !== testTextArr[index]) {
      mistakes += 1
    }
    // Check for nonsensical words
    if (asdfjkl(word)) {
      nonsensicalWords += 1
    }
  })
  return { mistakes, nonsensicalWords }
}

export default function useTypingCalculation() {
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
  })

  const {
    text,
    timeRemaining,
    hasTestStarted,
    wpm,
    accuracy,
    nonsensicalWordsCount,
    shouldModalOpen,
  } = state

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

  // Calculate WPM and accuracy
  useEffect(() => {
    // Check if user has pressed space
    const hasPressedSpace = text[text.length - 1] === ' '
    // Calculate wpm, accuracy after each space
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
  }, [text])

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
