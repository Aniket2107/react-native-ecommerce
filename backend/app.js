const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv/config");
const authJwt = require("./middleware/auth");
const errorHandler = require("./middleware/errorhandler");
const app = express();

const dbConnect = require("./middleware/db");

dbConnect();

app.use(bodyParser.json());
app.use(cors());
app.options("*", cors());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(authJwt());
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
app.use(errorHandler);

app.use("/api/user", require("./Routes/User"));
app.use("/api/order", require("./Routes/Order"));
app.use("/api/product", require("./Routes/Product"));
app.use("/api/category", require("./Routes/Category"));

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server running at port ${PORT} `));
