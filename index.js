const express = require('express');
var cors = require('cors');
const nodemailer = require("nodemailer");
var bodyParser = require('body-parser');
var mysql = require('mysql');
var bodyParser = require('body-parser');
const process = require('process');
const { read } = require('fs');
var hbs = require('nodemailer-express-handlebars');
const { produccion } = require('./config.js');
const { time } = require('console');
// const { url } = require('inspector');
// produccion = true

key = "sdcjagx_ajsbxibeqoidbnoixniqnd9ueqdniednxiendiendededlendiendoie"

url = "https://www.kudiska.com:3000/"

var app = express();

if(process.argv.indexOf('--prod') !== -1){
   conexion_data = {
      host: "127.0.0.1",
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
     tls: { 
      rejectUnauthorized: false 
      }
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

tokenNumber = () => {
   return 'xxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
     var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);      
     return v.toString(16);
   });
}

verification = async (user) => {
   let mailer = nodemailer.createTransport({
       host: 'smtp.kudiska.com',
       port: 587,
       secure: false, // true for 465, false for other ports
       auth: {
           user: 'admin@kudiska.com', // generated ethereal user
           pass: 'y,3]yqD4Vqau' // generated ethereal password
         }
      });
   
   mailer.use('compile', hbs({
       viewEngine : {
           extname: '.hbs', // handlebars extension
           layoutsDir: 'views/email/', // location of handlebars templates
           defaultLayout:'verification',
           partialsDir: 'views/email/', // location of your subtemplates aka. header, footer etc
       },
       viewPath: 'views/email',
       extName: '.hbs'
       }));
   mailer.sendMail({
       from: 'no-reply@lanzaApp.com',
       to:  user.email,
       subject: `Verificar cuenta`,
       template: 'verification',
       context: {
           name: user.firstname,
           last_name: user.lastname || '',
           link:`${url}validate/?key=${key}&email=${usuario.email}&pass=${usuario.pass}`
           
       }
       }, (error, response)=>{
           if(error){
               console.log(error);
               setTimeout(() => {
                  verification(user)
               }, 5000);
          
           }else{
               console.log(response);
               
           }
          
           
       }) 

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

app.post('/user/add', (req, res) => {

   // console.log(req.body)

   usuario = req.body;
   usuario.verification_token = tokenNumber()
   time_create = new Date().toISOString()
   last_session_time = time_create
   // last_session_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
   
   sql = `INSERT INTO \`users\`(\`id\`, \`firstname\`, \`lastname\`, \`years_old\`, \`phone\`, \`confirmed\`, \`email\`, \`password\`, \`time_create\`,\`last_session_time\`,\`verification_token\`) VALUES (NULL,'${usuario.firstname}','${usuario.lastname}',${usuario.years_old},'${usuario.phone}',NULL,'${usuario.email}','${usuario.password}',"${time_create}","${last_session_time}","${usuario.verification_token}")`
   
   con.query(sql,(err, result) => {
      if (err) throw err;
      res.json(result);
      res.status(200)
   });

   verification(usuario)

});

app.post('/user', (req, res) => {
   usuario = req.body
   sql = `SELECT * FROM \`users\` WHERE \`email\`='${usuario.email}' AND \`password\`='${usuario.password}'`
   
   con.query(sql, (err, result) => {
      // if (err) throw err;
      res.status(200)
      res.json(result);
   });
   // send_mail("LanzaApp", "kpineda18@outlook.com","probando mailer", "<b>probando si manda correo</b>").catch(console.error)
});

app.get('*', (req, res) => {
   res.json({msg: "nada aqui"})
});

// Escuchar peticiones
if(process.argv.indexOf('--prod') !== -1){
   // entra aqui si corres el proyecto con node app.js --prod
   console.log('corriendo en modo produccion');
   const fs = require('fs');
   const https = require('https');

   const privateKey = fs.readFileSync('/etc/letsencrypt/live/www.kudiska.com/privkey.pem', 'utf8');
   const certificate = fs.readFileSync('/etc/letsencrypt/live/www.kudiska.com/cert.pem', 'utf8');
   const ca = fs.readFileSync('/etc/letsencrypt/live/www.kudiska.com/chain.pem', 'utf8');
   
   const credentials = {
      key: privateKey,
      cert: certificate,
      ca: ca
   };
   
   // aqui crea el servidor https
   const httpsServer = https.createServer(credentials, app);
   httpsServer.listen(3000)
   console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
   
}else{
   // aqui crea un servidor http normal
   console.log('corriendo localmente con http...');
   var server = app.listen(3000, () => {
      console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
   });
}
   

// send_mail("LanzaApp", "kpineda18@outlook.com","probando mailer", "<b>probando si manda correo</b>").catch(console.error);