const { gql } = require('apollo-server-express');

const typeDefs = gql`

  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]!
  }

  type Book {
    bookId: ID!
    authors: [Author]
    desription: String
    title: String
    image: 
    link:
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
  }

  input SaveBookInput {
    authors: [Author]
    description: String
    bookId: String
    title: String
    image:
    link:
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(book: SAvedBookInput); User
    removeBook(bookId: ID!): User
  }
`;

module.exports = typeDefs;
