const houses = [
  { name: 'Slytherin', colors: ['green', 'silver'], score: 0 },
  { name: 'Ravenclaw', colors: ['blue', 'bronze'], score: 0 },
  { name: 'Gryffindor', colors: ['red', 'gold'], score: 0 },
  { name: 'Hufflepuff', colors: ['yellow', 'black'], score: 0 },
];

function changePoints(houseName, delta) {
  houses.find(h => h.name === houseName).score += Number(delta);
}

const commands = {
  changePoints: changePoints
}

const WebSocket = require('ws');
const Koa = require('koa');
const KoaStatic = require('koa-static');

const app = new Koa();

app.use(KoaStatic('public'))
app.listen(8000);

const wss = new WebSocket.Server({ port: 8001 });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const [command, ...args] = message.split(' ');
    try {
      commands[command](...args);
      wss.clients.forEach((ws) => {
        ws.send(JSON.stringify(houses));
      });
    } catch(e) {
      console.log(`Invalid command or arguments: ${message}`);
    }
  });
  // send initial houses
  ws.send(JSON.stringify(houses));
});
