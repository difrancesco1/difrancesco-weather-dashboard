const apiKey = "ea3657aed959c50a52aab3081d7f9e83"; //Personal API ofr openweather
var searchButton = document.querySelector("#search-btn");

var searchArray = []; //Empty Array for data
var searchArrayTwo = []; //Empty Array for data

cityArr = []; //Empty Array for data

// Search City Function
async function getCityDetails(event) { //await function
  event.preventDefault(); //cancels the event (default action does not occur initially)
  var searchInput = $("#search-input").val();  //Search input
  console.log(searchInput, "searchInput"); //shows in console our search input (with the text search input next to it to see that it is this value)
  try {
    const cityWeatherRes = await axios.get( //Gives data for the weather in each search
      `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&appid=${apiKey}&units=imperial`
    );
    console.log("citywweatherres", cityWeatherRes);
    searchArray = cityWeatherRes.data; 
    cityArr.push(cityWeatherRes.data); 
    console.log("cityArr",cityArr )
  } catch (err) {
    console.log(err);
  }

  //Clears previous Searches input
  $("#forecast-form")[0].reset();
  getMoreDetails();
  saveText();
}
//clear old searches from localstorage
$("#clear-storage").on("click", (event) => {
  localStorage.clear();
  renderCities();
});

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
}

//Diplays Each Forecast
function displayForecast() {
  var mainForcastDIV = document.querySelector("#main-forecast");

  var weatherIconElement = document.createElement("img");
  var cityNameElement = document.createElement("h1");
  var dateElement = new Date().toISOString().slice(0, 10);
  document.createElement("h2");
  var tempElement = document.createElement("p");
  var humidElement = document.createElement("p");
  var windElement = document.createElement("p");
  var uvElement = document.createElement("p");

  cityNameElement.innerText = `${searchArray.name}`;
  tempElement.innerText = "Temperature: " + `${searchArray.main.temp}` + "°F";
  humidElement.innerText = "Humidity: " + `${searchArray.main.humidity}` + "%";
  windElement.innerText =
    "Wind Speed: " + `${searchArray.wind.speed}` + " miles/hour";
  uvElement.innerText = "UV Index: " + `${searchArrayTwo.current.uvi}`;

  mainForcastDIV.append(
    cityNameElement,
    dateElement,
    tempElement,
    humidElement,
    windElement,
    uvElement
  );
}


//Function Used to save Search History

function saveText() {
  sessionStorage.setItem("search-histories", JSON.stringify(cityArr));
}

function loadHistory() {
  cityArr.forEach(function (index) { });
  var savedTexts = sessionStorage.getItem('texts');
if(!savedTexts) {
        return false;
    }

    savedTexts = JSON.parse(savedTexts);
    console.log(savedTexts, "this is savedTexts");
    textArr = savedTexts;
    loadStorageTexts();
}

