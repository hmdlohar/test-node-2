const express = require('express')
const app = express()
const port = 2999

app.use(express.static('plugins'));
app.use(express.static('js'));
const mongoose = require('mongoose');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

mongoose.connect("mongodb://localhost/student_db");
var db = mongoose.connection;
db.on('error',function(){
	console.log("Problem in connecting mongo db server. ");
});
db.once('open',function(){
	console.log('db is connected');
	
});

var studentSchema = new mongoose.Schema({
	name: String,
	roll_no: Number
});
var Student = mongoose.model('Student',studentSchema);



function insertStudent(name,roll_no,callback){
	var s1 = new Student({
		name: name || "hamid",
		roll_no : roll_no|| 64
	});
	
	s1.save((err,obj)=>{
		if(err) {callback({status:false});return;}
		callback({status:true});
	});
}

function deleteStudent(roll_no,callback){
	Student.remove({roll_no:roll_no},function(err){
		if(err){console.log(err);callback(false);return;}
		callback(true);
	});
}

function showStudents(callback){
	Student.find((err,obj)=>{
		if(err) return console.error(err);
		//console.log("All Students: ",obj);
		callback(obj);
	});
}
app.get('/', (req, res) => res.send('Hello World!'))


app.get('/home', (req, res) => {

	res.sendFile( __dirname + "/views/home.html")
})

app.get('/about',function(req, res){

	res.send("this is about file. mod");
	
});

app.get('/insertStudent',(req,res)=>{
	console.log(req.query);
	if(!req.query.name || !req.query.roll_no){
		res.send("error:");
		return;
	}
	insertStudent(req.query.name,req.query.roll_no,function(rs){
		console.log(rs)
		if(rs.status){
			res.send("inserted");
		}
		else{
			res.send("error");
		}
	});
	
});

app.get('/deleteStudent',(req,res)=>{
	console.log(req.query);
	if(!req.query.roll_no){
		res.send("error:");
		return;
	}
	deleteStudent(req.query.roll_no,function(rs){
		if(rs){
			res.send("success");
		}
		else{
			res.send("error");
		}
	});
	
});

app.get('/getStudent',(req,res)=>{
	showStudents(function(obj){
		res.send(obj);
	});
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))

