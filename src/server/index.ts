import * as Koa from "koa";

const app = new Koa();

app.use(async ctx => {
  ctx.body = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Gamesite 3</title>
    <link rel="shortcut icon" href="data:image/x-icon;," type="image/x-icon" />

    <script src="//localhost:8080/bundle.js" defer></script>
  </head>

  <body>
    <div id="root"></div>
  </body>
</html>
  `;
});

app.listen(3000);
