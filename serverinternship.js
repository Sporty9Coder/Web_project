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
//==================================================
app.get("/add-question",function(req,resp)
{
    var type=req.query.typekuch;
    var ques=req.query.statekuch;
    var opt1=req.query.opt1kuch;
    var opt2=req.query.opt2kuch;
    var opt3=req.query.opt3kuch;
    var opt4=req.query.opt4kuch;
    
    if(type=="easy")
    {
        dbCon.query("insert into easy (ques,opt1,opt2,opt3,opt4) values (?,?,?,?,?)",[ques,opt1,opt2,opt3,opt4],function(err,result)
        {
            if (err==null)
            {
                resp.send("question added in easy");
            }
            else resp.send(err);
        })
    }
    if(type=="medium")
    {
        dbCon.query("insert into medium (ques,opt1,opt2,opt3,opt4) values (?,?,?,?,?)",[ques,opt1,opt2,opt3,opt4],function(err,result)
        {
            if (err==null)
            {
                resp.send("question added in medium");
            }
            else resp.send(err);
        })
    }
    if(type=="hard")
    {
        dbCon.query("insert into hard (ques,opt1,opt2,opt3,opt4) values (?,?,?,?,?)",[ques,opt1,opt2,opt3,opt4],function(err,result)
        {
            if (err==null)
            {
                resp.send("question added in hard");
            }
            else resp.send(err);
        })
    }
})
app.get("/get-questions",function(req,resp)
{
    var questionArray=[0,0,0];
    dbCon.query("select * from easy",function(err,resultJson)
    {
        if(err==null)
        {
            // console.log(resultJson);
            questionArray[0]=resultJson;
            // console.log(questionArray);
        }
        else resp.send(err);
    })
    dbCon.query("select * from medium",function(err,resultJson)
    {
        if(err==null)
        {
            // console.log(resultJson);
            questionArray[1]=resultJson;
            // console.log(questionArray);
        }
        else resp.send(err);
    })
    dbCon.query("select * from hard",function(err,resultJson)
    {
        if(err==null)
        {
            // console.log(resultJson);
            questionArray[2]=resultJson;
            console.log(questionArray);
            resp.send(questionArray);
            // console.log(questionArray);
        }
        else resp.send(err);
    })
})
//============================================
app.get("/add-exams-angular",function(req,resp)
{
    var topic=req.query.topickuch;

    // Date (Javascript to MySQL format)
    var jsDate=new Date(req.query.datekuch);
    const year = jsDate.getFullYear();
    const month = String(jsDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(jsDate.getDate()).padStart(2, '0');

    var doe=`${year}-${month}-${day}`;

    // Time (Javascript to MySQL format)
    var jsstarttime = new Date(req.query.startkuch);
    const shour = String(jsstarttime.getHours()).padStart(2, '0');
    const smin = String(jsstarttime.getMinutes()).padStart(2, '0');
    const ssec = String(jsstarttime.getSeconds()).padStart(2, '0');

    var jsendtime = new Date(req.query.endkuch);
    const ehour = String(jsendtime.getHours()).padStart(2, '0');
    const emin = String(jsendtime.getMinutes()).padStart(2, '0');
    const esec = String(jsendtime.getSeconds()).padStart(2, '0');

    var starttime = `${shour}:${smin}:${ssec}`;
    var endtime = `${ehour}:${emin}:${esec}`;
    
    dbCon.query("insert into exams (topic,doe,starttime,endtime) values(?,?,?,?)",[topic,doe,starttime,endtime],function(err,result)
    {
        if(err==null)
        {
            resp.send("Exam added");
        }
        else resp.send(err);
    })
})
//=========================================================
app.get("/get-exams-angular",function(req,resp)
{
    dbCon.query("select * from exams",function(err,resultJson)
    {
        if(err==null)
        {
            resp.send(resultJson);
        }
        else resp.send(err);
    })
})
//========================================================
app.post("/update-exam",function(req,resp)
{
    var examdataArray=req.body;
    console.log(examdataArray);
    var srno=examdataArray.srno;
    var topic=examdataArray.topic;
    var doe=examdataArray.doe;
    var starttime=examdataArray.starttime;
    var endtime=examdataArray.endtime;
    dbCon.query("update exams set topic=?,doe=?,starttime=?,endtime=? where srno=?",[topic,doe,starttime,endtime,srno],function(err,result)
    {
        if(err==null)
        {
            resp.send("exam updated successfully");
        }
        else resp.send(err);
    })
})