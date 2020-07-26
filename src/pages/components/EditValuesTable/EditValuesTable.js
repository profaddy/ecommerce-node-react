import React, { useState } from 'react';
import get from 'lodash/get';
import { Pagination } from '@shopify/polaris';

import './styles.css';
const ProductTable = (props) => {
  const { products } = props;

  const initialPaginationParams = {
    data: products.slice(0, 10),
    pageCount: Math.ceil(products.length / 10),
    perPage: 10,
    selected: 0,
  };
  const [paginationParams, setPaginationParams] = useState(
    initialPaginationParams
  );
  const { pageCount, perPage, data, selected } = paginationParams;
  const handlPageClick = (action) => {
    let selectedPage = action === 'next' ? selected + 1 : selected - 1;
    const offset = Math.ceil(selectedPage * perPage);
    loadData(offset, selectedPage);
  };
  const loadData = (offset, selected) => {
    const updatedProducts = products.slice(offset, offset + perPage);
    setPaginationParams({
      ...paginationParams,
      data: updatedProducts,
      pageCount: Math.ceil(products.length / perPage),
      selected: selected,
    });
  };
  return (
    <>
      <div style={styles.tableWrapper}>
        <div style={styles.headerWrapper}>
          <div style={styles.columnItem}>Edit Type</div>
          <div style={styles.columnItem}>Edit Option</div>
          <div style={styles.columnItem}>Edit Value</div>
          <div style={{ ...styles.columnItem, flex: 3 }}>Variants Filter</div>
        </div>
        <div style={styles.listWrapper}>
          {data.map((product) => {
            return (
              <div style={styles.rowWrap}>
                <div style={styles.columnItem}>{product.type}</div>
                <div style={styles.columnItem}>{product.editOption}</div>
                <div style={styles.columnItem}>{product.editValue}</div>
                <div
                  style={{
                    ...styles.columnItem,
                    flex: 3,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={styles.variantHeaderWrapper}>
                    <div style={styles.variantItem}>Filter By</div>
                    <div style={styles.variantItem}>Filter Action</div>
                    <div style={styles.variantItem}>Filter Value</div>
                  </div>
                  <div style={styles.rowWrap}>
                    <div style={styles.variantItem}>
                      {product.variantFilterOptions.filter}
                    </div>
                    <div style={styles.variantItem}>
                      {product.variantFilterOptions.filterAction}
                    </div>
                    <div style={styles.variantItem}>
                      {product.variantFilterOptions.filterValue}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* <div style={styles.pagination}>
        <Pagination
          label={`Page ${selected + 1} of ${pageCount}`}
          hasPrevious={selected + 1 !== 1}
          onPrevious={() => {
            handlPageClick('previous');
          }}
          hasNext={selected + 1 !== 100}
          onNext={() => {
            handlPageClick('next');
          }}
        />
      </div> */}
    </>
  );
};

const styles = {
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    padding: 15,
  },
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
    overflowY: 'scroll',
    maxHeight: 300,
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
