var express=require("express");
var fileuploader=require("express-fileupload");
var mysql=require("mysql2");

var app=express();

var dbConfig={
    host:"127.0.0.1",
    user:"root",
    password:"MySqL@bCe#BTI$2023-NodeJS",
    database:"",
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

app.listen(5000,function()
{
    console.log("servermillet started");
})

app.use(express.static("millmoret"));
app.use(fileuploader());
app.use(express.urlencoded(true)); 

app.get("/",function(req,resp)
{
    resp.sendFile(process.cwd()+"/millmoret/index.html");
})
