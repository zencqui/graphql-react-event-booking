const Event = require('../../models/event');
const User = require('../../models/user');
const { transformEvent } = require('./resolverHelper');

module.exports = {
    events: async (args, req) => {

        try {
        const events = await Event.find();
                return events.map(event => {
                    return transformEvent(event);
                })
        }catch(err) {
            throw err;
        };
    },
    createEvent: async (args, req) => {

        if(!req.isAuth) {
            throw new Error('Unauthenticated!');
        }

        const event = new Event({
            title: args.eventInput.title,
             description: args.eventInput.description,
             price: +args.eventInput.price,
             date: Date(args.eventInput.date),
             creator: '5e2eaaf19ccc585360e8f6af'
        });
        
        let createdEvent;
        try {
            const createEventResult = await event.save();

                createdEvent = transformEvent(createEventResult);

                const existingUser = await User.findById('5e2eaaf19ccc585360e8f6af');

                if(!existingUser) {
                    throw new Error('User not found.');
                }
                
                existingUser.createdEvents.push(event);
                await existingUser.save();
            
             return createdEvent;

            } catch(err) {
                console.log(err);
                throw err;
            };
    }
}