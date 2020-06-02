import App from 'next/app';
import Head from 'next/head';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { CookiesProvider } from "react-cookie";
import { AppProvider } from '@shopify/polaris';
import { Provider } from '@shopify/app-bridge-react';
import Cookies from "js-cookie";
import '@shopify/polaris/styles.css';
import translations from '@shopify/polaris/locales/en.json';
// import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

// const client = new ApolloClient({
//   fetchOptions: {
//     credentials: 'include',
//   },
// });

const client = new ApolloClient({
  link: new createHttpLink({
    credentials: 'include',
    headers: {
      'Content-Type': 'application/graphql',
    }
  }),
  cache: new InMemoryCache(),
})
class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    const config = { apiKey: API_KEY, shopOrigin: Cookies.get("shopOrigin"), forceRedirect: true };

    return (
      <React.Fragment>
        <Head>
          <title>Sample App</title>
          <meta charSet="utf-8" />
        </Head>
        <Provider config={config}>
          <AppProvider i18n={translations}>
            <ApolloProvider client={client}>
              <CookiesProvider>
              <Component {...pageProps} config={config}/>
              </CookiesProvider>
            </ApolloProvider>
          </AppProvider>
        </Provider>
      </React.Fragment>
    );
  }
}

export default MyApp;
