Series = new Mongo.Collection("series");

if (Meteor.isClient) {
  Template.home.helpers({
    data: function () {
      return Series.find( {}, {sort: { year: -1 } } ).fetch();
    }
  });

  Tracker.autorun(function () {
    Meteor.subscribe('series');
  });

  Template.title.events({
    'click .showvideo': function (event) {
      var target = event.currentTarget.id.toLowerCase()

        Meteor.call('showvideo', {v:target+".html"}, function(error, result) {
          if (!error) {
            console.log(result);
          };
        });
      
      event.preventDefault();
    }
  });

  // Meteor.call('getSeriesDetails', function(error, result) {
  //   if (!error) {
  //     console.log(result);      
  //     return result;
  //   };
  // });
};

if (Meteor.isServer) {
  Meteor.startup(function () {

    //Get Movie Series Details
    Meteor.methods({

      showvideo: function(target){
        var cheerio = Meteor.npmRequire('cheerio');
        var video = '';
        var url = "http://thewatchseries.to/episode/"+target.v;
        
        var tlink = [];

        Meteor.http.call("GET",url,function(error,result){
          $ = cheerio.load(result.content);
          $('tr.download_link_gorillavid.in').each(function(){
            var vtarget = $(this).find('.buttonlink').attr('href');
          
            var links = {
              link:vtarget
            };
          
            console.log(vtarget);
          });

        });
        return tlink;    
      },
    });


    //Get Movie Series Details
    Meteor.methods({

      getSeriesDetails: function(){
        var cheerio = Meteor.npmRequire('cheerio');
        var target = "/title/tt0412142/";
        var seasonNumber = 1;
        var url = "http://www.imdb.com"+target+"episodes?season="+seasonNumber;
        Meteor.http.call("GET",url,function(error,result){
          $ = cheerio.load(result.content);
            
            episodes = [];
            
            $('.list_item').each(function(i,element){
              var name = $('.parent > h3 > a').text();
              var seaon = $('#bySeason').val();
              var title = $(this).find('.info > strong > a').text();
              var year = $(this).find('.airdate').text();
              var epnum = $(this).find('meta[itemprop=episodeNumber]').attr('content');
              var desc = $(this).find('.item_description').text();
              var thumb = $(this).find('.hover-over-image.zero-z-index > img').attr('src');
              var cleanthumb = thumb.match(/\b_V1[^\b]*|^_V1[^\b]*/gi);

              var movie = {
                title   : name.trim(),
                name    : title.trim(),
                season  : seaon,
                epnum   : epnum,
                year    : year.trim(),
                desc    : desc.trim(),
                thumb   : thumb.replace(cleanthumb,'').trim(),
              };

              episodes.push( movie );
              //console.log( Series.find( { title:movie.title } ).count() !== 0 );
              //console.log( Series.find( { videos:[{name:movie.name}] } ).count() === 0);

              if ( Series.find( { title:movie.title } ).count() !== 0 ){
                var id = Series.find( { title:movie.title } ).fetch();
              
                   if ( id[0].videos['name'] !== movie.name ) {
                      console.log("Saving " +movie.name+ " to Movie videos[] ");

                      Series.update(id[0]._id, {$addToSet: {videos: movie}});

                   } else { console.log(movie.name+ " is Already in the database") };
              };
              
            });
                      
        });
        return episodes;    
      },
    });

    Meteor.publish("series", function () {
        return Series.find();
      });

  });

}