const express = require('express');
const router = express.Router();
const fetch = require("node-fetch");
require('dotenv').config();
const parse = require('json-parser');
const OWM_API_KEY = process.env.OWM_API_KEY || 'invalid_key';
const UNITS = process.env.UNITS || 'metric';
const OWN_API_KEY = '553d2bcf86e69063b28bddbe3966f1cc';

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { weather: null, err: null });
});

router.post('/get_weather', async function (req,res) {
  let city = req.body.city;

 /* let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=${UNITS}&appid=45df74ee2e01cd6b86439fb0d5f4e716`; */
 let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=${UNITS}&appid=${OWN_API_KEY}`;

/*
{"coord":{"lon":2.35,"lat":48.85},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04d"}],"base":"stations","main":{"temp":20.22,"feels_like":17.29,"temp_min":19,"temp_max":21.11,"pressure":1012,"humidity":55},"visibility":10000,"wind":{"speed":4.6,"deg":210},"clouds":{"all":75},"dt":1592478902,"sys":{"type":1,"id":6550,"country":"FR","sunrise":1592451997,"sunset":1592510221},"timezone":7200,"id":2988507,"name":"Paris","cod":200}
 */


  try {
    let data = await fetch(url);
    let weather = await data.json();
    let ville = weather.name;
    let pays = weather.sys.country;
    let meteo = weather.weather[0].main;
    let conditions = weather.weather[0].description;
    let temperature = weather.main.temp;
    let pression = weather.main.pressure;
    let humidite = weather.main.humidity;
    let longitude = weather.coord.lon;
    let latitude = weather.coord.lat;
    let separator1 = '[';
    let separator2 = ']';
	
    console.log(separator1, pays, separator2, separator1, ville, separator2, separator1, meteo, separator2, separator1, conditions, separator2, separator1, temperature, separator2, separator1, pression, separator2, separator1, humidite, separator2, separator1, longitude, separator2, separator1, latitude, separator2);

/*  console.log(pays, ville, meteo, conditions, temperature, pression, humidite);
    console.log (meteo);
    return weather; 
    const meteo = JSON.parse(weather);
    console.log(weather.name);
    console.log(meteo);
    winston.log(weather); 	  
    console.log(weather); 
*/
	  
    if(weather.cod == '404' && weather.main == undefined) {
      res.render('index', {weather: null, error: 'Error: Unknown city'});
    }
    else if (weather.cod == '401' && weather.main == undefined) {
      res.render('index', {weather: null, error: 'Error: Invalid API Key. Please see http://openweathermap.org/faq#error401 for more info.'});
    }
    else {
      let unit_hex = (UNITS == 'imperial') ? '&#8457' : '&#8451';
      res.render('index', {weather: weather, error: null, units: unit_hex});
    }
  }
  catch (err) {
    console.log(err);
    res.render('index', {weather: null, error: 'Error: Unable to invoke OpenWeatherMap API'});
  }

});

module.exports = router;
