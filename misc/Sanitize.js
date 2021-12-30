import sanitizeHtml from 'sanitize-html';

    const sanitize = (dirty) => ({
     
        __html: sanitizeHtml(dirty,  { 
            allowedTags: [ 'b', 'i', 'em', 'strong', 'a', 'p', 'li' ],
            allowedAttributes: {
              'a': [ 'href' ]
            },
            allowedIframeHostnames: ['www.youtube.com']
          } 
        )
      });
      
    export default  function  SanitizeHTML( html) {
       return ( <div dangerouslySetInnerHTML={sanitize(html)} />)
    };
