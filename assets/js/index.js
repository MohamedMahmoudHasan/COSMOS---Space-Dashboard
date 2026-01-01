
const navLinks = document.querySelectorAll('.nav-link')
const appSection = document.querySelectorAll('.app-section')
console.log(appSection)

const loadDateInput = document.querySelector('#apod-date-input')
const loadDateSpan = document.querySelector('#apod-date-input').nextElementSibling
const loadDateBtn = document.querySelector('#load-date-btn')
const todayDateBtn = document.querySelector('#today-apod-btn')
const apodDate = document.querySelector('#apod-date')
const apodImage = document.querySelector('#apod-image')
const apodLoading = document.querySelector('#apod-loading')
const imgBtn = document.querySelector('#apod-image-container button')
const apodTitle = document.querySelector('#apod-title')
const apodDateDetail = document.querySelector('#apod-date-detail')
const apodExplanation = document.querySelector('#apod-explanation')
const apodCopyright = document.querySelector('#apod-copyright')
const apodDateInfo = document.querySelector('#apod-date-info')
const apodMediaType = document.querySelector('#apod-media-type')


for (let i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener('click',()=>{
        clearActiveNavLink()
        navLinks[i].classList.remove('text-slate-300', 'hover:bg-slate-800')
        navLinks[i].classList.add('bg-blue-500/10','text-blue-400')
        for (let j = 0; j < appSection.length; j++) {
            if(appSection[j].getAttribute('data-section') == navLinks[i].getAttribute('data-section')){
                appSection[j].classList.remove('hidden')
            }else{
                appSection[j].classList.add('hidden')
            }
        }
    })
    
}

function clearActiveNavLink(){
    for (let i = 0; i < navLinks.length; i++) {
        navLinks[i].classList.remove('bg-blue-500/10','text-blue-400')
        navLinks[i].classList.add('text-slate-300', 'hover:bg-slate-800')
    }
}


const isoDate = new Date().toISOString().slice(0, 10);
loadDateInput.setAttribute('max' , isoDate)
loadDateInput.value = isoDate
apiData()


async function apiData(dateValue = " ") {
    setDate()
    loadingData()
    let response = {}
    if(dateValue == " "){
        response = await fetch('https://api.nasa.gov/planetary/apod?api_key=48wB2ch9aFdLkxY1xUovYOLWzUSp5CJSKECuJI05')
    }else{
        response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=48wB2ch9aFdLkxY1xUovYOLWzUSp5CJSKECuJI05&date=${dateValue}`)
    }
    if(response.ok){
        let data = await response.json()
        display(data)
        apodImage.classList.remove('hidden')
        apodLoading.classList.add('hidden')
    }
}

function display(data){
    let options = {year: 'numeric', month: 'long', day: 'numeric' };
    let today  = new Date(data.date);
    let date = today.toLocaleDateString("en-US", options)
    apodDate.innerHTML = `Astronomy Picture of the Day - ${date}`
    data.media_type == 'image' ? apodImage.setAttribute('src' ,data.hdurl) : 'assets/images/placeholder.webp'
    imgBtn.addEventListener('click', function() {
        window.open(`${data.url}`, "_blank");
    });
    apodTitle.innerHTML = data.title
    apodDateDetail.innerHTML = `<i class="far fa-calendar mr-2"></i>${date}`
    apodExplanation.innerHTML = data.explanation
    apodCopyright.innerHTML = '&copy; Copyright: '+data.copyright
    apodDateInfo.innerHTML = date
    apodMediaType.innerHTML = data.media_type
}


loadDateBtn.addEventListener('click',()=>{
    apiData(loadDateInput.value)
    setDate(loadDateInput.value)
})

todayDateBtn.addEventListener('click',()=>{
    if(loadDateInput.value != isoDate){
        setDate()
        apiData()
        loadDateInput.value = isoDate
    }
})

loadDateInput.addEventListener('input',()=>{
    setDate(loadDateInput.value)
})

function setDate(date = isoDate){
    let options = {year: 'numeric', month: 'short', day: 'numeric' };
    let today  = new Date(date);
    loadDateSpan.innerHTML = today.toLocaleDateString("en-US", options)
}
function loadingData(){
    apodImage.classList.add('hidden')
    apodLoading.classList.remove('hidden')
    apodDate.innerHTML = `Astronomy Picture of the Day - Loading ...`
    apodTitle.innerHTML = 'Loading ...'
    apodDateDetail.innerHTML = `<i class="far fa-calendar mr-2"></i>Loading ...`
    apodExplanation.innerHTML = 'Loading ...'
    apodCopyright.innerHTML = '&copy; Copyright: Loading ...'
    apodDateInfo.innerHTML = 'Loading ...'
    apodMediaType.innerHTML = 'Loading ...'
}