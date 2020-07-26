require('isomorphic-fetch');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const Koa = require('koa');
const next = require('next');
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const {receiveWebhook, registerWebhook} = require('@shopify/koa-shopify-webhooks');
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const session = require('koa-session');
const Router = require('koa-router');
const mongoose = require('mongoose');
const adminApi = require('./utils/adminApi.js');
const port = parseInt(process.env.PORT, 10) || 3002;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const productRouter = require('./server/routers/productRouter');
const testRouter = require('./server/routers/testRouter');
const billingRouter = require('./server/routers/billingRouter.js');
const taskProgressRouter = require('./server/routers/FetchTaskProgress.js');
const completedTaskRouter = require('./server/routers/CompletedTaskRouter.js');
const queuedTaskRouter = require('./server/routers/QueuedTaskRouter.js');
const emailRouter = require('./server/routers/EmailRouter.js');
const Shop = require('./server/models/Shops.js');
const { isEmpty } = require('lodash');
const fs = require('fs');
const https = require('https');
var cron = require('node-cron');
const postBilling = require('./server/controller/billing/postBilling');

const connectMongod = async () => {
  try {
    await mongoose.connect(
      `mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false`,
      { useUnifiedTopology: true, useNewUrlParser: true, dbName:"Bulkedit" }
    );
  } catch (error) {
    console.log('mongodb connection failed');
  }
};
connectMongod();

mongoose.connection.on('error', (error) => {
  console.log(error, 'mongodb error>>>>>>>>>>');
});

const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY, APP_NAME, HOST } = process.env;
// cron.schedule('30,*,*,* * * ', () => {
//   console.log('running every 30 seconds');
//   const
// });

app.prepare().then(() => {
  const server = new Koa(app);
  const router = new Router();
  server.use(
    bodyParser({
      detectJSON: function (ctx) {
        return /\.json$/i.test(ctx.path);
      },
    })
  );
  server.use(session({ sameSite: 'none', secure: true }, server));
  server.keys = [SHOPIFY_API_SECRET_KEY];
  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET_KEY,
      accessMode: 'online',
      scopes: ['read_products', 'write_products'],
      async afterAuth(ctx) {
        const { shop, accessToken } = ctx.session;
        const registration = await registerWebhook({
        address: `https://${HOST}/webhooks/app/uninstalled`,
        topic: 'APP_UNINSTALLED',
        accessToken,
        shop,
        apiVersion:"2020-04"
      });

      if (registration.success) {
        console.log('Successfully registered webhook!');
      } else {
        console.log('Failed to register webhook', registration.result);
      }
        console.log(shop,accessToken,"tokens")
        try {
          const shopDetails = await Shop.findOne({ shopOrigin: shop }).exec();
          console.log(shopDetails, "shopDetails");
          if (isEmpty(shopDetails)) {
            const plan = {
              price: '4.99',
              name: 'Basic Plan',
              trial_days:3
            };
            console.log("creating new shop...");
            const billingResponse = await postBilling(plan,shop,accessToken);
            console.log(billingResponse,"billingResponse");
            const newShop = new Shop({
              _id: new mongoose.Types.ObjectId(),
              shopOrigin: shop,
              accessToken: accessToken,
              chargeDetails:billingResponse,
              isAppInstalled:true,
              created_at: new Date(),
              updated_at: new Date(),
            });
            await newShop.save();
            const confirmationUrl = billingResponse.confirmation_url;
            // const activatePayload = {
            //   recurring_application_charge:billingResponse
            // }
            // const response = await adminApi.post(
            //   `https://${shop}/admin/api/2020-04/recurring_application_charges/${billingResponse.id}/activate.json`,
            //   activatePayload
            // );
            return ctx.redirect(confirmationUrl);
            console.log("shop created successfully");
          } else if((!isEmpty(shopDetails) && shopDetails.isAppInstalled === false)){
            console.log(shopDetails,"shopDetails");

            const plan = {
              price: '4.99',
              name: 'Basic Plan',
              trial_days:shopDetails.chargeDetails.trial_days
            };
            const billingResponse = await postBilling(plan, shop,accessToken);
            await Shop.updateOne(
              { shopOrigin: shop },
              {
                $set: {
                  accessToken: accessToken,
                  chargeDetails:billingResponse,
                  updated_at: new Date(),
                },
              }
            );
            const confirmationUrl = billingResponse.confirmation_url;
            return ctx.redirect(confirmationUrl);
            console.log('shopdetails updated successfully');
            // ctx.redirect(`https://${shop}/admin/apps/${APP_NAME}`);
          }else{
            console.log("false fallback to createshopifyauth willbe redirected to the app")
            ctx.redirect(`https://${shop}/admin/apps/${APP_NAME}`);
          }
        } catch (error) {
          console.log(error, 'error while updating accessstoken');
        }
      },
    })
  );
  server.use(
  receiveWebhook({
    path: '/webhooks/app/uninstalled',
    secret: SHOPIFY_API_SECRET_KEY,
    // called when a valid webhook is received
    onReceived(ctx) {
      console.log('received webhook: ', ctx.state.webhook);
      async function updateDatabase(){
      await Shop.updateOne(
        { shopOrigin: ctx.state.webhook.domain },
        {
          $set: {
            isAppInstalled:false
          },
        }
      );
      console.log("install flag set to false")
    }
    updateDatabase();
    },
  }),
);
  server.use(verifyRequest());
  server.use(productRouter.routes());
  server.use(productRouter.allowedMethods());
  server.use(taskProgressRouter.routes());
  server.use(taskProgressRouter.allowedMethods());
  server.use(testRouter.routes());
  server.use(testRouter.allowedMethods());
  server.use(billingRouter.allowedMethods());
  server.use(billingRouter.routes());
  server.use(completedTaskRouter.routes());
  server.use(completedTaskRouter.allowedMethods());
  server.use(queuedTaskRouter.routes());
  server.use(queuedTaskRouter.allowedMethods());
  server.use(emailRouter.routes());
  server.use(emailRouter.allowedMethods());
  server.use(router.routes());
  //shopify mandotory hooks
  router.get('/GetShopifyCustomerdata', async (ctx) => {
    try {
      ctx.status(200);
    } catch (err) {
      console.log(err)
    }
  });
  router.get('/EraseShopifyCustomerdata', async (ctx) => {
    try {
      ctx.status(200);
    } catch (err) {
      console.log(err)
    }
  });
  router.get('/EraseShopData', async (ctx) => {
    try {
      ctx.status(200);
    } catch (err) {
      console.log(err)
    }
  });
  server.use(async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
    return;
  });
  server.use(cors());
  const serverCallback = server.callback();
  if (process.env.NODE_ENV === 'production') {
    var privateKey = fs.readFileSync(
      '/etc/letsencrypt/live/productedit.vowelweb.com/privkey.pem',
      'utf8'
    );
    var certificate = fs.readFileSync(
      '/etc/letsencrypt/live/productedit.vowelweb.com/fullchain.pem',
      'utf8'
    );
    const config = {
      https: {
        options: {
          key: privateKey,
          cert: certificate,
        },
      },
    };
    const httpsServer = https.createServer(
      config.https.options,
      serverCallback
    );
    httpsServer.listen(port, function (err) {
      console.log(`> Ready on production http://localhost:${port}`);
      if (!!err) {
        console.error('HTTPS server FAIL: ', err, err && err.stack);
      }
    });
  } else {
    server.listen(port, () => {
      console.log(`> Ready on development http://localhost:${port}`);
    });
  }
});
