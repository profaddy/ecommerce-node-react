import React from 'react';
import { Card, Collapsible, Stack, Icon } from '@shopify/polaris';
import { SelectMinor } from '@shopify/polaris-icons';

export const CollapsibleComponent = (props) => {
  const { active, children, id, title } = props;
  const onCollapse = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const x = document.getElementById(`basic-collapsible-${id}`);
    if (x !== null) {
      if (x.style.display === 'block') {
        x.style.display = 'none';
      } else {
        x.style.display = 'block';
      }
    }
  };
  return (
    <div style={styles.collapsibleWrapper}>
      <Card sectioned>
        <Stack vertical>
          <div style={styles.headerWrapper} onClick={onCollapse}>
            <div style={styles.headerTitle}>{title}</div>
            <div style={styles.headerIcon}>
              <Icon source={SelectMinor} />
            </div>
          </div>

          <Collapsible
            open={active}
            // id={`basic-collapsible-${id}`}
            transition={{ duration: '150ms', timingFunction: 'ease' }}
          >
            <div style={{ display: 'none' }} id={`basic-collapsible-${id}`}>
              {children}
            </div>
          </Collapsible>
        </Stack>
      </Card>
    </div>
  );
};

const styles = {
  collapsibleWrapper: {
    minHeight: 50,
    marginBottom: 20,
    paddingTop: 2,
    backgroundColor: '#495ABC',
    minHeight: 2,
  },
  headerWrapper: {
    display: 'flex',
    cursor: 'pointer',
  },
  progressBar: {
    marginBottom: 20,
    backgroundColor: '#495ABC',
    minHeight: 5,
  },
  headerTitle: {
    flex: 3,
  },
  headerIcon: {
    width: 20,
    height: 20,
    cursor: 'pointer',
  },
};
export default CollapsibleComponent;
