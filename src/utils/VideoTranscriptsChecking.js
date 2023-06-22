
export default function videoChecking(htmlInput)
{
    const allVideos = htmlInput.querySelectorAll('video');
    if(allVideos.length == 0){
        giveSuggestion(`<p> No videos on your page .</p>`);
        return;
    }
    else{
        for(let video of allVideos){
            if(!video.hasAttribute('transcript')){
                giveSuggestion(`<p> No transcript for the video ${video.src}</p>`);
            }
            else{
                let transcriptValue = video.getAttribute('transcript');
                console.log(transcriptValue);
                if(hasOnlyWhitespaceContentOrNULL(transcriptValue)){
                    giveSuggestion(`<p> Transcript tag present but no value inside transcript tag</p>`);
                }
            }
        }
    }
    function hasOnlyWhitespaceContentOrNULL(element) {
        if(element === null)return true;
        if(element.trim() === null)return true;
        const whitespaceRegex = /^\s*$/;
        // Remove leading and trailing whitespace from the element's content
        const content = element.trim();// check by using length on trim
        return whitespaceRegex.test(content);
    }
    function giveSuggestion(text){
        const videoID = document.getElementById('Video');
        videoID.insertAdjacentHTML('beforeend',text);
    }
}