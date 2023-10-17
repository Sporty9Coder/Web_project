const e = require("express");
var express=require("express");
var fileuploader=require("express-fileupload");
var mysql=require("mysql2");

var app=express();

var dbConfig={
    host:"127.0.0.1",
    user:"root",
    password:"MySqL@bCe#BTI$2023-NodeJS",
    database:"internship",
    dateStrings:true
}
var dbCon=mysql.createConnection(dbConfig);

dbCon.connect(function(err)
{
    if(err==null)
    {
        console.log("connected successfully");
    }
    else console.log(err);
})

app.listen(2026,function()
{
    console.log("serverinternship started");
})

app.use(express.static("Internship_assgn"));
app.use(fileuploader());
app.use(express.urlencoded(true)); 

app.get("/create-account",function(req,resp)
{
    console.log(req.query);
    dbCon.query("insert into clients values(?,?,?,current_date(),?)",[req.query.kuchEmail,req.query.kuchPwd,req.query.kuchType,1],function(err)
    {
        if(err==null)
        {
            resp.send("Account created successfully");
        }
        else resp.send(err);
    })
})
//=============================
app.get("/login-process",function(req,resp)
{
    dbCon.query("select * from clients where email=? and pwd=?",[req.query.LoginEmail,req.query.LoginPwd],function(err,resultTableJson)
    {
        if(err==null)
        {
            if(resultTableJson.length==1)
            {
                if(resultTableJson[0].status==1)
                {
                    resp.send(resultTableJson[0].type);
                }
                else resp.send("You are blocked user");
            }
            else
            {
                resp.send("Invalid Email/password");
            }
    }
        else resp.send(err);
    })
})
//=================================================
app.get("/get-teachers",function(req,resp)
{
    var type="Teacher"
    dbCon.query("select email,dos,status,type from clients where type=?",[type],function(err,resultJson)
    {
        // console.log(type);
        // console.log(resultJson);
        if(err==null)
        {
            resp.send(resultJson);
        }
        else resp.send(err);
    })
})
//===================================================
app.get("/get-students",function(req,resp)
{
    var type="Student"
    dbCon.query("select email,dos,status,type from clients where type=?",[type],function(err,resultJson)
    {
        // console.log(type);
        // console.log(resultJson);
        if(err==null)
        {
            resp.send(resultJson);
        }
        else resp.send(err);
    })
})
//==================================================
app.get("/block-user",function(req,resp)
{
    var email=req.query.emailkuch;
    dbCon.query("update clients set status=0 where email=?",[email],function(err,result)
    {
        if(err==null)
        {
            resp.send("user Blocked");
        }
        else resp.send(err);
    })
})
//==================================================
app.get("/unblock-user",function(req,resp)
{
    var email=req.query.emailkuch;
    dbCon.query("update clients set status=1 where email=?",[email],function(err,result)
    {
        if(err==null)
        {
            resp.send("user Blocked");
        }
        else resp.send(err);
    })
})