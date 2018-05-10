import * as Koa from "koa";
import * as koaJwt from "koa-jwt";

import { getConfig } from "./config";
const config = getConfig(process.env);

const app = new Koa();

app.use(koaJwt({ secret: config.JWT_SECRET, cookie: "jwt", passthrough: true }));
app.use(async ctx => {
  ctx.body = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Gamesite 3</title>
    <link rel="stylesheet" href="//localhost:8080/global.css">
    <link rel="shortcut icon" href="data:image/x-icon;," type="image/x-icon" />

    <script src="//localhost:8080/main.bundle.js" defer></script>
  </head>

  <body>
    <div id="root"></div>
  </body>
</html>
  `;
});

app.listen(config.SERVER_PORT);
