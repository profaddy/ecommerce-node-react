import React from 'react';
import {Toast,AppProvider} from '@shopify/polaris';
import Cookies from "js-cookie";



 const ToastWrapper = ({active = false,message="",error=false,onDismiss=() => {console.log("not configured")}}) => {
  const toastMarkup = active ? (
    <Toast content={message} error={error} onDismiss={onDismiss}/>
  ) : null;
  // const {
  //   SHOPIFY_API_SECRET_KEY,
  //   SHOPIFY_API_KEY,
  // } = process.env;
  return (
    <AppProvider apiKey={"8ccecd044c5104888621a0fb91f4c5ce"} i18n={{}} shopOrigin={Cookies.get("shopOrigin")}>
    {toastMarkup}
  </AppProvider>
  );
}

export default ToastWrapper;