
//============================================================================================


var express = require("express");
var fileuploader = require("express-fileupload");
var mysql = require("mysql2");

var app = express();
app.use(express.urlencoded(true));
app.use(fileuploader());
var dbConfig = {
    host: "127.0.0.1",
    user: "root",
    password: "MySqL@bCe#BTI$2023-NodeJS",
    database: "bceNode"
}
var dbCon = mysql.createConnection(dbConfig);
dbCon.connect(function (err) {
    if (err == null)
        console.log("connected successfully");
    else console.log(err);
})


app.use(express.static("public"));
app.listen(2000, function () {
    console.log("Server2 started...");
})

app.get("/directory", function (req, resp) {
    var dir = __dirname;
    // var dir=process.cwd();
    var file = __filename;
    console.log(dir + "     " + file);
    resp.send(dir + "     " + file);
})
// app.get("/signup",function(req,resp)
// {
//     resp.sendFile(process.cwd()+"/public/signup.html");
// })

app.get("/", function (req, resp) {
    resp.sendFile(process.cwd() + "/public/index1.html");
})
app.get("/signup", function (req, resp) {
    resp.sendFile(process.cwd() + "/public/signupprocess.html");
})
app.get("/signup-process", function (req, resp) {
    resp.send("Welcome" + " " + req.query.txtEmail + "   " + req.query.txtPwd + "  ");
    console.log("Welcome" + " " + req.query.txtEmail + "   " + req.query.txtPwd + "  ");
})
app.get("/signup-secure", function (req, resp) {
    resp.sendFile(process.cwd() + "/public/signup-secure.html");
})

app.post("/signup-process-secure", function (req, resp) {
    var qual = "";

    if (req.body.qualb != undefined) {
        qual = req.body.qualb + ",";
    }
    if (req.body.qualm != undefined) {
        qual = qual + req.body.qualm + ",";
    }
    if (req.body.qualb == undefined && req.body.qualm == undefined) {
        qual = "No qualification";
    }
    if (qual.endsWith(",")) {
        qual = qual.substring(0, qual.length - 1);
    }
    resp.send("welcome" + req.body.txtEmail + "   " + req.body.txtPwd + " Qualification: " + qual + " Nationality: " + req.body.nationality);
    console.log("welcome" + req.body.txtEmail + "   " + req.body.txtPwd);


    //--------------------------------File Upload----------------------------------------//
    // var filename="nopic.jpg";
    // if(req.files!=null)
    // {
    //     filename=req.files.nppic.name;
    //     var path=process.cwd()+"/public/uploads"+filename;
    //     req.files.nppic.mv(path);
    // }
    // var cities=req.body.cities.toString();
    // resp.send("welcome"+req.body.txtEmail+"   "+req.body.txtPwd+" Qualification: "+qual+" Nationality: "+req.body.nationality+"  Name "+filename+" city "+req.body.city+" cities "+cities);


})

// //==============================DataBase Connectivity==============================
app.get("/db-signup-secure", function (req, resp) {
    resp.sendFile(process.cwd() + "/public/db-signup.html");
})
//====================DB-Signup====================
app.post("/db-signup-process-secure", function (req, resp) 
{
    console.log(req.files);
    var filename = "nopic.jpg";
    if (req.files!= null) 
    {
        console.log("pic uploaded");
        filename = req.files.nppic.name;
        var path = process.cwd() + "/public/uploads/" + filename;
        req.files.nppic.mv(path);
    }
    console.log(filename);
    console.log(req.body);
    var email = req.body.txtEmail;
    var password = req.body.txtPwd;
    var picname = filename;
    var dob = req.body.dob;

    dbCon.query("insert into signup (email,password,picname,dob) values(?,?,?,?)", [email, password, picname, dob], function (err) {
        if (err == null) {
            resp.send("Recorded successfully");
        }
        else resp.send(err);
    })
})
app.post("/db-delete-process-secure", function (req, resp) {
    var email = req.body.txtEmail;
    dbCon.query("delete from signup where email=?", [email], function (err, result) {
        if (err == null) {
            if (result.affectedRows == 1)
                resp.send("deleted");
            else resp.send("invalid email");
        }
        else resp.send(err);
    })
})

app.get("/chk-email",function(req,resp)
{
    var emailKu=req.query.kuchEmail;
    dbCon.query("select * from signup where email=?",[emailKu],function(err,resultTable)
    {
        if(err==null)
        {
            if(resultTable.length==1)
            {
                resp.send("Already exists");
            }
            else resp.send("Available");
        }
        else resp.send(err);
    })
})

