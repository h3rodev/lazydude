Series = new Mongo.Collection("series");
if (Meteor.isClient) {

Template.home.helpers({
  data: function () {
    return Series.find().fetch();
  }
});

}

if (Meteor.isServer) {
  Meteor.startup(function () {

    Meteor.methods({
      clear: function(){
        Series.remove({});
      }
    });

    // On server startup, if the database is empty, create some initial data.
    if (Series.find().count() === 0) {
      Series.insert({
        title   :"The Walking Dead",
        desc    :"Sheriff Deputy Rick Grimes leads a group of survivors in a world overrun by zombies.",
        year    :2010,
        rating  :8.6,
        url     :"/title/tt1520211/",
        image   :"http://ia.media-imdb.com/images/M/MV5BMTk5ODI1NTA2NF5BMl5BanBnXkFtZTgwODg2NjU4NjE@",
        genre   :['Horror', 'Drama']
      });
      console.log('inserting dummy data');
    }

  });
}