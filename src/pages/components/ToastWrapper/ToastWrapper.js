import React, from 'react';
import {Toast} from '@shopify/polaris';

 const ToastWrapper = ({active = false,message="",onDismiss=() => {console.log("not configured")}}) => {
  const toastMarkup = active ? (
    <Toast content={message} error onDismiss={onDismiss} />
  ) : null;

  return (
      <>
          {toastMarkup}
          </>
  );
}

export default ToastWrapper;