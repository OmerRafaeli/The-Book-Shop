'use strict'
const STORAGE_KEY = 'bookDB'
const gRates = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
const PAGE_SIZE = 5

var gBooks
var gPageIdx = 0
var gCurrViewedBook
var gFilterBy = { rate: '', minPrice: 0 }
_createBooks()



function createBook(
    title = makeLorem(2),
    price = getRandomIntInclusive(9, 100)
) {
    return {
        id: makeId(),
        title,
        price,
        rate: 0
    }
}

function _createBooks() {
    var books = loadFromStorage(STORAGE_KEY,)
    if (!books || !books.length) {
        books = []
        for (var i = 0; i < 35; i++) {
            books.push(createBook())
        }
    }
    gBooks = books
    _saveBooksToStorage()
}

function nextPage() {
    gPageIdx++
    if (gPageIdx * PAGE_SIZE >= gBooks.length) {
        const elNextPage = document.querySelector('.next-page')
        elNextPage.setAttribute('disabled', '')
    }
    const elPreviousPage = document.querySelector('.previous-page')
    elPreviousPage.removeAttribute('disabled')
}

function previousPage() {
    gPageIdx--
    if (gPageIdx === 0) {
        const elPreviousPage = document.querySelector('.previous-page')
        elPreviousPage.setAttribute('disabled', '')
    }
    const elNextPage = document.querySelector('.next-page')
    elNextPage.removeAttribute('disabled')
}

function getRates() {
    return gRates
}

function getBooksForDisplay() {
    var books = gBooks.filter(book => book.rate + ''.includes(gFilterBy.rate + '') &&
        book.price >= gFilterBy.minPrice)

    const startIdx = gPageIdx * PAGE_SIZE
    books = books.slice(startIdx, startIdx + PAGE_SIZE)
    return books
}

function addBook(name, price) {
    const book = createBook(name, price)
    gBooks.unshift(book)
    _saveBooksToStorage()
    return book
}

function removeBook(bookId) {
    const bookIdx = gBooks.findIndex(book => book.id === bookId)
    gBooks.splice(bookIdx, 1)
    _saveBooksToStorage()
}

function updateBook(bookId, bookPrice) {
    const book = gBooks.find(book => book.id === bookId)
    console.log(gBooks)//.price = bookPrice
    book.price = bookPrice
    _saveBooksToStorage()
    return book

}

function changeBookRating(val) {
    gCurrViewedBook.rate = val
    _saveBooksToStorage()
}

function setBookFilter(filterBy = {}) {
    if (filterBy.rate !== undefined) gFilterBy.rate = filterBy.rate
    if (filterBy.minPrice !== undefined) gFilterBy.minPrice = filterBy.minPrice
    return gFilterBy
}

function setBookSort(sortBy = {}) {
    if (sortBy.price !== undefined) {
        gBooks.sort((c1, c2) => (c1.price - c2.price) * sortBy.price)
    } else if (sortBy.rate !== undefined) {
        gBooks.sort((c1, c2) => (c1.rate - c2.rate) * sortBy.rate)
    }
}

function getBookById(bookId) {
    const book = gBooks.find(book => bookId === book.id)
    return book
}