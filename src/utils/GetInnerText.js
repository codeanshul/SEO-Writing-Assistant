
export default function getInnerText(readText) {
    // Create a temporary container element
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = readText;
    console.log(tempContainer);
    // Remove unwanted elements or properties
    const elementsToRemove = ['style', 'script', 'link', 'meta'];
    elementsToRemove.forEach((tagName) => {
        const elements = tempContainer.getElementsByTagName(tagName);
        for (let i = elements.length - 1; i >= 0; i--) {
            elements[i].parentNode.removeChild(elements[i]);
        }
    });
    const computedStyles = window.getComputedStyle(tempContainer);
    // Filter out styles that don't affect the visible content
    const ignoredStyles = ['display', 'visibility', 'opacity'];
    ignoredStyles.forEach((style) => {
        if (style in computedStyles) {
            tempContainer.style[style] = computedStyles[style];
        }
    });
    // Get the cleaned inner text
    const cleanedInnerText = tempContainer.innerText.trim();
    // Clean up the temporary container
    tempContainer.remove();
    // Return the cleaned inner text
    return cleanedInnerText;
}