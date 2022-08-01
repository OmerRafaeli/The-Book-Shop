'use strict'

function onInit() {
    renderFilterByQueryStringParams()
    renderRates()
    renderBooks()
}

function renderRates() {
    const rates = getRates()

    var strHTMLs = rates.map(rate => `<option>${rate}</option>`)
    strHTMLs.unshift('<option value="">Select Rate</option>')


    document.querySelector('.filter-rate-select').innerHTML = strHTMLs.join('')
}

function renderBooks() {
    const books = getBooksForDisplay()
    const strHTMLs = books.map(book =>

        `<tr>
            <td class="book-id">${book.id}</td>
            <td class="book-id">${book.rate}</td>
            <td class="book-title">${book.title}</td>
            <td class="book-price">${book.price}$</td>
            <td class="book-actions">            
            <button class="table-action-btns" title="Read" onclick="onReadBook('${book.id}')">Read</button>
            <button class="table-action-btns" title="Update" onclick="onUpdateBook('${book.id}')">Update</button>
            <button class="table-action-btns" title="Delete" onclick="onRemoveBook('${book.id}')">Delete</button></td>                        
            </tr>`
    )
    //console.log('strHTML:', strHTML.join())
    document.querySelector('tbody').innerHTML = strHTMLs.join('')
}

function onRemoveBook(bookId) {
    removeBook(bookId)
    renderBooks()
}

function onAddBook() {
    const name = document.querySelector('.book-name').value
    const price = +document.querySelector('.book-price').value
    if (!name || !price || price === NaN) return
    addBook(name, price)
    renderBooks()
}

function onUpdateBook(bookId) {
    var book = getBookById(bookId)
    const newPrice = +prompt('new price?', book.price)
    if (newPrice && book.price !== newPrice) {
        //console.log('bookId, bookPrice:', bookId, newPrice)
        book = updateBook(bookId, newPrice)
        renderBooks()
    }
}

function onReadBook(bookId) {
    const book = getBookById(bookId)
    gCurrViewedBook = book
    const elReadModal = document.querySelector('.read-modal')
    elReadModal.style.backgroundImage = `url(../img/back-cover${getRandomIntInclusive(1, 4)}.png)`
    elReadModal.querySelector('.book-title').innerText = `Book Title: ${book.title}`
    elReadModal.querySelector('.book-side-title').innerText = book.title
    elReadModal.querySelector('.book-id').innerText = `Book id: ${book.id}`
    elReadModal.querySelector('.book-price').innerText = book.price + '$'
    elReadModal.querySelector('.book-summery').innerText = `Book Summery: ${makeLorem(30)}`
    document.querySelector('.rate-value').value = book.rate
    elReadModal.classList.add('open')
}

function onCloseModal() {
    const elReadModal = document.querySelector('.read-modal')
    elReadModal.classList.remove('open')
    renderBooks()
}

function onChangeBookRating(val) {
    const newVal = +(val + 1)
    const elRateValue = document.querySelector('.rate-value')
    if (newVal === 1 && elRateValue.value < 10) {
        elRateValue.value++
    } else if (newVal === -1 && elRateValue.value > 0) {
        elRateValue.value--
    }
    changeBookRating(elRateValue.value)
}

function onSetFilterBy(filterBy) {
    filterBy = setBookFilter(filterBy)
    renderBooks()

    const queryStringParams = `?rate=${filterBy.rate}&minPrice=${filterBy.minPrice}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)

}

function renderFilterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const filterBy = {
        rate: +queryStringParams.get('rate') || '',
        minPrice: +queryStringParams.get('minPrice') || 0
    }

    if (!filterBy.rate && !filterBy.minPrice) return

    document.querySelector('.filter-rate-select').value = filterBy.rate
    document.querySelector('.filter-price-range').value = filterBy.minPrice
    setBookFilter(filterBy)
}

function onSetSortBy() {
    const prop = document.querySelector('.sort-by').value
    const isDesc = document.querySelector('.sort-desc').checked

    const sortBy = {
        [prop]: (isDesc) ? -1 : 1
    }

    setBookSort(sortBy)
    renderBooks()
}

function onNextPage() {
    nextPage()
    renderBooks()
}

function onPreviousPage() {
    previousPage()
    renderBooks()
}