const fs = require("fs");
const { URLSearchParams } = require("url");

const RequestHandler = (req, res) => {
  console.log("This is in the Request Handler");
  console.log("The Request Object has ", req.url, req.method, req.headers);
  if (req.url == "/") {
    res.setHeader("Content-Type", "text/html");
    res.write(`
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
    res.end();
  } else if (req.url == "/products") {
    res.setHeader("Content-Type", "text/html");
    res.write(`
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
    res.end();
  } else if (req.url == "/buy-product") {
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
  } else {
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
  }
};

module.exports = {
  handler: RequestHandler,
};
