var express=require("express");
var fileuploader=require("express-fileupload");
var mysql=require("mysql2");

var app=express();

var dbConfig={
    host:"127.0.0.1",
    user:"root",
    password:"MySqL@bCe#BTI$2023-NodeJS",
    database:"milletmore",
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

app.get("/send-to-cart",function(req,resp)
{
    var name=req.query.namekuch;
    var price=req.query.pricekuch;
    var qty=req.query.qtykuch;
    var pic=req.query.pickuch;
    dbCon.query("insert into products values(?,?,?,?)",[name,price,qty,pic],function(err)
    {
        if(err==null)
        {
            resp.send("Item added to cart");
        }
        else resp.send(err);
    })
})

app.get("/get-cart-items",function(req,resp)
{
    dbCon.query("select * from products",function(err,resJSONTable)
    {
        if(err==null)
        {
            if(resJSONTable.length!=0)
            resp.send(resJSONTable);
            else {
                // resp.sendFile("/millmoret/empty-cart.html");
                resp.send(resJSONTable);
            }
        }
        else resp.send(err);
    })
})