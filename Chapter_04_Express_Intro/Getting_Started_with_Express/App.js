const http = require("http");
const express = require("express");
const fs = require('fs')
const {URLSearchParams} = require('url')

const app = express();

const server = http.createServer(app);

app.use((req, res, next) => {
  console.log("The Request Object has ", req.url, req.method, req.headers);
  next();
});

app.get("/", (req, res, next) => {
  res.send(`
        <!DOCTYPE html>
<html lang="en">
<head>
    <title>Home</title>
</head>
<body>
    <h1>This is My Home page.</h1>
    <form action="/buy-product" method="POST">
        <input type="text" placeholder="Enter the Product Name" name="productName">
        <br/>
        <input type="number" placeholder="Enter the Budget" name="productBudget">
        <input type="submit" value="Submit">
    </form>
</body>
</html>
        `);
});

app.post("/buy-product", (req, res, next) => {
  console.log("Form data received.");
  const buffer = [];
  req.on("data", (chunk) => {
    console.log(chunk);
    buffer.push(chunk);
  });

  req.on("end", () => {
    const body = Buffer.concat(buffer).toString();
    const urlParams = new URLSearchParams(body);
    const bodyJson = {};
    for (const [key, value] of urlParams.entries()) {
      bodyJson[key] = value;
    }
    // fs.writeFileSync("buy.txt", JSON.stringify(bodyJson)); not recommended to use as this forced the event loop to handle this task instead of giving it to worker threads
    fs.writeFile("buy.txt", JSON.stringify(bodyJson), (err) => {
      res.statusCode = 302;
      res.setHeader("Location", "/products");
      res.end();
      console.log("sending Reponse");
    });
  });
});

app.get(`/products`, (req, res, next) => {
  res.send(`
        <!DOCTYPE html>
<html lang="en">
<head>
    <title>Products</title>
</head>
<body>
    <h1>Product List will Appear Here.</h1>
</body>
</html>
        `);
});

app.use((req, res, next) => {
  req.statusCode = 404;
  res.setHeader("Content-Type", "text/html");
  res.write(`
        <!DOCTYPE html>
<html lang="en">
<head>
    <title>Not Found</title>
</head>
<body>
    <h1>404 Page Not Found</h1>
</body>
</html>
        `);
  res.end();
});

const PORT = 3010;

server.listen(PORT, () => {
  console.log(`Server is running on PORT:http://localhost:${PORT}`);
});
