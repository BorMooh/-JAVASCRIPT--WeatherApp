//https://openweathermap.org/api

window.addEventListener('load', ()=> {
    let long;
    let lat;
    let temperatureDesc = document.querySelector('.temperature-description');
    let temperatureDegree = document.querySelector('.temperature-degree');
    let city = document.querySelector('.location-city');

    "api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}"

    if(navigator.geolocation)
    {
        //Pridobivanje lokacije uporabnika - latitude in logitude
        navigator.geolocation.getCurrentPosition(position => {
            long = position.coords.longitude;
            lat = position.coords.latitude;
            

            const api = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=16f364f0a3b530faec39488f8a34aab3`;

            //Pridobivanje podatkov iz API-ja
            //Te podatke shrani v 'response', ki je pretvori v JSON
            fetch(api)
                .then(response =>{
                    return response.json();
            })
                .then(data =>{
                    console.log(data);

                    //Spremenljivke oziroma vrednosti
                    const {temp, humidity} = data.main;
                    let temperaturaC = convertToCelsius(data.main.temp);
                    let temperaturaF = convertToFahr(data.main.temp);
                    let opis = data.weather[0].description;
                    let pictureID = data.weather[0].icon;
                    
                    let mesto = data.name;
                    let timezone = data.timezone;

                    //Nastavljanje DOM elementov
                    temperatureDegree.textContent = temperaturaC.toFixed(1);
                    temperatureDesc.textContent = opis;
                    city.textContent = mesto;

                    //Slika
                    let link = `http://openweathermap.org/img/wn/${pictureID}@2x.png`;
                    document.getElementById("slika").src = link;
                });
            });
    }
    else
    {
        //error napiše
    }
});


function convertToCelsius(kelvin)
{
    Number.parseInt(kelvin, 10);
    return kelvin - 273.15;
}

function convertToFahr(kelvin)
{
    Number.parseInt(kelvin, 10);
    return ((kelvin - 273.15) * 1.8) + 32;
}