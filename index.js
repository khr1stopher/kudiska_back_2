const express = require('express');
var cors = require('cors');
const nodemailer = require("nodemailer");
var bodyParser = require('body-parser');
var mysql = require('mysql');
const { read } = require('fs');

produccion = false
produccion = true

var app = express();

if(produccion){
   conexion_data = {
      host: "localhost",
      user: "kudiska_user",
      password: "(jsrd(BE7U",
      database: "laravel_3"
   }
} else {
   conexion_data = {
      host: "localhost",
      user: "root",
      password: "",
      database: "laravel_3"
   }
}

var con = mysql.createConnection(conexion_data);
 
 con.connect(function(err) {
   if (err) throw err;
 });

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
   sql = "SELECT * FROM `users`"
   con.query(sql, (err, result) => {
      if (err) throw err;
      res.status(200)
      res.json(result);
   });
});

app.get('*', (req, res) => {
   res.json({msg: "nada aqui"})
});

app.post('/user/add', (req, res) => {
   usuario = req.body
   sql = `INSERT INTO users (\`id\`,\`firstname\`, \`lastname\`, \`years_old\`, \`phone\`,\`email\`, \`password\`, \`time_create\`) VALUES (NULL, '${usuario.firstname}', '${usuario.lastname}', ${usuario.years_old}, '${usuario.phone}', '${usuario.email}', '${usuario.password}', '${new Date().toISOString()}')`
   respuesta = 'nada'
   try{
      con.query(sql, (err, result) => {
         if (err) throw err;
         res.status(200)
         res.json(result);
      });
   } catch (e) {

   }
   res.send(respuesta);
});

app.post('/user', (req, res) => {
   usuario = req.body
   sql = `SELECT * FROM \`users\` WHERE \`email\`='${usuario.email}' AND \`password\`='${usuario.password}'`
   con.query(sql, (err, result) => {
      // if (err) throw err;
      res.status(200)
      res.json(result);
   });
});

puerto = 3000

var server = app.listen(puerto, () => {
   console.log(`Express server ${puerto}: \x1b[32m%s\x1b[0m`, 'online');
});

async function mail_start() {
   // Generate test SMTP service account from ethereal.email
   // Only needed if you don't have a real mail account for testing
   // let testAccount = await nodemailer.createTestAccount();
 
   // create reusable transporter object using the default SMTP transport
   let transporter = nodemailer.createTransport({
     host: "http://smtp.kudiska.com",
     port: 587,
     secure: false, // true for 465, false for other ports
     auth: {
       user: 'admin@kudiska.com', // generated ethereal user
       pass: 'y,3]yqD4Vqau', // generated ethereal password
     },
   });
 
   // send mail with defined transport object
   let info = await transporter.sendMail({
     from: '"hola mundo 👻" <admin@kudiska.com>', // sender address
     to: "kpineda18@outlook.com, kkromans009@gmail.com", // list of receivers
     subject: "Hello ✔", // Subject line
     text: "Hello world?", // plain text body
     html: "<b>Hello world?</b>", // html body
   });
 
   console.log("Message sent: %s", info.messageId);
   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
 
   // Preview only available when sending through an Ethereal account
   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
   // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
 }
 
 mail_start().catch(console.error);