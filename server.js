var express= require("express");
var app=express();
app.listen(21234,function()
{
    console.log("Server Started");
});
app.get("/hello",function(req,resp)
{
    resp.contentType("text/html");
    // resp.send("yoyo");
    resp.write("<b>started backend</b><br>");
    resp.write("nodejs server <hr>for javascript");
    resp.end();

})
