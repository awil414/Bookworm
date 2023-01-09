const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select('-__v -password');
        return userData;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
       // Create the user 
      const user = await User.create({ username, email, password });
      // Immediately assign a JSON WebToken and log the user in 
      const token = signToken(user);
      // Return an `Auth` object that consists of the signed token and user's info
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      // Look up user by the provided email
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }
      // If there is a found user, execute the `isCorrectpassword` instance method and check if correct password provided
      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }
      // If email and password are correct, sign user into the application with a JWT
      const token = signToken(user);
      // Return an `Auth` object that consists of the signed token and user's info
      return { token, user };
    },
   
    saveBook: async (parent, { book }, context) => {
      if (context.user) {
        const updateUser = await User.findByIdAndUpdate(
            {_id: context.user._id },
            { $addToSet: { savedBooks: book }},
            { new: true },
        );
        return updateUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updateUser = await User.findByIdAndUpdate(
            {_id: context.user._id },
            { $pull: { savedBooks: { bookId }}},
            { new: true },
        );
        return updateUser; 
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

module.exports = resolvers;