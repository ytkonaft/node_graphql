const express = require("express");
const bodyParser = require("body-parser");
const graphQlHttp = require("express-graphql");
const mongoose = require("mongoose");
const graphQlSchema = require("./graphql/schema");
const graphQlResolvers = require("./graphql/resolvers");

const app = express();

app.use(bodyParser.json());

app.get("/", (req, resp, next) => {
  resp.send("Hello");
});

app.use(
  "/graphql",
  graphQlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);

const testEnv = {
  USER: "root",
  PASSWORD: "password",
  HOST: "localhost",
  PORT: "27017",
  DB_NAME: "graph"
};

// const { USER, PASSWORD, HOST, PORT, DB_NAME } = process.env;
const { USER, PASSWORD, HOST, PORT, DB_NAME } = testEnv;

mongoose
  .connect(`mongodb://${USER}:${PASSWORD}@${HOST}:${PORT}/${DB_NAME}`, {
    useNewUrlParser: true
  })
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
