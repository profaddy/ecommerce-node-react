import React from 'react';
import ProductTable from '../../components/ProductTable/ProductTable';
import { Card } from '@shopify/polaris';
import { isEmpty } from 'lodash';
const Step2 = (props) => {
  const { products } = props;
  return (
    <div>
      <div style={styles.step}>Step2: Select Products</div>
      <Card>
        {isEmpty(products) && <>Apply filter to preview products</>}
        {!isEmpty(products) && <ProductTable products={products} />}
      </Card>
    </div>
  );
};

const styles = {
  step: {
    margin: 15,
  },
};
export default Step2;
