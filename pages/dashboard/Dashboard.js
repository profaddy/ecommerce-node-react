import React from 'react';
import EditCard from '../../components/EditCard/EditCard';
import editOptions from "./EditOptions";
import styles from "./styles";

const Dashboard = (props) => {
  return (
    <div style={styles.container}>
<div style={styles.header}>
    Start Editing Products
</div>
      <div style={styles.eidtCardContainer}>
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
  );
};

export default Dashboard;
