import { gql } from '@apollo/client';

export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      description
      icon
      color
      createdAt
    }
  }
`;

export const GET_TRANSACTIONS = gql`
  query GetTransactions {
    transactions {
      id
      title
      amount
      type
      category {
        id
        name
        icon
        color
      }
      createdAt
    }
  }
`;
