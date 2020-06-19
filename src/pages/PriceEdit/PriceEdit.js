import React, { useState } from 'react';
import Router from 'next/router';
import api from '../../../utils/api';
import filters from './filters';
import {
  Select,
  Card,
  Button,
  TextField,
} from '@shopify/polaris';
import Step1 from './steps/step1.js';
import Step2 from './steps/step2.js';
import Step3 from './steps/step3.js';

const initialFormValues = {
  filter: 'price',
  filterAction: 'is',
  editOption: `changeToCustomValue`,
};
const PriceEdit = () => {
  const [values, setFormValues] = useState(initialFormValues);
  const [formSubmit, setFormSubmit] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const filterType = filters.filter((item) => item.value === values.filter)[0].type;
    console.log(filterType);
    const {filter,filterAction,filterValue} = values;
    const { data } = await api.get(`products?filter=${filter}&filterType=${filterType}&filterAction=${filterAction}&filterValue=${filterValue}`);
    setProducts(data.products);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    console.log('values', values);
  };
  const updateSelectedProducts = async () => {
    setFormSubmit(true);
    const variantsToBeUpdated = products.reduce((acc, item) => {
      console.log(item, 'item');
      return [...acc, ...item.variants];
    }, []);
    console.log(variantsToBeUpdated, 'variantsToBeUpdated');
    const { editOption, editValue } = values;
    const paylaod = {
      variants: variantsToBeUpdated,
      editOption,
      editValue,
    };
    const { data } = await api.put(`products`, paylaod);
    setFormSubmit(false);
    fetchProducts();
    console.log(data);
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
      <div>
        <form onSubmit={onSubmit}>
          <Step1
            fetchProducts={fetchProducts}
            values={values}
            formSubmit={formSubmit}
            setFormValues={setFormValues}
          />
          <Step2 products={products}/>
          <Step3 values={values} setFormValues={setFormValues}/>
        </form>
        <br />
        <Card>
          <Button onClick={() => setFormValues(initialFormValues)}>
            Reset
          </Button>
          <Button onClick={() => updateSelectedProducts()}>Update</Button>
        </Card>
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
  step: {
    margin: 15,
  },
  editOptionWrapper: {
    display: 'flex',
    padding: 15,
    flexDirection: 'column',
  },
  editOptionItem: {
    marginBottom: 15,
    width: '50%',
  },
  emptyState: {
    padding: 15,
  },
};

export default PriceEdit;
