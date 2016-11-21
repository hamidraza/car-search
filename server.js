require('babel-register');
const app = require('./server/app.js');

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});