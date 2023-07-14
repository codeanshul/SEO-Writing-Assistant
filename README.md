<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    
<b>Problem Statement : </b>
To create a tool which will identify issues and provide suggestions on how to improve their SEO based on the html content provided . 
<br>
<br>
<b>The main goals of this project are:</b>
<br>
<ul>
<li>To provide suggestions and issues based on the body content of a page. </li>
<li>To enable user to get suggestions without having to publish a URL , so that they can make improvements while writing content </li>
</ul>
<br>
<b>Parameters which we have considered : </b>
<br>
<br>
<b> 1) Images : </b>
    <ul>
    <li>Alt text check : 
        Ensure that all images have descriptive alt text to improve accessibility and SEO.</li>
    <li>Image Format Check :
        Use the most appropriate image formats for your website, such as webp.</li>
    <li>Check Src link secured with https protocol :
        Ensure that all image src links are secured with https to protect user privacy and security.</li>
    <li>Potential Compression :
        Check for how much size of the image can be reduced without much affecting its quality.</li>
    <li>Set loading attribute of image tag to lazy : 
        Use the loading="lazy" attribute on image tags can improve page load speed.</li>
    </ul>

<b>2) Semantic Tags Check : </b>
    <ul>
        <li>Empty Tags Check :
            <br>
            a)Text elements such as article, section, and div do not have any inner HTML.
            <br>
            b)Image and anchor elements do not have any src or href attributes, respectively.
        </li>
        <li>Article Tags Check :
            <br>
            a)It should contain some heading in it, like h2, h3 element. This helps to identify the article.
            <br>
            b)An article tag should not just contain text tags, such as p or span. It should also contain other types of content like images , this helps to make the article more engaging.
            <br>
            c)An article tag should be directly nested within the body, main elements. This ensures that the article is displayed in the correct location on the page.
            <br>
            d)An article tag should not be nested within itself. 
        </li>
        <li>Section Tags Check:
            <br>
            a)The section element should contain a heading that identifies the section and helps users scan the page. The heading can be an h1, h2, h3, or h4 element.
            <br>
            b)The section element should not be used as a wrapper for other elements. If you need to group elements together, you can use the div element.
        </li>
        <li>Maximum Nesting of Div Tags :
            <br>
            a)Check the depth of nesting of div tags and report if it exceeds the limit. 
            <br>
            b)Can use exclusive sections instead.
        </li>
        <li>Non Semantic Tags Percentage : 
            <br>
            a)Determine the percentage of non-semantic tags in the content and report if it exceeds a specified limit.
        </li>
    </ul>

<b>3) Header tags : </b>
    <ul>
        <li>Empty and Length of Header : 
        <br>
        The function checks for empty header tags and warns if the header tag is too long.
        </li>
        <li>Count of H1 Tags and position : 
        <br>
        The function checks for the number of h1 tags in the page. There should only be one h1 tag in a page, and it should be on the top of the page.
        </li>
        <li>Keywords inside H1 Tag : 
        <br>
        The function checks for keywords in the h1 tag. The keywords should be relevant to the content of the page and should be used in a natural way. 
        </li>
        <li>Hierarchy of Header Tags :
        <br>
        The function checks the hierarchy of header tags to ensure proper nesting. This means that the h1 tags should be nested within h2 tags, which should be nested within h3 tags, and so on.
        </li>
    </ul>
        

<b>4) Links :</b>
    <ul>
        <li>
            Rel attribute: 
            <br>
            Check that the rel attribute of a link is  set to "nofollow" for external link. This attribute tells search engines not to follow the link, which can reduce the link's authority.
        </li>
        <li>
            Anchor text:
            <br>
            Check that the anchor text of a link provides enough information to the user about the link's destination before they click on it.
        </li>
        <li>
            HTTPS Protocol : 
            <br>
            Check that the href attribute of a link is secure with the https protocol. This ensures that the user's data is protected when they click on the link
        </li>
        <li>
            Crawlable links: 
            <br>
            Check that all links on a website are crawlable by search engines. This ensures that all pages on the website can be indexed by search engines.
        </li>
    </ul>

<b>5) Text Content :</b> 
    <ul>
    <li>
        Use long-tail keywords: 
        <br>
        These are more specific and less competitive than short-tail keywords, so they can help you rank higher in search results.
    </li>
    <li>
        Use some keywords inside the content: 
        <br>
        This means using the keywords throughout your content in a natural way.
    </li>
    <li>
        Avoid keyword stuffing. 
        <br>
        This is when you use too many keywords on a page, which can make your content look spammy and can get you penalized by search engines.
    </li>
    <li>
        Check the Flesch-Kincaid readability score. 
        <br>
        This score measures how easy your content is to read and understand.
        <br>
        This can be improved by  : Simplifying sentence structure , use clear and simple language and shorten paragraphs
    </li>
    </ul> 
<br>
<br>
<b>Future Scope :</b>
<br>
<br>
1)We can search for the code of Lighthouse that includes the parameters we are currently using.
<br>
2)We can integrate our project with a WYSIWYG editor, allowing us to conveniently highlight and suggest the specific elements we want directly within the editor.
<br>
3)We can develop a score calculator based on the relative importance of each factor.
<br>
4)We can prioritise critical warnings for each parameter by placing them above all the content, followed by normal warnings.
<br>
<br>
References : 

<a href = 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide'>SEO Starter Guide </a>

<a href = 'https://www.searchenginejournal.com/on-page-seo/essential-factors/'>On page SEO </a>

<a href = 'https://developers.google.com/search/docs/appearance/google-images'>Google Images </a>

<a href = 'https://www.searchenginejournal.com/on-page-seo/image-optimization/#close'>Image Optimization </a>

<a href = 'https://cloud.google.com/vision/docs/supported-files'> Supported Files </a>

<a href = 'https://www.semrush.com/blog/semantic-html5-guide/' > Semantic HTML </a>

<a href = 'https://seosherpa.com/header-tags/'> Header Tags </a>

<a href = 'https://www.searchenginejournal.com/on-page-seo/header-tags/#close'>More on header Tags </a>

<a href = 'https://www.searchenginejournal.com/seo/why-links-important-seo/#close'> Why links are important </a>

<a href = 'https://www.semrush.com/blog/external-links/'> External links </a>

<a href = 'https://www.semrush.com/blog/what-is-anchor-text-and-how-can-i-optimize-it/'> Anchor text and optimization </a>

<a href = 'https://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_tests'> Readability Test </a>

<a href = 'https://www.searchenginejournal.com/keyword-research/long-tail-keywords/#close'> Long Tail Keywords </a>
</body>
</html>