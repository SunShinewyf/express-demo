var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var db = require('../db');
var User = require('../models/user');

/* 列表页面 */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Simple Demo' });
});

/* 注册页面*/
router.get('/register',function(req,res,next){
  res.render('register',{ title: '用户注册' });
});

router.post('/register',function(req,res){
  var username = req.body['username'];
  var password = req.body['password'];
  var repassword = req.body['repassword'];
  if(!username){
    req.session.error = '用户名不得为空';
    return res.redirect('/register');
  }
  if(!password){
    req.session.error = '密码不得为空';
    return res.redirect('/register');
  }
  if(password != repassword){
    req.session.error = '两次密码不一致';
    return res.redirect('/register');
  }
  var md5 = crypto.createHash('md5');
  var newPassword = md5.update(password).digest('base64');
  var newUser = new User({
      name:username,
      password:newPassword
  })
  User.findOne({name:newUser.name},function(err,user){
    if(user){
      req.session.error = '用户已经存在';
      return res.redirect('/register');
    }
    if(err){
      req.session.error = err;
      return res.redirect('/register');
    }
    newUser.save(function(err){
      if(err){
        req.session.error = err.message;
        return res.redirect('/register')
      }
      req.session.user = newUser;
      req.session.success = '注册成功';
      return res.redirect('/login');
    })
  })
});

/* 登陆页面*/
router.get('/login',function(req,res,next){
  res.render('login', { title:'用户登陆' });
});

/*登录逻辑*/
router.post('/login',function(req,res){
  var username = req.body.username;
  var password = req.body.password;
  var md5 = crypto.createHash('md5');
  var newPassword = md5.update(password).digest('base64');
  User.findOne({name:username},function(err,user){
    if(!user) {
      req.session.error = '用户不存在';
      return res.redirect('/login');
    }else{
      if(user.password != newPassword){
        req.session.error = '密码不正确';
        return res.redirect('/login');
      }
    }
    req.session.success = '登录成功';
    req.session.user = user;
    return res.redirect('/');
  })
})

/*发表页面*/
router.get('/write',function(req,res,next){
  res.render('write',{ title:'发表想法'})
})

/*发表页面逻辑*/
router.post('/write',function(req,res){
  
})

module.exports = router;
