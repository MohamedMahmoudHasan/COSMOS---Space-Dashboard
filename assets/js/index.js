
// copyright
// : 
// "Roi Levi"
// date
// : 
// "2026-01-01"
// explanation
// : 
// "Cycle 25 solar maximum made 2025 a great year for aurora borealis (or aurora australis) on planet Earth. And the high level of solar activity should extend into 2026. So, while you're celebrating the arrival of the new year, check out this spectacular auroral display that erupted in starry night skies over Kirkjufell, Iceland. The awesome auroral corona, energetic curtains of light streaming from directly overhead, was witnessed during a strong geomagnetic storm triggered by intense solar activity near the March 2025 equinox. This northland and skyscape captures the evocative display in a 21 frame panoramic mosaic."
// hdurl
// : 
// "https://apod.nasa.gov/apod/image/2601/AuroraFireworksstormRoiLevi.jpg"
// media_type
// : 
// "image"
// service_version
// : 
// "v1"
// title
// : 
// "Auroral Corona"
// url
// : 
// "https://apod.nasa.gov/apod/image/2601/AuroraFireworksstormRoiLevi1024.jpg"

const apodDate = document.querySelector('#apod-date')
const apodImage = document.querySelector('#apod-image')

apiData()

async function apiData() {
    let response = await fetch('https://api.nasa.gov/planetary/apod?api_key=48wB2ch9aFdLkxY1xUovYOLWzUSp5CJSKECuJI05')
    // let response = await fetch('https://api.nasa.gov/planetary/apod?api_key=48wB2ch9aFdLkxY1xUovYOLWzUSp5CJSKECuJI05&date=2025-12-01')
    if(response.ok){
        let data = await response.json()
        console.log(data)
        display(data)
    }
}

function display(data){
    let options = {year: 'numeric', month: 'long', day: 'numeric' };
    let today  = new Date(data.date);
    apodDate.innerHTML = `Astronomy Picture of the Day - ${today.toLocaleDateString("en-US", options)}`
    apodImage.setAttribute('src' ,data.hdurl)
    
}
