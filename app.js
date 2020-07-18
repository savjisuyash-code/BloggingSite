//APPLICATION CONFIG

var express             = require("express"),           //To include express 
mongoose                = require("mongoose"),          // To include mongoose
methodOverride          = require("method-override"),   // As the html forms only accept POST and GET request and we have to deal with it
passport                = require("passport"),  
LocalStrategy           = require("passport-local"),
bodyParser              = require("body-parser"),                   // parsing the string to object
expressSanitizer        = require("express-sanitizer"),              // To restrict user from using any JS in the code
app                     = express(),                        //Start express
User                    = require("./models/User.js");

mongoose.connect("mongodb://localhost/restful_blogs"); //Connect to database


app.use(bodyParser.urlencoded({extended : true}));

app.use(expressSanitizer());                

app.use(express.static("public"));

app.use(methodOverride("_method"));         //To handle PUT and DELETE requests



//MONGOOSE MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title : String,
    image : String,
    body  : String,
    created: {
        type : Date ,
        default : Date.now
    }
});
var Blog = mongoose.model("Blog" , blogSchema); // All routes can be handled by using Blog


/*Blog.create({
    title : "newtitle" , 
    image : "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallpapertag.com%2Fwallpaper%2Ffull%2Fa%2Ff%2Fa%2F311252-office-background-1920x1080-for-phone.jpg&f=1&nofb=1" ,
    body  : "This is the body of the blog!!"
} , function(err , newBlog){
    if(err){
        console.log(err);
    } else {
        console.log("NEW BLOG ADDED SUCCESSFULLY!");
    }
});*/


// ADD RESTFUL ROUTES

app.get("/" , function(req, res){
   res.redirect("/blogs");
    
})

//INDEX ROUTE
app.get("/blogs" , function(req , res){
    Blog.find({} , function(err , blogs){
        if(err){
            console.log(err);
        } else{
            res.render("index.ejs" , {blogs : blogs});
        }
    }) 
})

//NEW ROUTE
app.get("/blogs/new" , function(req , res){
    res.render("new.ejs");
})

//CREATE ROUTE

app.post("/blogs" , function(req , res){
    
    req.body.blog.body = req.sanitize(req.body.blog.body); //SANITIZING THE INPUT (Reject any JS)
    //CREATE BLOG
    Blog.create(req.body.blog , function(err , newBlog){
        if(err){
            console.log(err);
        } else{
            res.redirect("/blogs");
        }
    })
})

//SHOW ROUTE

app.get("/blogs/:id" , function(req , res){
    Blog.findById(req.params.id , function(err , foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("show.ejs" , {blog : foundBlog})
        }
    })
})

//EDIT ROUTE
app.get("/blogs/:id/edit" , function(req , res){
    Blog.findById(req.params.id , function(err , foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit.ejs" , {blog : foundBlog}) 
        }
    }) 

})

//UPDATE ROUTE
app.put("/blogs/:id" , function(req , res){
    req.body.blog.body = req.sanitize(req.body.blog.body);  //SANITIZING THE INPUT
    //FIND THE ELEMENT BY GIVEN ID AND UPDATE IT WITH THE NEW DATA
    Blog.findByIdAndUpdate(req.params.id , req.body.blog , function(err , updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id)
        }
    })
})

//DELETE ROUTE

app.delete("/blogs/:id" , function(req , res){
   Blog.findByIdAndRemove(req.params.id , function(err){
       if(err){
           console.log(err)
       } else {
           res.redirect("/blogs")
       }
   })
})


//SERVER
app.listen(process.env.PORT , process.env.IP , function(){
    console.log("THE SERVER HAS BEEN HOSTED!")
});