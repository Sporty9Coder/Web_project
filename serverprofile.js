
var express=require("express");
var fileuploader=require("express-fileupload");
var mysql=require("mysql2");

var app=express();
app.listen(2023,function()
{
    console.log("serverprofile started");
})

app.use(express.static("project"));

var dbConfig={
    host:"127.0.0.1",
    user:"root",
    password:"MySqL@bCe#BTI$2023-NodeJS",
    database:"project",
    dateStrings:true
}
var dbCon=mysql.createConnection(dbConfig);
dbCon.connect(function(err)
{
    if(err==null)
    console.log("conected successfully");
    else console.log(err);
})


app.use(fileuploader());
app.use(express.urlencoded(true)); 

app.get("/",function(req,resp)
{
    resp.sendFile(process.cwd()+"/project/index1.html");
})

app.get("/profile",function(req,resp)
{
    resp.sendFile(process.cwd()+"/project/project.html");
})

app.post("/submit-process",function(req,resp)
{
    var filename="nopic.jpg";
    if(req.files!=null)
    {
        filename=req.files.proofpic.name;
        var path=process.cwd()+"/project/uploads/"+filename;
        req.files.proofpic.mv(path);
    }
    var emailid=req.body.txtEmail;
    var name=req.body.txtName;
    var contact=req.body.txtContact;
    var address=req.body.txtAddress;
    var city=req.body.comboCity;
    var dob=req.body.dob;
    var gender=req.body.comboGender;
    var id=req.body.comboIDproof;
    var idpicnamee=filename;

    dbCon.query("insert into profile values(?,?,?,?,?,?,?,?,?)",[emailid,name,contact,address,city,dob,gender,id,idpicnamee],function(err)
    {
        if(err==null)
        {
            resp.send("recorded in database");
        }
        else resp.send(err);
    })
})

app.get("/get-json-details",function(req,resp)
{
    dbCon.query("select * from profile where emailid=?",[req.query.kuchEmail],function(err,resJSONTable)
    {
        if(err==null)
        {
            resp.send(resJSONTable);
            console.log(resJSONTable);
        }
        else resp.send(err);
    })
})

app.post("/update-process",function(req,resp)
{
    var filename;
    if(req.files!=null)
    {
        filename=req.files.proofpic.name;
        var path=process.cwd()+"/project/uploads/"+filename;
        req.files.proofpic.mv(path);
    }
    else
    {
        filename=req.body.hdn;
    }
    var emailid=req.body.txtEmail;
    var name=req.body.txtName;
    var contact=req.body.txtContact;
    var address=req.body.txtAddress;
    var city=req.body.comboCity;
    var dob=req.body.dob;
    var gender=req.body.comboGender;
    var id=req.body.comboIDproof;
    var idpicname=filename;

    dbCon.query("update profile set name=?,contact=?,address=?,city=?,dob=?,gender=?,id=?,idpicname=? where emailid=?",[name,contact,address,city,dob,gender,id,idpicname,emailid],function(err,resJSONTable)
    {
        if(err==null)
        {
            resp.send("record updated successfully");
        }
        else resp.send(err);
    })
})



