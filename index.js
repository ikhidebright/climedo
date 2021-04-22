import express from "express";
import createError from "http-errors";
import dotenv from "dotenv";
import apiRoutes from "./routes/index.routes";

require("./config/db");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", apiRoutes);

app.get("/", (request, response) => {
  response.status(200).json({
    status: true,
    message: "Welcome to Climedo",
  });
});

app.use((request, response, next) => {
  next(createError.NotFound());
});

app.use((err, request, response, next) => {
  response.status(err.status || 500);
  response.send({
    error: {
      status: err.status || 500,
      message: err.message || "An error occured!",
    },
  });
  return;
});

app.set("x-powered-by", false);

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Server available on port: ${PORT}`);
});
