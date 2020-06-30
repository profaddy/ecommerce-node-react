import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import isEmpty from 'lodash/isEmpty';
import Dashboard from "../src/pages/dashboard/Dashboard.js";
import TabComponent from '../src/pages/components/TabComponent/TabComponent.js';
import { Card } from '@shopify/polaris';
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
    // {
    //   id: 'repeat-customers',
    //   content: 'Repeat customers',
    //   panelID: 'repeat-customers-content',
    // },
    // {
    //   id: 'prospects',
    //   content: 'Prospects',
    //   panelID: 'prospects-content',
    // },
  ];
  return (
    <>
    {/* <button onClick={() => {Router.push("/")}}>Home</button> */}
    <TabComponent tabs={tabs}/>
    </>
  );
};
const styles = {
}
export default Index;
