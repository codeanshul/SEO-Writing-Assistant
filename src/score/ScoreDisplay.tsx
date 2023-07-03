import React , {FC} from 'react'
import './scoreDisplay.css'

interface Props{
  score : number;
  children : string;
}
const ScoreDisplay: FC<Props> = ({ score }) => {
  let backgroundColorScore;
  if (score <= 40) backgroundColorScore = 'red';
  else if (score <= 80) backgroundColorScore = 'yellow';
  else backgroundColorScore = 'green';
  return (

    <div className="score-display" style={{ display: 'flex', alignItems: 'center'}}>
      <div className="score-circle" style={{backgroundColor : backgroundColorScore}}>
        <div className="score">
            {score.toFixed(1)}
        </div>
      </div>
    </div>
  )
}

export default ScoreDisplay