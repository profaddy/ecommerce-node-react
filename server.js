require('isomorphic-fetch');
const dotenv = require('dotenv');
dotenv.config();
const express = require("express");
const app1 = express();
const cors = require('@koa/cors');
const router = express.Router();
const morgan = require("morgan");
const bodyParser = require("body-parser");
// const mongoose = require("mongoose");

const store = require('store-js');
const Koa = require('koa');
const next = require('next');
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const session = require('koa-session');
const { default: graphQLProxy } = require('@shopify/koa-shopify-graphql-proxy');
const { ApiVersion } = require('@shopify/koa-shopify-graphql-proxy');
const Router = require('koa-router');
const { receiveWebhook, registerWebhook } = require('@shopify/koa-shopify-webhooks');
const getSubscriptionUrl = require('./server/getSubscriptionUrl');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const {
  SHOPIFY_API_SECRET_KEY,
  SHOPIFY_API_KEY,
  HOST,
} = process.env;
app1.get('/test', (req, res) => {
  res.send('Hello World!');
});
app.prepare().then(() => {
  const server = new Koa(app);
  const router = new Router();
  server.use(session({ sameSite: 'none', secure: true }, server));
  server.keys = [SHOPIFY_API_SECRET_KEY];

  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET_KEY,
      scopes: ['read_products', 'write_products'],
      async afterAuth(ctx) {
        const { shop, accessToken } = ctx.session;
        ctx.cookies.set("shopOrigin", shop, {
          httpOnly: false,
          secure: true,
          sameSite: 'none'
        });
        ctx.cookies.set("accessToken", accessToken, {
          httpOnly: false,
          secure: true,
          sameSite: 'none'
        });
        console.log("afterAuth");
      
//         app1.use(morgan("dev"));
// app1.use(bodyParser.urlencoded({ extended: true }));
// app1.use(bodyParser.json());

// app1.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   if (req.method === "OPTIONS") {
//     res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE");
//     res.status(200).json({})
//   }
//   next();
// })
        // const registration = await registerWebhook({
        //   address: `${HOST}/webhooks/products/create`,
        //   topic: 'PRODUCTS_CREATE',
        //   accessToken,
        //   shop,
        //   apiVersion: ApiVersion.October19
        // });

        // if (registration.success) {
        //   console.log('Successfully registered webhook!');
        // } else {
        //   console.log('Failed to register webhook', registration.result);
        // }
        //   const apiParams = {
        //   accessToken:accessToken
        // }
        // store.set("shopCreds",apiParams)
        // window.localStorage.setItem("shopCreds",JSON.stringify(apiParams))
        // await getSubscriptionUrl(ctx, accessToken, shop);
      }
    })
  );

  // const webhook = receiveWebhook({ secret: SHOPIFY_API_SECRET_KEY });

  // router.post('/webhooks/products/create', webhook, (ctx) => {
  //   console.log('received webhook: ', ctx.state.webhook);
  // });

  // server.use(graphQLProxy({ version: ApiVersion.April19 }));
  server.use(router.routes());
  server.use(verifyRequest());
  server.use(async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
    return
  });
  router.get('/products', async (ctx) => {
    try {
      console.log("test");
        const results = await fetch(`https://${ctx.cookies.get('shopOrigin')}/admin/api/2020-04/products.json`, {
      headers: {
          "X-Shopify-Access-Token": ctx.cookies.get('accessToken'),
        },
      })
      .then(response => response.json())
      .then(json => {
        return json;
      });
      // .then(response => response.json())
      // .then(json => {
        // return json;
      // });
      ctx.body = {
        status: 'success',
        data: results
      };
    } catch (err) {
      console.log(err)
    }
  })
  // router.get(verifyRequest(), async (ctx) => {
  //   await handle(ctx.req, ctx.res);
  //   ctx.respond = false;
  //   ctx.res.statusCode = 200;
  // });
  server.use(cors())
  
  // server.use(router.allowedMethods("GET, PUT, POST, PATCH, DELETE"));
  // server.use(router.routes());

  server.listen(port, () => {
    
    console.log(`> Ready on http://localhost:${port}`);
  });
});
