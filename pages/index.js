import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import isEmpty from 'lodash/isEmpty';
import Dashboard from "../src/pages/dashboard/Dashboard.js"
import { Card } from '@shopify/polaris';
const Index = (props) => {
  return (
    <>
    <button onClick={() => {Router.push("/")}}>Home</button>
      <Dashboard />
    </>
  );
};
const styles = {
}
export default Index;
