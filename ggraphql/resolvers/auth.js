const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');

module.exports = {
    createUser: async (args) => {
        try {
        const existingUser = await User.findOne({email: args.userInput.email});
        
            if(existingUser) {
                throw new Error('User exists already.');
            }
            const hashedPwd = await bcrypt.hash(args.userInput.password, 12);

                const user = new User({
                    email: args.userInput.email,
                    password: hashedPwd
                });
                const createdUser = await user.save();
                console.log(createdUser);
                return {...createdUser._doc, password: null, _id: createdUser.id};
            } catch(err) {
                throw err;
            };
    },
    login: async ({email, password}) => {
        const user = await User.findOne({email: email});
        if(!user) {
            throw new Error('User does not exist!');
        }

        const isEqual = await bcrypt.compare(password, user.password);

        if(!isEqual) {
            throw new Error('Password is not correct!');
        }

        const token = jwt.sign({userId: user.id, email: user.email}, 'somesupersecretkey', {expiresIn: '1h'});

        return { userId: user.id, token: token, tokenExpiration: 1 };
        
    }
}