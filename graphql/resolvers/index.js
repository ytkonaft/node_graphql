const bcrypt = require("bcryptjs");
const Event = require("../../models/event");
const User = require("../../models/user");
const Booking = require("../../models/booking");

const getEvents = async (eventIds) => {
  const result = await Event.find({ _id: { $in: eventIds } });
  return result.map((event) => ({
    ...event._doc,
    creator: getUserById.bind(this, event._doc.creator)
  }));
};

const getEventById = async (eventId) => {
  const result = await Event.findById(eventId);
  return {
    ...result._doc
  };
};

const getUserById = async (userId) => {
  const result = await User.findById(userId);
  return {
    ...result._doc,
    password: null,
    createdEvents: getEvents.bind(this, result.createdEvents)
  };
};

const resolver = {
  events: async () => {
    try {
      const results = await Event.find();
      return results.map((event) => ({
        ...event._doc,
        creator: getUserById.bind(this, event._doc.creator)
      }));
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  users: async () => {
    try {
      const results = await User.find();
      return results.map((user) => ({
        ...user._doc,
        password: null,
        createdEvents: getEvents.bind(this, user._doc.createdEvents)
      }));
    } catch (err) {
      console.log(err);
      throw err;
    }
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

  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => ({ ...booking._doc }));
    } catch (err) {
      throw err;
    }
  },

  // cancelBooking: async ({bookingId}) => {
  //   try {
  //     const booking = await Booking.findById(bookingId).populate;

  //   } catch (err) {
  //     throw err;
  //   }
  // },

  bookEvent: async ({ eventId }) => {
    const booking = new Booking({
      user: "5d1224d36bc30b11e0d9127f",
      eventId: eventId
    });

    try {
      const result = await booking.save();
      return {
        ...result._doc,
        event: getEventById.bind(this, eventId),
        user: getUserById.bind(this, result._doc.user)
      };
    } catch (err) {
      throw err;
    }
  },

  createEvent: async ({ eventInput }) => {
    const userId = "5d1224d36bc30b11e0d9127f";
    try {
      const event = new Event({
        title: eventInput.title,
        description: eventInput.description,
        price: +eventInput.price,
        date: new Date(eventInput.date),
        creator: userId
      });

      const result = await event.save();
      const userCreator = await User.findById(userId);

      if (!userCreator) throw new Error("User not found");

      userCreator.createdEvents.push(result._doc._id);
      await userCreator.save();

      return {
        ...result._doc,
        creator: getUserById.bind(this, result._doc.creator)
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};

module.exports = resolver;
