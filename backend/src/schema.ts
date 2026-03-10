import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    categories: [Category!]!
    transactions: [Transaction!]!
    createdAt: String!
  }

  type Category {
    id: ID!
    name: String!
    description: String
    icon: String
    color: String
    userId: String!
    user: User!
    transactions: [Transaction!]!
    createdAt: String!
  }

  type Transaction {
    id: ID!
    title: String!
    amount: Float!
    type: String!
    categoryId: String!
    category: Category!
    userId: String!
    user: User!
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
    categories: [Category!]!
    category(id: ID!): Category
    transactions: [Transaction!]!
    transaction(id: ID!): Transaction
  }

  type Mutation {
    register(email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!

    createCategory(name: String!, description: String, icon: String, color: String): Category!
    updateCategory(id: ID!, name: String!, description: String, icon: String, color: String): Category!
    deleteCategory(id: ID!): Category!

    createTransaction(title: String!, amount: Float!, type: String!, categoryId: ID!): Transaction!
    updateTransaction(id: ID!, title: String, amount: Float, type: String, categoryId: ID): Transaction!
    deleteTransaction(id: ID!): Transaction!
  }
`;
