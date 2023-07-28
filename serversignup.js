var express=require("express");
var fileuploader=require("express-fileupload");
var mysql=require("mysql2");
var nodemailer = require('nodemailer');

var app=express();

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
    {
        console.log("connected successfully");
    }
    else console.log(err);
})

app.listen(2721,function()
{
    console.log("serversignup started");
})

app.use(express.static("project"));
app.use(fileuploader());
app.use(express.urlencoded(true)); 

// app.get("/",function(req,resp)
// {
//     resp.sendFile(process.cwd()+"/project/index.html");
// })
//===============================
app.get("/create-account",function(req,resp)
{
    console.log(req.query);
    dbCon.query("insert into users values(?,?,?,?,?)",[req.query.kuchEmail,req.query.kuchPwd,req.query.kuchType,"7/8/23",1],function(err)
    {
        if(err==null)
        {
            resp.send("Account created successfully");
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'bansalrehan731@gmail.com',
                  pass: '@RpBs$2106btech'
                }
              });
              
              console.log("created");
              
              var mailOptions = {
                from: 'bansalrehan731@gmail.com',
                to: "cricfoot27@gmail.com",
                subject: 'Sending Email using Node.js',
                text: 'That was easy!'
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
        }
        else resp.send(err);
    })
})
//=============================
app.get("/chk-account",function(req,resp)
{
    dbCon.query("select * from users where email=?",[req.query.EmailAddress],function(err,result)
    {
        if(err==null)
        {
            if(result.length==1)
            {
                resp.send("Account already exists");
            }
            else resp.send("Available");
        }
        else resp.send(err);
    })
})

app.get("/login-process",function(req,resp)
{
    dbCon.query("select * from users where email=? and pwd=?",[req.query.LoginEmail,req.query.LoginPwd],function(err,resultTableJson)
    {
        if(err==null)
        {
            console.log(resultTableJson);
            console.log(req.query);
            // console.log(req.query.hdnLGemail);
            // console.log(req.query.hdnLGpwd);
            if(resultTableJson.length==1)
            {
                if(resultTableJson[0].status==1)
                {
                    resp.send(resultTableJson[0].type);
                    // if(resultTableJson[0].type=="Donor")
                    // resp.sendFile(process.cwd()+"/dash-donor.html");
                    // if(resultTableJson[0].type=="Needy")
                    // resp.sendFile(process.cwd()+"/dash-needy.html");
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

app.post("/submit-process",function(req,resp)
{
    var filename="nopic.jpg";
    if(req.files!=null)
    {
        filename=req.files.proofpic.name;
        var path=process.cwd()+"/project/uploads/"+filename;
        req.files.proofpic.mv(path);
    }
    var email=req.body.txtEmail;
    var name=req.body.txtName;
    var mobile=req.body.txtContact;
    var address=req.body.txtAddress;
    var city=req.body.comboCity;
    var proof=req.body.comboIDproof;
    var pic=filename;
    var ahours=req.body.timeFrom+" to "+req.body.timeTo;

    dbCon.query("insert into donors values(?,?,?,?,?,?,?,?)",[email,name,mobile,address,city,proof,pic,ahours],function(err)
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
    dbCon.query("select * from donors where email=?",[req.query.kuchEmail],function(err,resJSONTable)
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
    var email=req.body.txtEmail;
    var name=req.body.txtName;
    var mobile=req.body.txtContact;
    var address=req.body.txtAddress;
    var city=req.body.comboCity;
    var proof=req.body.comboIDproof;
    var pic=filename;
    var ahours=req.body.timeFrom+" to "+req.body.timeTo;


    dbCon.query("update donors set name=?,mobile=?,address=?,city=?,proof=?,pic=?,ahours=? where email=?",[name,mobile,address,city,proof,pic,ahours,email],function(err,resJSONTable)
    {
        if(err==null)
        {
            resp.send("record updated successfully");
        }
        else resp.send(err);
    })
})

app.get("/donor-profile-process",function(req,resp)
{
    resp.sendFile(process.cwd()+"/project/Profile-donor.html");
})

app.get("/donor-availmed-process",function(req,resp)
{
    resp.sendFile(process.cwd()+"/project/avail-med.html");
})

app.get("/avail-med-process",function(req,resp)
{
    dbCon.query("insert into medsavailable (email,med,expdate,packing,qty) values(?,?,?,?,?)",[req.query.kuchEmail,req.query.kuchMedname,req.query.kuchExpdate,req.query.kuchPacking,req.query.kuchQty],function(err,result)
    {
        if(err==null)
        {
            resp.send("Medicine Recorded");
        }
        else resp.send(err);
    })
})

app.get("/donor-settings-process",function(req,resp)
{
    dbCon.query("update users set pwd=? where email=? and pwd=?",[req.query.kuchNewpwd,req.query.kuchEmail,req.query.kuchOldpwd],function(err,result)
    {
        // console.log(req.query);
        if(err==null)
        {
            if(result.affectedRows==1)
            resp.send("password Updated");
            else resp.send("incorrect password");
        }
        else resp.send(err);
    })
})

app.get("/needy-profile-process",function(req,resp)
{
    resp.sendFile(process.cwd()+"/project/Profile-needy.html");
})

app.post("/sendtoserver-process",function(req,resp)
{
    var filename="nopic.jpg";
    if(req.files!=null)
    {
        filename=req.files.proofpic.name;
        var path=process.cwd()+"/project/uploads/"+filename;
        req.files.proofpic.mv(path);
    }
    var email=req.body.txtEmail;
    var name=req.body.txtName;
    var mobile=req.body.txtContact;
    var address=req.body.txtAddress;
    var city=req.body.comboCity;
    var dob=req.body.dob;
    var gender=req.body.comboGender;
    var aadharpic=filename;

    dbCon.query("insert into needy values(?,?,?,?,?,?,?,?)",[email,name,mobile,dob,gender,city,address,aadharpic],function(err)
    {
        if(err==null)
        {
            resp.send("recorded in database");
        }
        else resp.send(err);
    })
})

app.get("/get-needy-details",function(req,resp)
{
    dbCon.query("select * from needy where email=?",[req.query.kuchEmail],function(err,resJSONTable)
    {
        if(err==null)
        {
            resp.send(resJSONTable);
            console.log(resJSONTable);
        }
        else resp.send(err);
    })
})

app.post("/updateneedy-process",function(req,resp)
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
    var email=req.body.txtEmail;
    var name=req.body.txtName;
    var mobile=req.body.txtContact;
    var address=req.body.txtAddress;
    var city=req.body.comboCity;
    var dob=req.body.dob;
    var gender=req.body.comboGender;
    var aadharpic=filename;


    dbCon.query("update needy set name=?,mobile=?,dob=?,gender=?,city=?,address=?,aadharpic=? where email=?",[name,mobile,dob,gender,city,address,aadharpic,email],function(err,resJSONTable)
    {
        if(err==null)
        {
            resp.send("record updated successfully");
        }
        else resp.send(err);
    })
})

app.get("/user-panel-process",function(req,resp)
{
    resp.sendFile(process.cwd()+"/project/panel-users.html");
})

app.get("/donor-panel-process",function(req,resp)
{
    resp.sendFile(process.cwd()+"/project/panel-donor.html");
})

app.get("/needy-panel-process",function(req,resp)
{
    resp.sendFile(process.cwd()+"/project/panel-needy.html");
})

app.get("/get-angular-user-details",function(req,resp)
{
    dbCon.query("select * from users",function(err,resultJson)
    {
        if(err==null)
        {
            resp.send(resultJson);
        }
        else resp.send(err);
    })
})

app.get("/delete-users-angular",function(req,resp)
{
    var email=req.query.kuchEmail;
    dbCon.query("delete from users where email=?",[email],function(err,result)
    {
        if(err==null)
        {
            if(result.affectedRows==1)
            {
                resp.send("deleted successfully");
            }
            else resp.send("Invalid ID");
        }
        else resp.send(err);
    })
})

app.get("/block-user-angular",function(req,resp)
{
    var email=req.query.emailKuch;
    var pwd=req.query.pwdKuch;
    dbCon.query("update users set status=0 where email=? and pwd=?",[email,pwd],function(err,result)
    {
        if(err==null)
        {
            if(result.affectedRows==1)
            {
                resp.send("User Blocked");
            }
            else resp.send("Invalid ID or Password");
        }
        else resp.send(err);
    })
})

app.get("/resume-user-angular",function(req,resp)
{
    var email=req.query.emailKuch;
    var pwd=req.query.pwdKuch;
    dbCon.query("update users set status=1 where email=? and pwd=?",[email,pwd],function(err,result)
    {
        if(err==null)
        {
            if(result.affectedRows==1)
            {
                resp.send("User Unblocked");
            }
            else resp.send("Invalid ID or Password");
        }
        else resp.send(err);
    })
})

app.get("/get-angular-donor-details",function(req,resp)
{
    dbCon.query("select * from donors",function(err,resultJson)
    {
        if(err==null)
        {
            resp.send(resultJson);
        }
        else resp.send(err);
    })
})

app.get("/get-angular-needy-details",function(req,resp)
{
    dbCon.query("select * from needy",function(err,resultJson)
    {
        if(err==null)
        {
            resp.send(resultJson);
        }
        else resp.send(err);
    })
})

app.get("/donor-medicmanage-process",function(req,resp)
{
    resp.sendFile(process.cwd()+"/project/med-manager.html");
})

app.get("/get-records-process",function(req,resp)
{
    dbCon.query("select * from medsavailable where email=?",[req.query.emailkuch],function(err,resultJson)
    {
        // console.log(req.query.emailkuch);
        // console.log(resultJson);
        if(err==null)
        {
            resp.send(resultJson);
        }
        else resp.send(err);
    })
})

app.get("/delete-med-process",function(req,resp)
{
    dbCon.query("delete from medsavailable where srno=?",[req.query.serialKuch],function(err,result)
    {
        if(err==null)
        {
            if(result.affectedRows==1)
            {
                resp.send("Deleted successfully");
            }
            else resp.send("Medicine Doesn't exist");
        }
        else resp.send(err);
    })
})

app.get("/needy-findmed-process",function(req,resp)
{
    resp.sendFile(process.cwd()+"/project/finder-med.html");
})

app.get("/get-City-angular",function(req,resp)
{
    dbCon.query("select distinct city from donors",function(err,resultCityJSON)
    {
        console.log(resultCityJSON);
        // console.log("resultCityJSON="+" "+resultCityJSON);
        if(err==null)
        {
            resp.send(resultCityJSON);
        }
        else resp.send(err);
    })
})

app.get("/get-med-angular",function(req,resp)
{
    dbCon.query("select distinct med from medsavailable",function(err,resultMedJSON)
    {
        console.log(resultMedJSON)
        // console.log("resultMedJSON="+" "+resultMedJSON);
        if(err==null)
        {
            resp.send(resultMedJSON);
        }
        else resp.send(err);
    })
})

app.get("/delete-expiremed-process",function(req,resp)
{
    dbCon.query("delete from medsavailable where expdate<=current_date()",function(err,result)
    {
        console.log(result.affectedRows);
        if(err==null)
        {
            if(result.affectedRows!=0)
            {
                resp.send("Deleted successfully");
            }
            else resp.send("All medicines are correct");
        }
        else resp.send(err);
    })
})

app.get("/find-donors-angular",function(req,resp)
{
    var medku=req.query.medkuch;
    var cityku=req.query.citykuch;
    dbCon.query("select * from donors inner join medsavailable on donors.email=medsavailable.email where medsavailable.med=? and donors.city=?",[medku,cityku],function(err,result)
    {
        if(err==null)
        {
            console.log(result);
            resp.send(result);
        }
        else resp.send(err);
    })
})