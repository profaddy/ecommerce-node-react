import React from 'react';
import isEmpty from 'lodash/isEmpty';
import filters from '../filters';

import { Select, Card, Button, TextField } from '@shopify/polaris';
const Step1 = (props) => {
  const { values, fetchProducts, formSubmit, setFormValues } = props;
  const getFilterOptions = () => {
    switch (values.filter) {
      case 'price':
        return [
          { label: 'of all variants equal to', value: '===' },
          { label: 'of all variants less than', value: '>' },
          { label: 'of all variants greater than', value: '<' },
        ];
      case 'description':
        return [
          { label: 'contains', value: '===' },
          { label: 'does not contain', value: '!==' },
          { label: 'is empty', value: '!' },
        ];
      case 'title':
        return [
          { label: 'contains', value: '===' },
          { label: 'does not contain', value: '!==' },
          { label: 'is empty', value: '!' },
        ];
      default:
        return [
            { label: 'contains', value: '===' },
            { label: 'does not contain', value: '!==' },
            { label: 'is empty', value: '!' },
          ];
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
              options={filters}
              onChange={(value) => {
                setFormValues({
                  ...values,
                  filter: value,
                  filterAction: getFilterOptions(),
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
export default Step1;
