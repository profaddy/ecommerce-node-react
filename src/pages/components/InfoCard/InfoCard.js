import React from 'react';
import { Card } from '@shopify/polaris';
const InfoCard = (props) => {
  const { count } = props;
  return (
    <Card>
      <div style={styles.infoWrap}>
        <div style={styles.progressBar}></div>
        <div style={{ ...styles.infoItem, fontWeight: 700 }}>Total Edits</div>
        <div style={styles.infoItem}>{count || 'Loading. . .'}</div>
      </div>
    </Card>
  );
};

export default InfoCard;
const styles = {
  infoWrap: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 100,
  },
  progressBar: {
    marginBottom: 20,
    backgroundColor: '#495ABC',
    minHeight: 5,
  },
  infoItem: {
    marginBottom: 20,
    alignSelf: 'center',
    fontFamily: `apple-system, "BlinkMacSystemFont", "San Francisco", "Roboto", "Segoe UI", "Helvetica Neue", sans-serif`,
    fontSize: 18,
  },
};
