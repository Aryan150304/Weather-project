
// document.querySelector(".material-symbols-outlined").addEventListener('click',()=>{
//   //https://api.unsplash.com/search/photos/?query=chandigarh&client_id=qYfRbzMMkvYC_TBHvKH4f9qI7o0ISSnLp_cmiDgmplk&orientation=landscape
//   const query = document.querySelector(".search").value;
//   console.log(api);
//   document.querySelector("body").style.backgroundImage = "url("+api.results[0].urls.raw+")";
// })

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const https = require('https');
// to include body parser in the server
app.use(bodyParser.urlencoded({
  extended: true
}))
// to host static files
app.use(express.static(__dirname + "/"));

// to get the data to client browser
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/post.html");
})

// to post the data to localhost
app.post("/", (req, res) => {
  console.log(req.body);
  var search = req.body.search;
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
            if(JSON.parse(data_complete).total==0){
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
                      <h2 class="weatherHead">Weather in Mumbai</h2>
                      <h3 class="">51°C</h3>
                    </div>

                      <div class="flexb">
                        <img src="" alt="">
                        <p>Broken Clouds</p>
                      </div>
                      <div class="weather">
                      <p class="desc">Humidity : </p>
                      <p class="desc">Wind speed</p>
                    </div>

                  </div>
                </div>
              </body>

              </html>
  `);
  res.send();
            }
            else{
            var image =JSON.parse(data_complete).results[0].urls.raw;
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
                    <h2 class="weatherHead">Weather in Mumbai</h2>
                    <h3 class="">51°C</h3>
                  </div>

                    <div class="flexb">
                      <img src="" alt="">
                      <p>Broken Clouds</p>
                    </div>
                    <div class="weather">
                    <p class="desc">Humidity : </p>
                    <p class="desc">Wind speed</p>
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

// to listen to port 3000
app.listen(3000, () => {
  console.log("Server is running at port 3000");
})
