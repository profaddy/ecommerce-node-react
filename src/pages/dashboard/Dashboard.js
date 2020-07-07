import React from 'react';
import EditCard from '../components/EditCard/EditCard';
import { editOptions } from './EditOptions';
import { styles } from './styles';
import {Card} from "@shopify/polaris";
const Dashboard = (props) => {
  return (
    <Card>
    <div style={styles.container}>
      <div style={styles.header}>Start Editing Products</div>
      <div key={new Date()} style={styles.eidtCardContainer}>
        {editOptions.map((item) => {
          return (
            <div style={styles.editCardItem}>
              <EditCard
                cardColor={item.cardColor}
                title={item.title}
                navigationPath={item.navigationPath}
              />
            </div>
          );
        })}
      </div>
    </div>
    </Card>
  );
};

export default Dashboard;
