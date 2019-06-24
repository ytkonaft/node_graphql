const express = require("express");
const bodyParser = require("body-parser");
const graphQlHttp = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express();

app.use(bodyParser.json());

app.get("/", (req, resp, next) => {
  resp.send("Hello");
});

app.use(
  "/graphql",
  graphQlHttp({
    schema: buildSchema(`
        type RootQuery{
            events: [String!]!
            users: [String!]!
        }
        type RootMutation {
            createEvent(name: String!) : String
        }
        schema {
            query: RootQuery
            mutation:  RootMutation
        }
    `),
    rootValue: {
      events: () => {
        return ["test1", "test2", "test3"];
      },
      users: () => {
        return ["user1", "user2", "user3"];
      },
      createEvent: ({ name }) => {
        return name;
      }
    },
    graphiql: true
  })
);

app.listen(3000);
