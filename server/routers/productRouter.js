'use strict';
// import Router from 'koa-router';
const Router = require('koa-router');
const { isEmpty } = require('lodash');
// const router = new Router();
const router = new Router({ prefix: '/api/v1/products' });

router.get('/', async (ctx) => {
  try {
    console.log('products', ctx.query);
    const { filter, filterType, filterAction, filterValue } = ctx.query;
    const filterOptions = {
      filterValue,
      filterAction,
      filter,
    };

    const response = await fetch(
      `https://${ctx.cookies.get(
        'shopOrigin'
      )}/admin/api/2020-04/products.json`,
      {
        headers: {
          'X-Shopify-Access-Token': ctx.cookies.get('accessToken'),
        },
      }
    );
    const { products } = await response.json();
    console.log(products, filterOptions, 'main call');
    let filteredProducts;
    if(filterOptions.filter === "allProducts"){
      filteredProducts = products
    }else if (filterType === 'product') {
      filteredProducts = filterByProduct(products, filterOptions);
    } else if (filterType === 'variant') {
      filteredProducts = filterByVariant(products, filterOptions);
    } else {
      filteredProducts = products;
    }

    ctx.body = {
      status: 'success',
      products: filteredProducts,
    };
  } catch (err) {
    console.log(err);
  }
});
router.put('/', async (ctx) => {
  try {
    console.log(ctx.request.body, 'ctx response');
    const { editOption, editValue, variants,variantFilterOptions } = ctx.request.body;
    let filteredVariants = variants
    if(!(isEmpty(variantFilterOptions.filter) || variantFilterOptions.filter === "allVariants")){
       filteredVariants = variants.filter((variant) => shouldAdd(variant,variantFilterOptions));
    }
    console.log(filteredVariants,"filteredVariants");
    variants.forEach(async (variant) => {
      const updatedPrice = getUpdatedPrice(
        editOption,
        Number(variant.price),
        Number(editValue)
      );
      console.log(updatedPrice, 'updatedPrice>>');
      const url = `https://${ctx.cookies.get(
        'shopOrigin'
      )}/admin/api/2020-04/variants/${variant.id}.json`;
      const payload = {
        variant: {
          id: variant.id,
          price: `${updatedPrice}`,
        },
      };
      const response = await fetch(url, {
        headers: {
          'Content-type': 'application/json; charset=UTF-8', // Indicates the content
          'X-Shopify-Access-Token': ctx.cookies.get('accessToken'),
        },
        method: 'put',
        body: JSON.stringify(payload),
      });
      const resp = await response.json();
      console.log(`reuqest completed for ${variant.title}`, resp);
    });
    const result = [];
    ctx.body = {
      status: 'success',
      data: result,
    };
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;

//helpers
const getUpdatedPrice = (editOption, currentPrice, editValue) => {
  console.log(editOption, 'editOption');
  switch (editOption) {
    case 'changeToCustomValue':
      return editValue;
    case 'addPriceByAmount':
      return currentPrice + editValue;
    case 'addPriceByPercentage':
      const offsetToBeAdded = (currentPrice * editValue) / 100;
      return currentPrice + offsetToBeAdded;
    default:
      return editValue;
  }
};

const filterByProduct = (products, filterOptions) => {
  console.log(products, filterOptions, 'filterByProduct');

  const { filter, filterAction } = filterOptions;
  const filteredProducts = products.filter((product) => {
    return shouldAdd(product, filterOptions);
  });
  return filteredProducts;
};

const filterByVariant = (products, filterOptions) => {
  console.log(products, filterOptions, 'filterByProduct');
  const filteredProducts = products.reduce((acc, product) => {
    const { variants } = product;
    const filteredVariants = variants.filter((variant) =>
      shouldAdd(variant, filterOptions)
    );
    console.log(filteredVariants, 'filteredVariants');
    if (filteredVariants.length === variants.length) {
      console.log('acc', acc, 'product', product);
      acc.push(product);
    }
    return acc;
  }, []);
  console.log(filteredProducts, 'filteredProducts');
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