import React, { useEffect, useState, useCallback } from 'react';
import PageLayout from '../components/PageLayout/PageLayout.js';
import api from '../../../utils/api.js';
import ToastWrapper from '../components/ToastWrapper/ToastWrapper.js';
import TaskState from '../@enums/TaskState.js';
import isEmpty from 'lodash/isEmpty';
import { Spinner } from '@shopify/polaris';
import Collapsible from '../components/Collapsible/Collapsible.js';
import prettyDate from '../../../utils/prettyDate';
import groupBy from 'lodash/groupBy';
import omit from 'lodash/omit';
import Step2 from '../PriceEdit/steps/step2';
import EditValuesTable from '../components/EditValuesTable/EditValuesTable.js';

const defaultToastOptions = {
  active: false,
  message: '',
  error: false,
};

const ManageTasks = (props) => {
  const [completedTasks, setCompletedTasks] = useState([]);
  useEffect(() => {
    getCompletedTasks();
  }, [completedTasks.length]);
  const [taskState, setTaskState] = useState(TaskState.EMPTY);
  const [toast, setToast] = useState(defaultToastOptions);
  const [active, setActive] = useState(true);

  const handleToggle = useCallback(() => setActive((active) => !active), []);

  const getCompletedTasks = async () => {
    try {
      setTaskState(TaskState.LOADING);
      const { data } = await api.get('qTasks');
      console.log(data.data, 'response');
      if (isEmpty(data.data.qtasks)) {
        setTaskState(TaskState.EMPTY);
      } else {
        setTaskState(TaskState.SUCCESS);
      }

      const convertAOBToArray = (object) => {
        const resultArray = Object.keys(object).map((key) => {
          return object[key];
        });
        return resultArray;
      };

      const mergedArray = data.data.qtasks.reduce((acc, item, index) => {
        const groupVariantsByproduct = groupBy(item.variants, 'product_id');
        const productArray = convertAOBToArray(groupVariantsByproduct);
        console.log(productArray, 'productArray');
        const newProduct = productArray.reduce((a, p, i) => {
          console.log(item, 'item');
          const product = {
            ...p[0].product,
            variants: groupVariantsByproduct[p[0].product_id],
          };
          a.push(product);
          return a;
        }, []);
        console.log(newProduct, 'newProduct');
        acc.push({ ...omit(item, ['variants']), products: newProduct });
        return acc;
      }, []);
      console.log(mergedArray, 'mergedArray');
      const finalArray = mergedArray.map((item) => {
        return item[0];
      });
      setCompletedTasks(mergedArray);
    } catch (error) {
      console.log(error, 'error');
      setTaskState(TaskState.ERROR);
    }
  };
  return (
    <PageLayout title="Tasks">
      {taskState === TaskState.LOADING && (
        <div style={styles.loader}>
          <Spinner
            accessibilityLabel="Fetching Tasks"
            size="large"
            color="teal"
          >
            Fetching Taks . . .
          </Spinner>
        </div>
      )}
      {taskState === TaskState.ERROR && (
        <div style={{ dispay: 'flex' }}>
          <div style={styles.error}>
            Error occured while fetching tasks,Kindly contact the app admin
          </div>
        </div>
      )}
      {taskState === TaskState.EMPTY && (
        <div style={styles.loader}>No tasks to display</div>
      )}
      {taskState === TaskState.SUCCESS && (
        <>
          <div key={new Date()} style={styles.eidtCardContainer}>
            {completedTasks.map((item, index) => {
              console.log(item, 'completedTasks');
              return (
                <Collapsible
                  handleToggle={handleToggle}
                  active={active}
                  id={index}
                  title={prettyDate(item.created_at)}
                >
                  <div style={styles.taskWrapper}>
                    <div style={styles.taskItem}></div>
                    <div style={styles.step}>Edit Options</div>
                    <div style={{ width: '100%' }}>
                      <EditValuesTable
                        products={[item]}
                        productState={'success'}
                        showTitle={false}
                      />
                    </div>
                    <div style={styles.step}>Selected Products for update</div>
                    <div style={{ width: '100%' }}>
                      <Step2
                        products={item.products}
                        productState={'success'}
                        showTitle={false}
                      />
                    </div>
                    {/* <div style={styles.taskItem}>{item.}</div> */}
                  </div>
                </Collapsible>
              );
            })}
          </div>
          <ToastWrapper
            active={toast.active}
            message={toast.message}
            error={toast.error}
            onDismiss={() => setToast({ defaultToastOptions })}
          />
        </>
      )}
    </PageLayout>
  );
};

export default ManageTasks;
const styles = {
  eidtCardContainer: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  editCardItem: {
    margin: '15px 15px 15px 0px',
    minWidth: '31%',
  },
  loader: {
    textAlign: 'center',
  },
  taskWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  taskItem: {
    marginRight: 10,
  },
  error: {
    textAlign: 'center',
    color: 'red',
  },
  step: {
    fontWeight: 700,
    width: '100%',
    display: 'flex',
    margin: '10px auto',
  },
};
