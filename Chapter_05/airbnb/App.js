const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');


const rootDir = require('./utils/path-util')
const app = express();


const notFoundRouter = require('./routers/notFoundRouter');
const hostRouter = require('./routers/hostRouter');
const storeRouter = require('./routers/storeRouter')


app.use(express.static(path.join(rootDir,'public')))
app.use(bodyParser.urlencoded({extended: true}))
app.use(storeRouter)
app.use('/host',hostRouter)
app.use(notFoundRouter)

const PORT = 3010;

app.listen(PORT, () => {
  console.log(`Server is running on PORT:http://localhost:${PORT}`);
});
