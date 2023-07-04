import React, { FC } from 'react'
import './scoreDisplay.css'

interface Props {
  score: number;
  children: string;
  htmlInput: HTMLElement;
}
const ScoreDisplay: FC<Props> = ({ score, htmlInput }) => {
  let backgroundColorScore : string;
  if(score == 0)backgroundColorScore = 'lightgray';
  else if (score <= 40) backgroundColorScore = 'red';
  else if (score <= 80) backgroundColorScore = 'yellow';
  else backgroundColorScore = 'green';
  return (

    <div className="score-display" style={{ display: 'flex', alignItems: 'center' }}>

      <div className="score-circle" style={{ backgroundColor: backgroundColorScore }}>
        <div className="score">
          {
            htmlInput.innerHTML.trim() === '' ? (
              <p> No Content</p>
            ) : htmlInput.innerHTML.trim() !== '' && score === 0 ? (
              <p> Loading </p>
            ) : (
              score.toFixed(0)
            )
          }
          
        </div>
      </div>
    </div>
  )
}
export default ScoreDisplay