var express = require('express');
var router = express.Router();

/* 列表页面 */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Simple Demo' });
});

/* 注册页面*/
router.get('/register',function(req,res,next){
  res.render('register',{ title: '用户注册' });
});

router.post('/register',function(req,res){
  console.log(11111);
  return res.redirect('/login');
});

/* 登陆页面*/
router.get('/login',function(req,res,next){
  res.render('login', { title:'用户登陆' });
});


module.exports = router;
