import React, { useState, useEffect } from 'react';
import { editOptions } from './EditOptions';
import { styles } from './styles';
import InfoCard from '../components/InfoCard/InfoCard.js';
import EditCard from '../components/EditCard/EditCard';
import api from '../../../utils/api';

const Dashboard = (props) => {
  const [completedTasks, setCompletedTasks] = useState([]);
  useEffect(() => {
    getCompletedTasks();
  }, [completedTasks.length]);

  const getCompletedTasks = async () => {
    const { data } = await api.get('cTasks');
    console.log(data.data, 'response');
    setCompletedTasks(data.data.ctasks);
  };
  return (
    <div style={styles.container}>
      <div style={styles.header}>Account Overview</div>
      <div style={styles.eidtCardContainer}>
        <div style={styles.editCardItem}>
          <InfoCard count={completedTasks && completedTasks.length} />
        </div>
      </div>
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
  );
};

export default Dashboard;
