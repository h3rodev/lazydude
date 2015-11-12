Iron.utils.debug = true;

Router.route('/', function () {
  this.layout('ApplicationLayout', {

    data: {
      title: 'Master Title'
    }
  });

  this.render('home');
});

Router.route('/about', function () {
  this.layout('ApplicationLayout', {

    data: {
      title: 'Master Title'
    }
  });

  this.render('about');
});
