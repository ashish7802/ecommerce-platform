import http from 'node:http';

const server = http.createServer((_request, response) => {
  response.writeHead(200, {'content-type': 'application/json'});
  response.end(JSON.stringify({status: 'ok'}));
});

if (import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  server.listen(0, () => console.log('server ready'));
}

export default server;
