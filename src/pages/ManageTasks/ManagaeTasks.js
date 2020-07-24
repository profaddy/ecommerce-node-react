import React, { useEffect,useState } from 'react';
import PageLayout from '../components/PageLayout/PageLayout.js';
import api from '../../../utils/api.js';
import ToastWrapper from '../components/ToastWrapper/ToastWrapper.js';
import TaskState from '../@enums/TaskState.js';
import isEmpty from "lodash/isEmpty";
import {  Spinner } from '@shopify/polaris';
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

  const getCompletedTasks = async () => {
    try {
      setTaskState(TaskState.LOADING);
      const { data } = await api.get('cTasks');
      console.log(data.data, 'response');
      if (isEmpty(data.data.ctasks)) {
        setTaskState(TaskState.EMPTY);
      } else {
        setTaskState(TaskState.SUCCESS);
      }
      setTaskState(TaskState.SUCCESS);
      setCompletedTasks(data.data.ctasks);
    } catch (error) {
        console.log(error,"error");
        setTaskState(TaskState.ERROR);
    }
  };
  console.log(taskState,completedTasks);
  return (
    <PageLayout title="Select Plan">
        {taskState === TaskState.LOADING && 
        <div style={styles.loader}>
              <Spinner
                accessibilityLabel="Fetching Tasks"
                size="large"
                color="teal"
              >
                Fetching Taks . . .
              </Spinner>
              </div>
        }
{taskState === TaskState.ERROR && 
       <div style={{ dispay: 'flex' }}>
       <div style={styles.error}>
         Error occured while fetching tasks,Kindly contact the app admin
       </div>
     </div>

}
{taskState === TaskState.EMPTY && <div style={styles.loader}>
    No tasks to display
    </div>}
        {taskState === TaskState.SUCCESS &&
      <>
        <div key={new Date()} style={styles.eidtCardContainer}>
          {completedTasks.map((item) => {
            return (
              <div style={styles.taskWrapper}>
                <>{item.variant.title}</>
                <>{item.variant.price}</>
              </div>
            );
          })}
        </div>
        <ToastWrapper
          active={toast.active}
          message={toast.message}
          error={toast.error}
          onDismiss={() => setToast({ defaultToastOptions })}
        />
      </>}
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
  taskWrapper:{
      display:"flex",
    //   flexDirection: 'column'
  },
  error: {
    textAlign: 'center',
    color: 'red',
  },
};
