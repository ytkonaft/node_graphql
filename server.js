const express = require("express");
const bodyParser = require("body-parser");
const graphQlHttp = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express();

const eventsStore = [];

app.use(bodyParser.json());

app.get("/", (req, resp, next) => {
  resp.send("Hello");
});

app.use(
  "/graphql",
  graphQlHttp({
    schema: buildSchema(`
        type Event {
          _id: ID!
          title: String!
          description: String! 
          price: Float!
          date: String!
        }
        input EventInput {
          title: String!
          description: String! 
          price: Float!
          date: String!
        }
        type RootQuery{
          events: [Event]!
          users: [String!]!
        }
        type RootMutation {
          createEvent(eventInput: EventInput): Event
        }
        schema {
          query: RootQuery
          mutation: RootMutation
        }
    `),
    rootValue: {
      events: () => {
        return eventsStore;
      },
      users: () => {
        return ["user1", "user2", "user3"];
      },
      createEvent: ({ eventInput }) => {
        const event = {
          _id: Math.random().toString(),
          title: eventInput.title,
          description: eventInput.description,
          price: +eventInput.price,
          date: eventInput.date
        };
        eventsStore.push(event);
        return event;
      }
    },
    graphiql: true
  })
);

app.listen(3000);
