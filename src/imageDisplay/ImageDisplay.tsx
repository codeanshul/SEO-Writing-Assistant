import React, { FC, useState } from 'react'

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
            src={src}
            alt={altText}
            onClick={handleClick}
            width="80px"
            height="40px"
            style={{ display: 'inline-block' }}
        />
    );
}

export default ImageDisplay