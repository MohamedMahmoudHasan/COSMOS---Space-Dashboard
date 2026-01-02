
const sidebarToggle = document.querySelector('#sidebar-toggle')
const sidebar = document.querySelector('#sidebar')


const navLinks = document.querySelectorAll('.nav-link')
const appSection = document.querySelectorAll('.app-section')
const featuredLaunchData = document.querySelector('#featured-launch-data')
const launchesGrid = document.querySelector('#launches-grid')


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


document.addEventListener('click',(e)=>{
    if(sidebar.contains(e.target)){
        sidebar.classList.remove('sidebar-open')
    }else if(sidebarToggle.contains(e.target)){
        sidebar.classList.add('sidebar-open')
    }else{
        sidebar.classList.remove('sidebar-open')
    }
})

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
displayLaunches()


async function apiData(dateValue = " ") {
    loadingData()
    setDate()
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



async function displayLaunches(){
    response = await fetch('https://lldev.thespacedevs.com/2.3.0/launches/upcoming/?format=json&limit=10')
    if(response.ok){
        let data = await response.json()
        let featData = data.results[0]
        displayFeaturedLaunch(featData)
        displayLaunchesGrid(data.results)
    }
}


function displayFeaturedLaunch(featData){
    featuredLaunchData.innerHTML = `
        <div class="flex flex-col justify-between">
                <div>
                <div class="flex items-center gap-3 mb-4">
                    <span
                    class="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold flex items-center gap-2"
                    >
                    <i class="fas fa-star"></i>
                    Featured Launch
                    </span>
                    <span
                    class="px-4 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold"
                    >
                    Go
                    </span>
                </div>
                <h3 class="text-3xl font-bold mb-3 leading-tight">
                    ${featData.name}
                </h3>
                <div
                    class="flex flex-col xl:flex-row xl:items-center gap-4 mb-6 text-slate-400"
                >
                    <div class="flex items-center gap-2">
                    <i class="fas fa-building"></i>
                    <span>${featData.launch_service_provider.name}</span>
                    </div>
                    <div class="flex items-center gap-2">
                    <i class="fas fa-rocket"></i>
                    <span>${featData.rocket.configuration.name}</span>
                    </div>
                </div>
                <div
                    class="inline-flex items-center gap-3 px-6 py-3 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-xl mb-6"
                >
                    <i class="fas fa-clock text-2xl text-blue-400"></i>
                    <div>
                    <p class="text-2xl font-bold text-blue-400">${dateDiff(featData.window_start)}</p>
                    <p class="text-xs text-slate-400">Days Until Launch</p>
                    </div>
                </div>
                <div class="grid xl:grid-cols-2 gap-4 mb-6">
                    <div class="bg-slate-900/50 rounded-xl p-4">
                    <p
                        class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                    >
                        <i class="fas fa-calendar"></i>
                        Launch Date
                    </p>
                    <p class="font-semibold">${setFeatDate(featData.window_start)}</p>
                    </div>
                    <div class="bg-slate-900/50 rounded-xl p-4">
                    <p
                        class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                    >
                        <i class="fas fa-clock"></i>
                        Launch Time
                    </p>
                    <p class="font-semibold">${setFeatTime(featData.window_start)}</p>
                    </div>
                    <div class="bg-slate-900/50 rounded-xl p-4">
                    <p
                        class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                    >
                        <i class="fas fa-map-marker-alt"></i>
                        Location
                    </p>
                    <p class="font-semibold text-sm">${featData.pad.location.name}</p>
                    </div>
                    <div class="bg-slate-900/50 rounded-xl p-4">
                    <p
                        class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                    >
                        <i class="fas fa-globe"></i>
                        Country
                    </p>
                    <p class="font-semibold">${featData.pad.country.name}</p>
                    </div>
                </div>
                <p class="text-slate-300 leading-relaxed mb-6">
                    ${featData.mission.description}
                </p>
                </div>
                <div class="flex flex-col md:flex-row gap-3">
                <button
                    class="flex-1 self-start md:self-center px-6 py-3 bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                    <i class="fas fa-info-circle"></i>
                    View Full Details
                </button>
                <div class="icons self-end md:self-center">
                    <button
                    class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors"
                    >
                    <i class="far fa-heart"></i>
                    </button>
                    <button
                    class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors"
                    >
                    <i class="fas fa-bell"></i>
                    </button>
                </div>
                </div>
            </div>
            <div class="relative">
                <div
                class="relative h-full min-h-[400px] rounded-2xl overflow-hidden bg-slate-900/50"
                >
                <!-- Placeholder image/icon since we can't load external images reliably without correct URLs -->
                    <img src="${featData.image.image_url}" alt="${featData.name}" class="w-full h-full object-cover" onerror="this.onerror=null; this.src='/images/launch-placeholder.png';">
                <!-- <div
                    class="flex items-center justify-center h-full min-h-[400px] bg-slate-800"
                >
                    <i class="fas fa-rocket text-9xl text-slate-700/50"></i>
                </div> -->
                <div
                    class="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent"
                ></div>
                </div>
            </div>
    `
}

function displayLaunchesGrid(data){
    let dataGrid = ''
    for (let i = 1; i < 10; i++) {
        dataGrid += `
        <div
              class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer"
            >
              <div
                class="relative h-48 bg-slate-900/50 flex items-center justify-center"
              >
                <img src="${data[i].image.image_url}" alt="${data[i].name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onerror="this.onerror=null; this.src='assets/images/launch-placeholder.png';">
                <div class="absolute top-3 right-3">
                  <span
                    class="px-3 py-1 bg-green-500/90 text-white backdrop-blur-sm rounded-full text-xs font-semibold"
                  >
                    Go
                  </span>
                </div>
              </div>
              <div class="p-5">
                <div class="mb-3">
                  <h4
                    class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors"
                  >
                    ${data[i].name}
                  </h4>
                  <p class="text-sm text-slate-400 flex items-center gap-2">
                    <i class="fas fa-building text-xs"></i>
                    ${data[i].launch_service_provider.name}
                  </p>
                </div>
                <div class="space-y-2 mb-4">
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-calendar text-slate-500 w-4"></i>
                    <span class="text-slate-300">${setShortDate(data[i].window_start)}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-clock text-slate-500 w-4"></i>
                    <span class="text-slate-300">${setFeatTime(data[i].window_start)}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-rocket text-slate-500 w-4"></i>
                    <span class="text-slate-300">${data[i].rocket.configuration.name}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-map-marker-alt text-slate-500 w-4"></i>
                    <span class="text-slate-300 line-clamp-1">${data[i].pad.location.name}</span>
                  </div>
                </div>
                <div
                  class="flex items-center gap-2 pt-4 border-t border-slate-700"
                >
                  <button
                    class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold"
                  >
                    Details
                  </button>
                  <button
                    class="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    <i class="far fa-heart"></i>
                  </button>
                </div>
              </div>
            </div>
    `
        
    }
    
    launchesGrid.innerHTML= dataGrid
}


function setDate(date = isoDate){
    let options = {year: 'numeric', month: 'short', day: 'numeric' };
    let today  = new Date(date);
    loadDateSpan.innerHTML = today.toLocaleDateString("en-US", options)
}
function setShortDate(date){
    let options = {year: 'numeric', month: 'short', day: 'numeric' };
    let shortDate  = new Date(date);
    return shortDate.toLocaleDateString("en-US", options)
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

function dateDiff(date){
    const targetDate = new Date(date);
    const now = new Date();
    const diffInMs = targetDate - now;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    return Math.ceil(diffInDays)
}
function setFeatDate(date){
    let options = {weekday: 'long' , year: 'numeric', month: 'long', day: 'numeric' };
    let modifiedDate  = new Date(date);
    return modifiedDate.toLocaleDateString("en-US", options)
}
function setFeatTime(date){
    let options = {hour: '2-digit', minute: '2-digit', timeZone: 'UTC' , timeZoneName: 'short' };
    let modifiedTime  = new Date(date);
    return modifiedTime.toLocaleString("en-US", options)
}