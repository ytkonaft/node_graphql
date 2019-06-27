const User = require("../../models/user");
const Event = require("../../models/event");
const { dateToString } = require("../helpers/date");

const transformBooking = (booking) => ({
  ...booking._doc,
  event: getEventById.bind(this, booking._doc.event),
  user: getUserById.bind(this, booking._doc.user),
  createdAt: dateToString(booking._doc.createdAt),
  updatedAt: dateToString(booking._doc.updatedAt)
});

const transformEvent = (event) => ({
  ...event._doc,
  date: dateToString(event._doc.date),
  creator: getUserById.bind(this, event._doc.creator)
});

const transformUser = (user) => ({
  ...user._doc,
  password: null,
  createdEvents: getEvents.bind(this, user.createdEvents)
});

const getEvents = async (eventIds) => {
  const result = await Event.find({ _id: { $in: eventIds } });
  return result.map((event) => transformEvent(event));
};

const getEventById = async (eventId) => {
  const event = await Event.findById(eventId);
  return transformEvent(event);
};

const getUserById = async (userId) => {
  const result = await User.findById(userId);
  return transformUser(result);
};

exports.getEvents = getEvents;
exports.getEventById = getEventById;
exports.getUserById = getUserById;

exports.transformBooking = transformBooking;
exports.transformEvent = transformEvent;
exports.transformUser = transformUser;
