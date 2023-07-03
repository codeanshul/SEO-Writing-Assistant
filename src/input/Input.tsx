import React , {FC} from 'react'
import './input.css'

interface Props{
    handleButtonClick : () => void;
    handleInputChangeHTML : (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleInputChangeKey : (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    text : string;
    keyword : string;
}
const Input : FC<Props> = ({handleButtonClick,handleInputChangeHTML,handleInputChangeKey,text,keyword}) => {
  return (
        <div className='input'>
                <h2> <u>HTML Input </u></h2>
                <textarea
                    className='htmlinput'
                    value={text}
                    onChange={handleInputChangeHTML}
                    spellCheck = 'false'
                />
                <textarea
                    className='keyword'
                    id="keywords"
                    value={keyword}
                    onChange={handleInputChangeKey}
                    placeholder="Enter keywords"
                >
                </textarea>
                <button
                    onClick={handleButtonClick}
                    className='button'
                >
                Get Recommendations
                </button>
        </div>
  )
}

export default Input