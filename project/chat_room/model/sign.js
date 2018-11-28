const mongoose=require('mongoose')
const Schema = mongoose.Schema;

const sign_data = new Schema({
    email: String,
    password: String
});
const room =new Schema({
    name:String
})

const room_db=mongoose.model('room',room);
const sign=mongoose.model('signup',sign_data);

module.exports= {
    get_login:async function(ctx)
    {
        await ctx.render('login')
    },
    get_signup:async function(ctx)
    {
        await ctx.render('signup')
    },
    post_signup:async function(ctx)
    {
        var body=ctx.request.body;
        var body_data={
            email:body.email,
            password:body.password
        }
        account_save=new sign(body_data)
        var dosc=await account_save.save()
        console.log(dosc)
        ctx.redirect('/');
    },
    signin:async function(ctx)
    {
        var body=ctx.request.body;
        var body_data={
            email:body.email,
            password:body.password
        }
        dosc=await sign.find(body_data)
        console.log(dosc)
        ctx.redirect('/person');
    },
    search:async function(ctx)
    {
        var email=ctx.request.body.email;
        dosc=await sign.find({},['email'])
        console.log(dosc)
        var allsearch=[]
        for(content of dosc)
        {
            if(content.email.indexOf(email)!=-1 )
            {
                allsearch.push(content);
            }
        };
        console.log(allsearch);
        ctx.body=allsearch;
    },
    person:async function(ctx)
    {
        await ctx.render('person')
    },
    create_room:async function(ctx)
    {
        var room_name=ctx.request.body.room_name;
        var room_={
            name:room_name
        }
        var room_save=new room_db(room_)
        var dosc=await room_save.save()
        ctx.redirect(`/room/${room_name}`)
    },
    get_room:async function(ctx)
    {
        return await ctx.render('room');
    }
}