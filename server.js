require('isomorphic-fetch');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const Koa = require('koa');
const next = require('next');
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const session = require('koa-session');
const mongoose = require('mongoose');

const port = parseInt(process.env.PORT, 10) || 3001;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const productRouter = require('./server/routers/productRouter');
const testRouter = require('./server/routers/testRouter');
const Shop = require('./server/models/Shops.js');
const { isEmpty } = require('lodash');

// mongoose.connect(`mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false`,
//   { useUnifiedTopology: true, useNewUrlParser: true },
// )
const connectMongod = async () => {
  try {
    await mongoose.connect(
      `mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false`,
      { useUnifiedTopology: true, useNewUrlParser: true }
    );
  } catch (error) {
    console.log('mongodb connection failed');
  }
};
connectMongod();

mongoose.connection.on('error', (error) => {
  console.log(error, 'mongodb error>>>>>>>>>>');
});

const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY } = process.env;

app.prepare().then(() => {
  const server = new Koa(app);
  server.use(session({ sameSite: 'none', secure: true }, server));
  server.keys = [SHOPIFY_API_SECRET_KEY];

  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET_KEY,
      scopes: ['read_products', 'write_products'],
      async afterAuth(ctx) {
        const { shop, accessToken } = ctx.session;
        try {
          const shopDetails = await Shop.findOne({ shopOrigin: shop }).exec();
          console.log(shopDetails,shopDetails);
          if (isEmpty(shopDetails)) {
            const newShop = new Shop({
              _id: new mongoose.Types.ObjectId(),
              shopOrigin: shop,
              accessToken: accessToken,
              created_at: new Date(),
              updated_at:new Date()
            });
            await newShop.save();
          }else{
            await Shop.updateOne({ shopOrigin: shop }, {
              $set: {
                  accessToken: accessToken,
                  updated_at: new Date(),
              }
          });
            // shopDetails.accessToken = accessToken;
            // await shopDetails.save();
            // await shopDetails.updateOne({shopOrigin: shop},{accessToken:accessToken});
            // await shopDetails.save();
            console.log("shopdetails updated successfully");
          }
        } catch (error) {
          console.log(error,"error while updating accessstoken")
        }
        ctx.cookies.set('shopOrigin', shop, {
          httpOnly: false,
          secure: true,
          sameSite: 'none',
        });
        ctx.cookies.set('accessToken', accessToken, {
          httpOnly: false,
          secure: true,
          sameSite: 'none',
        });
        console.log('afterAuth');
        ctx.redirect('/');
      },
    })
  );
  server.use(verifyRequest());
  server.use(
    bodyParser({
      detectJSON: function (ctx) {
        return /\.json$/i.test(ctx.path);
      },
    })
  );
  server.use(productRouter.routes());
  server.use(productRouter.allowedMethods());
  server.use(testRouter.routes());
  server.use(testRouter.allowedMethods());
  server.use(async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
    return;
  });
  server.use(cors());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
