const Task = require('../../models/CompletedTasks.js');

const fetchTasks = async (ctx) => {
  try {

    console.log("queueId",ctx.params.queueId);
    const shopOrigin = ctx.session.shop;
    const TaskDetails = await Task.find({
        shopOrigin: shopOrigin,
        queueId:ctx.params.queueId
      }).exec();
      ctx.status = 200;
      ctx.body = {
          status:true,
          data:{
              ctasks:TaskDetails
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

module.exports = fetchTasks;
