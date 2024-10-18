import { gql } from 'graphql-tag';

export const GET_TASKS = gql`
  query {
    Task {
      isFav
      id
      title
    }
  }
`;

export const DELETE_TASK_BY_ID = gql`
  mutation DeleteTaskById($id: Int!) {
    delete_Task_by_pk(id: $id) {
      id
      title
    }
  }
`;

export const ADD_TASK = gql`
  mutation InsertTask($isFav: Boolean, $title: String) {
    insert_Task(objects: { isFav: $isFav, title: $title }) {
      affected_rows
      returning {
        isFav
        id
        title
      }
    }
  }
`;

export const TOGGLE_FAV_TASK = gql`
  mutation UpdateTaskIsFav($id: Int!, $isFav: Boolean!) {
    update_Task(where: { id: { _eq: $id } }, _set: { isFav: $isFav }) {
      affected_rows
      returning {
        id
        title
        isFav
      }
    }
  }
`;

export const GET_TASK_BY_ID = gql`
  query GetTaskById {
    Task(where: { id: { _eq: 10 } }) {
      isFav
      id
      title
    }
  }
`;

export const UPDATE_TITLE_BY_ID = gql`
  mutation UpdateTitleById($id: Int!, $title: String!) {
    update_Task(where: { id: { _eq: $id } }, _set: { title: $title }) {
      affected_rows
      returning {
        id
        title
        isFav
      }
    }
  }
`;
