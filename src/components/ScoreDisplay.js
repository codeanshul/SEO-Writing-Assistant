import React from 'react'
import '../styles/ScoreDisplay.css'

const ScoreDisplay = ({ score }) => {
  let backgroundColorScore;
  if (score <= 40) backgroundColorScore = 'red';
  else if (score <= 80) backgroundColorScore = 'yellow';
  else backgroundColorScore = 'green';
  return (

    <div className="score-display" style={{ display: 'flex', alignItems: 'center'}}>
      <div className="score-circle" style={{backgroundColor : backgroundColorScore}}>
        <div className="score">
            {score}
        </div>
      </div>
    </div>
  )
}

export default ScoreDisplay