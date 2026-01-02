
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


const planetsCard = document.querySelectorAll('.planet-card')
const planetMain = document.querySelector('#planet-main')
let currentPlanetIndex = 0



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
displayPlanet()


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

for (let i = 0; i < planetsCard.length; i++) {
    planetsCard[i].addEventListener('click' , ()=>{
        if(currentPlanetIndex != i){
            currentPlanetIndex = i;
            displayPlanet()
        }
    })  
}

async function displayPlanet(){
    let response = await fetch('https://solar-system-opendata-proxy.vercel.app/api/planets')
    if(response.ok){
        let data = await response.json();
        displayCurrentPlanet(data.bodies[currentPlanetIndex])
    }
}
function displayCurrentPlanet(data){
    planetMain.innerHTML=`
        <div
            class="xl:col-span-2 bg-slate-800/50 border border-slate-700 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8">
            <div class="flex flex-col xl:flex-row xl:items-start space-y-4 xl:space-y-0">
              <div class="relative h-48 w-48 md:h-64 md:w-64 shrink-0 mx-auto xl:mr-6">
                <img id="planet-detail-image" class="w-full h-full object-contain" src="${data.image}"
                  alt="${data.description}" />
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between mb-3 md:mb-4">
                  <h3 id="planet-detail-name" class="text-2xl md:text-3xl font-space font-bold">
                    ${data.englishName}
                  </h3>
                  <button class="w-10 h-10 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                    <i class="far fa-heart"></i>
                  </button>
                </div>
                <p id="planet-detail-description"
                  class="text-slate-300 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
                  ${data.description}
                </p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-2 md:gap-4 mt-4">
              <div class="bg-slate-900/50 rounded-lg p-3 md:p-4">
                <p class="text-xs text-slate-400 mb-1 flex items-center gap-1">
                  <i class="fas fa-ruler text-xs"></i>
                  <span class="text-xs">Semimajor Axis</span>
                </p>
                <p id="planet-distance" class="text-sm md:text-lg font-semibold">
                  ${((data.semimajorAxis)/1000000).toFixed(1)}M km
                </p>
              </div>
              <div class="bg-slate-900/50 rounded-lg p-4">
                <p class="text-xs text-slate-400 mb-1 flex items-center gap-1">
                  <i class="fas fa-circle"></i>
                  Mean Radius
                </p>
                <p id="planet-radius" class="text-lg font-semibold">
                  ${Math.ceil(data.meanRadius)} km
                </p>
              </div>
              <div class="bg-slate-900/50 rounded-lg p-4">
                <p class="text-xs text-slate-400 mb-1 flex items-center gap-1">
                  <i class="fas fa-weight"></i>
                  Mass
                </p>
                <p id="planet-mass" class="text-lg font-semibold">
                  ${data.mass.massValue} x 10^${data.mass.massExponent} kg
                </p>
              </div>
              <div class="bg-slate-900/50 rounded-lg p-4">
                <p class="text-xs text-slate-400 mb-1 flex items-center gap-1">
                  <i class="fas fa-compress"></i>
                  Density
                </p>
                <p id="planet-density" class="text-lg font-semibold">
                  ${data.density.toFixed(2)} g/cm³
                </p>
              </div>
              <div class="bg-slate-900/50 rounded-lg p-4">
                <p class="text-xs text-slate-400 mb-1 flex items-center gap-1">
                  <i class="fas fa-sync-alt"></i>
                  Orbital Period
                </p>
                <p id="planet-orbital-period" class="text-lg font-semibold">
                  ${(data.sideralOrbit).toFixed(2)} days
                </p>
              </div>
              <div class="bg-slate-900/50 rounded-lg p-4">
                <p class="text-xs text-slate-400 mb-1 flex items-center gap-1">
                  <i class="fas fa-redo"></i>
                  Rotation Period
                </p>
                <p id="planet-rotation" class="text-lg font-semibold">
                  ${data.sideralRotation.toFixed(2)} hours
                </p>
              </div>
              <div class="bg-slate-900/50 rounded-lg p-4">
                <p class="text-xs text-slate-400 mb-1 flex items-center gap-1">
                  <i class="fas fa-moon"></i>
                  Moons
                </p>
                <p id="planet-moons" class="text-lg font-semibold">${data.moons != null ?data.moons.length:'0'}</p>
              </div>
              <div class="bg-slate-900/50 rounded-lg p-4">
                <p class="text-xs text-slate-400 mb-1 flex items-center gap-1">
                  <i class="fas fa-arrows-alt-v"></i>
                  Gravity
                </p>
                <p id="planet-gravity" class="text-lg font-semibold">
                  ${data.gravity.toFixed(2)} m/s²
                </p>
              </div>
            </div>
          </div>
          <div class="space-y-6">
            <div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <h4 class="font-semibold mb-4 flex items-center">
                <i class="fas fa-user-astronaut text-purple-400 mr-2"></i>
                Discovery Info
              </h4>
              <div class="space-y-3 text-sm">
                <div class="flex justify-between items-center py-2 border-b border-slate-700">
                  <span class="text-slate-400">Discovered By</span>
                  <span id="planet-discoverer" class="font-semibold text-right">${data.discoveredBy != '' ?data.discoveredBy : 'Known since antiquity'}</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-slate-700">
                  <span class="text-slate-400">Discovery Date</span>
                  <span id="planet-discovery-date" class="font-semibold">${data.discoveryDate != '' ?data.discoveryDate : 'Ancient times'}</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-slate-700">
                  <span class="text-slate-400">Body Type</span>
                  <span id="planet-body-type" class="font-semibold">Planet</span>
                </div>
                <div class="flex justify-between items-center py-2">
                  <span class="text-slate-400">Volume</span>
                  <span id="planet-volume" class="font-semibold">${data.vol.volValue} x 10^${data.vol.volExponent} km³</span>
                </div>
              </div>
            </div>
            <div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <h4 class="font-semibold mb-4 flex items-center">
                <i class="fas fa-lightbulb text-yellow-400 mr-2"></i>
                Quick Facts
              </h4>
              <ul id="planet-facts" class="space-y-3 text-sm">
                <li class="flex items-start">
                  <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
                  <span class="text-slate-300">Mass: ${data.mass.massValue} x 10^${data.mass.massExponent} kg</span>
                </li>
                <li class="flex items-start">
                  <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
                  <span class="text-slate-300">Surface gravity: ${data.gravity.toFixed(2)} m/s²</span>
                </li>
                <li class="flex items-start">
                  <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
                  <span class="text-slate-300">Density: ${data.density.toFixed(2)} g/cm³</span>
                </li>
                <li class="flex items-start">
                  <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
                  <span class="text-slate-300">Axial tilt: ${data.axialTilt.toFixed(2)}°</span>
                </li>
              </ul>
            </div>
            <div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <h4 class="font-semibold mb-4 flex items-center">
                <i class="fas fa-satellite text-blue-400 mr-2"></i>
                Orbital Characteristics
              </h4>
              <div class="space-y-3 text-sm">
                <div class="flex justify-between items-center py-2 border-b border-slate-700">
                  <span class="text-slate-400">Perihelion</span>
                  <span id="planet-perihelion" class="font-semibold">${((data.perihelion)/1000000).toFixed(1)}M km</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-slate-700">
                  <span class="text-slate-400">Aphelion</span>
                  <span id="planet-aphelion" class="font-semibold">${((data.aphelion)/1000000).toFixed(1)}M km</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-slate-700">
                  <span class="text-slate-400">Eccentricity</span>
                  <span id="planet-eccentricity" class="font-semibold">${data.eccentricity.toFixed(5)}</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-slate-700">
                  <span class="text-slate-400">Inclination</span>
                  <span id="planet-inclination" class="font-semibold">${data.inclination.toFixed(2)}°</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-slate-700">
                  <span class="text-slate-400">Axial Tilt</span>
                  <span id="planet-axial-tilt" class="font-semibold">${data.axialTilt.toFixed(2)}°</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-slate-700">
                  <span class="text-slate-400">Avg Temperature</span>
                  <span id="planet-temp" class="font-semibold">${data.avgTemp}°C</span>
                </div>
                <div class="flex justify-between items-center py-2">
                  <span class="text-slate-400">Escape Velocity</span>
                  <span id="planet-escape" class="font-semibold">${((data.escape)/1000).toFixed(2)} km/s</span>
                </div>
              </div>
            </div>
            <button class="w-full py-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors font-semibold">
              <i class="fas fa-book mr-2"></i>Learn More
            </button>
          </div>
    
    `
}