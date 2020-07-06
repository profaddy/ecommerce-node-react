import React, { useEffect, useState } from 'react';
import Dashboard from "../src/pages/dashboard/Dashboard.js";
import TabComponent from '../src/pages/components/TabComponent/TabComponent.js';
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
      id: 'About us',
      content: 'About us',
      accessibilityLabel: 'about-us',
      panelID: 'about-us',
      children:<>Vowel web</>
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
      children:<>Pricing will go here</>
    },
  ];
  return (
    <>
    <TabComponent tabs={tabs}/>
      </>
  );
};
const styles = {
}
export default Index;
