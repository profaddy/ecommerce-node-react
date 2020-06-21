import React from 'react';
import isEmpty from 'lodash/isEmpty';
import filters from '../filters';
import { Select, Card, Button, TextField } from '@shopify/polaris';

const Step1 = (props) => {
  const { values, fetchProducts, formSubmit, setFormValues } = props;
  const getFilterOptions = () => {
    const selectedFilter = filters.filter((item) => {
      return item.value === values.filter;
    })[0];
    const { comparisonType, type } = selectedFilter;
    if (type === 'product') {
      switch (comparisonType) {
        case 'string':
          return [
            { label: 'contains', value: 's===' },
            { label: 'does not contain', value: 's!==' },
            { label: 'is empty', value: 's!' },
          ];
        case 'number':
          return [
                  { label: 'is equal to', value: 'n===' },
                  { label: 'is not equal to', value:'n!=='},
                  { label: 'is less than', value: 'n>' },
                  { label: 'is greater than', value: 'n<' },
                ];
        case 'date':
          return [
            { label: 'is equal to', value: 'd===' },
            {label: 'is not equal to', value:'d!=='},
            { label: 'is less than', value: 'd>' },
            { label: 'is greater than', value: 'd<' },
          ];
        default:
          return [];
      }
    } else if (type === 'variant') {
      switch (comparisonType) {
        case 'string':
          return [
            { label: 'of all variants contains', value: 's===' },
            { label: 'of all variants does not contain', value: 's!==' },
            { label: 'of all variants is empty', value: 's!' },
          ];
        case 'number':
          return [
                  { label: 'of all variants is equal to', value: 'n===' },
                  { label: 'of all variants is not equal to', value:'n!=='},
                  { label: 'of all variants is less than', value: 'n>' },
                  { label: 'of all variants is greater than', value: 'n<' },
                ];
        case 'date':
          return [
            { label: 'of all variants is equal to', value: 'd===' },
            { label: 'of all variants is not equal to', value:'d!=='},
            { label: 'of all variants is less than', value: 'd>' },
            { label: 'of all variants is greater than', value: 'd<' },
          ];
        default:
          return [];
      }
    } else {
      return [];
    }
  };
  return (
    <div>
      <div style={styles.step}>Step1: Filter Products</div>
      <Card sectioned>
        <div style={{ display: 'flex' }}>
          <div style={styles.formItem}>
            <Select
              key={'filter'}
              name="filter"
              options={filters.filter((item) => item.type === "product")}
              onChange={(value) => {
                setFormValues({
                  ...values,
                  filter: value,
                });
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
            {formSubmit === true && isEmpty(values.filterValue) && (
              <div style={{ color: 'red' }}>Please provide a value</div>
            )}
          </div>
          <div>
            <Button
              submit
              primary
              onClick={() => fetchProducts()}
              disabled={false}
            >
              Apply
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

const styles = {
  formItem: {
    marginRight: 15,
    minWidth: 200,
  },
  step: {
    margin: 15,
  },
};
export default Step1;
