const express = require("express");
const bodyParser = require("body-parser");
const graphQlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Event = require("./models/event");
const User = require("./models/user");

const app = express();

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

        type User {
          _id: ID!
          email: String!
          password: String
        }

        input EventInput {
          title: String!
          description: String! 
          price: Float!
          date: String!
        }

        input UserInput {
          email: String!
          password: String!
        }

        type RootQuery{
          events: [Event]!
          users: [String!]!
        }

        type RootMutation {
          createEvent(eventInput: EventInput): Event
          createUser(userInput: UserInput): User
        }

        schema {
          query: RootQuery
          mutation: RootMutation
        }
    `),
    rootValue: {
      events: async () => {
        try {
          const results = await Event.find();
          return results.map((event) => ({ ...event._doc }));
        } catch (err) {
          console.log(err);
          throw err;
        }
      },

      users: () => {
        return ["user1", "user2", "user3"];
      },

      createUser: async ({ userInput }) => {
        try {
          const existUser = await User.findOne({ email: userInput.email });

          if (existUser) throw new Error("User is exists!");

          const hashedPassword = await bcrypt.hash(userInput.password, 12);

          const user = new User({
            email: userInput.email,
            password: hashedPassword
          });

          const result = await user.save();

          return { ...result._doc, password: null };
        } catch (err) {
          console.log(err);
          throw err;
        }
      },

      createEvent: async ({ eventInput }) => {
        try {
          const event = new Event({
            title: eventInput.title,
            description: eventInput.description,
            price: +eventInput.price,
            date: new Date(eventInput.date),
            creator: "5d1224d36bc30b11e0d9127f"
          });

          const result = await event.save();
          const user = await User.findById("5d1224d36bc30b11e0d9127f");

          if (!user) throw new Error("User not found");

          user.createdEvents.push(result._doc._id);
          await user.save();

          return { ...result._doc };
        } catch (err) {
          console.log(err);
          throw err;
        }
      }
    },
    graphiql: true
  })
);
const { USER, PASSWORD, HOST, PORT, DB_NAME } = process.env;

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
