  fetch("http://localhost:3000/quotes?_embed=likes")
    .then(response => response.json())
    .then(arrayOfQuotes => arrayOfQuotes.forEach(quote => {
      renderQuote(quote);
    })
  )

  let quoteList = document.getElementById("quote-list")

  function renderQuote(quote){
    let quoteLi = document.createElement('li')
    quoteLi.className = 'quote-card'

    let deleteBtn = document.createElement('button')
    deleteBtn.className = 'btn-danger'
    deleteBtn.innerText = 'ew no'
    deleteBtn.addEventListener('click', () => deleteQuote(quote, quoteLi))

    let likeBtn = document.createElement('button')
    likeBtn.className = 'btn-success'
    likeBtn.innerText = 'we stan'
    likeBtn.innerHTML = `Likes: <span>${quote.likes.length}</span>`
    likeBtn.addEventListener('click', () => likeQuote(quote, quoteLi))

    quoteList.append(quoteLi)

    quoteLi.innerHTML += `<blockquote class="blockquote">
          <p class="mb-0">${ quote.quote }</p>
          <footer class="blockquote-footer">${ quote.author }</footer>`
    quoteLi.append(deleteBtn, likeBtn)

  }

  let newQuoteForm = document.getElementById("new-quote-form")

  newQuoteForm.addEventListener('submit', () => {
    event.preventDefault()

    let author = event.target['author'].value
    let quote = event.target['new-quote'].value

    createNewQuote(author, quote)
  })

  function createNewQuote(author, quote){
    fetch('http://localhost:3000/quotes?_embed=likes', {
      method: 'POST',
      headers: {
        "content-type": "application/json",
        "accept": "application/json"
      },
      body: JSON.stringify({
        author: author,
        quote: quote
      })
    })
    .then(r => r.json())
    .then(quoteObject => renderQuote(quoteObject))
  }

  function deleteQuote(quote, quoteLi){
    fetch(`http://localhost:3000/quotes/${quote.id}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json'
      }
    })
    .then(r => r.json())
    .then(quoteLi.remove())
  }

  function likeQuote(quote, quoteLi){
    let likeArray = quote.likes
    let likesNum = likeArray.length
    let likeBtn = quoteLi.querySelector('.btn-success')

    console.log('likes',likeArray);
    fetch(`http://localhost:3000/likes`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify({
        quoteId: quote.id
      })
    })
    .then(r => r.json())
    .then((like) => {
      quote.likes.push(like)
      likeBtn.innerHTML = `Likes: <span>${quote.likes.length}</span>`
    })
  }
