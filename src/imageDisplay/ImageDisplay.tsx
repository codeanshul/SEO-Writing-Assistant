import React, { FC, useState } from 'react'
import './imageDisplay.css'
interface Props {
    src: string;
    altText: string;
}
const ImageDisplay: FC<Props> = ({ src, altText }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState("https://picsum.photos/200/200");

    const handleClick = () => {
        console.log(src);
        window.open(src,altText);
    };

    return (
        <img
            className = 'imageCheckDisplay'
            src={src}
            alt={altText}
            onClick={handleClick}
        />
    );
}

export default ImageDisplay