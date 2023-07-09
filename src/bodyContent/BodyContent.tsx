import React, { useState , ChangeEvent} from 'react';
import Output from '../output/Output';
import Input from '../input/Input';
import './bodyContent.css'
const BodyContent = () => {
    const ele = document.createElement('body');
    const [text, setText] = useState('');
    const [keyword, setKeyword] = useState('');
    const [htmlContent, setHtmlContent] = useState<HTMLElement>(ele);
    const [keyArray, setKeyArray] = useState<string[]>([]);
    const handleInputChangeHTML = (event : ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value);
    };
    const handleInputChangeKey = (event : ChangeEvent<HTMLTextAreaElement>) => {
        setKeyword(event.target.value);
    };
    const handleButtonClick = () => {

        fetch('demo1.html')
            .then((res) => res.text())
            .then((res) => {
                setText(res);
                processHTML(res);
            })
            .catch((err) => console.log(err))
        // if(text)processHTML(text);
        function processHTML(contents : string) {
            // Performing operations on the HTML contents
            const arr = contents.split("</html>");
            const htmlInput = document.createElement('html');
            htmlInput.innerHTML = contents;
            let keyArray = keyword.replace(/\s+/g, ' ').trim().toLowerCase().split(',');
            // console.log(keyArray);
            // keyArray.map((item) => {
            //     return item = item.replace(/\s+/g, ' ').trim().toLowerCase();
            //     console.log(item);
            // });
            setHtmlContent(htmlInput);
            setKeyArray(keyArray);
        }
    };

    return (
        <main className='page'>
            <Input handleButtonClick={handleButtonClick} handleInputChangeHTML={handleInputChangeHTML} handleInputChangeKey={handleInputChangeKey} text={text} keyword={keyword}/>
            <Output htmlInput={htmlContent} keyArray={keyArray} readText={text} />
        </main>
    );
};
export default BodyContent;
