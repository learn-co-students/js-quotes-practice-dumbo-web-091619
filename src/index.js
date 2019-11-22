// ==============first try 2:50 pm 11/20/19======================
let quoteList = document.querySelector('#quote-list')
let newQoutForm = document.querySelector('#new-quote-form')

function getQuotes(){
    fetch(`http://localhost:3000/quotes?_embed=likes`)
    .then(r => r.json())
    .then((quoteArr) => {
        
        quoteArr.forEach((quoteItem) => {
         
            renderQuote(quoteItem)

        })        

    })
}

function renderQuote(quoteItem){
    
    let qouteLi = document.createElement('li')
    let blockQuote = document.createElement('blockquote')
    let pTag = document.createElement('p')
    let brTag = document.createElement('br')
    let successButton = document.createElement('button')
    let dngrButton = document.createElement('button')
    let foorterTag = document.createElement('footer')
    let pSpan = document.createElement('span')
    let quoteLikesArr = quoteItem.likes

    qouteLi.className = 'quote-card'
    blockQuote.className = 'blockquote' 
    pTag.className = 'mb-0'
    foorterTag.className = 'blockquote-footer'
    successButton.className = 'btn-success'
    dngrButton.className = 'btn-danger'

    pTag.innerText = quoteItem.quote
    foorterTag.innerText = quoteItem.author
    successButton.innerText = 'likes:'
    successButton.id = quoteItem.id 
    dngrButton.innerText = "Delete"
    qouteLi.id = quoteItem.id
    dngrButton.id = qouteLi.id
    pSpan.innerText = ` ${quoteItem.likes.length}`
    
    successButton.append(pSpan)
    qouteLi.append(blockQuote,pTag,foorterTag,brTag,successButton,dngrButton)
    quoteList.append(qouteLi)

    deleteQuote(dngrButton,qouteLi)
    likeQuote(successButton,quoteItem,pSpan,quoteLikesArr)
    
}

function deleteQuote(dngrButton,qouteLi){
   dngrButton.addEventListener('click',(evt) => {
       console.log(evt.target)
       fetch(`http://localhost:3000/quotes/${evt.target.id}`, {
         method:'DELETE',
        headers: { 
            'Content-type': 'application/json'
        },
        body: JSON.stringify({

         })
       })
       .then(r => r.json())
       .then((response) => {

          console.log(evt.target)
          qouteLi.remove()
          newQoutForm.reset()       

       })
       
   })
}


function likeQuote(successButton,quoteItem,pSpan,quoteLikesArr){
    successButton.addEventListener('click',() => {
        
        fetch(`http://localhost:3000/likes`, {
          method:'POST',
          headers: { 
             'Content-type': 'application/json'
         },
         body: JSON.stringify({
             quoteId: quoteItem.id
          })
        })
        .then(r => r.json())
        .then((like) => {
                       
            quoteLikesArr.push(like)

            pSpan.innerText = ` ${quoteLikesArr.length}`
         
            successButton.append(pSpan)

        })
        
    })
}

newQoutForm.addEventListener('submit',(evt) => {
    evt.preventDefault()
    // console.log(evt.target)
    let newQuote = evt.target["new-quote"].value
    let newQuoteAuth = evt.target["author"].value
    let newQuoteLikes = []
    // console.log(newQuote,newQuoteAuth)
    
    fetch(`http://localhost:3000/quotes`, {
        method:'POST',
        headers: { 
            'Content-type': 'application/json'
     },
     body: JSON.stringify({
         author:newQuoteAuth,
         quote:newQuote,
         likes:newQuoteLikes
      })
    })
    .then(r => r.json())
    .then((newQuoteItem) => {
        renderQuote(newQuoteItem)
        newQoutForm.reset()
    })

})

getQuotes()
