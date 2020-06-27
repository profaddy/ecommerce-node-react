const asyncForEach = require('../../utils/asyncForEach.js');
const isEmpty = require('lodash/isEmpty');
const Shop = require('../../models/Shops.js');

const updateProduts = async (ctx) => {
  try {
    const {
      editOption,
      editValue,
      variants,
      variantFilterOptions,
    } = ctx.request.body;
    const shopOrigin = ctx.session.shop;
    const shopDetails = await Shop.find({
      shopOrigin: shopOrigin,
    }).exec();
    let filteredVariants = variants;
    if (
      !(
        isEmpty(variantFilterOptions.filter) ||
        variantFilterOptions.filter === 'allVariants'
      )
    ) {
      filteredVariants = variants.filter((variant) =>
        shouldAdd(variant, variantFilterOptions)
      );
    }
    async function updateFiltreedVariants() {
      await asyncForEach(filteredVariants, async (variant) => {
        console.log(variant.title, 'title initial');
        const updatedPrice = getUpdatedPrice(
          editOption,
          Number(variant.price),
          Number(editValue)
        );
        const url = `https://${shopOrigin}/admin/api/2020-04/variants/${variant.id}.json`;
        const payload = {
          variant: {
            id: variant.id,
            price: `${updatedPrice}`,
          },
        };
        const response = await fetch(url, {
          headers: {
            'Content-type': 'application/json; charset=UTF-8', // Indicates the content
            'X-Shopify-Access-Token': shopDetails[0].accessToken,
          },
          method: 'put',
          body: JSON.stringify(payload),
        });
        let errors = [];
        
        // const resp = await response.json();
        // console.log(response.status);
        if (response.status !== 200) {
          errors.push({
            status: response.status,
            msg: response.statusText,
            data: variant,
          });
        }
        console.log(`reuqest completed for ${variant.title}`,"errors",errors);
      });
    }
    updateFiltreedVariants();
    // if (!isEmpty(errors)) {
    //   throw errors;
    // }
    const result = [];
    ctx.status = response.status;
    ctx.body = {
      status: true,
      data: result,
    };
  } catch (err) {
      console.log(err,"err")
    ctx.status = 400;
    ctx.body = {
      status: false,
      errors: err.msg,
    };
  }
};

module.exports = updateProduts;
//helpers
const getUpdatedPrice = (editOption, currentPrice, editValue) => {
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
