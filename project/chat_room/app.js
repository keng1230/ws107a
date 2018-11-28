const Koa=require('koa')
const app=new Koa()
const logger = require('koa-logger')
const koaBody = require('koa-body')
const serve = require('koa-static');
const views = require('koa-views');
const path=require('path')
const session = require('koa-session');
const IO = require( 'koa-socket' )
const io = new IO()
const Router = require('koa-router')
const router=new Router;
const mongoose=require('mongoose')
mongoose.connect('mongodb://localhost/chat_room');
const sign=require('./model/sign_router')
app.keys = ['chat_room'];
app.use(session(app));
app.use(serve(__dirname + '/public'));
io.attach( app )
app._io.on( 'connection', socket => {
  console.log('connection');
socket.on('chat message', function(msg){
  console.log(msg);
  app._io.emit('chat message',msg);
})
})
app.use(views(path.join(__dirname, '/views'), { extension: 'ejs' }));
 app.use(logger())
app.use(koaBody())
app.use(sign.routes())
  .use(sign.allowedMethods())
  app.listen(3000);