import React, { useState } from 'react';
import '../styles/Button.css'
import Output from './Output';
import '../styles/HtmlInput.css'
import '../styles/Keywords.css'
// import input from './input.html';
const TextInput = () => {
    const [text, setText] = useState('');
    const [keyword, setKeyword] = useState('lorem,ipsum');
    const [htmlContent,setHtmlContent] = useState('');
    const [keyArray,setKeyArray] = useState('');
    const handleInputChangeHTML = (event) => {
        setText(event.target.value);
    };
    const handleInputChangeKey = (event) => {
        setKeyword(event.target.value);
    };
    const handleButtonClick = () => {

           fetch('input.html')
                .then((res) => res.text())
                .then((res) => {
                    setText(res);
                    processHTML(res);
                })
                .catch((err) => console.log(err))
        // if(text)processHTML(text);
        function processHTML(contents) {
            // Performing operations on the HTML contents
            const arr = contents.split("</html>");
            const htmlInput = document.createElement('html');
            htmlInput.innerHTML = contents;
            let keyArray = keyword.split(",");
            keyArray.forEach((item) => item.trim());
            setHtmlContent(htmlInput);
            setKeyArray(keyArray);
        }
    };

    return (
        <div className='page'>
            <div className='leftside'>
                <h2> HTML Input</h2>
                <textarea
                    className='htmlinput'
                    type="text"
                    value={text}
                    onChange={handleInputChangeHTML}
                    spellcheck = 'false'
                />
                <textarea
                    className='keyword'
                    type="text"
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
            <Output htmlInput={htmlContent} keyArray={keyArray} readText = {text}>
            </Output>
        </div>
    );
};

export default TextInput;
