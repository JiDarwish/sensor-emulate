const express = require('express')
const http = require('http')
var bodyParser = require("body-parser");
const port = 3000
var mysql = require('mysql');
var cors = require('cors')
const WebSocket = require('ws');
const event = new (require('events').EventEmitter);
console.log(event);

function getConnection() {
  return mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "adminPass",
    database: 'sensor',
    insecureAuth: true
  })
}
const app = express()
app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const server = http.createServer(app)


const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
  // ws.on('data', function incoming(data) {
  //   wss.clients.forEach(function each(client) {
  //     if (client.readyState === WebSocket.OPEN) {
  //       client.send(data);
  //     }
  //   });
  // });

  event.on('data', val => {
    console.log('Emitted value! ' + val)
    ws.send('data', value);
  })

  ws.send('connected');
});


app.get('/data', async (req, res) => {
  const con = getConnection()
  await con.connect((err) => {
    if (err) {
      console.log('There was an error')
    }
    con.query('SELECT max(id) as id from data;', (err, id) => {
      if (err) {
        console.error('There was an error  ' + err)
      }

      const maxId = id[0]['id']
      con.query('SELECT value FROM data WHERE id=' + maxId + ';', (err, data) => {

        res.send(data);
      })

    })

  })
})


app.post('/new', async (req, res) => {
  const body = req.body
  console.log('Got data' + JSON.stringify(body))

  event.emit('data', req.body.value) // EVENT


  const con = getConnection()
  await con.connect((err) => {
    if (err) {
      console.log('There was an error')
    }
    con.query('INSERT INTO data (value) VALUES (' + body.value + ')', (err, res) => {
      if (err) {
        console.log(err)
        console.log('Error inserting data!')
      }
    });

  })

  res.send('Thanks');
})



app.listen(port, () => console.log(`Example app listening on port ${port}!`))


