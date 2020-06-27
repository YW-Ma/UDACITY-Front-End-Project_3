/* Global Variables */
// API related variables
const APIKey = 'c9267f5315ddb6b01cc3ac0e48b77f7a';
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?zip=';
// Elements in DOM
const generateButton = document.getElementById('generate');
const zipText = document.getElementById("zip");
const feelingsText = document.getElementById('feelings');

const date = document.querySelector('#date');
const temp = document.querySelector('#temp');
const content = document.querySelector('#content');

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();

// Obtain weather information from API
// api.openweathermap.org/data/2.5/weather?zip={zip code},{country code}&appid={your api key}
const weatherInfo = async zip => await fetch(`${baseUrl+zip},us&appid=${APIKey}`);

//POST --> to server
const postData = async(url, weatherInfo) => {
    const response = await fetch(url, {
        method: 'Post',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(weatherInfo)
    });
    try {
        const newData = await response.json();
        return newData;

    } catch (error) {
        console.log('error:', error);
    }
}
//GET --> from server
function updateUI(data) {
    date.innerHTML = "Date: " + data.date;
    temp.innerHTML = "Temp: " + data.temperature;
    content.innerHTML = "Feelings: " + data.feelings;
}
const getData = async(url) => {
    const response = await fetch('getData');

    try {
        const data = await response.json();
        updateUI(data);
    } catch (error) {
        console.log('error', error);
    }
}

// Generating
generateButton.addEventListener('click', async() => {
    
    // 1. Change to Pending
    generateButton.innerHTML = 'Pending . . .';
    // 2. Obtain values from user
    const zip = zipText.value;
    const feelings = feelingsText.value;
    
    // 3. Obtain data from weatherInfo
    const response = await weatherInfo(zip);
    const res = await response.json();
    
    // 4. Parsing data from weatherInfo
    // Interesting, the temp returned is in Kelvin degree. hahaha'
    const absolute_zero = 273.15
    const temp = (res.main.temp - 273.15).toPrecision(3).toString() + '°C';
    const dataset = { date: newDate, temperature: temp, feelings: feelings };
    
    // 5. Posting data to Server
    data = await postData('/newData', dataset);
    
    // 6. Updating UI based on data in Server
    getData('getAll');

    // 7. Back to Generate
    generateButton.innerHTML = 'Generate';
});