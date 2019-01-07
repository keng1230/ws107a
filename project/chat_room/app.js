const Koa=require('koa')
const app=module.exports=new Koa()
const logger = require('koa-logger')
const koaBody = require('koa-body')
const serve = require('koa-static');
const views = require('koa-views');
const path=require('path')
const session = require('koa-session');
const Router = require('koa-router')
const router=new Router;
const mongoose=require('mongoose')
mongoose.connect('mongodb://localhost/chat_room');
const sign=require('./model/sign_router')
app.keys = ['chat_room'];
app.use(session(app));
app.use(serve(__dirname + '/public')); // 將靜態的內容都放在public底下
app.use(views(path.join(__dirname, '/views'), { extension: 'ejs' })); //使用ejs模板 在views裡面
 app.use(logger()) //側錄
app.use(koaBody()) //將post的內容轉成可以懂得內容
app.use(sign.routes()) //調用sign路由裡面的東西
  .use(sign.allowedMethods())
  app.listen(3000);