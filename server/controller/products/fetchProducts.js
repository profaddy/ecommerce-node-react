const { isEmpty } = require('lodash');
const Shop = require('../../models/Shops.js');
const moment = require('moment');

const fetchProducts = async (ctx) => {
  try {
    const { filter, filterType, filterAction, filterValue } = ctx.query;
    const filterOptions = {
      filterValue,
      filterAction,
      filter,
    };
    const shopOrigin = ctx.session.shop;
    const shopDetails = await Shop.find({
      shopOrigin: shopOrigin,
    }).exec();
    const response = await fetch(
      `https://${shopOrigin}/admin/api/2020-04/products.json`,
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
  try{
  const { filter, filterAction } = filterOptions;
  console.log(filterOptions,"options in filterby product")

  const filteredProducts = products.filter((product) => {
    return shouldAdd(product, filterOptions);
  });
  return filteredProducts;
}catch(error){
  console.log(error);
}
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
  console.log(filterValue,"options in should add")

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
    case 'd===':
      const parsedFilterValue = JSON.parse(filterValue);
      const start_date = moment(parsedFilterValue.start,"YYYY-MM-DDTHH:mm:ss.sssZ").utc().format("YYYY-MM-DD");
      const end_date = moment(parsedFilterValue.end,"YYYY-MM-DDTHH:mm:ss.sssZ").utc().format("YYYY-MM-DD");
      // const start_date = filterValue.start.split("T")[0];
      // const end_date = filterValue.end.split("T")[0];
      const productDate = moment(product[`${filter}`]).utc().format("YYYY-MM-DD")

      const isDateInRange = moment(product[`${filter}`]).isBetween(start_date,end_date) || moment(productDate).isSame(start_date) || moment(productDate).isSame(end_date);
      console.log(start_date,end_date,isDateInRange,product[`${filter}`],"dates");
      return isDateInRange;
      // const compare_date = moment(product[`${filter}`])
      // const end_date = moment().format()
      // console.log(product,product[`${filter}`],"product in date selection",moment(product[`${filterValue.start}`]),moment(product[`${filterValue.end}`]),moment(product[`${filter}`]))
        // const isStartDateLesser = moment(product[`${filter}`]).format
        //   .isAfter(moment(filterValue.start));
        // const isEndDateGreater = moment(product[`${filter}`])
        //   .isBefore(moment(filterValue.end));
        // return isStartDateLesser && isEndDateGreater;
    default:
      return false;
  }
};
