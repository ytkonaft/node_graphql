const Booking = require("../../models/booking");
const { transformEvent, transformBooking } = require("./utils");

module.exports = {
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => transformBooking(booking));
    } catch (err) {
      throw err;
    }
  },

  cancelBooking: async ({ bookingId }) => {
    try {
      const booking = await Booking.findById(bookingId).populate("event");
      await Booking.deleteOne({ _id: bookingId });
      return transformEvent(booking.event);
    } catch (err) {
      throw err;
    }
  },

  bookEvent: async ({ eventId }) => {
    const booking = new Booking({
      user: "5d1224d36bc30b11e0d9127f",
      event: eventId
    });
    try {
      const result = await booking.save();
      return transformBooking(result);
    } catch (err) {
      throw err;
    }
  }
};
