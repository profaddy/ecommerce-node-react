import React, { useState } from 'react';
import Router from 'next/router';
import api from '../../../utils/api';
import filters from './filters';
import { Card, Button } from '@shopify/polaris';
import Step1 from './steps/step1.js';
import Step2 from './steps/step2.js';
import Step3 from './steps/step3.js';
import Step4 from './steps/step4.js';
import isEmpty from 'lodash/isEmpty';
import validator from "./validator.js";

import ToastWrapper from '../components/ToastWrapper/ToastWrapper.js';

const initialFormValues = {
  filter: 'allProducts',
  filterAction: 'is',
  editOption: `changeToCustomValue`,
  variantFilter: 'allVariants',
  variantFilterAction: 'is'
};
const defaultToastOptions = {
  active:false,
  message:"",
  error:false
}
const PriceEdit = () => {
  const [values, setFormValues] = useState(initialFormValues);
  const [formSubmit, setFormSubmit] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [products, setProducts] = useState([]);
  const [toast,setToast] = useState(defaultToastOptions)

  const fetchProducts = async () => {
    try{
    const filterType = filters.filter((item) => item.value === values.filter)[0]
      .type;
    const { filter, filterAction, filterValue } = values;
    const { data } = await api.get(
      `products?filter=${filter}&filterType=${filterType}&filterAction=${filterAction}&filterValue=${filterValue}`
    );
    if(data.status === false){
      throw("test")
    }
    setToast({active:true,message:`products fetched successfully`,error:false})
    setProducts(data.products);
    }catch(error){
      setToast({active:true,message:`${error.response.statusText}`,error:true})
    }
  };
  const onSubmit = (e) => {
    e.preventDefault();
    console.log('values', values);
  };
  const updateSelectedProducts = async () => {
    // setFormSubmit(true);

    const errors = validator(values);
    console.log(errors)
    if (isEmpty(errors)) {
      const variantsToBeUpdated = products.reduce((acc, item) => {
        console.log(item, 'item');
        return [...acc, ...item.variants];
      }, []);
      const {
        editOption,
        editValue,
        variantFilter,
        variantFilterAction,
        variantFilterValue,
      } = values;
      const variantFilterOptions = {
        filter: variantFilter,
        filterAction: variantFilterAction,
        filterValue: variantFilterValue,
      };
      const paylaod = {
        variants: variantsToBeUpdated,
        variantFilterOptions,
        editOption,
        editValue,
      };
      const { data } = await api.put(`products`, paylaod);
      // setFormSubmit(false);
      fetchProducts();
    } else {
      setFormErrors(errors);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div
        style={styles.homeLink}
        onClick={() => {
          Router.push('/');
        }}
      >
        {'< Dashboard'}
      </div>
      <div>
        <form onSubmit={onSubmit}>
          <Step1
            fetchProducts={fetchProducts}
            values={values}
            formSubmit={formSubmit}
            formErrors={formErrors}
            setFormValues={setFormValues}
          />
          <Step2 products={products} />
          <Step3
            values={values}
            formSubmit={formSubmit}
            formErrors={formErrors}
            setFormValues={setFormValues}
          />
          <Step4
            values={values}
            formErrors={formErrors}
            setFormValues={setFormValues}
          />
        </form>
        <br />
        <Card>
          <Button onClick={() => setFormValues(initialFormValues)}>
            Reset
          </Button>
          <Button
            onClick={() => updateSelectedProducts()}
            disabled={isEmpty(products)}
          >
            Start Bulk Editing
          </Button>
          <Button onClick={() => updateSelectedProducts()} disabled={true}>
            Schedule Bulk Editing
          </Button>
        </Card>
        <Card subdued sectioned title="Internal Form Values">
          <code>{JSON.stringify(values, null, 2)}</code>
        </Card>
      </div>
      <ToastWrapper active={toast.active} message={toast.message} error= {toast.error} onDismiss={() => setToast({defaultToastOptions})}/>
    </div>
  );
};
const styles = {
  pageWrapper: {
    margin: 20,
  },
  homeLink: {
    cursor: 'pointer',
  },
};
export default PriceEdit;
