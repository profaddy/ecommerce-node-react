import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import axios from "axios";
import { Query } from 'react-apollo';
import { ResourcePicker, TitleBar } from '@shopify/app-bridge-react';
import { EmptyState, Layout, Page } from '@shopify/polaris';

import gql from 'graphql-tag';


const query1 = gql`
  query getProductList1 {
    shop {
      name
    }
  }
`;
const test = gql`
  {
    products(first: 10) {
      edges {
        node {
          id
          title
        }
      }
    }
  }
`;
const GET_CURRENT_SHOP = gql`
  {
    shop {
      name
    }
  }
`;
const query2 = gql`
  query {
    products {
      edges {
        node {
          id
          title
        }
      }
    }
  }
`;

// `{
//     products(first:10){
//     edges{
//     node{
//       id,
//       title
//     }
//   }
// }
// }`
const Index = (props) => {
  const [open, setModalOpen] = useState(true);
  const [products,setProducts] = useState([])
  const getProducts = async () => {
    const response = await axios.get('/products');
    console.log(response);
    // setProducts(response.products)
  };
  useEffect(() => {
    console.log('props', props);
    getProducts();
  }, []);
  return (
    <Page>
        {products.map((item) => {
            return <>{item.title}</>
        })}
        {products.length === 0 ?<>No product</>:<>products available</> 
        }
      {/* <Query query={GET_CURRENT_SHOP}>
        {({ data, loading, error }) => {
          //   const { viewer } = data;
          console.log(data, loading, error, 'params');
          if (!!loading) {
            return <>loading...</>;
          }
          if (!!error) {
            return <>error</>;
          }
          if (!data) {
            return null;
          }

          return (
            <div>
              Success
            </div>
          );
        }}
      </Query> */}
      <TitleBar
        primaryAction={{
          content: 'Select products',
          onAction: () => setModalOpen(true),
        }}
      />
      <ResourcePicker
        resourceType="Product"
        showVariants={false}
        open={open}
        onSelection={(resources) => this.handleSelection(resources)}
        onCancel={() => setModalOpen(false)}
      />
    </Page>
  );
};
export default Index;
