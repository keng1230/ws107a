const mongoose = require('mongoose') 
const Schema = mongoose.Schema;
const app = require('../app'); //引入 app.js 中主程式 為了用koa-socket.io
const IO = require( 'koa-socket' )
const io = new IO()
io.attach( app )
const sign_data = new Schema({  //儲存帳密的
    email: String,
    password: String
});
const room = new Schema({  //儲存房間的
    name: String,
    roomuser:String
})
const room_db = mongoose.model('room', room); //room的model 
const sign = mongoose.model('signup', sign_data); //帳密的model
var roomname;  //全域變數來取得roomname 
app._io.on('connection', socket => {
    var room_name = roomname; //在這邊先把全域變數的存下來
    socket.on(room_name, function (msg) {
        app._io.emit(room_name, msg);  
    })
})
    module.exports = {
        get_login: async function (ctx) { //login 的method
            if (ctx.session.user)
                await ctx.render('person')
            else
                await ctx.render('login')
        },
        get_signup: async function (ctx) { //signup的method
            await ctx.render('signup')
        },
        post_signup: async function (ctx) { //註冊按下的method
            var body = ctx.request.body; //取得裡面的內容
            var body_data = {       //將它存起來等等一次放進db
                email: body.email,
                password: body.password
            }
            account_save = new sign(body_data)
            var dosc = await account_save.save()  //儲存進account db
            ctx.session.user = body.email;
            ctx.redirect('/person'); //回到主頁
        },
        signin: async function (ctx) { // 登入按下的method
            var body = ctx.request.body; //取得登入時的資料
            var body_data = {
                email: body.email,
                password: body.password
            }
            dosc = await sign.findOne(body_data) //找到資料
            if (dosc) { //如果有找到
                ctx.session.user = body.email; //把cookie 寫入瀏覽器
                ctx.redirect('/person') //回到主頁
            }
            else
                ctx.redirect('/') //登陸失敗回到login頁面
        },
        search: async function (ctx) {
            var roomn=ctx.request.body.search; //查詢房間
            var dosc=await room_db.find({name:roomn}); //使用防名找尋房間
            await ctx.render('search',{contents:dosc}); //返回頁面 ，裡面包含找尋到的房間
        },
        person: async function (ctx) { //主頁的method
            await ctx.render('person')
        },
        create_room: async function (ctx) { //創建房間
            var room_name = ctx.request.body.room_name; //取得創建房間時的資料
            var room_ = {
                name: room_name,
                roomuser:ctx.session.user
            }
            var room_save = new room_db(room_) //儲存房間的資料進db
            var dosc = await room_save.save()
            roomname = room_name;
            ctx.redirect(`/room/${room_name}`)  //跳到房間的頁面
        },
        get_room: async function (ctx) {
            var room_id = ctx.params.roomname;  //進入房間的method
            roomname = room_id;
            return await ctx.render('room', { room_id: room_id });
        },
        logout: async function (ctx) {  //登出
            ctx.session.user = null; //將cookie清除，cookie 裡面包含使用者的資料讓它清除後 就會認為你是登出的結果。
            ctx.redirect('/');
        }
    }