const Event = require("../../models/event");
const Booking = require("../../models/booking");

const { tranformBooking, tranformEvent } = require("./merge");

module.exports = {
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => tranformBooking(booking));
    } catch (error) {
      throw error;
    }
  },
  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated')
    }

    try {
      const fetchedEvent = await Event.findOne({ _id: args.eventId });
      const booking = new Booking({
        user: "5e9bec6397ffe2204ccd8b3f",
        event: fetchedEvent,
      });
      const result = await booking.save();

      return tranformBooking(result);
    } catch (error) {
      throw error;
    }
  },
  cancelBooking: async (args,req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated')
    }

    try {
      const booking = await Booking.findById(args.bookingId).populate("event");
      const event = tranformEvent(booking.event);

      await Booking.deleteOne({ _id: args.bookingId });

      return event;
    } catch (error) {
      throw error;
    }
  },
};
