// elements
const previousLocationsEl = $("#previousLocations");
const searchBarCity = $("#searchBarCity");
const searchCityButtonEl = $("#searchCityButton");
const weatherSectionEl = $("#WeatherSection");
const futureWeatherSectionEl = $("#futureWeatherSection");
const locationList = $("#previousLocations");
const currentTime = moment().format("h:mm a");
console.log(currentTime);

// This renders a li tag with the input name in the search bar.
const renderListItem = (location) => {
  console.log("rendering list");
  const listEl = `<li id="listEl" class="list-group-item border-top-0 border-end-0 border-start-0 ">${location}</li>`;
  previousLocationsEl.append(listEl);
};

function setColor(UVIndex) {
  const colorsArray = ["success", "warning", "orange", "danger", "violet"];
  let color = "";
  if (UVIndex <= 2) {
    color = colorsArray[0];
  } else if (UVIndex <= 5) {
    color = colorsArray[1];
  } else if (UVIndex <= 7) {
    color = colorsArray[2];
  } else if (UVIndex <= 10) {
    color = colorsArray[3];
  } else {
    color = colorsArray[4];
  }

  return color;
}

const renderCurrentWeather = (
  location,
  temperature,
  wind,
  humidity,
  UVIndex,
  icon
) => {
  let color = setColor(UVIndex);
  console.log("rendering current weather");
  const currentWeatherSection = `<div id="currentWeatherSection"class="border border-dark p-4 mb-4 rounded-2">
          <div class="container d-flex justify-content-between align-items-center p-0">
            <h3 class="mb-4">${location} ${currentTime}</h3>
            <img
              src="https://openweathermap.org/img/w/${icon}.png"
              alt=""
              class="col-1"
            />
          </div>
          <div class="column g-0">
            <div class="col-sm-12 col-md-8 p-2 border d-flex justify-content-between">
            <div class="col-sm-6">Temperature</div>
            <div class="col-sm-6">${temperature} &deg;</div>
            </div>
            <div class="col-sm-12 col-md-8 p-2 border d-flex justify-content-between">
            <div class="col-sm-6">Wind</div>
            <div class="col-sm-6">${wind} &deg;</div>
            </div>
            <div class="col-sm-12 col-md-8 p-2 border d-flex justify-content-between">
            <div class="col-sm-6">Humidity</div>
            <div class="col-sm-6">${humidity} &deg;</div>
            </div>
            <div class="col-sm-12 col-md-8 p-2 border d-flex justify-content-between">
            <div class="col-sm-6">UV index</div>
            <div class="col-sm-6 text-${color}">${UVIndex} &deg;</div>
            </div>
          </div>
        </div>`;
  weatherSectionEl.prepend(currentWeatherSection);
};

const renderFutureWeather = async (
  location,
  temperature,
  wind,
  humidity,
  UVIndex,
  icon
) => {
  console.log("rendering Future weather");

  const colorsArray = ["success", "warning", "orange", "danger", "violet"];
  let color = setColor(UVIndex);

  const futureWeatherSinglecard = `<div class="border border-dark m-2 rounded-2 custom-width-card p-4">
            <div
              class="container d-flex justify-content-between align-items-center p-0"
            >
              <h3 class="mb-4">${location}</h3>
              <img
                src="https://openweathermap.org/img/w/${icon}.png"
                alt=""
                class="col-1"
              />
            </div>
            <div class="row g-0">
            <div class="col-sm-12 p-2 border d-flex justify-content-between">
            <div class="col-sm-6">Temperature</div>
            <div class="col-sm-6">${temperature} &deg;</div>
            </div>
            <div class="col-sm-12 p-2 border d-flex justify-content-between">
            <div class="col-sm-6">Wind</div>
            <div class="col-sm-6">${wind} &deg;</div>
            </div>
            <div class="col-sm-12 p-2 border d-flex justify-content-between">
            <div class="col-sm-6">Humidity</div>
            <div class="col-sm-6">${humidity} &deg;</div>
            </div>
            <div class="col-sm-12 p-2 border d-flex justify-content-between">
            <div class="col-sm-6">UV index</div>
            <div class="col-sm-6 text-${color}">${UVIndex}&deg;</div>
            </div>
            </div>
          </div>`;

  futureWeatherSectionEl.append(futureWeatherSinglecard);
};

// ------- Local Storage ---------
// Initialise local storage
const initialiseLocalStorage = () => {
  // get feedbackResults from LS
  const feedbackResultsFromLS = JSON.parse(localStorage.getItem("cities"));
  console.log(feedbackResultsFromLS);

  // If this throws undefined, it means
  if (!feedbackResultsFromLS) {
    // if not exist set LS to have feedbackResults as an empty array
    localStorage.setItem("cities", JSON.stringify([]));
  }
};

// Store
const storeInLS = (key, value) => {
  // get feedbackResults from LS
  const arrayFromLS = JSON.parse(localStorage.getItem(key));

  // push answer in to array
  arrayFromLS.push(value);

  // set feedbackResults in LS
  localStorage.setItem(key, JSON.stringify(arrayFromLS));
};

//Get
const getLSArray = (key) => {
  // get feedbackResults from LS
  return JSON.parse(localStorage.getItem(key));
};

// Delete local storage
const deleteLS = (key) => {
  localStorage.removeItem(key);
  removeScoreBoard();
  renderScoreTable();
};

//Iterate over array
const iterateArray = () => {
  const citiesArray = getLSArray("cities");
  for (let i = 0; i < citiesArray.length; i++) {
    renderListItem(citiesArray[i]);
  }
};

const fetchData = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Failed to fetch data");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const constructUrl = (baseUrl, params) => {
  const queryParams = new URLSearchParams(params).toString();

  return queryParams ? `${baseUrl}?${queryParams}` : baseUrl;
};

// Fetching from the API
const getLonAndLat = async (location) => {
  console.log("Lat and lon");

  const url = constructUrl("https://api.openweathermap.org/data/2.5/weather", {
    q: location,
    appid: "ff891452cf5dbd2b6b58afe44e37784e",
  });
  try {
    const currentData = await fetchData(url);

    // Get lat, lon and city name
    const lat = currentData?.coord?.lat;
    const lon = currentData?.coord?.lon;
    const displayCityName = currentData?.name;

    const forecastDataUrl = constructUrl(
      "https://api.openweathermap.org/data/2.5/onecall",
      {
        lat: lat,
        lon: lon,
        exclude: "minutely,hourly",
        units: "metric",
        appid: "8109f605d79877f7488a194794a29013",
      }
    );
    const forecastData = await fetchData(forecastDataUrl);
    console.log({
      cityName: displayCityName,
      weatherData: forecastData,
    });
    return {
      cityName: displayCityName,
      weatherData: forecastData,
    };
  } catch (error) {
    alert("Wrong Name");
    return false;
  }
};

// When the Search button is clicked the following functions are called
searchCityButtonEl.on("click", async function () {
  const cityName = searchBarCity.val();
  const arrayFromLS = JSON.parse(localStorage.getItem("cities"));
  const weatherValue = await getLonAndLat(cityName);
  if (!weatherValue) {
    alert("Wrong Name");
    return;
  }
  if (!arrayFromLS.includes(cityName) || cityName == " ") {
    $("#currentWeatherSection").remove();
    $("#futureWeatherSection").empty();
    storeInLS("cities", cityName);

    const currentWeather = weatherValue.weatherData.current;
    const futureWeather = weatherValue.weatherData.daily;
    console.log(futureWeather);
    renderListItem(cityName);
    renderCurrentWeather(
      cityName,
      currentWeather.temp,
      currentWeather.wind_speed,
      currentWeather.humidity,
      currentWeather.uvi,
      currentWeather.weather[0].icon
    );
    futureWeather.forEach((element) =>
      renderFutureWeather(
        cityName,
        element.temp.day,
        element.wind_speed,
        element.humidity,
        element.uvi,
        element.weather[0].icon
      )
    );
  }
});
locationList.on("click", async function (event) {
  const currentTarget = event.target;
  if (currentTarget.tagName == "LI") {
    console.log(currentTarget.textContent);
    const cityName = currentTarget.textContent;
    const arrayFromLS = JSON.parse(localStorage.getItem("cities"));
    console.log("hi");
    if (arrayFromLS.includes(cityName)) {
      $("#currentWeatherSection").remove();
      $("#futureWeatherSection").empty();
      const weatherValue = await getLonAndLat(cityName);

      const currentWeather = weatherValue.weatherData.current;
      const futureWeather = weatherValue.weatherData.daily;
      console.log(futureWeather);
      renderCurrentWeather(
        cityName,
        currentWeather.temp,
        currentWeather.wind_speed,
        currentWeather.humidity,
        currentWeather.uvi,
        currentWeather.weather[0].icon
      );
      for (let i = 0; i < 5; i++) {
        console.log(futureWeather[i]);
        renderFutureWeather(
          cityName,
          futureWeather[i].temp.day,
          futureWeather[i].wind_speed,
          futureWeather[i].humidity,
          futureWeather[i].uvi,
          futureWeather[i].weather[0].icon
        );
      }
    }
  }
});

window.onload = function () {
  initialiseLocalStorage();
  iterateArray();
};
