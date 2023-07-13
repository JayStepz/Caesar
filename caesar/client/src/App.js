import React from "react";
import Navbar from "./componets/Navbar";
import "./App.css";
import Home from "./componets/pages/Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Food from "./componets/pages/Food";
import Activities from "./componets/pages/Activities";
import Adventure from "./componets/pages/Adventure";
import { ModalButton } from './componets/Modal'
import Signup, {Login} from "./componets/pages/SignUp";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <>
      <ApolloProvider client={client}>
      <Router>
          <Navbar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/option1" component={Food} />
          <Route path="/option2" component={Activities} />
          <Route path="/option3" component={Adventure} />
          <Route path="/sign-up" component={Signup} />
          <Route path="/login" component={Login} />
          </Switch>
          <ModalButton />
        </Router>
        </ApolloProvider>
    </>
  );
}

export default App;
