import React from 'react';
import { Card , Select, TextField} from '@shopify/polaris';

const EditOptions = [
    { label: 'Change price to', value: 'changeToCustomValue' },
    { label: 'Adjust price by amount', value: 'addPriceByAmount' },
    { label: 'Adjust price by percentage', value: 'addPriceByPercentage' },
  ];
const Step4 = (props) => {
    const {values, setFormValues} = props;
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
      <div style={styles.step}>STEP4: Select what to Edit</div>
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
      margin: "10px auto",
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
export default Step4;
