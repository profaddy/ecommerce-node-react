import React, { useState } from 'react';
import api from '../../../utils/api';

import filters from './filters';
import { Formik, Form, Field } from 'formik';
import {
  Select,
  Card,
  Button,
  TextField,
  ResourceList,
} from '@shopify/polaris';
import Router from 'next/router';
import ResourceListComponent from '../../../components/ResourceList'

const PriceEdit = () => {
  const [values, setFormValues] = useState({
    filter: 'price',
    filterAction: 'is',
  });
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const { data } = await api.get('products');
    setProducts(data.data.products);
  };
  const handleSelectedProduct = (item) => {
    setSelectedProducts({ ...selectedProducts, ...item });
  };
  console.log(values, 'formvalues');
  const onSubmit = (e) => {
    e.preventDefault();
    console.log('values', values);
  };
  const getFilterOptions = () => {
    switch (values.filter) {
      case 'price':
        return [
          { label: 'is', value: 'is' },
          { label: 'is less than', value: 'less than' },
          { label: 'greater than', value: 'greater than' },
        ];
      case 'description':
        return [{ label: 'is', value: 'is' }];
      default:
        [];

        return [{ label: 'is', value: 'is' }];
    }
  };
  return (
    <div>
      <button
        onClick={() => {
          Router.push('/');
        }}
      >
        Home
      </button>
      <div>Prie Edit Page</div>
      <div>
        <form onSubmit={onSubmit}>
          <Card sectioned>
            <div style={{ display: 'flex' }}>
              <div style={styles.formItem}>
                <Select
                  key={'filter'}
                  name="filter"
                  options={filters}
                  onChange={(value) => {
                    setFormValues({ ...values, filter: value });
                  }}
                  value={values.filter}
                />
              </div>
              <div style={styles.formItem}>
                <Select
                  key={'filter'}
                  name="filterAction"
                  options={getFilterOptions()}
                  onChange={(value) => {
                    setFormValues({ ...values, filterAction: value });
                  }}
                  value={values.filterAction}
                />
              </div>
              <div style={styles.formItem}>
                <TextField
                  name="filterValue"
                  value={values.filterValue}
                  onChange={(value) =>
                    setFormValues({ ...values, filterValue: value })
                  }
                />
              </div>
              <div>
                <Button
                  submit
                  primary
                  onClick={() => {
                    fetchProducts();
                  }}
                  disabled={false}
                >
                  Save
                </Button>
              </div>
            </div>
          </Card>
          <ResourceListComponent
            itemList={products}
            selectedItems={selectedProducts}
            handleSelectedProduct={handleSelectedProduct}
          />
        </form>
        <br />
        <Card subdued sectioned title="Internal Form Values">
          <code>{JSON.stringify(values, null, 2)}</code>
        </Card>
      </div>
    </div>
  );
};

const styles = {
  formContainer: {
    display: 'flex',
    width: '100%',
  },
  formItem: {
    marginRight: 15,
    minWidth: 200,
  },
};

export default PriceEdit;
