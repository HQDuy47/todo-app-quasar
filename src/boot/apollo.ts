// src/boot/apollo.js
import { boot } from 'quasar/wrappers';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { provideApolloClient } from '@vue/apollo-composable';

const HASURA_ADMIN_SECRET = 'myadminsecretkey';

const httpLink = new HttpLink({
  uri: 'http://localhost:8080/v1/graphql',
  headers: {
    'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
  },
});

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default boot(() => {
  provideApolloClient(apolloClient);
});
