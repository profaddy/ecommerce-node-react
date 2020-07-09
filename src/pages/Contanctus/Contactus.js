import React, { useState } from 'react';
import {
  Card,
  TextField,
  FormLayout,
  Button,
  InlineError,
} from '@shopify/polaris';
import api from '../../../utils/api.js';
import { isEmpty } from 'lodash';
const initialFormValues = {
  email: '',
  name: '',
  message: '',
};

const ContactForm = (props) => {
  const [formValues, setFormValues] = useState(initialFormValues);
  const { email, name, message } = formValues;
  const [isFormSubmitted, setFormSubmitted] = useState(false);

  const isInvalid = (name) => {
    if (isFormSubmitted && isEmpty(formValues[name])) {
      return true;
    } else {
      return false;
    }
  };
  const onFormSubmit = async () => {
    const payload = {
      mailOptions: { name, email, message },
    };
    const response = await api.post('/contactus', payload);
    setFormSubmitted(true);
    console.log(response, 'resp');
  };
  return (
    <Card sectioned>
      <FormLayout>
        <TextField
          name="name"
          type="name"
          error={isInvalid('name')}
          label={'Full Name'}
          value={name}
          id="name"
          onChange={(value) => setFormValues({ ...formValues, name: value })}
        />
        {isFormSubmitted && isInvalid('name') && (
          <InlineError message={'Required'} fieldID={'name'} />
        )}
        <TextField
          name="email"
          type="email"
          error={isInvalid('email')}
          label={'Email'}
          id="email"
          value={email}
          onChange={(value) => setFormValues({ ...formValues, email: value })}
        />
        {isFormSubmitted && isInvalid('name') && (
          <InlineError message={'Required'} fieldID={'email'} />
        )}
        <TextField
          name="message"
          type="message"
          id="message"
          error={isInvalid('message')}
          label={'Desciption'}
          value={message}
          onChange={(value) => setFormValues({ ...formValues, message: value })}
          multiline
        />
        {isFormSubmitted && isInvalid('name') && (
          <InlineError message={'Required'} fieldID={'message'} />
        )}{' '}
        <Button primary onClick={onFormSubmit}>
          Submit Query
        </Button>
      </FormLayout>
    </Card>
  );
};

export default ContactForm;
