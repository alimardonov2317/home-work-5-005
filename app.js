const wrapperEl = document.querySelector(".wrapper")
const loadingEl = document.querySelector(".loading")
const btnSeemore = document.querySelector(".btn__seemore")
const collectionEl = document.querySelector(".collection")
const BASE_URL = "https://dummyjson.com"

const perPageCount = 10
let total = 0

async function fetchData(endpoint){
    const response = await fetch(`${BASE_URL}${endpoint}`)
    response
        .json()
        .then((res)=> {
            createCard(res)
            total = res.total
        })
        .catch((err) => console.log(err))
        .finally(()=> {
            loadingEl.style.display = "none"
            btnSeemore.removeAttribute("disabled")
            btnSeemore.textContent = "See more"
        })
}

window.addEventListener("load", ()=>{
    createLoading(perPageCount)
    fetchData(`/products?limit=${perPageCount}`)
    fetchCategory("/products/category-list")
})

function createLoading(n){
    loadingEl.style.display = "grid"
    loadingEl.innerHTML = null
    Array(n).fill().forEach(()=>{
        const div = document.createElement("div")
        div.className = "loading__item"
        div.innerHTML = `
            <div class="loading__image to-left">
            <div class="loading__title to-leftt"></div>
            </div>
        `
        loadingEl.appendChild(div)
    })
}

function createCard(data){
    // while(wrapperEl.firstChild){
    //     wrapperEl.firstChild.remove()
    // }
    data.products.forEach(product=> {
        const divEl = document.createElement("div")
        divEl.className = "card"
        divEl.innerHTML = `
            <img src=${product.thumbnail} alt="rasm">
            <h3>${product.title}</h3>
            <p>${product.price} USD</p>
            <button>Buy now</button>
        `
        wrapperEl.appendChild(divEl)    
    })
}

let offset = 0
btnSeemore.addEventListener("click", ()=>{
    btnSeemore.setAttribute("disabled", true)
    btnSeemore.textContent = "Loading..."
    createLoading(perPageCount)
    offset++
    if(total <= perPageCount + (offset * perPageCount)){
        btnSeemore.style.display = "none"
    }
    fetchData(`/products?limit=${perPageCount}&skip=${offset * perPageCount}`)
})





async function fetchCategory(endpoint){
    const response = await fetch(`${BASE_URL}${endpoint}`)
    response
        .json()
        .then(res => {
            createCategory(res);
        })
}

function createCategory(data){
    data.forEach((category)=> {
        const listEl = document.createElement("li")
        listEl.className = "item"
        listEl.dataset.category = `/products/category/${category}`
        listEl.textContent = category
        collectionEl.appendChild(listEl)
    })
}