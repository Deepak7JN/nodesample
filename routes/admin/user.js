const express = require('express')
const router = express.Router()
const session = require('express-session');

var {Users} = require('./../../models/admin/user');
var sess;
// Get All User Data
router.get('/', (req, res) => {
    
    sess=req.session;
    console.log(sess.username);
    if(sess.username){
    Users.find({})
    .then((data)=>{
        var dataObject = {"title":"Users","users":data}
        //console.log(dataObject);
        res.render('admin/user',{"data":dataObject})
    })
    .catch((err)=>{
    console.log(err)
    })
    }
})

// Add New User Data
router.post('/', (req, res, next) => {

    var User = new Users({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
    });
    User.save().then((doc) => {
        //res.send(doc);
        res.redirect('back')
    }, (e) => {
        res.status(400).send(e)
    });
})



// Get Single User Data
router.get('/:id', (req, res) => {
    
    Users.find({"_id": req.params.id})
    .then((data)=>{
        var dataObject = {"modalTitle":"Edit User","modalSubmit":"Update","users":data}
        //console.log(data);
        res.send({"data":dataObject})
    })
    .catch((err)=>{
    console.log(err)
    })
})

//Update Single User Data
router.post('/:id', (req, res) => {
    Users.findByIdAndUpdate(  
        req.params.id,
        req.body,
        // the callback function
        (err, user) => {
        // Handle any possible database errors
            if (err) return res.status(500).send(err);
            //var dataObject = {"title":"Users"}
            //console.log(dataObject);
            res.redirect('back')
        }
    )
})

//Delete Single User Data
router.delete('/:id', (req, res) => {
    Users.findByIdAndRemove(  
        req.params.id,
        // the callback function
        (err, user) => {
        // Handle any possible database errors
            if (err) return res.status(500).send(err);
            //var dataObject = {"title":"Users"}
            //console.log(dataObject);
            return res.status(200).send("sucess");
        }
    )
})

module.exports = router;