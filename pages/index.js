import React, { useEffect, useState } from 'react';
import Dashboard from "../src/pages/dashboard/Dashboard.js";
import TabComponent from '../src/pages/components/TabComponent/TabComponent.js';
import Pricing from "../src/pages/Pricing/Pricing.js";
import ContactForm from "../src/pages/Contanctus/Contactus.js"
const Index = (props) => {
   
  const tabs = [
    {
      id: 'Dashboard',
      content:  "Dashboard" ,
      accessibilityLabel: 'Dashboard',
      panelID: 'dashboard',
      children:<Dashboard />
    },
    {
      id: 'Instructions',
      content: 'Instariction',
      panelID: 'instructions',
      children:<>Instructions will go here</>
    },
    {
      id: 'Pricing',
      content: 'Pricing',
      panelID: 'pricing',
      children:<Pricing />
    },
    {
      id: 'Contact us',
      content: 'Contact us',
      accessibilityLabel: 'contact-us',
      panelID: 'contact-us',
      children:<ContactForm />
    },
  ];
  return (
    <>
      <TabComponent tabs={tabs}/>
    </>
  );
};
export default Index;
