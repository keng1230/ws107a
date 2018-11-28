const Router = require('koa-router')
const router=module.exports=new Router()
var sign=require('./sign');
router
    .get('/',sign.get_login)
    .get('/signup',sign.get_signup)
    .post('/signup',sign.post_signup)
    .post('/sign',sign.signin)
    .post('/search',sign.search)
    .get('/person',sign.person)
    .post('/create',sign.create_room)
    .get('/room/:roomname',sign.get_room)