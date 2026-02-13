const http = require("http");

console.log("The server has started");

const requestHandler = (req, res) => {
  console.log("This is in the Request Handler");
  console.log("The Request Object has ", req.url, req.method, req.headers);
  res.setHeader("Content-Type", "text/html");
  res.write(`
        <!DOCTYPE html>
<html lang="en">
<head>
    <title>First Node Server</title>
</head>
<body>
    <h1>This is My First Node Server</h1>
</body>
</html>
        `);
        res.end();
};

const server = http.createServer(requestHandler);

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`The Server is Running at http://localhost:${PORT}`);
});
