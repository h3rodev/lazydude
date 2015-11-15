Iron.utils.debug = true;

Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
  this.render('home');
});

Router.route('/title/:id', function () {
  this.render('title', {
    data: function () {
      return Series.findOne({ url:this.url.replace('http://localhost:3000','') });
    }
  });
});
