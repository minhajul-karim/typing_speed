import asdfjkl from 'asdfjkl'

export const TEST_DURATION = 60
export const testText =
  'this is a simple paragraph that is meant to be nice and easy to type which is why there will be commas no periods or any capital letters so i guess this means that it cannot really be considered a paragraph but just a series of run on sentences this should help you get faster at typing as im trying not to use too many difficult words in it.'
export const testTextArr = testText.split(' ')

export const reducer = (state, action) => {
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
        highlightIndex: 0,
        highlightClassName: 'hightlight',
      }
    case 'RESET': {
      return {
        ...state,
        timeRemaining: 0,
        hasTestStarted: false,
        wpm: 0,
        accuracy: 0,
      }
    }
    case 'CALCULATE_MISTAKES':
      if (action.count > 3) {
        return {
          ...state,
          shouldModalOpen: true,
          modalText: 'Please focus on your accuracy and try again',
          nonsensicalWordsCount: 0,
        }
      }
      return {
        ...state,
        wpm: action.wpm,
        accuracy: action.accuracy,
        nonsensicalWordsCount: action.count,
      }
    case 'INCREMENT_HIGHLIGHT_INDEX':
      if (state.highlightIndex < testTextArr.length - 1) {
        return {
          ...state,
          highlightIndex: state.highlightIndex + 1,
          highlightClassName: action.className,
        }
      }
      return state
    case 'PRESSED_SPACE':
      return {
        ...state,
        hasPressedSpace: action.hasPressedSpace,
      }
    case 'CHANGE_HIGHLIGHT_COLOR':
      return {
        ...state,
        highlightClassName: action.className,
      }
    case 'END_TEST':
      return {
        ...state,
        shouldModalOpen: true,
        modalText: `Congrats! You're a legend!`,
      }
    default:
      return state
  }
}

export const calculateMistakes = (text) => {
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
