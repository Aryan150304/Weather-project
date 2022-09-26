const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const https = require('https');
const http = require('http');
// to include body parser in the server
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(express.static(__dirname + '/'));
// to get the information
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
})
// to post information and to get the information from the api
app.post("/", (req, res) => {
  var search = req.body.search;
  http.get("http://api.openweathermap.org/data/2.5/weather?q=" + search + "&appid=fcda278cdfd5c0c55a958d472c7d6572&units=metric", (response) => {
    response.on('data', (data) => {
      var weatherData = JSON.parse(data);
      console.log(weatherData);
      var weatherDesc = weatherData.weather[0].description;
      var temp = weatherData.main.temp;
      var icon = weatherData.weather[0].icon;
      var humidity = weatherData.main.humidity;
      var windSpeed = weatherData.wind.speed;
      var iconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      // adding unsplash api
      const api = `https://api.unsplash.com/search/photos/?query=${search}&client_id=qYfRbzMMkvYC_TBHvKH4f9qI7o0ISSnLp_cmiDgmplk&orientation=landscape`;
      https.get(api, (response) => {
        status_code = response.statusCode;
        if (status_code == 200) {
          // Watch out here:
          //  - Response data is delivered in chunks
          //  - If your next processing step operates on the whole response data, you need to collect the chunks into one string first.
          //  - Your dat ais ready for further processing when the `end` event is received.
          //
          let data_complete = '';
          try {
            response.on("data", (data_chunk) => {
              data_complete += data_chunk.toString();
            });
            response.on("end", () => {
              console.log(JSON.parse(data_complete));
              if (JSON.parse(data_complete).total == 0 && (weatherData.statusCode == 404)) {
                res.write(`<!DOCTYPE html>
                  <html lang="en" dir="ltr">

                  <head>
                    <meta charset="utf-8">
                    <meta content="width=device-width, initial-scale=1" name="viewport" />
                    <script src="https://kit.fontawesome.com/0fc8787d5f.js" crossorigin="anonymous"></script>
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
                    <title>Weather project</title>
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
                    <link rel="preconnect" href="https://fonts.googleapis.com">
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600&display=swap" rel="stylesheet">
                    <link rel="stylesheet" href="post.css">
                  </head>

                  <!-- body part of the file -->

                  <body style="background-image: url('https://wallpapercave.com/wp/wp2414727.jpg');">
                    <div class="flex">
                      <div class="weatherSection">
                        <form action="/" method="post" class="form">
                          <input type="text" name="search" value="" placeholder="Enter the location" class="search">
                          <button type="submit" name="button"><span class="material-symbols-outlined">
                              search
                            </span></button>
                        </form>
                        <div class="weather sec">
                          <h2 class="weatherHead">City not found..</h2>
                          <h3 class="">Try another city</h3>
                        </div>

                          <div class="flexb">
                            <img src="" alt="">
                            <p>Uh oh!</p>
                          </div>
                          <div class="weather : ">
                          <p class="desc">Humidity : </p>
                          <p class="desc">Wind speed</p>
                        </div>

                      </div>
                    </div>
                  </body>

                  </html>
              `);
                res.send();
              } else if (JSON.parse(data_complete).total == 0 || (weatherData.statusCode == 200)) {
                res.write(`<!DOCTYPE html>
              <html lang="en" dir="ltr">
              <head>
                <meta charset="utf-8">
                <meta content="width=device-width, initial-scale=1" name="viewport" />
                <script src="https://kit.fontawesome.com/0fc8787d5f.js" crossorigin="anonymous"></script>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
                <title>Weather project</title>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600&display=swap" rel="stylesheet">
                <link rel="stylesheet" href="post.css">
              </head>

              <!-- body part of the file -->

              <body style="background-image: url('https://wallpapercave.com/wp/wp2414727.jpg');">
                <div class="flex">
                  <div class="weatherSection">
                    <form action="/" method="post" class="form">
                      <input type="text" name="search" value="" placeholder="Enter the location" class="search">
                      <button type="submit" name="button"><span class="material-symbols-outlined">
                          search
                        </span></button>
                    </form>
                    <div class="weather sec">
                      <h2 class="weatherHead">Weather in ${search}</h2>
                      <h3 class="">${temp}</h3>
                    </div>

                      <div class="flexb">
                        <img src="${iconURL}" alt="image representing weather">
                        <p>${weatherDesc}</p>
                      </div>
                      <div class="weather">
                      <p class="desc">Humidity : ${humidity}%</p>
                      <p class="desc">Wind speed : ${windSpeed}km/hr</p>
                    </div>

                  </div>
                </div>
              </body>

              </html>
          `);
                res.send();

              } else {
                var image = JSON.parse(data_complete).results[0].urls.raw;
                console.log(image);
                res.write(`<!DOCTYPE html>
                <html lang="en" dir="ltr">

                <head>
                  <meta charset="utf-8">
                  <meta content="width=device-width, initial-scale=1" name="viewport" />
                  <script src="https://kit.fontawesome.com/0fc8787d5f.js" crossorigin="anonymous"></script>
                  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
                  <title>Weather project</title>
                  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
                  <link rel="preconnect" href="https://fonts.googleapis.com">
                  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600&display=swap" rel="stylesheet">
                  <link rel="stylesheet" href="post.css">
                </head>

                <!-- body part of the file -->

                <body style="background-image: url('${image}');">
                  <div class="flex">
                    <div class="weatherSection">
                      <form action="/" method="post" class="form">
                        <input type="text" name="search" value="" placeholder="Enter the location" class="search">
                        <button type="submit" name="button"><span class="material-symbols-outlined">
                            search
                          </span></button>
                      </form>
                      <div class="weather sec">
                        <h2 class="weatherHead">Weather in ${search}</h2>
                        <h3 class="">${temp}</h3>
                      </div>

                        <div class="flexb">
                          <img src="${iconURL}" alt="image representing weather">
                          <p>${weatherDesc}</p>
                        </div>
                        <div class="weather">
                        <p class="desc">Humidity : ${humidity}%</p>
                        <p class="desc">Wind speed : ${windSpeed}km/hr</p>
                      </div>

                    </div>
                  </div>
                </body>

                </html>
              `);
                res.send();
              }
            });
          } catch (error) {
            console.log(error);
          }
        }
      });
    });
  });
});

// to listen to port 3000
app.listen(process.env.PORT|| 3000, () => {
  console.log("Server is running at port 3000");
})
