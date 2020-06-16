require('isomorphic-fetch');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('@koa/cors');
const bodyParser = require("koa-bodyparser");
const Koa = require('koa');
const next = require('next');
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const session = require('koa-session');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const productRouter = require("./server/routers/productRouter");
var fs = require('fs');
var https = require('https');
var privateKey  = fs.readFileSync('/etc/letsencrypt/live/react.vowelweb.com/privkey.pem', 'utf8');
var certificate = fs.readFileSync('/etc/letsencrypt/live/react.vowelweb.com/fullchain.pem', 'utf8');

const config = {
https: {
options: {
key: privateKey,
cert: certificate,
},

},

};

const {
  SHOPIFY_API_SECRET_KEY,
  SHOPIFY_API_KEY,
} = process.env;
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
  server.use(verifyRequest());
  server.use(bodyParser());
  server.use(productRouter.routes());
  server.use(productRouter.allowedMethods());
  server.use(async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
    return
  });
  server.use(cors())
  const serverCallback = server.callback();

const httpsServer = https.createServer(config.https.options, serverCallback);
  httpsServer.listen(port, function(err) {
      console.log(`> Ready on http://localhost:${port}`);
if (!!err) {

console.error('HTTPS server FAIL: ', err, (err && err.stack));

}
})
  // server.listen(port, () => {
  //   console.log(`> Ready on http://localhost:${port}`);
  // });
});
