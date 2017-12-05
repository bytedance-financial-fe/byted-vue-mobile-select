var webpack = require('webpack');
var path = require('path');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.dev.conf.js');
webpackConfig.then(config => {
  Object.keys(config.entry).forEach(key => {
    config.entry[key] = [
      config.entry[key],
      'webpack-dev-server/client?http://localhost:8081/',
      'webpack/hot/dev-server'
    ];
  });
  var compiler = webpack(config);
  var server = new WebpackDevServer(compiler, {
    hot: true,
    
    before: function(app) {
      // Here you can access the Express app object and add your own custom middleware to it.
      // For example, to define custom handlers for some paths:
      // app.get('/some/path', function(req, res) {
      //   res.json({ custom: 'response' });
      // });

      // 路由
      app.get('/', function(req, res) {
        var result = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset=utf-8>
          <meta name=viewport content="width=device-width,initial-scale=1">
          <title>页面列表</title>
        </head>
        <body>
        ${Object.keys(config.entry).map(
          key => `<div><a href="dev/${key}.html">${key}.html</a></div>`
        )}
        </body>
        </html>
        `;
        res.set('content-type', 'text/html');
        res.send(result);
        res.end();
      });
      app.get('/dev/*', function(req, res) {
        // console.log(req.path);
        var viewname = req.path.replace(/^\/dev\//, '');
        viewname = viewname ? viewname : 'index.html';
        console.log(req.path, viewname);
        console.log(
          '------------------------------------------------------------------------------------------'
        );
        var filepath = path.join(compiler.outputPath, viewname);
        // 使用webpack提供的outputFileSystem
        compiler.outputFileSystem.readFile(filepath, function(err, result) {
          if (err) {
            // something error
            // return next(err);
            result = err;
          }
          res.set('content-type', 'text/html');
          res.send(result);
          res.end();
        });
      });
      app.get('/public/*', function(req, res) {
        // console.log(req.path);
        var viewname = req.path.replace(/^\/public\/spage\/caijing-activity-web\//, '');
        viewname = viewname ? viewname : 'index.html';
        console.log(req.path, viewname);
        console.log(
          '------------------------------------------------------------------------------------------'
        );
        var filepath = path.join(compiler.outputPath, viewname);
        // 使用webpack提供的outputFileSystem
        compiler.outputFileSystem.readFile(filepath, function(err, result) {
          if (err) {
            // something error
            // return next(err);
            result = err;
          }
          res.set('content-type', 'text/html');
          res.send(result);
          res.end();
        });
      });
    }
  });
  server.listen(8081);
});
