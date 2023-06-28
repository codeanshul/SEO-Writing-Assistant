import React, { useState } from 'react';
import '../styles/BodyContent.css'
import Output from './Output';
import Input from './Input';
const BodyContent = () => {
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
            <Input handleButtonClick = {handleButtonClick} handleInputChangeHTML = {handleInputChangeHTML} handleInputChangeKey = {handleInputChangeHTML} text = {text} keyword = {keyword}>
            </Input>
            <Output htmlInput={htmlContent} keyArray={keyArray} readText = {text}>
            </Output>
        </div>
    );
};
export default BodyContent;
