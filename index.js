const express = require('express');
var cors = require('cors');
const nodemailer = require("nodemailer");
var bodyParser = require('body-parser');
var mysql = require('mysql');
const { read } = require('fs');

const { produccion } = require('./config.js');
const { time } = require('console');
// produccion = true

key = "sdcjagx_ajsbxibeqoidbnoixniqnd9ueqdniednxiendiendededlendiendoie"

var app = express();

// if(produccion){
   conexion_data = {
      host: "127.0.0.1",
      user: "kudiska_user",
      password: "(jsrd(BE7U",
      database: "laravel_3"
   }
// } else {
//    conexion_data = {
//       host: "localhost",
//       user: "root",
//       password: "",
//       database: "laravel_3"
//    }
// }

async function send_mail(De = "LanzaApp", para, asunto, msg) {
   // Generate test SMTP service account from ethereal.email
   // Only needed if you don't have a real mail account for testing
   // let testAccount = await nodemailer.createTestAccount();
 
   // create reusable transporter object using the default SMTP transport
   let transporter = nodemailer.createTransport({
     host: "smtp.kudiska.com",
     port: 587,
     secure: false, // true for 465, false for other ports
     auth: {
       user: 'admin@kudiska.com', // generated ethereal user
       pass: 'y,3]yqD4Vqau', // generated ethereal password
     },
   });
 
// http://api.ipify.org/?format=jsonp&callback=JSONP_CALLBACK

   // send mail with defined transport object
   let info = await transporter.sendMail({
     from: `${De} <admin@kudiska.com>`, // sender address
     to: para, // list of receivers
     subject: asunto, // Subject line
   //   text: "Hello world?", // plain text body
     html: msg, // html body
   });
 
   console.log("Message sent: %s", info.messageId);
   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
 
   // Preview only available when sending through an Ethereal account
   // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
   // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

var con = mysql.createConnection(conexion_data);
 
con.connect();

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





app.get('/validate', (req, res) => {
   params = req.query
   temp = []
   if(params.key == key){
      sql = `SELECT * FROM \`users\` WHERE \`email\` = '${params.email}' AND \`password\`='${params.pass}'`
      sql2 = `UPDATE \`users\` SET \`confirmed\`= true WHERE \`email\` = ${params.email}`
      con.query(sql,(err, result) => {
         if (err) throw err;
         temp = JSON.stringify(result[0])
         con.query(sql2, (err, result) => {
            // if (err) throw err;
            console.log('true')
         });
         res.json(result)
         res.status(200)
      });
   }
});

app.get('*', (req, res) => {
   res.json({msg: "nada aqui"})
});

app.post('/user/add', (req, res) => {

   // console.log(req.body)

   usuario = req.body;
   time_create = new Date().toISOString()
   
   sql = `INSERT INTO \`users\`(\`id\`, \`firstname\`, \`lastname\`, \`years_old\`, \`phone\`, \`confirmed\`, \`email\`, \`password\`, \`time_create\`) VALUES (NULL,'${usuario.firstname}','${usuario.lastname}',${usuario.years_old},'${usuario.phone}',NULL,'${usuario.email}','${usuario.password}',"${time_create}")`
   
   con.query(sql,(err, result) => {
      if (err) throw err;
      res.json(result);
      res.status(200)
   });
   send_mail("LanzaApp", "kpineda18@outlook.com","Activar Cuenta", `
   <!DOCTYPE html>
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>Document</title>
       <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
   </head>
   <body class="d-flex flex-column justify-content-center align-items-center">
   <style>body{height: 100vh;}.imagen{}.imagen img{max-width: 300px;}
   </style>
   <div class="d-flex flex-column justify-content-center align-items-center">
       <h2>Lanza App</h2>
       <div class="imagen">
           <img src="https://kudiska.com/assets/kudiska.png">
       </div>
       <p>!Hola, Sr <b>${usuario.firstname} ${usuario.lastname}</b>, Bienvenido a LanzaApp </p>
       <p>Para completar el registro aga click en el boton de abajo para confirmar su cuenta</p>
       <a class="btn btn-primary" href="http://kudiska.com:3000/validate/validate/?key=${key}&email=${usuario.email}&pass=${usuario.pass}">Verificar</a>
   </div>    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
   <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>
   <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js" integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV" crossorigin="anonymous"></script>
   </body>
   </html>`).catch(console.error)

});

app.post('/user', (req, res) => {
   usuario = req.body
   sql = `SELECT * FROM \`users\` WHERE \`email\`='${usuario.email}' AND \`password\`='${usuario.password}'`
   
   con.query(sql, (err, result) => {
      // if (err) throw err;
      res.status(200)
      res.json(result);
   });
   send_mail("LanzaApp", "kpineda18@outlook.com","probando mailer", "<b>probando si manda correo</b>").catch(console.error)
});

puerto = 3000

var server = app.listen(puerto, () => {
   console.log(`Express server ${puerto}: \x1b[32m%s\x1b[0m`, 'online');
});


send_mail("LanzaApp", "kpineda18@outlook.com","probando mailer", "<b>probando si manda correo</b>").catch(console.error);