const express = require('express'),
  wrap = require('co-express'),
  React = require('react'),
  ReactDOMServer = require('react-dom/server'),
  {RouterContext , match} = require('react-router'),
  {createStore} = require('redux'),
  {Provider} = require('react-redux'),
  webpack = require('webpack'),
  webpackDevMiddleware = require('webpack-dev-middleware'),
  webpackHotMiddleware = require('webpack-dev-middleware'),
  webpackConfig = require('../webpack.config'),
  moment = require('moment'),
  carsData = require('./data/cars.json').map((c, i) => {
    return {
      ...c,
      id: i+1,
      availability: {
        startDate: moment(+c.availability.startDate).add(1, 'month'),
        endDate: moment(+c.availability.endDate).add(1, 'month')
      }
    };
  });

import defaultReducer from '../client/reducers/index';
import routes         from '../client/routes';

/*console.log("\n\n\n\n\n\n");
console.log("carsData", carsData);
console.log("\n\n\n\n\n\n");*/

require('dotenv').config();

const app = express(),
  store = createStore(defaultReducer, {cars: carsData});

app.use(express.static('public'));

if(process.env.ENV == 'development'){
  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler, webpackConfig.devServer));
  app.use(webpackHotMiddleware(compiler));
}


app.use((req, res) => {
  let result = '',
    error = null,
    notFound = false;

  match({routes, location: req.originalUrl}, (err, redirectLocation, renderProps) => {

    if(err) {
      error = err;
    }else if(!renderProps) {
      notFound = true;
    }else{

      let state = store.getState();
      const html = ReactDOMServer.renderToString(
        <Provider store={store}>
          <RouterContext  {...renderProps}/>
        </Provider>
      );

      result += `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Car search app</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800" rel="stylesheet">
          </head>
          <body>
            <div id="app">${html}</div>
            <script>window.__APP_STATE__=${JSON.stringify(state)}</script>
            <script src="http://localhost:8080/build/bundle.js"></script>
          </body>
        </html>
      `;

    }

  });

  if (error) return res.status(500).send(error.message);
  if (notFound) return res.status(404).send('page not found');
  return res.send(result);
});

module.exports = app;
