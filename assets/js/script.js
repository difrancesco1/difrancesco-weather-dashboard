const apiKey = "ea3657aed959c50a52aab3081d7f9e83"; //Personal API ofr openweather
var searchButton = document.querySelector("#search-btn"); //Search Button

var searchArray = []; //array for search results weather
var searchArrayTwo = []; //array for 

cityArr = [];

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
    searchArray = cityWeatherRes.data; //Stores that data in our array 
    cityArr.push(cityWeatherRes.data); 
  } catch (err) {
    console.log(err);
  }

  //  To Clear Search Input
  $("#forecast-form")[0].reset();
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
}


// UV Index Color
var uvColor = function() {
  var UVUrl = "https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={4d664091c5d3ad248b463f239a1cc951}"
  fetch(UVUrl).then(function(response) {
    var uvIndex = parseInt(response.value);
    var uvBox = document.getElementById(".uv-area");

    uvBox.textContent("UV Index: " + response.value);

    if (uvIndex > 0 && uvIndex <= 2.99) {
      uvBox.addClass("low");
    }
    else if (uvIndex >= 3 && uvIndex <= 5.99) {
      uvBox.addClass("moderate");
    }
    else {
      uvBox.addClass("high");
    }
  })
};

uvColor();

// Display Forecast Function 
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


// Save Text Function

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

