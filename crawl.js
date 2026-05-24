const{ JSDOM } = require('jsdom')
async function crawlpage(baseURL,currentURL, Pages){
    const baseURLobj = new URL(baseURL)
    const currentURLobj = new URL(currentURL)
    if(baseURLobj.hostname !== currentURLobj.hostname){
        return Pages
    }
    const normalizedCurrentURL = normalizeURL(currentURL)
    if(Pages[normalizedCurrentURL] > 0){
        Pages[normalizedCurrentURL]++
        return Pages
    }
    Pages[normalizedCurrentURL] = 1
   console.log(`actively crawling ${currentURL}`)
   try{
     const resp = await fetch(currentURL)
     if(resp.status > 399){
        console.log(`error in fetch with status code: ${resp.status} on page: ${currentURL}`)
        return Pages
     }
     const contentType = resp.headers.get("content-type")
     if(!contentType.includes("text/html")){
        console.log(`non html response, content type: ${contentType}, on page: ${currentURL}`)
        return Pages
     }
   const htmlbody = await resp.text()
    const nextURLs = getURLsFROMHTML(htmlbody, baseURL)
    for(const nextURL of nextURLs){
        Pages = await crawlpage(baseURL, nextURL, Pages)
    }
    return Pages
   }catch(err){
    console.log(`error in fetch: ${err.message}, on pagea; ${currentURL}`)
   }
   
}

function getURLsFROMHTML(htmlbody, baseURL) {
    const urls = []
    const dom = new JSDOM(htmlbody)
    const linkELements= dom.window.document.querySelectorAll('a')
    for(const linkElement of linkELements){
        if(linkElement.href.slice(0,1)==='/'){
            //relative url
            try{
                const urlobj =  new URL(`${baseURL}${linkElement.href}`)
                urls.push(urlobj.href)
            }catch(err){
                console.log(`error with relative url: ${err.message}`)
            }
            
        } else{
            //absolute url
            try{
                const urlobj =  new URL(linkElement.href)
                urls.push(urlobj.href)
            }catch(err){
                console.log(`error with absolute url: ${err.message}`)
            }
             
            
        }
        
    }
    return urls
}
function normalizeURL(urlstring) {
    const urlobj = new URL(urlstring)
    const hostpath = `${urlobj.hostname}${urlobj.pathname}`
    if(hostpath.length >0 && hostpath.slice(-1)=== '/'){
        return hostpath.slice(0,-1)
    }
    return hostpath


}

module.exports = {
    normalizeURL,
    getURLsFROMHTML,
    crawlpage
}