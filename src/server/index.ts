import * as Koa from "koa";
import * as koaJwt from "koa-jwt";
import * as mount from "koa-mount";
import * as serve from "koa-static";
import { getConfig } from "./config";
const config = getConfig(process.env);

const app = new Koa();

app.use(mount("/static", serve("dist")));

app.use(koaJwt({ secret: config.JWT_SECRET, cookie: "jwt", passthrough: true }));
app.use(async ctx => {
  const user = ctx.state.user;
  const userTag = user ? `<script defer>window.__USER__=${JSON.stringify(user)};</script>` : "";

  ctx.body = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Gamesite 3</title>
    <link rel="stylesheet" href="/static/global.css">
    <link rel="shortcut icon" href="data:image/x-icon;," type="image/x-icon" />
    ${userTag}
    <script src="/static/main.bundle.js" defer></script>
  </head>

  <body>
    <div id="root"></div>
  </body>
</html>
  `;
});

app.listen(config.SERVER_PORT);
