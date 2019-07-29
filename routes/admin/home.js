const express = require('express')
const router = express.Router()
const session = require('express-session');
const bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
var alert = require('alert-node');
var {Users} = require('./../../models/admin/user');
var sess;
const app = express();
app.use(session({secret: 'ssshhhhh'}));

router.get('/', (req, res) => {
    var dataObject = {'title':'Home'}
    res.render('admin/login',{data: dataObject})
})

router.get('/login', (req, res) => {
    var dataObject = {'title':'Home'}
    res.render('admin/login',{data: dataObject})
})

router.get('/logout', (req, res) => {
    var dataObject = {'title':'Home'}
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        //res.redirect('/');
        res.render('admin/login',{data: dataObject})
    });

    
    
})

router.get('/recover', (req, res) => {
    //var dataObject = {'title':'Home'}
    res.render('admin/recover')
})

router.post('/recover_mail', (req, res) => {


var transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: 'deepak.happ@gmail.com',
    pass: 'Gladi7777'
  }
});


Users.findOne({email:req.body.email}, function(err,user)
{
    sess=req.session;
    sess.email = req.body.email;

 if(err){
    alert("The email u have entered is not registered ");
    res.render('admin/recover');
 } 
 //throw err;
 if(user)
 {

    var mailOptions = {
        from: 'deepak.happ@gmail.com',
        to: req.body.email,
        subject: 'Node Email Recovery',
        text: 'username: '+user.username+' & password: '+user.password+' '
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
     console.log("Found: "+user.username+", pass="+user.password);
     res.render('admin/login');
     alert("Username and password sent to your registered email address ");
      
 }else
 {
     console.log("Not found: "+email);
     alert("The email u have entered is not registered ");
     res.render('admin/login');
 }
     

});


})

router.post('/logincheck', (req, res) => {
    sess=req.session;
    sess.username = req.body.username;
    var username = req.body.username;
    var password = req.body.password;
    var match = 0;
    var match2 = 0;
    var User = new Users({
        username: req.body.username,
        password: req.body.password
    });



   Users.findOne({username:req.body.username}, function(err,user)
   {
 
    
    if(user)
    {
        //console.log("Found: "+username+", pass="+user.password);
        bcrypt.compare(password, user.password, function(error,result) {
            if(result) {
             // Passwords don't match
             res.render('admin/home');
            } else {
             // Passwords  match
             alert("password Not Match ");
             res.render('admin/login');
            
            } 
          });
         
          
    }else
    {

        Users.findOne({email:req.body.username}, function(err,user)
        {
        
        if(user)
        {
            bcrypt.compare(password, user.password, function(err,result) {
                if(result) {
                 // Passwords don't match
                 res.render('admin/home');
                } else {
                 // Passwords  match
                 alert("password Not Match ");
                 res.render('admin/login');
                
                } 
              });
            
        }else
        {
            console.log("Not found: "+username);
            res.render('admin/login');
        }
        });
        
    }
        
    
    
       
   });



});


router.post('/register', (req, res) => {
//console.log(sess.email);

   

    Users.findOne({email:req.body.email}, function(err,user)
    {
  
     if(err) throw err;
     if(user)
     {
         alert("Already Regirstered Email please Login here");
         res.render('admin/login');
     }else
     {
        var username = req.body.username;
        var password = req.body.password;
        var confirmpassword = req.body.confirm-password;
        var email = req.body.email;
        bcrypt.hash(password, 10, function(err, hash) {
            // Store hash in database
            if(err) throw err;
            if(hash)
     {
        
        var User = new Users({
            username: req.body.username,
            email: req.body.email,
            password: hash,
            confirmpassword: req.body.confirm-password
        });
        
        User.save().then((doc) => {
            //res.send(doc);
           // res.redirect('back');
            res.render('admin/home');
        }, (e) => {
            res.status(400).send(e)
        });


        console.log("Not hash: "+hash);
     }else{
        res.render('admin/login');
     }
            
          });

     
        
         //console.log("Not found: "+username);
         res.render('admin/login');
     }
         
     
         
     
        
    });


});

module.exports = router;