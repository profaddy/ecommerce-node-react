import React, { useState } from 'react';
import filters from './filters';
import { Formik, Form, Field } from 'formik';
import { Select, Card, Button, TextField } from '@shopify/polaris';
import Router from 'next/router';

const PriceEdit = () => {
  const [values, setFormValue] = useState('Jaded Pixel');

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
      {/* {filters.map((filter) => <>filter.name</>)} */}
      <div>
        <Formik
          initialValues={{ filter: 'title', filterValue: '' }}
          onSubmit={console.log}
        >
          {({ values, dirty, setFieldValue }) => {
            console.log(values, 'values');
            return (
              <>
                <Form>
                  <Card sectioned>
                    {/* <FormLayout> */}
                    <div style={{ display: 'flex' }}>
                      {/* <TextField label="Title" name="title" /> */}
                      {/* <FormLayout.Group> */}
                      {/* <Select label="Time" name="time" options={filters} /> */}
                      <div style={styles.formItem}>
                        <Field name="filter" component={'select'}>
                          {({
                            field, // { name, value, onChange, onBlur }
                            form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                            meta,
                            ...props
                          }) => (
                            <div style={styles.formItem}>
                              <Select
                                key={field.name}
                                {...field}
                                options={filters}
                                onChange={(value) => {
                                  console.log(field.name, value);
                                  setFieldValue(field.name, value);
                                }}
                              />
                              {meta.touched && meta.error && (
                                <div className="error">{meta.error}</div>
                              )}
                            </div>
                          )}
                        </Field>
                      </div>
                      <div style={styles.formItem}>
                        <Field name="filterValue">
                          {({
                            field, // { name, value, onChange, onBlur }
                            form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                            meta,
                            ...props
                          }) => (
                            <div>
                              <TextField
                                {...field}
                                onChange={(value) => console.log(value)}
                              />
                              {meta.touched && meta.error && (
                                <div className="error">{meta.error}</div>
                              )}
                            </div>
                          )}
                        </Field>
                      </div>
                      <div>
                        <Button submit primary disabled={!dirty}>
                          Save
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Form>
                <br />
                <Card subdued sectioned title="Internal Form Values">
                  <code>{JSON.stringify(values, null, 2)}</code>
                </Card>
              </>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

const styles = {
  formContainer: {
    display: 'flex',
  },
  formItem: {
    marginRight: 15,
  },
};

export default PriceEdit;
