import React from 'react';
import ReactDOM from 'react-dom';
import { Routes } from './Routes';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";


const client = new ApolloClient({
  uri: "http://localhost:5000/graphql"
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <Routes />
    </React.StrictMode>
  </ApolloProvider>,
  document.getElementById('root')
);
