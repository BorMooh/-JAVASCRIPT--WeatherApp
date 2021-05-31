//TODO
/*
    -Podatek je lahko undefined(wind gust)
    -ikone?
    -stil
    -lahko izbiramo lokacijo na mapi? (long,lat kot API parametri)
*/

//Input error provider nastavimo na none, tako da se ne prikaže ob zagonu strani
document.getElementById('input-error').style.display = "none";

document.getElementById("location-submit").addEventListener('click', ()=>
{


    //Konstanta, ki jo lahko spreminja samo input field na index.html
    let inputLocation = document.getElementById("location-input").value;

    //Elementi iz HTML
    let dataDegrees = document.querySelector('.data-degrees');
    let dataDescription = document.querySelector('.description');
    let dataTimezone = document.querySelector('.data-table-time-timezone');
    let dataTime = document.querySelector('.data-table-time-info');
    let dataType = document.querySelector('.tip');
    let dataClouds = document.querySelector('.data-table-clouds-info');
    let dataWindspeed = document.querySelector('.data-table-wind-speed');
    let dataWindgust = document.querySelector('.data-table-wind-gust');
    let dataWindbearing = document.querySelector('.data-table-wind-bearing');
    let dataVisibility = document.querySelector('.data-table-info-visiblity');
    let dataHumidity = document.querySelector('.data-table-info-humidity');
    let dataPressure = document.querySelector('.data-table-info-pressure');
    let dataCoords = document.querySelector('.data-table-info-coords');
    


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


            //Error provider
            if(data.message == "Nothing to geocode")
            {
                document.getElementById('input-error').style.display = "block";
                return;
            }
            document.getElementById('input-error').style.display = "none";


            //Temperatura, vreme, oblaki, vidnost, ikona za prikaz
            let tempK = data.main.temp;
            let tempC = convertToCelsius(tempK);
            let tempF = convertToFahr(tempK);
            let cloudiness = data.clouds.all; //Koliko procentov je oblakov
            let visibility = data.visibility;
            let weather = data.weather[0].main;
            let humidity = data.main.humidity;
            let pressure = data.main.pressure;
            let weatherDesc = data.weather[0].description;
            let icon = data.weather[0].icon;

            //Veter
            let windDeg = data.wind.deg;
            let windSpeed = data.wind.speed;
            let windGust = data.wind.gust;



            //Geografski podatki o lokaciji
            let mesto = data.name
            let timezone = getTimeZone(data.timezone);
            let localTime = getTime(timezone);
            let drzava = data.sys.country;
            let lat = data.coord.lat;
            let lon = data.coord.lon;



            //Če timezone pred številko nima minusa mu dodamo plus(za lepši output)
            if(data.timezone > 0)
            {
                dataTimezone.textContent = "UTC +" + timezone;
            }
            //Če pa ima timezone pred številko minus ga pa samo izpišemo
            else
            {
                dataTimezone.textContent = "UTC " + timezone;
            }


            
            //Prikazanje podatkov na zaslon z .textContent od vsakega queryselectorja(glej "Elementi iz HTML")
            dataClouds.textContent = "clouds: " + cloudiness + "%";
            dataWindbearing.textContent = "bearing: " + windDeg + "°";
            dataWindspeed.textContent = "speed:" +windSpeed + " km/h";

            
            //Kdaj se pri "WInd Gust" izpiše da je 'undefined' - če je undefined napišemo samo trenutno hitrost vetra 
            if(windGust == undefined)
                dataWindgust.textContent = `gust: ${windSpeed} km/h`;
            else
                dataWindgust.textContent = "gust: " + windGust + "km/h";
            if(visibility == undefined)
                dataVisibility.textContent = "visibility unknown";
            else
                dataVisibility.textContent = visibility + "m";

            dataTime.textContent = localTime;
            dataDegrees.textContent = tempC;
            dataDescription.textContent = weatherDesc;
            dataHumidity.textContent = humidity + "%";
            dataPressure.textContent = pressure + "hPa";
            dataCoords.textContent = `lat: ${lat} lon: ${lon}`;
            document.getElementById("weather-image").src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
            

            //Nastavljanje trenutnega mesta kot placeholder v input box - Value se mora izbrisati da se placeholder vidi
            document.getElementById('location-input').placeholder = `${mesto}, ${drzava}`;
            document.getElementById('location-input').value = "";

            //SPREMEMBA IZ CELSIUS NA FAHRENHEIT
            document.getElementById("data-degrees").addEventListener("click", () =>{

                let preveriTip = document.getElementById("tip").innerHTML;
            
                //Ali je pri temperaturi zapisan C?
                if(preveriTip == "°C")
                {
                    //FAHRENHEIT
                    dataDegrees.textContent = tempF;
                    dataType.textContent = "°F";

                }
                //Če ni zapisan C je zapisan F
                else
                {
                    //CELSIUS
                    dataDegrees.textContent = tempC;
                    dataType.textContent = "°C";

                }


            });

            //


        })
});



//Konverzija iz Kelvinov v Celzije
function convertToCelsius(kelvin)
{
    Number.parseInt(kelvin, 10);
    return (kelvin - 273.15).toFixed(1);
}

//Konverzija iz Kelvinov v Fahrenheit
function convertToFahr(kelvin)
{
    Number.parseInt(kelvin, 10);
    return (((kelvin - 273.15) * 1.8) + 32).toFixed(1);
}

//Metoda, ki pridobi timezone(timezone v podatkih je v sekundah)
function getTimeZone(seconds)
{
    Number.parseInt(seconds, 10);
    return (seconds / 3600); 
}

//Metoda, ki iz podatkov pridobi čas iz timezone-a
function getTime(timezone)
{
    let today = new Date();
    let hours = today.getUTCHours();
    let minutes = today.getUTCMinutes();


    //Če je skupni seštevek timezone in trenutnega UTC časa večje ali enak 24
    hours = Number.parseInt(hours, 10) + Number.parseInt(timezone, 10);
    if(hours >= 24)
    {
        hours = hours - 24;
    }
    
    //Če je ura pod 10 se doda ničla pred številko (lepši output)
    if(hours < 10)
    {
        hours = "0" + hours;

    }
    //Če je minuta pod 10 se doda ničla pred številko (lepši output)
    if(minutes < 10)
    {
        minutes = "0" + minutes;
    }


    return `${hours}:${minutes}`;
}
