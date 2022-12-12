const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const router = require("./routers/route");
const bodyParser = require("body-parser");
require("dotenv").config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/", router);

const port = 3000;

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log("Unable to connect to DB");
    console.error(err);
  });

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
