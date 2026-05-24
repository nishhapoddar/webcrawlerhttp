const {crawlpage} = require(`./crawl.js`)
function main(){
    if(process.argv.length <3){  //it is 3 because when we run the command node main.js https://www.google.com then in process.argv we have 3 things first is node, second is main.js and third is url
        console.log('no website provided')
        process.exit(1)
    }
    if(process.argv.length >3){
        console.log('too many command line argv')
        process.exit(1)
    }
    const baseURL = process.argv[2]
    console.log(`starting crawl at ${baseURL}`)
    crawlpage(baseURL)
}
main()