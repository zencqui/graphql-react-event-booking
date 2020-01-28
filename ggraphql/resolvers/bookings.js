const Booking = require('../../models/booking');
const Event = require('../../models/event');
const { transformBooking, transformEvent } = require('./resolverHelper');

module.exports = {
    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return transformBooking(booking);
            });
        } catch(err) {
            throw err;
        }
    },
    bookEvent: async (args, req) => {

        if(!req.isAuth) {
            throw new Error('Unauthenticated!');
        }

        const fetchedEvent = await Event.findOne({ _id: args.eventId });
        const booking = new Booking({
            user: '5e2eaaf19ccc585360e8f6af',
            event: fetchedEvent
        });

        const result = await booking.save();

        return transformBooking(result);
    },
    cancelBooking: async (args, req) =>{

        if(!req.isAuth) {
            throw new Error('Unauthenticated!');
        }

        try {
            const booking = await Booking.findById(args.bookingId).populate('event');

            if(!booking) {
                throw new Error('Booking does not exist.');
            }

            const event = transformEvent(booking.event);
            
            await Booking.deleteOne({_id: args.bookingId});
            return event;

        } catch (err) {
            throw err;
        }
    }
}