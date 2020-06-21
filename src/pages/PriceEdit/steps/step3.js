import React from 'react';
import isEmpty from 'lodash/isEmpty';
import filters from '../filters';
import { Select, Card, Button, TextField } from '@shopify/polaris';

const Step3 = (props) => {
  const { values, fetchProducts, formSubmit, setFormValues } = props;
  const getFilterOptions = () => {
    const selectedFilter = filters.filter((item) => {
      return ( item.type === "variant" && item.value === values.variantFilter);
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
      <div style={styles.step}> STEP3(OPTIONAL) : Select Variants to edit</div>
      <Card sectioned>
        <div style={{ display: 'flex' }}>
          <div style={styles.formItem}>
            <Select
              key={'variantFilter'}
              name="variantFilter"
              options={filters.filter((item) => item.type === "variant")}
              onChange={(value) => {
                setFormValues({
                  ...values,
                  variantFilter: value,
                });
              }}
              value={values.variantFilter}
            />
          </div>
          <div style={styles.formItem}>
            <Select
              key={'variantFilterAction'}
              name="variantFilterAction"
              options={getFilterOptions()}
              onChange={(value) => {
                setFormValues({ ...values, variantFilterAction: value });
              }}
              value={values.variantFilterAction}
            />
          </div>
          <div style={styles.formItem}>
            <TextField
              name="variantFilterValue"
              value={values.variantFilterValue}
              onChange={(value) =>
                setFormValues({ ...values, variantFilterValue: value })
              }
            />
            {formSubmit === true && isEmpty(values.variantFilterValue) && (
              <div style={{ color: 'red' }}>Please provide a value</div>
            )}
          </div>
          {/* <div>
            <Button
              submit
              primary
              onClick={() => fetchProducts()}
              disabled={false}
            >
              Apply
            </Button>
          </div> */}
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
    margin: "10px auto",
  },
};
export default Step3;
