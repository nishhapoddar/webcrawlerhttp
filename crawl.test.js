// sometimes there can be many url that lead to same page so in that case we use this things to speacify that all the url are extually pointing to the same page.purpose of normalizeURL is to take us to the same thing.
const { normalizeURL, getURLsFROMHTML } = require('./crawl.js')
const { test, expect } = require('@jest/globals')

test('normalizeURL strip protocol', () => {
    const input = 'https://blog.boot.dev/path'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
})

test('normalizeURL strip trailing slash', () => {
    const input = 'https://blog.boot.dev/path/'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
})

test('normalizeURL capitals', () => {
    const input = 'https://BLOG.boot.dev/path/'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)

})
test('normalizeURL strip protocol', () => {
    const input = 'http://blog.boot.dev/path/'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
})
// getURLsFROMHTML is used to extract all the url from the html body and return them as an array of string
test('getURLsFROMHTML absolute', () => {
    const inputHTMLBody = `
    <html>
    <body>
    <a href = "https://blog.boot.dev/path/"
           Boot.dev BLOG
           </a>
           </body>
           </html>
    `
    const inputbaseURL = "https://blog.boot.dev/path/"
    const actual = getURLsFROMHTML(inputHTMLBody, inputbaseURL)
    const expected = ["https://blog.boot.dev/path/"]
    expect(actual).toEqual(expected)
})
test('getURLsFROMHTML relative', () => {
    const inputHTMLBody = `
    <html>
    <body>
    <a href = "/path/"
           Boot.dev BLOG
           </a>
           </body>
           </html>
    `
    const inputbaseURL = "https://blog.boot.dev"
    const actual = getURLsFROMHTML(inputHTMLBody, inputbaseURL)
    const expected = ["https://blog.boot.dev/path/"]
    expect(actual).toEqual(expected)
})

test('getURLsFROMHTML both', () => {
    const inputHTMLBody = `
    <html>
    <body>
    <a href = "https://blog.boot.dev/path1/"
           Boot.dev BLOG path 1
           </a>
           <a href = "/path2/"
           Boot.dev BLOG path 2
           </a>
           </body>
           </html>
    `
    const inputbaseURL = "https://blog.boot.dev"
    const actual = getURLsFROMHTML(inputHTMLBody, inputbaseURL)
    const expected = ["https://blog.boot.dev/path1/", "https://blog.boot.dev/path2/"]
    expect(actual).toEqual(expected)
})
test('getURLsFROMHTML relative', () => {
    const inputHTMLBody = `
    <html>
    <body>
    <a href = "invalid">
           Invaid url
           </a>
           </body>
           </html>
    `
    const inputbaseURL = "https://blog.boot.dev"
    const actual = getURLsFROMHTML(inputHTMLBody, inputbaseURL)
    const expected = []
    expect(actual).toEqual(expected)
})

