import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($email: String!, $password: String!) {
    register(email: $email, password: $password) {
      token
      user {
        id
        email
      }
    }
  }
`;

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($name: String!, $description: String, $icon: String, $color: String) {
    createCategory(name: $name, description: $description, icon: $icon, color: $color) {
      id
      name
      description
      icon
      color
      createdAt
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: ID!, $name: String!, $description: String, $icon: String, $color: String) {
    updateCategory(id: $id, name: $name, description: $description, icon: $icon, color: $color) {
      id
      name
      description
      icon
      color
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id) {
      id
    }
  }
`;

export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($title: String!, $amount: Float!, $type: String!, $categoryId: ID!) {
    createTransaction(title: $title, amount: $amount, type: $type, categoryId: $categoryId) {
      id
      title
      amount
      type
      category {
        id
        name
      }
      createdAt
    }
  }
`;

export const UPDATE_TRANSACTION = gql`
  mutation UpdateTransaction($id: ID!, $title: String, $amount: Float, $type: String, $categoryId: ID) {
    updateTransaction(id: $id, title: $title, amount: $amount, type: $type, categoryId: $categoryId) {
      id
      title
      amount
      type
      category {
        id
        name
      }
    }
  }
`;

export const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id) {
      id
    }
  }
`;
