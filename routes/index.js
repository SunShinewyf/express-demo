var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var db = require('../db');
var User = require('../models/user');
var Article = require('../models/article')

/* 列表页面 */
router.get('/', function(req, res) {
    var user = req.session.user;
    Article.find({user:user._id},function(err,articles){
        if(err){
            req.session.message = '查询文章失败';
            return res.redirect('/',{title:'simple demo'});
        }else{
            res.render('',{
                articles:articles,
                title:'文章列表'
            });
        }
    })
});

/* 注册页面*/
router.get('/register',function(req,res){
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

function getTime(date){
    return date.getFullYear()+
        "-"+date.getMonth()+1+"-"+
        date.getDate()+" "+
        date.getHours()+":"+
        date.getMinutes();
}

/* 登陆页面*/
router.get('/login',function(req,res){
  res.render('login', { title:'用户登录' });
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
router.get('/write',function(req,res){
    var articleId = req.query.id;
    var title;
    Article.findOne({_id:articleId},function(err,article){
      if(err){
        res.session.message = '数据查询失败';
        res.render('',{title:'文章列表'});
      }
      if(article){
         title = '文章编辑';
      }else{
        title = '发表想法';
      }
      res.render('write',{
          title:title,
          article:article
      });
    })
})

/*发表页面逻辑*/
router.post('/write',function(req,res){

  var title = req.body.title;
  var content = req.body.content;
  var user = req.session.user;
  var time = getTime(new Date());
  if(!title){
    req.session.error = '文章标题不得为空';
    return res.redirect('/write');
  }
  if(!content){
    req.session.error = '文章内容不得为空';
    return res.redirect('/write');
  }
  var article = new Article({
      title:title,
      content:content,
      user:user._id,
      time:time
  })
  article.save(function(err){
    if(err){
      req.session.message = err;
      return res.redirect('/write');
    }
    req.session.success = '发表成功';
    return res.redirect('/');
  })
});

//用户退出
router.get('/logout',function(req,res){
  req.session.user = null;
  return res.redirect('/login');
})


module.exports = router;
