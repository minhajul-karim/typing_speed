import React from 'react'
import { useTypingCalculation } from '../../hooks/useTypingCalculation'

export default function TypingSpeed() {
  const {
    startTest,
    hasTestStarted,
    timeRemaining,
    testTextSpans,
    text,
    wpm,
    accuracy,
    textareaRef,
    changeHandler,
    shouldModalOpen,
    modalText,
    goBack,
  } = useTypingCalculation()

  return (
    <div className="typing_container">
      <div className="overlay" style={{ display: shouldModalOpen ? 'block' : 'none' }}>
        <div className="modal">
          <h2>{modalText}</h2>
          <button type="button" className="typing_container__btn" onClick={goBack}>
            Go back
          </button>
        </div>
      </div>
      <h1 className="typing_container__title">Typing Speed Test</h1>
      <p className="typing_container__test">{testTextSpans}</p>
      <p className="typing_container__speed">
        Speed <strong>{wpm > 0 ? wpm : 0}</strong> WPM
      </p>
      <p className="typing_container__accuracy">
        Accuracy <strong>{accuracy > 0 ? accuracy : 0}%</strong>
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
