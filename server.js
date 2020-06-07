require('isomorphic-fetch');
const dotenv = require('dotenv');
dotenv.config();
const express = require("express");
const cors = require('@koa/cors');
const router = express.Router();
const morgan = require("morgan");
const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
const Koa = require('koa');
const next = require('next');
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const session = require('koa-session');
const Router = require('koa-router');

const port = parseInt(process.env.PORT, 10) || 3001;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const {
  SHOPIFY_API_SECRET_KEY,
  SHOPIFY_API_KEY,
  HOST,
} = process.env;
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
        ctx.redirect('/')
      }
    })
  );
  server.use(router.routes());
  server.use(verifyRequest());
  server.use(async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
    return
  });
  router.get('/api/v1/:endpoint', async (ctx) => {
    try {
      const endpoint = ctx.params.endpoint;
      const results = await fetch(`https://${ctx.cookies.get('shopOrigin')}/admin/api/2020-04/${endpoint}.json`, {
      headers: {
          "X-Shopify-Access-Token": ctx.cookies.get('accessToken'),
        },
      })
      .then(response => response.json())
      .then(json => {
        return json;
      });
      ctx.body = {
        status: 'success',
        data: results
      };
    } catch (err) {
      console.log(err)
    }
  })
  server.use(cors())
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
