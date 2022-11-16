let widgets = document.querySelectorAll(".widget");
const widgetHTML = widgets[0].outerHTML;
const apiKey = "0fdb2eae52b8a945f7efd8f7dbd20355";
const container = document.querySelector(".widgets");
const addButton = document.querySelector(".add-btn");
const currentDate = new Date();
let latitudeInputs, longitudeInputs, submitButtons, currentWeatherFields, currentTimeFields,
    currentWindFields, currentWeatherTypes ,currentPressureFields, currentHumidityFields, currentTempFeelsFields
const imgPaths = {
    'Clear': "clear.jpg",
    'Rain': "cloudy.png",
    'Haze': "haze.png",
    'Clouds': "rain.jpg",
    'Snow': "snow.png"
}

addButton.addEventListener("click", () => {
    container.insertAdjacentHTML("beforeend", widgetHTML);
    getDOMNodes();
    new Widget();
})

function getDOMNodes(){
    widgets = document.querySelectorAll(".widget");
    submitButtons = document.querySelectorAll(".submit-btn");
    latitudeInputs = document.querySelectorAll(".latitude-input");
    longitudeInputs = document.querySelectorAll(".longitude-input");
    currentWeatherFields = document.querySelectorAll(".weather-info__temperature");
    currentTimeFields = document.querySelectorAll(".weather-info__time");
    currentWeatherTypes = document.querySelectorAll(".weather-info__img");
    currentWindFields = document.querySelectorAll(".wind-force")
    currentPressureFields = document.querySelectorAll(".pressure")
    currentHumidityFields = document.querySelectorAll(".humidity")
    currentTempFeelsFields = document.querySelectorAll(".temp-feels")
}

class Widget{
    constructor() {
        this.id = latitudeInputs.length
        this.latitudeInput = latitudeInputs[latitudeInputs.length - 1];
        this.longitudeInput = longitudeInputs[longitudeInputs.length - 1];
        this.currentTime = currentTimeFields[currentTimeFields.length - 1];
        this.currentWeather = currentWeatherFields[currentWeatherFields.length - 1];
        this.currentWeatherType = currentWeatherTypes[currentWeatherTypes.length - 1];
        this.currentWind = currentWindFields[currentWindFields.length - 1];
        this.currentPressure = currentPressureFields[currentPressureFields.length - 1];
        this.currentHumidity = currentHumidityFields[currentHumidityFields.length - 1];
        this.currentTempFeels = currentTempFeelsFields[currentTempFeelsFields.length - 1];
        this.submitButton = submitButtons[submitButtons.length - 1]
        this.submitButton.addEventListener("click", (event) => {
            event.preventDefault();
            if(this.isInvalidInput()){
                throw new Error('Некорректные значения широты и долготы');
            }
            else{
                this.getWeather();
                this.createMap();
            }

        })

    }

    getWeather(){
        const latitude = this.latitudeInput.value;
        const longitude = this.longitudeInput.value;
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`)
            .then((res) => res.json())
            .then((v) => {
                console.log(v);
                this.currentWeather.textContent = Math.round(v["main"]["temp"] - 272.1).toString() + " °C";
                this.currentWeatherType.src = this.getWeatherImg(v["weather"][0]["main"]);
                this.currentTime.textContent = `${currentDate.getHours()}:${currentDate.getMinutes()}`;
                this.currentWind.textContent = `${v["wind"]["speed"]} м/с`;
                this.currentPressure.textContent = `${Math.round(v["main"]["pressure"] * 100 / 133.3)} мм.рт.ст.`;
                this.currentHumidity.textContent = `${v["main"]["humidity"]}%`;
                this.currentTempFeels.textContent = `${Math.round(v["main"]["feels_like"] - 272.1)} °C`;
            })
            .catch((err) => console.log(err));
    }

    createMap(){
        const map = widgets[this.id - 1].querySelector(`#map-${this.id}`);
        if(map){
            map.remove();
        }
        widgets[this.id - 1].insertAdjacentHTML("beforeend",
            `<div id="map-${this.id}" style="width: 500px; height: 750px"></div>`);
        ymaps.ready(() => {
            const latitude = +this.latitudeInput.value;
            const longitude = +this.longitudeInput.value;
            let newMap = new ymaps.Map(`map-${this.id}`, {
                center: [latitude, longitude],
                zoom: 15
            });
            const placemark = new ymaps.Placemark([latitude, longitude], {}, {});
            newMap.geoObjects.add(placemark);
        });
    }

    isInvalidInput(){
        return isNaN(Number(this.latitudeInput.value)) ||
            isNaN(Number(this.longitudeInput.value)) ||
            Number(this.latitudeInput.value) > 90 || Number(this.latitudeInput.value) < -90 ||
            Number(this.longitudeInput.value) > 180 || Number(this.longitudeInput.value) < -180;
    }

    getWeatherImg(weatherType){
        let path = this.currentWeatherType.src;
        const lastSlashIndex = path.lastIndexOf('/');
        path = `${path.slice(0, lastSlashIndex + 1)}src/img/${imgPaths[weatherType]}`
        console.log(path);
        return path;
    }
}

getDOMNodes();
let widget = new Widget();