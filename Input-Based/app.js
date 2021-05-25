window.addEventListener('load', ()=>
{
    //Konstanta, ki jo lahko spreminja samo input field na index.html
    const inputLocation = document.getElementById("location-input").value;

    //Elementi iz HTML
    let dataDegrees = document.querySelector('.data-degrees');
    let dataDescription = document.querySelector('.description');
    let dataTimezone = document.querySelector('.timezone');

    //API
    const api = `http://api.openweathermap.org/data/2.5/weather?q=${inputLocation}&appid=16f364f0a3b530faec39488f8a34aab3`;

    //Pridobivanje podatkov iz API-ja
    fetch(api)
        //Te podatke potem pretvorimo v JSON obliko da jih lahko uporabimo
        .then(response => {
            return response.json();
        })
        //Vse podatke imamo sedaj v JSON obliki z imenom 'data'
        .then(data => {
            console.log(data);

            
            //Temperatura, vreme, oblaki, vidnost, ikona za prikaz
            let tempK = data.main.temp;
            let tempC = convertToCelsius(tempK);
            let tempF = convertToFahr(tempK);
            let cloudiness = data.clouds.all; //Koliko procentov je oblakov
            let visibility = data.visibility;
            let weather = data.weather[0].main;
            let weatherDesc = data.weather[0].description;
            let icon = data.weather[0].icon;

            //Veter
            let windDeg = data.wind.deg;
            let windSpeed = data.wind.speed;


            //Geografski podatki o lokaciji
            let mesto = data.name
            let timezone = getTimeZone(data.timezone);
            let localTime = getTime(timezone);
            let lat = data.coord.lat;
            let lon = data.coord.lon;


            console.log(timezone);
            console.log(localTime);
            //Time - test
            dataTimezone.textContent = `UTC ${timezone}`;


            //

            dataDegrees.textContent = tempC;
            dataDescription.textContent = weatherDesc;
            document.getElementById("image").src = `http://openweathermap.org/img/wn/${icon}@2x.png`;

        })
});




function convertToCelsius(kelvin)
{
    Number.parseInt(kelvin, 10);
    return (kelvin - 273.15).toFixed(1);
}

function convertToFahr(kelvin)
{
    Number.parseInt(kelvin, 10);
    return (((kelvin - 273.15) * 1.8) + 32).toFixed(1);
}

function getTimeZone(seconds)
{
    Number.parseInt(seconds, 10);
    return (seconds / 3600); 
}

function getTime(timezone)
{
    console.log(timezone);
    let today = new Date();
    let hours = today.getUTCHours();
    let minutes = today.getUTCMinutes();


    hours = Number.parseInt(hours, 10) + Number.parseInt(timezone, 10);

    return `${hours}:${minutes}`;
}
