const submitButton = document.querySelector(".submit-btn");

async function getData(){
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=56.8377&lon=60.6599&appid=0fdb2eae52b8a945f7efd8f7dbd20355`;
    return await fetch(url);
}

submitButton.onclick = (event) => {
    event.preventDefault();
    getData()
        .then((res) => res.json())
        .then((v) => console.log(v))
        .catch((err) => console.log(err))
};