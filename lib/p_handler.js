var U_post = require('../models/u_post.js');
var Account = require('../models/account.js');
var post_view_model = require('../viewModel/v_post.js');
var moment = require('moment');

exports.add_new = function(req, res){// Writes a Single post to the database
    if(!req.user){
        return next(err);
    }
    else {
        var name = JSON.parse(JSON.stringify(req.user));
        var newPost = new U_post({
            title: req.body.title,
            image_url: req.body.image_url,
            content: req.body.content,
            owner_id: req.body.owner_id,
            owner_name: name.username,
            c_date: moment()
        }).save();
    }
    return res.redirect('/');
}

exports.set_the_stage = function(req, res){
    var is_admin = false;
    if(req.user){
        // In order to access parts of the object (I do not know why it must be a passport thing
        // we must turn into into a json string, and back into an object or something to have access to the data

        var unwrap_re_wrap = JSON.parse(JSON.stringify(req.user));
        is_admin = unwrap_re_wrap.admin;
    }
    res.render('index', {user: req.user, admin: is_admin});
}

exports.register_user = function(req, res, next){
    Account.register(new Account({username: req.body.username}), req.body.password, function(err) {
        if (err) {
            console.log('error while user register!', err);
            return next(err);
        }
        console.log('user registered!');
        res.redirect('/');
    });
}

exports.can_we_post = function(req, res){
    if(req.user){
        res.render('new_post', {user: req.user});
    }
    else{
        res.render('register', { error: "You need to register to do that!"});
    }
}

exports.get_all_posts = function(req, res){
   U_post.find(function(err, u_posts){
       var post_list = u_posts.map(function(u_post){
           return{
               _id: u_post._id,
               title: u_post.title,
               content: u_post.content,
               image_url: u_post.image_url,
               c_date: u_post.c_date,
               owner_id: u_post.owner_id,
               owner_name: u_post.owner_name
           }
       });
       res.render('all_posts', { post: post_list });
   })
}

exports.get_posts_by_user = function(req, res){
    if(req.params.id == req.user._id){
        U_post.find({owner_id: req.params.id }, function(err, u_posts){
            var user_post_list = u_posts.map(function(u_post){
                return{
                    _id: u_post._id,
                    title: u_post.title,
                    content: u_post.content,
                    image_url: u_post.image_url,
                    c_date: u_post.c_date,
                    owner_name: u_post.username,
                    owner_id: u_post.owner_id
                }
            });
            res.render('posts_by_user', {post: user_post_list});
        });
    }
    else{
        U_post.find({owner_id: req.params.id }, function(err, u_posts){
            var user_post_list = u_posts.map(function(u_post){
                return{
                    _id: u_post._id,
                    title: u_post.title,
                    content: u_post.content,
                    image_url: u_post.image_url,
                    c_date: u_post.c_date,
                    owner_name: u_post.username,
                    owner_id: u_post.owner_id
                }
            });
            res.render('posts_by_another_user', {post: user_post_list});
        });
    }
}

exports.get_user_list = function(req, res){
    var unwrap_a = JSON.parse(JSON.stringify(req.user));
    if(unwrap_a.admin === "true") {
        Account.find(function (err, accounts) {
            var user_list = accounts.map(function (a_name) {
                return {
                    username: a_name.username,
                    id: a_name._id
                }
            });
            res.render('a_dash', {user: user_list});
        });
    }
    else{
        res.redirect('/', {err: "not authorized"});
    }
}

exports.get_and_show_one = function(req, res){
    U_post.find({_id: req.params.id}, function(err, u_posts){
        var one_post = u_posts.map(function(u_post){
            return{
                title: u_post.title,
                content: u_post.content,
                c_date: u_post.c_date,
                owner_name: u_post.owner_name,
                image_url: u_post.image_url
            }
        });
        res.render('view_one', {post: one_post});
    });
}

exports.edit_post = function(req, res){
    U_post.find({_id: req.params.id},function(err, u_posts){
        var load_post_to_edit = u_posts.map(function(u_post){
            return{
                id: u_post._id,
                title: u_post.title,
                content: u_post.content,
                image_url: u_post.image_url,
                c_date: u_post.c_date,
                owner_name: u_post.owner_name,
                owner_id: u_post.owner_id
            }
        });
        res.render('edit_post', {post: load_post_to_edit});
    });
}

exports.delete_post = function(req, res){
    U_post.remove({_id: req.params.id}, function(err){
        if(err){
            res.json(err);
        }
        else{
            // This should be worth Extra-credit. Just saying.
            U_post.find({owner_id: req.params.o_id }, function(err, u_posts){
                var user_post_list = u_posts.map(function(u_post){
                    return{
                        _id: u_post._id,
                        title: u_post.title,
                        content: u_post.content,
                        image_url: u_post.image_url,
                        c_date: u_post.c_date,
                        owner_name: u_post.username,
                        owner_id: u_post.owner_id
                    }
                });
                console.log(user_post_list);
                res.render('posts_by_user', {post: user_post_list});
            });
        }
    });
}

exports.update_post = function(req, res){
    var id = req.body.id;
    delete req.body.id;
    U_post.findByIdAndUpdate(
        id,
        {$set: req.body},
        {new: true},
        function(err, newish_post){
            res.render('all_posts');
        });
}

exports.search_content = function(req,res){
    var q = req.body.q_id;
    var query = {};
    if(q){
        query = {
            content: new RegExp(q, 'i')
        }
    }
    U_post.find(query, function(err, u_posts){
        res.render('all_posts', { post: u_posts})
    });
}