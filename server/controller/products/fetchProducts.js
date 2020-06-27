const { isEmpty } = require('lodash');
const Shop = require('../../models/Shops.js');

const fetchProducts = async (ctx) => {
  try {
    const { filter, filterType, filterAction, filterValue } = ctx.query;
    const filterOptions = {
      filterValue,
      filterAction,
      filter,
    };

    const shopDetails = await Shop.find({
      shopOrigin: ctx.cookies.get('shopOrigin'),
    }).exec();
    const response = await fetch(
      `https://${ctx.cookies.get(
        'shopOrigin'
      )}/admin/api/2020-04/products.json`,
      {
        headers: {
          'X-Shopify-Access-Token': shopDetails[0].accessToken,
        },
      }
    );
    const jsonResponse = await response.json();
    if (response.status !== 200) {
      throw { status: response.status, msg: response.statusText };
    }
    const { products } = jsonResponse;
    let filteredProducts;
    if (filterOptions.filter === 'allProducts') {
      filteredProducts = products;
    } else if (filterType === 'product') {
      filteredProducts = filterByProduct(products, filterOptions);
    } else if (filterType === 'variant') {
      filteredProducts = filterByVariant(products, filterOptions);
    } else {
      filteredProducts = products;
    }
    ctx.status = response.status;
    ctx.body = {
      status: true,
      products: filteredProducts,
    };
  } catch (err) {
    ctx.status = err.status;
    ctx.body = {
      status: false,
      msg: err.msg,
    };
  }
};

module.exports = fetchProducts;

//helpers
const filterByProduct = (products, filterOptions) => {
  const { filter, filterAction } = filterOptions;
  const filteredProducts = products.filter((product) => {
    return shouldAdd(product, filterOptions);
  });
  return filteredProducts;
};

const filterByVariant = (products, filterOptions) => {
  const filteredProducts = products.reduce((acc, product) => {
    const { variants } = product;
    const filteredVariants = variants.filter((variant) =>
      shouldAdd(variant, filterOptions)
    );
    if (filteredVariants.length === variants.length) {
      acc.push(product);
    }
    return acc;
  }, []);
  return filteredProducts;
};

const shouldAdd = (product, filterOptions) => {
  const { filter, filterAction, filterValue } = filterOptions;
  switch (filterAction) {
    case 'n>':
      return Number(product[`${filter}`]) === Number(filterValue);
    case 'n!==':
      return !(Number(product[`${filter}`]) === Number(filterValue));
    case 'n===':
      return Number(product[`${filter}`]) === Number(filterValue);
    case 's===':
      return product[`${filter}`].indexOf(filterValue) !== -1;
    case 's!==':
      return !(product[`${filter}`].indexOf(filterValue) !== -1);
    case 's!':
      return isEmpty(product[`${filter}`]);
    default:
      return false;
  }
};
