const QTask = require('../../models/queuedTasks.js');
const CTask = require('../../models/CompletedTasks.js');


const fetchTasksProgress = async (ctx) => {
  try {
    console.log("queueId",ctx.params.queueId);
    const queuedTasks =  await QTask.find({
        shopOrigin: shopOrigin,
      }).exec();
      console.log(queuedTasks,"queuedTasks",queuedTasks.reverse,queuedTasks.reverse[0])
    const shopOrigin = ctx.session.shop;
    const TaskDetails = await CTask.find({
        shopOrigin: shopOrigin,
        queueId:queuedTasks.reverse[0]._id,
      }).exec();
      ctx.status = 200;
      ctx.body = {
          status:true,
          data:{
              ctasks:TaskDetails.length,
              qtasks:queuedTasks.reverse[0].variants.length
          }
      }
    } catch (error) {
    ctx.status = 400;
    ctx.body = {
      status: false,
      msg: 'Unknown error occured',
    };
  }
};

module.exports = fetchTasksProgress;
