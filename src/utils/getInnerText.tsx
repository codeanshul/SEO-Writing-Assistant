export default function getInnerText(readText: string): string {
    // Create a temporary container element
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = readText;

    // Remove unwanted elements or properties
    const elementsToRemove: string[] = ['style', 'script', 'link', 'meta'];
    elementsToRemove.forEach((tagName: string) => {
        const elements = tempContainer.getElementsByTagName(tagName);
        for (let i = elements.length - 1; i >= 0; i--) {
            const element = elements[i];
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }
    });
    const computedStyles = window.getComputedStyle(tempContainer);
    // Filter out styles that don't affect the visible content
    const ignoredStyles: string[] = ['display', 'visibility', 'opacity'];
    ignoredStyles.forEach((style: string) => {
        if (style in computedStyles) {
            const computedStyleValue = computedStyles[style as keyof CSSStyleDeclaration];
            if (typeof computedStyleValue === 'number') {
                tempContainer.style[style as any] = computedStyleValue.toString();
            }
        }
    });

    // Get the cleaned inner text
    const cleanedInnerText = tempContainer.innerText.trim();

    // Clean up the temporary container
    tempContainer.remove();

    // Return the cleaned inner text
    return cleanedInnerText;
}
