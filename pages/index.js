import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import Router from 'next/router';
import isEmpty from 'lodash/isEmpty';
import Dashboard from "../src/pages/dashboard/Dashboard.js"
import { Card, ResourceList, TextStyle, Thumbnail } from '@shopify/polaris';
import { ResourcePicker, TitleBar } from '@shopify/app-bridge-react';
import { Page } from '@shopify/polaris';
const Index = (props) => {
  const [open, setModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const getProducts = async () => {
    const response = await api.get('products');
    return response.data.data;
  };
  useEffect(() => {
    async function fetchData() {
      if (isEmpty(products)) {
        try {
          const data = await getProducts();
          setProducts(data.products);
        } catch (error) {
          console.error(error, 'error');
        }
      } else {
        alert('Error occured while fetching products');
      }
    }
    fetchData();
  }, []);
  return (
    <>
    <button onClick={() => {Router.push("/")}}>Home</button>
      <Dashboard />
      <Card>
        <button onClick={() => Router.push("/dashboard/Dashboard")}></button>
        {isEmpty(products) && <>No Products available.</>}
        {!isEmpty(products) && (
          <ResourceList
            showHeader
            resourceName={{ singular: 'product', plural: 'products' }}
            items={products}
            renderItem={(product) => {
              const { title, id, created_at } = product;
              const media = (
                <Thumbnail
                  source={product.images[0] ? product.images[0].src : ''}
                  alt={product.images[0] ? product.images[0].alt : ''}
                />
              );
              return (
                <ResourceList.Item
                  id={id}
                  title={title}
                  media={media}
                  created_at={created_at}
                  accessibilityLabel={`View details for ${title}`}
                  onClick={() => Router.push('/product-detail')}
                >
                  <h3>
                    <TextStyle variation="strong">{title}</TextStyle>
                  </h3>
                  <div>{created_at}</div>
                </ResourceList.Item>
              );
            }}
          />
        )}
      </Card>
    </>
  );
};
const styles = {
  eidtCardContainer:{
    display:"flex",
    flexWrap:"wrap",
  },
  editCardItem:{
    margin: "15px 15px 15px 0px",
    minWidth:275
  }
}
export default Index;
