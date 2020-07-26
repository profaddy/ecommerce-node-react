const Task = require('../../models/queuedTasks.js');

const fetchTasks = async (ctx) => {
  try {
    console.log("queueId qtask",ctx.params.queueId);
    const shopOrigin = ctx.session.shop;
    const TaskDetails = await Task.find({
      shopOrigin: shopOrigin,
      // queueId:ctx.params.queueId,
        status:"completed"
      }).exec();
      ctx.status = 200;
      ctx.body = {
          status:true,
          data:{
              qtasks:TaskDetails
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

// const fetchTasks = async (ctx) => {
//   try {
//     console.log("queueId qtask",ctx.params.queueId);
//     const shopOrigin = ctx.session.shop;
//     const TaskDetails = await Task.find({
//         shopOrigin: shopOrigin,
//         queueId:ctx.params.queueId,
//         status:"queued"
//       }).exec();
//       ctx.status = 200;
//       ctx.body = {
//           status:true,
//           data:{
//               qtasks:TaskDetails
//           }
//       }
//     } catch (error) {
//     ctx.status = 400;
//     ctx.body = {
//       status: false,
//       msg: 'Unknown error occured',
//     };
//   }
// };

module.exports = fetchTasks;
