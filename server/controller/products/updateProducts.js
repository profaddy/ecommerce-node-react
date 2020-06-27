const asyncForEach = require('../../utils/asyncForEach.js');
const isEmpty = require('lodash/isEmpty');

const updateProduts = async (ctx) => {
  try {
    const {
      editOption,
      editValue,
      variants,
      variantFilterOptions,
    } = ctx.request.body;

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
        let errors = [];
        const resp = await response.json();
        if (response.status !== 200) {
          errors.push({
            status: response.status,
            msg: response.statusText,
            data: variant,
          });
        }
        console.log(`reuqest completed for ${variant.title}`);
      });
    }
    updateFiltreedVariants();
    if (!isEmpty(errors)) {
      throw errors;
    }
    const result = [];
    ctx.status = response.status;
    ctx.body = {
      status: true,
      data: result,
    };
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: false,
      errors: err,
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
