import React, { useState } from 'react';
import get from 'lodash/get';

const ProductTable = (props) => {
  const { products } = props;
  return (
    <div style={styles.tableWrapper}>
      <div style={styles.headerWrapper}>
        <div style={styles.columnItem}>Avatar</div>
        <div style={styles.columnItem}>Title</div>
        <div style={styles.columnItem}>Product Type</div>
        <div style={styles.columnItem}>Vendors</div>
        <div style={{ ...styles.columnItem, flex: 3 }}>Variants</div>
      </div>
      <div style={styles.listWrapper}>
        {products.map((product) => {
          return (
            <div style={styles.rowWrap}>
              <div style={styles.columnItem}>
                <img
                  src={get(product, 'images.src') || null}
                  width={20}
                  height={20}
                />
              </div>
              <div style={styles.columnItem}>{product.title}</div>
              <div style={styles.columnItem}>{product.type}</div>
              <div style={styles.columnItem}>{product.vendor}</div>
              <div
                style={{
                  ...styles.columnItem,
                  flex: 3,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={styles.variantHeaderWrapper}>
                  <div style={styles.variantItem}>options|size</div>
                  <div style={styles.variantItem}>price</div>
                  <div style={styles.variantItem}>compared price</div>
                  <div style={styles.variantItem}>weight</div>
                  <div style={styles.variantItem}>price</div>
                </div>
                {product.variants.map((variant) => {
                  return (
                    <div style={styles.rowWrap}>
                      <div style={styles.variantItem}>grey</div>
                  <div style={styles.variantItem}>{variant.price}</div>
                      <div style={styles.variantItem}>50</div>
                      <div style={styles.variantItem}>20kg</div>
                      <div style={styles.variantItem}>20</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  tableWrapper: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    overflowWrap: 'break-word',
  },
  rowWrap: {
    display: 'flex',
  },
  headerWrapper: {
    display: 'flex',
    borderBottom: '1px solid lightgray',
    padding: 20,
  },
  variantHeaderWrapper: {
    display: 'flex',
    borderBottom: '1px solid lightgray',
  },
  listWrapper: {
    backgroundColor: '#FAFBFC',
    padding: 20,
  },
  columnItem: {
    flex: 1,
    marginBottom: 10,
    marginRight: 10,
    overflow: 'auto',
    // width:100,
  },
  variantItem: {
    marginRight: 10,
    marginBottom: 10,
    flex: 1,
    minWidth: 100,
  },
};
export default ProductTable;
