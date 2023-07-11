// *** Constant Require Section:

const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

// *** Body Parser ***
app.use(bodyParser.urlencoded({extended: true}));

// *** Static Folder ***
app.use(express.static("Public"));
// app.use("/public", express.static(path.join(__dirname, "public")));

// app.use("/Public", express.static(path.join(__dirname, "Public")));

// *** Tracking HTML File ***
app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

// *** Signup Route ***
app.post("/", function(req, res){

    const firstName = req.body.fname;
	const lastName = req.body.lname;
	const email = req.body.email;

    // *** Construct Requesting data ***
    const data = {
        members: [
            {
              email_address: email,
              status: 'subscribed',
              merge_fields: {
                  FNAME: firstName,
                  LNAME: lastName
              }
            }
          ]
    }

    // *** Stringify inputed data ***
    const jsonData = JSON.stringify(data);

    // *** url = "https://<data center>.api.mailchimp.com/3.0/lists/{listID}";
    const url = "https://us21.api.mailchimp.com/3.0/lists/7dbc726493";

    const options = {
        method: "POST",
        auth: "text or name:f5fd009eab6269343fa95f47ebaa17b2-us21"

    };

    // *** Requesting and send back our data to mailchimp ***
    const request = https.request(url, options, function(response){

      if(response.statusCode==200){
        res.sendFile(__dirname+"/success.html");
      }
      else{
        res.sendFile(__dirname+"/failure.html");
      }
        response.on("data", function(data){

            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();


});
app.post("/failure" ,function(req,res){
  res.redirect("/");
});
app.listen(process.env.PORT||3000, function(){
    console.log("Server started on port: 3000!");
});
