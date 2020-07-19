import React, { useEffect, useState } from 'react';
import Dashboard from '../src/pages/dashboard/Dashboard.js';
import TabComponent from '../src/pages/components/TabComponent/TabComponent.js';
import Pricing from '../src/pages/Pricing/Pricing.js';
import ContactForm from '../src/pages/Contanctus/Contactus.js';
import { Frame, Spinner } from '@shopify/polaris';
import api from '../utils/api.js';

const Index = (props) => {
  const [isAuthSuccess, setAuthSuccess] = useState(false);
  useEffect(() => {
    getAuth();
  });
  const getAuth = async () => {
    try {
      const response = await api.get('test');
      console.log('auth success', response);
      const {status,data} = response.data
      if(status === "billing"){
        console.log(data,"url")
        window.parent.location.href = data;
      }
      setAuthSuccess(true);
      return response;
    } catch (error){
      console.log("error",error.response.statusText)
      console.log(error, 'error while auth');
    }
  };
  const tabs = [
    {
      id: 'Dashboard',
      content: 'Dashboard',
      accessibilityLabel: 'Dashboard',
      panelID: 'dashboard',
      children: <Dashboard config={props.config} />,
    },
    {
      id: 'Instructions',
      content: 'Instructions',
      panelID: 'instructions',
      children: <>Instructions will go here</>,
    },
    {
      id: 'Pricing',
      content: 'Pricing',
      panelID: 'pricing',
      children: <Pricing config={props.config} />,
    },
    {
      id: 'Contact us',
      content: 'Contact us',
      accessibilityLabel: 'contact-us',
      panelID: 'contact-us',
      children: <ContactForm config={props.config} />,
    },
  ];
  return (
    <Frame>
      {isAuthSuccess && <TabComponent tabs={tabs} />}
      {!isAuthSuccess && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 100,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div>
            {' '}
            <Spinner
              accessibilityLabel="Loading App ..."
              size="large"
              color="teal"
            />
          </div>
          <div>Loading App ...</div>
        </div>
      )}
    </Frame>
  );
};
export default Index;
