require('isomorphic-fetch');
const dotenv = require('dotenv');
dotenv.config();
const express = require("express");
const cors = require('@koa/cors');
const morgan = require("morgan");
const bodyParser = require("koa-bodyparser");
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
  server.use(bodyParser());
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
      const response = await fetch(`https://${ctx.cookies.get('shopOrigin')}/admin/api/2020-04/${endpoint}`, {
      headers: {
            "X-Shopify-Access-Token": ctx.cookies.get('accessToken'),
          },
        });
        const result = await response.json();
      ctx.body = {
        status: 'success',
        data: result
      };
    } catch (err) {
      console.log(err)
    }
  })
  router.put('/api/v1/:endpoint', async (ctx) => {
    try {
      console.log(ctx.request.body,"ctx response");
      // const reqData = ctx.request.body;
      const {editOption,editValue,variants} = ctx.request.body
      variants.forEach(async (variant) => {
        const updatedPrice = getUpdatedPrice(editOption,Number(variant.price),Number(editValue));
        console.log(updatedPrice,"updatedPrice>>");
        const url =`https://${ctx.cookies.get('shopOrigin')}/admin/api/2020-04/variants/${variant.id}.json`
        const payload = {
          variant:{
            id:variant.id,
            price:`${updatedPrice}`
          }
        }
        const response = await fetch(url,{    headers: {
            'Content-type': 'application/json; charset=UTF-8', // Indicates the content 
          "X-Shopify-Access-Token": ctx.cookies.get('accessToken'),
        },method:'put',body:JSON.stringify(payload)})
        const resp = await response.json();
        console.log(`reuqest completed for ${variant.title}`,resp);
      })
      const result = []
      ctx.body = {
        status: 'success',
        data: result
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

//helpers
const getUpdatedPrice = (editOption,currentPrice,editValue) => {
  console.log(editOption,"editOption");
  switch(editOption){
    case "changeToCustomValue":
      return editValue;
    case "addPriceByAmount":
      return currentPrice + editValue;
    case "addPriceByPercentage":
      const offsetToBeAdded = (currentPrice * editValue)/100
      return currentPrice + offsetToBeAdded;
    default:
      return editValue;
  }
}