const filters = [
  {
    label:"All variants",
    value:"allVariants",
    type:'variant',
    comparisonType:'none'
  },
  {
    label:"All products",
    value:"allProducts",
    type:'product',
    comparisonType:'none'
  },
    {
      label: 'title',
      value: 'title',
      type:'product',
      comparisonType:'string'
    },
    {
      label: 'vendor',
      value: 'vendor',
      type:'product',
      comparisonType:'string'
    },
    {
      label: 'created_at',
      value: 'created_at',
      type:'product',
      comparisonType:'date'
    },
    {
      label: 'pusblished_at',
      value: 'pusblished_at',
      type:'product',
      comparisonType:'date'
    },
    {
      label: 'price',
      value: 'price',
      type:'variant',
      comparisonType:'number'
    },
    {
      label: 'description',
      value: 'description',
      type:'product',
      comparisonType:'string'
    },
  ];
  
  export default filters;