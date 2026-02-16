const http = require("http");
const {handler} = require('./RequestHandler')

const server = http.createServer(handler);

const PORT = 3010;

server.listen(PORT, () => {
  console.log(`Server is running on PORT:http://localhost:${PORT}`);
});
