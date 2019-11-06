document.addEventListener("DOMContentLoaded", () => {
    // assign relevant variables
    const quoteList = document.querySelector("#quote-list")
    const newQuoteForm = document.querySelector("#new-quote-form")

    // initial fetch
    // calls append function to load quotes to the dom
    let getQuotes = async () => {
        let response = await fetch("http://localhost:3000/quotes?_embed=likes")
        let quotes = await response.json()
        appendQuotes(quotes)
    }

    // append quotes to the dom
    let appendQuotes = (quotes) => {

        // clear any existing quotes
        let child = quoteList.lastElementChild;  
        while (child) { 
            quoteList.removeChild(child); 
            child = quoteList.lastElementChild; 
        } 
        // create and append each quote
        quotes.forEach(quote => {
            let quoteLi = document.createElement("li")
            quoteLi.setAttribute("class", 'quote-card')

            let blockQuote = document.createElement("blockquote")
            blockQuote.setAttribute("class", "blockquote")

            let quoteP = document.createElement("p")
            quoteP.setAttribute("class", "mb-0")
            quoteP.innerText = quote.quote
            blockQuote.appendChild(quoteP)

            // author
            let footer = document.createElement("footer")
            footer.setAttribute("class", "blockquote-footer")
            footer.innerText = quote.author
            blockQuote.appendChild(footer)

            let lineBreak = document.createElement("br")
            blockQuote.appendChild(lineBreak)

            // likeButton
            let likeButton = document.createElement("button")

            let numOfLikes
            if (quote.likes){
                numOfLikes = quote.likes.length
            } else {numOfLikes = 0}

            likeButton.setAttribute("class", 'btn-success')
            let quoteLikes = document.createElement("span")
            quoteLikes.innerText = `${numOfLikes}`
            likeButton.innerText = "Likes: "
            // like event listener
            likeButton.appendChild(quoteLikes)
            likeButton.addEventListener("click", () => {
                // call fetch function here
                addLike(quote)
            })
            blockQuote.appendChild(likeButton)

            // delete button
            let deleteButton = document.createElement("button")
            deleteButton.setAttribute("class", 'btn-danger')
            deleteButton.innerText = "Delete"
            deleteButton.addEventListener("click", () => {
                deleteQuote(quote)
            })
            blockQuote.appendChild(deleteButton)
            // append entire quote display object to the dom
            quoteLi.appendChild(blockQuote)
            quoteList.appendChild(quoteLi)
        })
    }
    
    // fetch to create new quote
    let postQuote = async (formData) => {
       
        let configObj = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(formData)
        }
        await fetch("http://localhost:3000/quotes", configObj)
        // fetch and display updated data
        getQuotes()
    }

    // fetch to add new like
    let addLike = async (quote, numOfLikes) => {

        let id = parseInt(quote.id)   
        
        let configObj = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                quoteId: id
            })
        }

        let response = await fetch("http://localhost:3000/likes/", configObj)
        // update relevant variable with new data
        let updatedLikes = await response.json()
        quote.likes.push(updatedLikes)
        numOfLikes = quote.likes.length
        // fetch and display updated data
        getQuotes()
    }

    // fetch to delete quote
    let deleteQuote = async (quote) => {
        let id = quote.id

        await fetch("http://localhost:3000/quotes/"+id, {method: "DELETE"})
        getQuotes()
    }

    // add event listener to form
    newQuoteForm.addEventListener("submit", () => {
        let formData = {
            quote: event.target['new-quote'].value,
            author: event.target['author'].value
            }
        // redirect submit event to post form data to api
        event.preventDefault()
        postQuote(formData)
    })

    // initial page load
    getQuotes()


})