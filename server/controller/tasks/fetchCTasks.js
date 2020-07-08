const Task = require('../../models/CompletedTasks.js');

const fetchTasks = async (ctx) => {
  try {
    const shopOrigin = ctx.session.shop;
    const TaskDetails = await Task.find({
      shopOrigin: shopOrigin,
    }).exec();
    ctx.status = 200;
    ctx.body = {
      status: true,
      data: {
        ctasks: TaskDetails,
      },
    };
  } catch (error) {
    ctx.status = 400;
    ctx.body = {
      status: false,
      msg: 'Unknown error occured',
    };
  }
};

module.exports = fetchTasks;
