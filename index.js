const express = require("express");
const fetch = require("node-fetch");
const app = express();
const port = process.env.PORT || 3000;
const apiKey = "af9df6c35df67680e8cab9ab310de69c";

function getLocationFromIP(client_ip) {
  return fetch(`https://ipapi.co/${client_ip}/json/`)
    .then((response) => response.json())
    .then((data) => data.city || "New York")
    .catch((error) => {
      console.error("Error fetching location:", error);
      return "New York";
    });
}
function getWeather(location) {
  return fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
  )
    .then((response) => response.json())
    .then((weatherData) =>
      weatherData.main ? weatherData.main.temp : "Unknown"
    )}


app.get("/api/hello", (req, res) => {
  const { visitor_name } = req.query;
  const client_ip =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  getLocationFromIP(client_ip)
    .then((location) => {
      return getWeather(location).then((temperature) => {
        res.status(200).json({
          client_ip,
          location,
          greeting: `Hello, ${visitor_name}!, the temperature is ${temperature} degrees Celsius in ${location}`,
        });
      });
    })
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
