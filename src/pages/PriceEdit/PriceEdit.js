import React, { useState } from 'react';
import api from '../../../utils/api';
import isEmpty from 'lodash/isEmpty';
import filters from './filters';
import {
  Select,
  Card,
  Button,
  TextField,
  ResourceList,
} from '@shopify/polaris';
import Router from 'next/router';
import ResourceListComponent from '../../../components/ResourceList';

const initialFormValues = {
  filter: 'price',
  filterAction: 'is',
  editOption: `changeToCustomValue`,
}
const PriceEdit = () => {
  const [values, setFormValues] = useState(initialFormValues);
  const [formSubmit,setFormSubmit] = useState(false); 
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const filterType = filters.filter((item) => item.value === values.filter)[0].type;
    console.log(filterType);
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
  const updateSelectedProducts = async () => {
    setFormSubmit(true);
    console.log(selectedProducts,"selectedProducts");
    var productsToBeUpdated = products.filter(function(item) {
      return selectedProducts.indexOf(item.id) !== -1;
});
const variantsToBeUpdated = productsToBeUpdated.reduce((acc,item) => {
  console.log(item,"item")
    return [...acc,...item.variants]
},[]);
console.log(variantsToBeUpdated,"variantsToBeUpdated");
const {editOption,editValue} = values
const paylaod = {
  products:productsToBeUpdated,
  variants:variantsToBeUpdated,
  editOption,
  editValue
}
    const {data} = await api.put(`products.json`,paylaod);
    setFormSubmit(false);
    fetchProducts();
    console.log(data);
  }
  const getFilterOptions = () => {
    switch (values.filter) {
      case 'price':
        return [
          { label: 'of all variants more than', value: '===' },
          { label: 'of all variants is less than', value: '>' },
          { label: 'of all variants greater than', value: '<' },
        ];
      case 'description':
        return [
          { label: 'contains', value: '===' },
          { label: 'does not contain', value: '!==' },
          { label: 'is empty', value: '!' }
      ];
      default:
        [];

        return [{ label: 'is', value: 'is' }];
    }
  };
  const EditOptions = [
    { label: 'Change price to', value: 'changeToCustomValue' },
    { label: 'Adjust price by amount', value: 'addPriceByAmount' },
    { label: 'Adjust price by percentage', value: 'addPriceByPercentage' },
  ];

  const getContentBasedOnEditSelection = () => {
    const editOption = { values };
    switch (editOption) {
      case 'changeToCustomValue':
        return (
          <TextField
            name="editValue"
            label={'Price'}
            value={values.editValue}
            onChange={(value) => setFormValues({ ...values, editValue: value })}
          />
        );
      case 'addPriceByAmount':
        return (
          <TextField
            name="editValue"
            label={'Price in INR'}
            value={values.editValue}
            onChange={(value) => setFormValues({ ...values, editValue: value })}
          />
        );
      case 'addPriceByPercentage':
        return (
          <TextField
            name="editValue"
            label={'Price in %'}
            value={values.editValue}
            onChange={(value) => setFormValues({ ...values, editValue: value })}
          />
        );
      default:
        return (
          <TextField
            name="editValue"
            value={values.editValue}
            onChange={(value) => setFormValues({ ...values, editValue: value })}
          />
        );
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
      <div style={styles.step}>Step1: Filter Products</div>
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
                    setFormValues({ ...values, filter: value, filterAction:getFilterOptions() });
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
                {formSubmit === true && isEmpty(values.filterValue) && <div style={{color:"red"}}>Please provide a value</div>}
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
                  Apply
                </Button>
              </div>
            </div>
          </Card>
          <div style={styles.step}>Step2: Select Products</div>
          {products.length === 0 && <Card>
            <div style={styles.emptyState}>Please apply filter to list products</div>
            </Card>}
          <ResourceListComponent
            itemList={products}
            selectedItems={selectedProducts}
            handleSelectedProduct={setSelectedProducts}
          />
          <div style={styles.step}>Step3: Choose How to Edit</div>
          <Card>
            <div style={styles.editOptionWrapper}>
            <div style={styles.editOptionItem}>
              <Select
                key={'editOptions'}
                name="editOption"
                options={EditOptions}
                onChange={(value) => {
                  setFormValues({ ...values, editOption: value });
                }}
                value={values.editOption}
              />
            </div>
            <div style={styles.editOptionItem}>
              {getContentBasedOnEditSelection()}
              {/* {values.editOption === "changeToCustomValue" } */}
            </div>
            </div>
          </Card>
        </form>
        <br />
        <Card>
          <Button onClick={() => setFormValues(initialFormValues)}>Reset</Button>
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
    marginBottom:15,
    width: '50%',
  },
  emptyState:{
    padding:15
  }
};

export default PriceEdit;
