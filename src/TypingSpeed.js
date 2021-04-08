import React from 'react'

export default function TypingSpeed() {
  return (
    <div className="typing_container">
      <h1 className="typing_container__title">Typing Speed Test</h1> 
      <p className="typing_container__test">Long time ago, there lived four cows in a jungle. They were best friends. They always grazed together and saved each other in danger. Due to this unity, even the tigers and lions could not kill and eat them. A lion had indeed an eye upon these cows. But he could never find the right opportunity to make them his prey. One day, the cows had a fight among themselves. Each one grazed separately her own way. The lion and the tiger got to know about the fight of the cows. So, they planned to trick all the cows. One day, lion and the tiger found the right opportunity to attack them.</p>
      <p className="typing_container__speed">Speed <strong>50</strong> WPM</p>
      <p className="typing_container__accuracy">Accuracy <strong>90%</strong></p>
      <textarea className="typing_container__textarea" />
    </div>
  )
}