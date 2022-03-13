const apiKey = "ea3657aed959c50a52aab3081d7f9e83"; //Personal API for openweather
var searchButton = document.querySelector("#search-btn");

var searchArray = []; //Empty Array for data
var searchArrayTwo = []; //Empty Array for data

cityArr = []; //Empty Array for data

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
  document.createElement("h2");
  var tempEl = document.createElement("p");
  var humidEl = document.createElement("p");
  var windEl = document.createElement("p");
  var uvEl = document.createElement("p");

  cityNameEl.innerText = `${searchArray.name}`;
  tempEl.innerText = "Temperature: " + `${searchArray.main.temp}` + "°F";
  humidEl.innerText = "Humidity: " + `${searchArray.main.humidity}` + "%";
  windEl.innerText =
    "Wind Speed: " + `${searchArray.wind.speed}` + " miles/hour";
    uvEl.innerText = "UV Index: " + `${searchArrayTwo.current.uvi}`;

  mainForcastDIV.append(
    cityNameEl,
    dateEl,
    tempEl,
    humidEl,
    windEl,
    uvEl
  );
  
}

var getFiveDayForecast = (event) => {
  var searchInput = $("#search-input").val();
  console.log("city",searchInput);
  // Set up URL for API search using forecast search
  let queryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${searchArray.coord.lat}&lon=${searchArray.coord.lon}&units=imperial&appid=${apiKey}`
  // Fetch from API
  fetch(queryURL)
      .then((response) => {
          return response.json();
      })
      .then((response) => {
      let fiveDayForecastHTML = `
      <h2>Five-Day Forecast:</h2>
      <div id="fiveDayForecastUl" class="d-inline-flex flex-wrap ">`;
      
      for (let i = 0; i < response.list.length; i++) {
          let dayData = response.list[i];
          let dayTimeUTC = dayData.dt;
          let timeZoneOffset = response.searchInput.timezone;
          let timeZoneOffsetHours = timeZoneOffset / 60 / 60;
          let thisMoment = moment.unix(dayTimeUTC).utc().utcOffset(timeZoneOffsetHours);
          let iconURL = "https://openweathermap.org/img/w/" + dayData.weather[0].icon + ".png";
          // Only displaying mid-day forecasts
          if (thisMoment.format("HH:mm:ss") === "11:00:00" || thisMoment.format("HH:mm:ss") === "12:00:00" || thisMoment.format("HH:mm:ss") === "13:00:00") {
              fiveDayForecastHTML += `
              <div class="weather-card card m-2 p0">
                  <ul class="list-unstyled p-3">
                      <li>${thisMoment.format("MM/DD/YY")}</li>
                      <li class="weather-icon"><img src="${iconURL}"></li>
                      <li>Temp: ${dayData.main.temp}&#8457;</li>
                      <br>
                      <li>Humidity: ${dayData.main.humidity}%</li>
                  </ul>
              </div>`;
          }
      }
      // Build the HTML template
      fiveDayForecastHTML += `</div>`;
      // Append the five-day forecast to the DOM
      $('#five-day-forecast').html(fiveDayForecastHTML);
  })
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

