import React, { useState } from 'react';
import get from 'lodash/get';
import { Icon } from '@shopify/polaris';
import ReactPaginate from 'react-paginate';
import {
  ArrowRightMinor,ArrowLeftMinor
} from '@shopify/polaris-icons';

import "./styles.css";
// const initialPaginationParams = {
//   data:products.slice(),
//   pageCount:products
// }
const ProductTable = (props) => {
  const { products } = props;

  const initialPaginationParams = {
    data:products.slice(0,2),
    pageCount:5,
    perPage:2
  }
  const [paginationParams,setPaginationParams] = useState(initialPaginationParams);
  const {pageCount,perPage,data} = paginationParams;
  const handlePageClick = (data) => {
    let selected = data.selected;
    let offset = Math.ceil((selected) * perPage);
    loadData(offset);
  }
  const loadData = (offset) => {
    const updatedProducts = products.slice(offset,offset + (perPage));
    setPaginationParams({...paginationParams,data:updatedProducts,pageCount:products.length/perPage})
  }
  return (
    <>
      <div style={styles.tableWrapper}>
        <div style={styles.headerWrapper}>
          <div style={styles.columnItem}>Avatar</div>
          <div style={styles.columnItem}>Title</div>
          <div style={styles.columnItem}>Product Type</div>
          <div style={styles.columnItem}>Vendors</div>
          <div style={{ ...styles.columnItem, flex: 3 }}>Variants</div>
        </div>
        <div style={styles.listWrapper}>
          {data.map((product) => {
            return (
              <div style={styles.rowWrap}>
                <div style={styles.columnItem}>
                  <img
                    src={get(product, 'images[0].src') || null}
                    width={50}
                    height={50}
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
                  </div>
                  {product.variants.map((variant) => {
                    return (
                      <div style={styles.rowWrap}>
                        <div style={styles.variantItem}>{variant.title}</div>
                        <div style={styles.variantItem}>{variant.price}</div>
                        <div style={styles.variantItem}>
                          {variant.compare_at_price}
                        </div>
                        <div style={styles.variantItem}>
                          {variant.weight} {variant.weight_unit}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <ReactPaginate
          previousLabel={<><Icon
            source={ArrowLeftMinor} /></>
            }
          nextLabel={<><Icon
          source={ArrowRightMinor} /></>}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={'pagination'}
          subContainerClassName={'pages pagination'}
          activeClassName={'active'}
        />
    </>
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
    overflow: 'scroll',
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
