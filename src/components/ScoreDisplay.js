import React from 'react'
import '../styles/ScoreDisplay.css'

const ScoreDisplay = ({score}) => {
  return (
    
    <div className="score-display" style={{display : 'flex' , alignItems : 'center'}}>
      <div className="score-circle">
        <div className="score">50</div>
      </div>
    </div>
  )
}

export default ScoreDisplay