let quoteList = document.getElementById('quote-list')
let newQuoteForm = document.getElementById('new-quote-form')

fetch('http://localhost:3000/quotes?_embed=likes')
.then(r => r.json())
.then(arrayOfQuotes => arrayOfQuotes.forEach(
    quote => (renderQuote(quote))
))

function renderQuote(quote) {
    let quoteLi = document.createElement('li')
    quoteLi.className = 'quote-card'
    quoteList.append(quoteLi)
    quoteLi.innerHTML += `<blockquote class="blockquote">
      <p class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      </blockquote>`
    let deleteBtn = document.createElement('button')
    deleteBtn.className = 'btn-danger'
    deleteBtn.id = `quote-${quote.id}`
    deleteBtn.innerText = 'Delete'
    let likeBtn = document.createElement('button')
    likeBtn.className = 'btn-success'
    likeBtn.id = `quote-${quote.id}`
    likeBtn.innerHTML = `Likes: <span>${quote.likes.length}</span>`
    quoteLi.append(likeBtn, deleteBtn)

    deleteBtn.addEventListener('click', () => {
        deleteQuote(quote, quoteLi)
    })

    likeBtn.addEventListener('click', () => {
        likeQuote(quote)
    })
}

newQuoteForm.addEventListener('submit', (event) => {
    event.preventDefault()
    let newAuthor = event.target.author.value
    let newQuote = event.target['new-quote'].value
    createNewQuote(newAuthor, newQuote)
    newQuoteForm.reset()
})

function createNewQuote(author, quote) {
    fetch("http://localhost:3000/quotes?_embed=likes", {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json'
        },
        body: JSON.stringify({
            author: author,
            quote: quote
        })
    })
    .then(r => r.json())
    .then(renderQuote(newQuote))
}

function deleteQuote(quote, quoteLi) {
    fetch(`http://localhost:3000/quotes/${quote.id}`, {
        method: "DELETE",
        headers: {
            'content-type': 'application/json'
        }
    })
    .then(r => r.json())
    .then(quoteLi.remove())
}

function likeQuote(quote) {
    fetch("http://localhost:3000/likes", {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            quoteId: quote.id
        })
    })
    .then(r => r.json())
    .then((likeObj) => {
        quote.likes.push(likeObj)
        let likeButton = document.getElementById(`quote-${quote.id}`)
        likeButton.innerHTML = `Likes: <span>${quote.likes.length}</span>`
    })
}
