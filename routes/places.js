var express = require("express");
var router = express.Router(); //used for exporting the routes
var Place = require("../models/place");
var User = require("../models/user");
var mongoose = require('mongoose');
var middleware = require("../middleware"); //automatically require the content of index js
var db = mongoose.connection;
var moment = require('moment');
//index campground
router.get("/",function(req,res)
{
    //get all campgrounds from db
    //req.user gives current user
    
    Place.find({},function(err,allPlaces)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("places/index",{data: allPlaces,currentUser: req.user});
        }
    });
    // res.render("campgrounds",{data: campgrounds});
});


//making a new campground
router.post("/",middleware.isLoggedIn, function(req,res)
{
   //get data from from and add to campfround array
   var name=req.body.name;
   var image=req.body.image;
   var dsc=req.body.description;
   var author = {
       id: req.user._id,
       username: req.user.username
   };
   var val={name: name,image: image,description: dsc,author: author};
   //create a new campground and save to a database 
   Place.create(val,function(err,nval)
   {
       if(err)
       {
           console.log(err);
       }
       else
       {
           //redirect back to campground
           res.redirect("/places"); //default is a get request when redirecting so get method will run 
       }
   });
});

router.get("/search",function(req,res)
{
   res.render("search");
 
});

router.post("/search",function(req,res)
{
  var placename=req.body.search;
 // var query=Place.find({name:placename},{_id:1});

    var interestedCount;
    var confirmedCount;
          Place.aggregate([
          { $match : { name : placename } },
          { $project : { count : { $size : "$confirmed" } } }
          ]).exec(function(err, result) {
            if(err)
              throw err;
           result.forEach(function(user){
              console.log("========hereconfirmcount======" + user.count);
              confirmedCount=user.count;

           });
        //   return res.json(result);
           console.log("confirmcount" + confirmedCount);

         });

            Place.aggregate([
              { $match : { name :  placename } },
              { $project : { count : { $size : "$interested" } } }
              ]).exec(function(err, result) {
                if(err)
                  throw err;
                result.forEach(function(user){
                  console.log("========hereinterestedcount======" + user.count);
                  interestedCount=user.count;

           });
                console.log("interestedCount" + interestedCount);
               
            });





   
   Place.findOne({name:placename}).populate("comments").exec(function(err,val)
    {
        if(err || !val)
        {
            console.log("search err");
            res.redirect("/places/user");
        }
        else
        {
          console.log("---------" + val);
          var strng=JSON.stringify(val)
          console.log("=========" + strng);
          console.log("=========id " + val.description);
          console.log("=========id " + strng._id);
          res.render("userDashboard/addViewComment",{val: val,interestedCount:interestedCount,confirmCount:confirmedCount});

           
        }
    });

  
 
});

///search admin

router.post("/searchadmin",function(req,res)
{
  var placename=req.body.search;
 // var query=Place.find({name:placename},{_id:1});


   var interestedCount;
    var confirmedCount;
          Place.aggregate([
          { $match : { name : placename } },
          { $project : { count : { $size : "$confirmed" } } }
          ]).exec(function(err, result) {
            if(err)
              throw err;
           result.forEach(function(user){
              console.log("========hereconfirmcount======" + user.count);
              confirmedCount=user.count;

           });
        //   return res.json(result);
           console.log("confirmcount" + confirmedCount);

         });

            Place.aggregate([
              { $match : { name :  placename } },
              { $project : { count : { $size : "$interested" } } }
              ]).exec(function(err, result) {
                if(err)
                  throw err;
                result.forEach(function(user){
                  console.log("========hereinterestedcount======" + user.count);
                  interestedCount=user.count;

           });
                console.log("interestedCount" + interestedCount);
               
            });





   
   Place.findOne({name:placename}).populate("comments").exec(function(err,val)
    {
        if(err || !val)
        {
            console.log("search err");
            res.redirect("/places/");
        }
        else
        {
          console.log("---------" + val);
          var strng=JSON.stringify(val)
          console.log("=========" + strng);
          console.log("=========id " + val.description);
          console.log("=========id " + strng._id);
            res.render("places/show",{val: val,interestedCount:interestedCount,confirmCount:confirmedCount});

           
        }
    });

  
 
});

//search manager
router.post("/searchmanager",function(req,res)
{
  var placename=req.body.search;
 // var query=Place.find({name:placename},{_id:1});


    var interestedCount;
    var confirmedCount;
          Place.aggregate([
          { $match : { name : placename } },
          { $project : { count : { $size : "$confirmed" } } }
          ]).exec(function(err, result) {
            if(err)
              throw err;
           result.forEach(function(user){
              console.log("========hereconfirmcount======" + user.count);
              confirmedCount=user.count;

           });
        //   return res.json(result);
           console.log("confirmcount" + confirmedCount);

         });

            Place.aggregate([
              { $match : { name :  placename } },
              { $project : { count : { $size : "$interested" } } }
              ]).exec(function(err, result) {
                if(err)
                  throw err;
                result.forEach(function(user){
                  console.log("========hereinterestedcount======" + user.count);
                  interestedCount=user.count;

           });
                console.log("interestedCount" + interestedCount);
               
            });

   Place.findOne({name:placename}).populate("comments").exec(function(err,val)
    {
        if(err || !val)
        {
            console.log("search err");
            res.redirect("/places/manager");
        }
        else
        {
          console.log("---------" + val);
          var strng=JSON.stringify(val)
          console.log("=========" + strng);
          console.log("=========id " + val.description);
          console.log("=========id " + strng._id);
            res.render("managerDashboard/manager_comment",{val: val,interestedCount:interestedCount,confirmCount:confirmedCount});

           
        }
    });

  
 
});


router.get("/user",function(req,res)
{
    //get all campgrounds from db
    //req.user gives current user
    
    Place.find({},function(err,allPlaces)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("userDashboard/userdash",{data: allPlaces,currentUser: req.user});
        }
    });
    // res.render("campgrounds",{data: campgrounds});
});

router.get("/manager",function(req,res)
{
    //get all campgrounds from db
    //req.user gives current user
    
    Place.find({},function(err,allPlaces)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("managerDashboard/managerDash",{data: allPlaces,currentUser: req.user});
        }
    });
    // res.render("campgrounds",{data: campgrounds});
});


//a form to add new forms 
router.get("/new",middleware.isLoggedIn, function(req, res) 
{
    res.render("places/new");
});

//order is important
//shows more info about that campground
router.get("/:id",function(req, res) 
{
    
    //find the campground with id
    var id=req.params.id;
    //we use the populate function for this 
    
    var interestedCount;
    var confirmedCount;
          Place.aggregate([
          { $match : { _id : new mongoose.Types.ObjectId(id) } },
          { $project : { count : { $size : "$confirmed" } } }
          ]).exec(function(err, result) {
            if(err)
              throw err;
           result.forEach(function(user){
              console.log("========hereconfirmcount======" + user.count);
              confirmedCount=user.count;

           });
        //   return res.json(result);
           console.log("confirmcount" + confirmedCount);

         });

            Place.aggregate([
              { $match : { _id :  new mongoose.Types.ObjectId(id) } },
              { $project : { count : { $size : "$interested" } } }
              ]).exec(function(err, result) {
                if(err)
                  throw err;
                result.forEach(function(user){
                  console.log("========hereinterestedcount======" + user.count);
                  interestedCount=user.count;

           });
                console.log("interestedCount" + interestedCount);
               
            });



    Place.findById(req.params.id).populate("comments").exec(function(err,val)
    {
        if(err || !val)
        {
            console.log(err);
        }
        else
        {
            res.render("places/show",{val: val,interestedCount:interestedCount,confirmCount:confirmedCount});
        }
    });
    //show template
});

router.get("/user/:id",function(req, res) 
{
    //find the campground with id
    var id=req.params.id;
    console.log("more info clicked " + id);
    //we use the populate function for this 

    var interestedCount;
    var confirmedCount;
          Place.aggregate([
          { $match : { _id : new mongoose.Types.ObjectId(id) } },
          { $project : { count : { $size : "$confirmed" } } }
          ]).exec(function(err, result) {
            if(err)
              throw err;
           result.forEach(function(user){
              console.log("========hereconfirmcount======" + user.count);
              confirmedCount=user.count;

           });
        //   return res.json(result);
           console.log("confirmcount" + confirmedCount);

         });

            Place.aggregate([
              { $match : { _id :  new mongoose.Types.ObjectId(id) } },
              { $project : { count : { $size : "$interested" } } }
              ]).exec(function(err, result) {
                if(err)
                  throw err;
                result.forEach(function(user){
                  console.log("========hereinterestedcount======" + user.count);
                  interestedCount=user.count;

           });
                console.log("interestedCount" + interestedCount);
               
            });





    Place.findById(id).populate("comments").exec(function(err,val)
    {
        if(err || !val)
        {
            console.log("--------------err" + err);
        }
        else
        {
          

     //     console.log("-------------------in user/:id " + JSON.stringify(val));
            res.render("userDashboard/addViewComment",{val: val,interestedCount:interestedCount,confirmCount:confirmedCount});
        }
    });
    //show template
});

router.get("/manager/:id",function(req, res) 
{
    //find the campground with id
    var id=req.params.id;
    //we use the populate function for this 

    var interestedCount;
    var confirmedCount;
          Place.aggregate([
          { $match : { _id : new mongoose.Types.ObjectId(id) } },
          { $project : { count : { $size : "$confirmed" } } }
          ]).exec(function(err, result) {
            if(err)
              throw err;
           result.forEach(function(user){
              console.log("========hereconfirmcount======" + user.count);
              confirmedCount=user.count;

           });
        //   return res.json(result);
           console.log("confirmcount" + confirmedCount);

         });

            Place.aggregate([
              { $match : { _id :  new mongoose.Types.ObjectId(id) } },
              { $project : { count : { $size : "$interested" } } }
              ]).exec(function(err, result) {
                if(err)
                  throw err;
                result.forEach(function(user){
                  console.log("========hereinterestedcount======" + user.count);
                  interestedCount=user.count;

           });
                console.log("interestedCount" + interestedCount);
               
            });





    Place.findById(id).populate("comments").exec(function(err,val)
    {
        if(err || !val)
        {
            console.log("--------------err" + err);
        }
        else
        {
          

     //     console.log("-------------------in user/:id " + JSON.stringify(val));
            res.render("managerDashboard/manager_comment",{val: val,interestedCount:interestedCount,confirmCount:confirmedCount});
        }
    });
   
    //show template
});


//EDIT CAMPGROUND
router.get("/:id/edit",middleware.checkOwner,function(req, res) 
{
    Place.findById(req.params.id,function(err, val) 
    {
        if(err || !val)
        {
            res.redirect("back");
        }
        else
        {
            res.render("places/edit",{place: val}); 
        }
    });
});

router.post("/interested/:id",function(req, res) 
{

  console.log("----------------interested clicked------------------");

  Place.findById(req.params.id).exec(function(err,val)
   {
        if(err || !val)
        {
            console.log(err);
        }
        else
        {
          console.log("----------------in places interested----------------");
            var id=req.user._id;
            val.interested.push(id);
           // val.save();

             Place.update({ _id: req.params.id }, 
                                   { $addToSet: { interested:id } }, 
                                      function(err) { /*...*/ }
                          );

            User.findById(req.user._id).exec(function(err,val1)
             {
                  if(err || !val1)
                  {
                      console.log(err);
                  }
                  else
                  {
                    console.log("----------------in places interested----------------");
                      var placeid=req.params.id;
                      val1.interested.push(placeid);
                      //val1.save();
                       User.update({ _id: req.user._id }, 
                                   { $addToSet: { interested: placeid } }, 
                                      function(err) { /*...*/ }
                          );
                      res.redirect("/places/user");
                  }
              });
            
        }
    });
});

router.post("/confirm/:id",function(req, res) 
{
  var date1=req.body.date;
  var date = moment(date1,"YYYY-MM-DD");
  console.log("----------------interested clicked------------------");
  console.log(" date ================================= " +req.body.date);
  Place.findById(req.params.id).exec(function(err,val)
   {
        if(err || !val)
        {
            console.log(err);
        }
        else
        {
          console.log("----------------in places interested----------------");
            var id=req.user._id;
            //val.confirmed.push(id);
            //val.save();
             Place.update({ _id: req.params.id }, 
                                   { $addToSet: { confirmed:id } }, 
                                      function(err) { /*...*/ }
                          );
             User.findById(req.user._id).exec(function(err,val1)
             {
                  if(err || !val1)
                  {
                      console.log(err);
                  }
                  else
                  {
                    console.log("----------------in places interested----------------");
                      var placeid=req.params.id;
                     // val1.confirmed.push({id: placeid,date: date});
                     // val1.save();
                      User.update({ _id: req.user._id }, 
                                    { $addToSet: { confirmed: {id: placeid,date: date} } }, 
                                       function(err) { /*...*/ }
                           );
                       User.update({ _id: req.user._id }, 
                                    { $addToSet: { confirmedPlaceId: placeid } }, 
                                       function(err) { /*...*/ }
                           );
                      res.redirect("/places/user");
                  }
              });
           
        }
    });
});

router.get("/getConfirmCount/:name",function(req, res) 
{
  var id= req.params.name; 
   console.log("here" + id);


  Place.aggregate([
    { $match : { name : id } },
    { $project : { count : { $size : "$confirmed" } } }
    ]).exec(function(err, result) {
      if(err)
        throw err;
     result.forEach(function(user){
        console.log("========count======" + user.count);

     });
      console.log();
      return res.json(result);
});
});

router.get("/getInterestedCount/:name",function(req, res) 
{
  var id= req.params.name; 
   console.log("here" + id);

/*  db.collection("places").aggregate({$match:{_id:req.params.id}},{$project:{count:{$size:"$interested"}}}, function(err, res) {
      if (err) throw err;
   //  console.log("1 document inserted " + query);
      console.log(res + " here");
      //db.close();
     // return 1;
  });*/


  Place.aggregate([
    { $match : { name : id } },
    { $project : { count : { $size : "$interested" } } }
    ]).exec(function(err, result) {
      if(err)
        throw err;
      console.log("count" + result);
      return res.json(result);
});
});


router.get("/isInterested/:name",function(req, res) 
{
  var id= req.params.name; 
  console.log("in isInterested" + req.user._id);
  var userid=req.user._id;
  // console.log("here" + req.user._id);


Place.find({$and:[{name:id},{"interested": {"$in":[userid] }}]}).exec(function (err, data){
        if(err){
            return console.log("error");
        } else {
          console.log("found" + data);
           return res.json(data);
        }
    });

 /* Place.find({name:id},{interested:req.user._id}).exec(function(err, result) {
      if(err)
        throw err;
      console.log("count" + result);
      return res.json(result);
});*/
});


router.get("/isConfirmed/:name",function(req, res) 
{
  var id= req.params.name; 
  console.log("here" + req.user._id);
  var userid=req.user._id;


  Place.find({$and:[{name:id},{"confirmed": {"$in": [userid] }}]}).exec(function (err, data){
        if(err){
            return console.log("error");
        } else {
          console.log("found" + data);
           return res.json(data);
        }
    });

 /* Place.find({name:id},{interested:req.user._id}).exec(function(err, result) {
      if(err)
        throw err;
      console.log("count" + result);
      return res.json(result);
});*/
});

router.post("/showInterested",function(req,res){

       var id=req.user._id;
      console.log("in showInterested" +id);
     // res.render("userDashboard/showInterested");
        
        User.findById(id).populate("interested").exec(function(err,val)
        {
            if(err || !val)
            {
                console.log("~~~~~~~err~~~~~~~");
            }
            else
            {
                 console.log("~~~~~~~ no err~~~~~~~");
                res.render("userDashboard/showInterestedPlaces",{val: val});
            }
        });

});


router.post("/showConfirmed",function(req,res){

       var id=req.user._id;
      console.log("in showConfirmed" +id);
     // res.render("userDashboard/showInterested");
        
        User.findById(id).populate("confirmedPlaceId").exec(function(err,val)
        {
            if(err || !val)
            {
                console.log("~~~~~~~err in show confirmed~~~~~~~");
            }
            else
            {
                 console.log("~~~~~~~ no err~~~~~~~");
                 console.log("------------------------query result " + JSON.stringify(val));
                res.render("userDashboard/showConfirmedPlaces",{val: val});
            }
        });

});
router.post("/showInterestedUsers/:id",function(req,res){

       var id=req.params.id;
      console.log("in showInterestedUsers" +id);
     // res.render("userDashboard/showInterested");
        
        Place.findById(id).populate("interested").exec(function(err,val)
        {
            if(err || !val)
            {
                console.log("~~~~~~~err~~~~~~~");
            }
            else
            {
                 console.log("~~~~~~~ no err~~~~~~~");
                res.render("userDashboard/showInterestedUsers",{val: val});
            }
        });

});

router.post("/showConfirmedUsers/:id",function(req,res){

       var placeid=req.params.id;
       var month,year,date;
      console.log("in showConfirmedUsers" +placeid);
     // res.render("userDashboard/showInterested");
        
        User.find({_id:req.user._id},{confirmed:{$elemMatch:{id:placeid,groupFormed:true}},_id:0,"confirmed.date":1})
              .populate("confirmedPlaceId")
              .exec(function (err, data){
                    if(err){
                        return console.log("error" + err);
                    } else {
                      console.log("found" + data);
                        if(data[0].confirmed[0]!=null)
                        {
                               date=data[0].confirmed[0].date;
                                console.log("lllllllllllllllll "+ date,date.getMonth(),date.getFullYear());
                                month=date.getMonth()+1;
                                year=date.getFullYear();
                                var date1= year + "-" + month + "-01T00:00:00.000Z";
                                var date2= year + "-" + month + "-31T00:00:00.000Z";
                                 User.find({confirmed:{$elemMatch:{id:placeid , date : {$gte: new Date(date1),$lt: new Date(date2)},groupFormed:true}}})
                                  .populate("confirmedPlaceId")
                                  .exec(function (err, data){
                                        if(err){
                                            return console.log("error" + err);
                                        } else {
                                          console.log("found" + data);
                                       res.render("userDashboard/showConfirmedUsers",{val: data,placeid:placeid});
                                       //   return res.json(data);
                                        }
                                    }); 
                        }
                        else
                        {

                         res.render("userDashboard/showConfirmedUsers",{val: data ,placeid:placeid}); 
//                        return res.json(data);
                        }
                    }
                });


             
             
           

});

router.post("/showConfirmedUsersManager/:id",function(req,res){

       var id=req.params.id;
      console.log("in showConfirmedUsers" +id);
     // res.render("userDashboard/showInterested");
        
        Place.findById(id).populate("confirmed").exec(function(err,val)
        {
            if(err || !val)
            {
                console.log("~~~~~~~err~~~~~~~");
            }
            else
            {
               console.log("~~~~~~~ no err~~~~~~~");
              
                res.render("managerDashboard/showConfirmedUsers",{val: val,moment:moment});
             
            }
        });

});


router.post("/showNewUsersManager/:id",function(req,res){

       var id=req.params.id;
      console.log("in showNewUsersManager" +id);
     // res.render("userDashboard/showInterested");

      User.find({confirmed:{$elemMatch:{id:id,groupFormed:false}}}).populate("confirmedPlaceId")
                        .exec(function (err, data){
                              if(err){
                                  return console.log("error" + err);
                              } else {
                                console.log("found" + data);

                              res.render("managerDashboard/newUsers",{val:data,placeid:id});
                              //return res.json(data);
                              }
                          });
        
      

});


router.post("/formGroups/:id",function(req, res) 
{
  var placeid=req.params.id;
  var month=req.body.month;
  var year=req.body.year;
  var date1= year + "-" + month + "-01T00:00:00.000Z";
  var date2= year + "-" + month + "-31T00:00:00.000Z";
  console.log(date1);
  console.log(date2);


  User.update({confirmed:{$elemMatch:{id:placeid , date : {$gte: new Date(date1),$lt: new Date(date2)}}}}
    ,{$set:{"confirmed.$.groupFormed" : true}},{multi:true})
  .exec(function(err,data){
      if(err)
        {
          console.log("-------------err in update");

        }
        else
        {

              User.find({confirmed:{$elemMatch:{id:placeid , date : {$gte: new Date(date1),$lt: new Date(date2)},groupFormed:true}}})  .populate("confirmedPlaceId")
              .exec(function (err, data){
                    if(err){
                        return console.log("error" + err);
                    } else {
                      console.log("found" + data);

                       Place.findById(placeid,function(err,val)
                        {
                           if(err)
                           {
                               res.redirect("/manager");
                           }
                           else
                           {
                               val.hasFormedGroups = true;
                               val.save();
                           }
                        });
//                       return res.json(data);
//                        res.render("managerDashboard/groupsFormed",{val:data,placeid:placeid});
                        res.redirect("/places/manager");
 
                    }
                });

        }
       
  });


});

//({_id:req.user._id},{confirmed:{$elemMatch:{id:placeid,groupFormed:true}},_id:0,"confirmed.date":1})
 //             .populate("confirmedPlaceId")


router.post("/viewGroups/:id",function(req, res) 
{
  var placeid=req.params.id;
  var month=req.body.month;
  var year=req.body.year;
  var date1= year + "-" + month + "-01T00:00:00.000Z";
  var date2= year + "-" + month + "-31T00:00:00.000Z";
  console.log(date1);
  console.log(date2);

   User.find({confirmed:{$elemMatch:{id:placeid , date : {$gte: new Date(date1),$lt: new Date(date2)},groupFormed:true}}}
    )
   .populate("confirmedPlaceId")
              .exec(function (err, data){
                    if(err){
                        return console.log("error" + err);
                    } else {
                      console.log("found" + data);
                     // return res.json(data);
                    res.render("managerDashboard/viewFormedGroups",{val:data,placeid:placeid,month:month,year:year});

                    }
                });


});



router.post("/uninterested/:id",function(req, res) 
{

  console.log("----------------uninterested clicked------------------");

  Place.findById(req.params.id).exec(function(err,val)
   {
        if(err || !val)
        {
            console.log(err);
        }
        else
        {
          console.log("----------------in places uninterested----------------");
            var id=req.user._id;
            val.interested.push(id);
           // val.save();

             Place.update({ _id: req.params.id }, 
                                   { $pullAll: { interested:[id] } }, 
                                      function(err) { /*...*/ }
                          );

            User.findById(req.user._id).exec(function(err,val1)
             {
                  if(err || !val1)
                  {
                      console.log(err);
                  }
                  else
                  {
                    console.log("----------------in places interested----------------");
                      var placeid=req.params.id;
                      val1.interested.push(placeid);
                      //val1.save();
                       User.update({ _id: req.user._id }, 
                                   { $pullAll: { interested: [placeid] } }, 
                                      function(err) { /*...*/ }
                          );
                      res.redirect("/places/user");
                  }
              });
            
        }
    });
});


router.post("/unconfirm/:id",function(req, res) 
{
  var date1=req.body.date;
  var date = moment(date1,"YYYY-MM-DD");
  console.log("----------------interested clicked------------------");
  console.log(" date ================================= " +req.body.date);
  Place.findById(req.params.id).exec(function(err,val)
   {
        if(err || !val)
        {
            console.log(err);
        }
        else
        {
          console.log("----------------in places interested----------------");
            var id=req.user._id;
            //val.confirmed.push(id);
            //val.save();
             Place.update({ _id: req.params.id }, 
                                   { $pullAll: { confirmed:[id] } }, 
                                      function(err) { /*...*/ }
                          );
             User.findById(req.user._id).exec(function(err,val1)
             {
                  if(err || !val1)
                  {
                      console.log(err);
                  }
                  else
                  {
                    console.log("----------------in places interested----------------");
                      var placeid=req.params.id;
                     // val1.confirmed.push({id: placeid,date: date});
                     // val1.save();
                      User.update({ _id: req.user._id }, 
                                    { $pull: { confirmed: {id: placeid} } }, 
                                       function(err) { /*...*/ }
                           );
                       User.update({ _id: req.user._id }, 
                                    { $pullAll: { confirmedPlaceId: [placeid] } }, 
                                       function(err) { /*...*/ }
                           );
                      res.redirect("/places/user");
                  }
              });
           
        }
    });
});



//UPDATE CAMPGROUND
router.put("/:id",middleware.checkOwner,function(req,res)
{
    
    Place.findByIdAndUpdate(req.params.id,req.body.camp,function(err,val)
    {
        if(err)
        {
            res.redirect("/places");
        }
        else
        {
            res.redirect("/places/"+req.params.id);
        }
    });
});
//DELETE CAMPGROUND
router.get("/delete/:id",middleware.checkOwner,function(req,res)
{
    Place.findByIdAndRemove(req.params.id,function(err)
    {
       if(err)
       {
           res.redirect("/places");
       }
       else
       {
           res.redirect("/places");
       }
    });
});

router.get("/edit/:id",middleware.isLoggedIn, function(req, res) 
{

    console.log("-------------edit place clicked----------------");

    Place.findById(req.params.id,function(err,val)
    {
       if(err)
       {
           res.redirect("/places");
       }
       else
       {           
           res.render("places/updatePlace",{val:val});
       }
   
    });
});



router.put("/edit/:id",middleware.checkOwner,function(req,res)
{
   var placename = req.body.name;
    var imageurl = req.body.image;
    var placedesc = req.body.description;

    console.log("````````here" + placename + imageurl + placedesc);
   

        
   
    Place.findById(req.params.id,function(err,val)
    {
       if(err)
       {
           res.redirect("/places");
       }
       else
       {
           val.name = placename;
           val.image = imageurl;
           val.description = placedesc;
           val.save();
           
           res.redirect("/places");
       }
    });
});


//middleware




module.exports = router;