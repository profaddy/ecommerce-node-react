import React ,{useState}from 'react';
import PageLayout from '../components/PageLayout/PageLayout.js';
import BillingCard from '../components/BillingCard/BillingCard.js';
import api from "../../../utils/api.js";
const Pricing = (props) => {
  const [formState,setFormState] = useState("success")
  const pricingOptions = [
    {
      price: '4.99$',
      name: 'Basic Plan',
      functionalities: [
        { name: 'Edit all product details', accessible: true },
        { name: '5 Bulk actions', accessible: true },
        { name: '30 day backup', accessible: true },
        { name: 'Schedule Products', accessible: false },
      ],
    },
  ];
  const onSelectPlan = (plan) => {
    console.log(plan, 'selected price');
    api.post("billing",{plan:plan});
  };
  return (
    <PageLayout title="Select Plan">
      <div key={new Date()} style={styles.eidtCardContainer}>
        {pricingOptions.map((plan) => {
          return (
            <div style={styles.editCardItem}>
              <BillingCard plan={plan} onSelectPlan={onSelectPlan} />
            </div>
          );
        })}
      </div>
    </PageLayout>
  );
};

export default Pricing;
const styles = {
  eidtCardContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  editCardItem: {
    margin: '15px 15px 15px 0px',
    minWidth: '31%',
  },
};
