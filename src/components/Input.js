import React from 'react'
import '../styles/Input.css'
const Input = (props) => {
  return (
        <div className='input'>
                <h2> HTML Input</h2>
                <textarea
                    className='htmlinput'
                    type="text"
                    value={props.text}
                    onChange={props.handleInputChangeHTML}
                    spellCheck = 'false'
                />
                <textarea
                    className='keyword'
                    type="text"
                    id="keywords"
                    value={props.keyword}
                    onChange={props.handleInputChangeKey}
                    placeholder="Enter keywords"
                >
                </textarea>
                <button
                    onClick={props.handleButtonClick}
                    className='button'
                >
                Get Recommendations
                </button>
        </div>
  )
}

export default Input