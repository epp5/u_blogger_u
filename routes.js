var passport = require('passport');
var Account = require("./models/account.js");
var router = require('express').Router();
var p_handler = require('./lib/p_handler');

// Modified ---------------------------- //
router.get('/', p_handler.set_the_stage);
// ------------------------------------- //

// Shrunk down ------------------------------------------------------------- //
router.get('/register', function(req, res) { res.render('register', {}); });
router.post('/register', p_handler.register_user);
// ------------------------------------------------------------------------- //


router.get('/make_new_post', p_handler.can_we_post);
// Determines if user may post, if so, directs to posting form

router.get('/admin/list', p_handler.get_user_list);
// This loads the admin dashboard

router.get('/see_this_users_posts/:id', p_handler.get_posts_by_user);
// This handles the viewing of user's own and other posts

router.get('/get_all_posts', p_handler.get_all_posts);
// This loads all posts from the database

router.get('/view/:id', p_handler.get_and_show_one);
// This loads a single post for viewing

router.get('/edit/:id', p_handler.edit_post);
// This LOADS a post for editing, prepares it

router.get('/delete/:id/:o_id', p_handler.delete_post);
// This deletes a post from the database by post ID, and returns back to post screen (by keeping track of owner)

router.post('/author', p_handler.add_new);
// This writes a new post to the database

router.post('/save_our_edit', p_handler.update_post);
// This uploads an edit to the database

router.post('/search', p_handler.search_content);
// This queries the content field of the database for words


// Un-modified ---------------------------------------------------------------------------------- //
router.get('/login', function(req, res) { res.render('login', {user: req.user}); });
router.post('/login', passport.authenticate('local'), function(req, res) { res.redirect('/'); });
router.get('/logout', function(req, res) { req.logout(); res.redirect('/'); });
module.exports = router;