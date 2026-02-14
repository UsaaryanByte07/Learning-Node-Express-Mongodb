const http = require("http");
const fs = require("fs");

const requestHandler = (req, res) => {
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
  } else if (req.url == "/buy-product") {
    console.log("Form data received.");
    const buffer = [];
    req.on("data", (chunk) => {
      console.log(chunk);
      buffer.push(chunk);
    });

    req.on("end", () => {
      const body = Buffer.concat(buffer).toString();
      console.log(body);
    });
    fs.writeFileSync("buy.txt", "Myntra App");
    res.statusCode = 302;
    res.setHeader("Location", "/products");
    console.log("sending Reponse");
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
  }
  res.end();
};

const server = http.createServer(requestHandler);

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server is running on PORT:http://localhost:${PORT}`);
});
