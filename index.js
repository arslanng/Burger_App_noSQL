const PORT = 8000;
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
// const fetch = require("node-fetch");
require("dotenv").config();

const app = express();

app.use(morgan("tiny")); // konsola html requestleri ve sonuçları ile ilgili log atar.
app.use(cors());
app.use(express.json());

//Data fetching
app.get("/burgers", (req, res) => {
  const url = process.env.ENDPOINT;
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "X-Cassandra-Token": process.env.ASTRA_TOKEN,
    },
  };
  fetch(url, options)
    .then((response) => response.json())
    .then((json) => res.json(json))
    .catch((err) => console.log("error:" + err));
});

//Hata mesajları
function notFound(req, res, next) {
  res.status(404);
  const error = new Error("Hey you are in the wrong place buddy!!!");
  next(error);
}

function errorHandler(error, req, res) {
  res.status(res.statusCode || 500);
  res.json({
    message: error.message,
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
