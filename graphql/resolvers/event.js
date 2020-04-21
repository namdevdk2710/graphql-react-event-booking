const Event = require("../../models/event");
const User = require("../../models/user");

const { tranformEvent } = require("./merge");

module.exports = {
  events: async () => {
    try {
      const events = await Event.find().populate("creator");
      return events.map((event) => tranformEvent(event));
    } catch (error) {
      throw error;
    }
  },
  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated')
    }

    let createdEvent;
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: "5e9bec6397ffe2204ccd8b3f",
    });

    try {
      const result = await event.save();
      createdEvent = tranformEvent(result);

      const creator = await User.findById("5e9bec6397ffe2204ccd8b3f");
      if (!creator) {
        throw new Error("User not found.");
      }
      creator.createdEvents.push(event);
      await creator.save();

      return createdEvent;
    } catch (error) {
      throw error;
    }
  },
};
