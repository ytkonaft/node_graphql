const Event = require("../../models/event");
const { transformEvent } = require("./utils");

module.exports = {
  events: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error("401");
      }
      const results = await Event.find();
      return results.map((event) => transformEvent(event));
    } catch (err) {
      console.log(err);
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

      return transformEvent(result);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};
