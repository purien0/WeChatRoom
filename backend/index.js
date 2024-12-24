const express = require('express')
const app = express()
const port = 3000//服务器端口

var server = app.listen(8082,"10.21.188.228")//客户端访问的ip地址以及端口，需要与前端main.js中保持一致，ip地址使用本机ip，端口不被占用即可
var io = require('socket.io').listen(server);//引入socket.io监听
//引入socket.js
require('./model/socket.js')(io);


app.get('/', (req, res) =>{
	console.log(`Api callback hello world`)
	res.send('Hello World!')
})

app.listen(port, () => console.log(`Chatroom backup listening on port ${port}!`))//服务器端口