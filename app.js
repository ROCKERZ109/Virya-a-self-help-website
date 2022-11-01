const express = require("express");
const bodyParser = require("body-parser");
const db = require(__dirname +"/database.js");
const session = require('express-session');
// const PythonShell = require('python-shell').PythonShell;
let ejs = require('ejs');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let wrongPassword = "";
var fullName = "";
var email = "";
var password = "";
var confirmPassword = "";
var name ="";


app.use(session({
	secret: '123@43asd',
	resave: true,
	saveUninitialized: true
}));


// -----------------ROOT-------------------


app.get("/", function(req,res){

    res.sendFile(__dirname + "/index.html");
})

app.post("/", function(req,res)
{
    let email = req.body.email;
    let password = req.body.pass;

    if(email && password)
    {
        
            db.query("SELECT fullName from test where Email = ? and Password = ?", [email,password], function(err,rows,fields)
            {
                if(err) throw err;
                
                name = rows[0].fullName;
                
            });

        db.query('SELECT * FROM test WHERE Email = ? AND Password = ?', [email, password], function(error, results, fields) {
			if (error) throw error;
			
            console.log(results);
            console.log(fields);
			if (results.length > 0) {
				
				req.session.loggedin = true;
				req.session.username = name;
				// Redirect to home page
				res.redirect("/home");
			} else {
				res.send('Incorrect Username and/or Password!');
			}			
			res.end();
		});
    }
    else {
		res.send('Please enter Username and Password!');
		res.end();
	}
})

// app.get("/homevirya.html", function(req,res)
// {
//     res.sendFile(__dirname+"/homevirya.html");
// })



// --------------------REGISTER------------------------


app.get("/register", function(req,res)
{
    res.render("register", {wrongInput: wrongPassword});
})
app.post("/register", function(req,res){
     fullName = req.body.fullName;
     email = req.body.email;
     password = req.body.pass;
     confirmPassword = req.body.confPass;
    console.log(fullName,email,password,confirmPassword);


    if(password === confirmPassword)
    {
        let myDb = db;
    let sql = "INSERT INTO test (fullName,Email,Password,Confirm) Values ("+"'"+fullName+"',"+ "'" +email+"',"+ "'" +password+"',"+ "'" +confirmPassword+"')"; 
    myDb.query(sql,function (err, data) {
        if (err){ throw err };
        console.log("record inserted");
        });
        res.redirect("/#form2Example17");
    }
    else{
        wrongPassword= "Password and Confirm Password Not Matched";
        res.render("register", {wrongInput: wrongPassword});
    }
    
    // console.log(email, password);
    
})


app.get("/home", function(req,res)
{
    res.render("home", {logName: name});
})

// app.get("/homevirya", function(req,res)
// {
//     console.log(name);
//     res.render("homevirya", {logName: name});
// })

app.get("/homevirya", function(req,res)
{
    if (req.session.loggedin){
        console.log(name);
    res.render("homevirya", {logName: name});
    }
    else{
        res.sendFile(__dirname + "/homevirya.html");
    }
    
})



// app.get("/chat", function(req,res)
// {
//     PythonShell.run('python/chatbot.py', null, function (err) {
//         if (err) throw err;
//         console.log('finished');
//       });
// })






app.listen(3000, function() {console.log("Server is running on port 3000")});


