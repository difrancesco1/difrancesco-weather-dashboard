const apiKey = "ea3657aed959c50a52aab3081d7f9e83"; //Personal API for openweather

var searchArray = []; //Empty Array for data
var searchArrayTwo = []; //Empty Array for data

cityData = []; //Empty Array for data

// Search City Function
async function getCityWeather(event) { //await function
  event.preventDefault(); //cancels the event (default action does not occur initially)
  var searchInput = $("#search-input").val();  //Search input
  console.log(searchInput, "searchInput"); //shows in console our search input (with the text search input next to it to see that it is this value)
  try {
    const cityWeatherRes = await axios.get( //Gives data for the weather in each search
      `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&appid=${apiKey}&units=imperial`
    );
    console.log("citywweatherres", cityWeatherRes);
    searchArray = cityWeatherRes.data; 
    cityData.push(cityWeatherRes.data); 
    console.log("cityData",cityData )
  } catch (err) {
    console.log(err);
  }

  //Clears previous Searches input
  $("#forecast")[0].reset();
  getMoreDetails();
  saveText();
}

// Details Function
async function getMoreDetails() {
  try {
    const cityWeatherResTwo = await axios.get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${searchArray.coord.lat}&lon=${searchArray.coord.lon}&units=imperial&appid=${apiKey}`
    );
    console.log("citywweatherrestwo", cityWeatherResTwo);
    searchArrayTwo = cityWeatherResTwo.data;
    console.log(searchArrayTwo);
  } catch (err) {
    console.log(err);
  }
  displayForecast();
  getFiveDayForecast(event);
}


//Diplays Each Forecast
function displayForecast() {
  var mainForcastDIV = document.querySelector("#main-forecast");

  var cityNameEl = document.createElement("h1");
  var dateEl = new Date().toISOString().slice(0, 10);
  var tempEl = document.createElement("p");
  var humidEl = document.createElement("p");
  var windEl = document.createElement("p");
  var uvEl = document.createElement("p");

  cityNameEl.innerText = `${searchArray.name}`;
  
  tempEl.innerText = "Temperature: " + `${searchArray.main.temp}` + "°F";
  humidEl.innerText = "Humidity: " + `${searchArray.main.humidity}` + "%";
  windEl.innerText =
    "Wind Speed: " + `${searchArray.wind.speed}` + "mph";
    uvEl.innerText = "UV Index: " + `${searchArrayTwo.current.uvi}`;

  mainForcastDIV.append(
    cityNameEl,
    dateEl,
    tempEl,
    windEl,
    humidEl,
    uvEl
  );
  
}
//Function Used to save Search History

function saveText() {
  sessionStorage.setItem("search-histories", JSON.stringify(cityData));
}