import React,{useState,useCallback} from 'react';
import isEmpty from 'lodash/isEmpty';
import filters from '../filters';
import { Select, Card, Button, TextField ,DatePicker,Popover} from '@shopify/polaris';
// import DatePicker from '../../components/DatePicker/datepicker.js';

const Step1 = (props) => {
  const currentDate = new Date()
  const [{ month, year }, setDate] = useState({
    month: currentDate.getMonth(),
    year: currentDate.getFullYear(),
  });
  const [selectedDates, setSelectedDates] = useState({
    start: currentDate,
    end: currentDate,
  });

  const onMonthChange = useCallback(
    (month, year) => setDate({ month, year }),
    []
  );
  const [active,setActive] = useState(false);

  const onDateSelection = (value) => {
    console.log(value,"selected date");
    setSelectedDates(value);
    setFormValues({ ...values, filterValue: value })
  }
  const activator = (
    <Button fullWidth onClick={() => setActive(!active)}>
      Date picker
    </Button>
  );  
  const StringField = () => {
    return (
      <div style={styles.formItem}>
        <TextField
          name="filterValue"
          type="text"
          value={values.filterValue}
          onChange={(value) => setFormValues({ ...values, filterValue: value })}
        />
        {formSubmit === true && isEmpty(values.filterValue) && (
          <div style={{ color: 'red' }}>Please provide a value</div>
        )}
      </div>
    );
  };
  const NumberField = () => {
    return (
      <div style={styles.formItem}>
        <TextField
          name="filterValue"
          type="number"
          min="0"
          value={values.filterValue}
          onChange={(value) => setFormValues({ ...values, filterValue: value })}
        />
        {formSubmit === true && isEmpty(values.filterValue) && (
          <div style={{ color: 'red' }}>Please provide a value</div>
        )}
      </div>
    );
  };
  const DateField = () => {
    return (
      <div style={styles.formItem}>
              <Popover
        active={active}
        activator={activator}
        onClose={() => setActive(!active)}
        allowRange={true}
        sectioned
        // fullWidth
      >
        <DatePicker
          month={month}
          year={year}
          onChange={onDateSelection}
          onMonthChange={onMonthChange}
          selected={selectedDates}
          allowRange={true}
        />
        </Popover>
        {formSubmit === true && isEmpty(values.filterValue) && (
          <div style={{ color: 'red' }}>Please provide a value</div>
        )}
      </div>
    );
  };

  const { values, fetchProducts, formSubmit, setFormValues } = props;
  const getFilterOptions = (value) => {
    console.log(value, 'value');
    console.log(values.filter, 'filter value');
    const filterValue = isEmpty(value) ? values.filter : value;
    const selectedFilter = filters.filter((item) => {
      return item.value === filterValue;
    })[0];
    const { comparisonType, type } = selectedFilter;
    if (type === 'product') {
      switch (comparisonType) {
        case 'string':
          return [
            { label: 'contains', value: 's===', content: StringField },
            { label: 'does not contain', value: 's!==', content: StringField },
            { label: 'is empty', value: 's!', content: StringField },
          ];
        case 'number':
          return [
            { label: 'is equal to', value: 'n===', content: NumberField },
            { label: 'is not equal to', value: 'n!==', content: NumberField },
            { label: 'is less than', value: 'n>', content: NumberField },
            { label: 'is greater than', value: 'n<', content: NumberField },
          ];
        case 'date':
          return [
            { label: 'is equal to', value: 'd===', content: DateField },
            { label: 'is not equal to', value: 'd!==', content: DateField },
            { label: 'is less than', value: 'd>', content: DateField },
            { label: 'is greater than', value: 'd<', content: DateField },
          ];
        default:
          return [];
      }
    } else if (type === 'variant') {
      switch (comparisonType) {
        case 'string':
          return [
            {
              label: 'of all variants contains',
              value: 's===',
              content: StringField,
            },
            {
              label: 'of all variants does not contain',
              value: 's!==',
              content: StringField,
            },
            {
              label: 'of all variants is empty',
              value: 's!',
              content: StringField,
            },
          ];
        case 'number':
          return [
            {
              label: 'of all variants is equal to',
              value: 'n===',
              content: NumberField,
            },
            {
              label: 'of all variants is not equal to',
              value: 'n!==',
              content: NumberField,
            },
            {
              label: 'of all variants is less than',
              value: 'n>',
              content: NumberField,
            },
            {
              label: 'of all variants is greater than',
              value: 'n<',
              content: NumberField,
            },
          ];
        case 'date':
          return [
            {
              label: 'of all variants is equal to',
              value: 'd===',
              content: DateField,
            },
            {
              label: 'of all variants is not equal to',
              value: 'd!==',
              content: DateField,
            },
            {
              label: 'of all variants is less than',
              value: 'd>',
              content: DateField,
            },
            {
              label: 'of all variants is greater than',
              value: 'd<',
              content: DateField,
            },
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
      <div style={styles.step}>STEP1: Filter Products</div>
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
                  filterAction: getFilterOptions(value)[0].value,
                });
              }}
              value={values.filter}
            />
          </div>
          {values.filter !== 'allProducts' && (
            <>
          
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
                {values &&
                  values.filter &&
                  getFilterOptions(values.filter)[0].content()}
              </div>
              {/* <div style={styles.formItem}>
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
              </div> */}
            </>
          )}
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
    margin: '10px auto',
  },
};
export default Step1;
