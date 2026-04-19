require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const Lead = require("./Lead");

const app = express();
app.use(express.json());

const port = process.env.PORT || 4000 

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)

// DB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err));

// 
