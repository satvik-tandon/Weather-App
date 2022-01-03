//select element
const icon = document.querySelector(".weather-icon");
const temp = document.querySelector(".temperature-value p");
const des = document.querySelector(".temperature-description p");
const loc = document.querySelector(".location p");
const noti = document.querySelector(".notification");

//app data
const weather = {};

weather.temperature = {
        unit: "celsius"
    }
    //constants
const KELVIN = 273;
const key = "91bba70ee441aecd5ea4811206e87007";

//checking if browser support geolocation
if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError)
} else {
    noti.style.display = "block";
    noti.innerHTML = "<p>Your browser doesn't support Geolocation</p>";
}

//setting up user position
function setPosition(position) {
    let lat = position.coords.latitude;
    let long = position.coords.longitude;

    getWeather(lat, long);
}

//showing error if there is issue with geolocation services
function showError(error) {
    noti.style.display = "block";
    noti.innerHTML = `<p> ${error.message} </p>`;
}

//get weather from api
function getWeather(latitude, longitude) {
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`

    fetch(api)
        .then(function(response) {
            let data = response.json();
            return data;
        })
        .then(function(data) {
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then(function() {
            displayWeather();
        });
}

function displayWeather() {
    icon.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    temp.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    des.innerHTML = weather.description;
    loc.innerHTML = `${weather.city}, ${weather.country}`;
}

//celsius to fahrenheit conversion
function celsiusToFahrenheit(temperature) {
    return (temperature * 9 / 5) + 32;
}

// when user click on temp
temp.addEventListener("click", function() {
    if (weather.temperature.value === undefined) return;

    if (weather.temperature.unit == "celsius") {
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);

        temp.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    } else {
        temp.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius"
    }
});