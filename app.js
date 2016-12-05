//'use strict';
console.log("APPs.js loaded-db");
//default login
var adminuser="admin";
//var adminpass="acc9281";
var adminpass="admin";

//Require items to start the process
var http = require('http');
var path = require('path');
var url = require("url");
var express = require('express');
var morgan = require('morgan');
var fs=require('fs') ;
var crypto = require('crypto');
var router = express();
var app = http.createServer(router);
var publicDir = require('path').join(__dirname, '/client');
var nodemailer = require("nodemailer");
var smtpPool = require('nodemailer-smtp-pool');
router.use(express.bodyParser());
router.use(express.static(publicDir));
router.use(express.cookieParser() );
router.use(express.session({secret: '1234567890QWERTY'}));
console.log("app.js processed");
testMode = false;

// add loggin middleware to log each request
// see: http://www.npmjs.org/package/morgan
router.use(morgan('dev'));

//mongo connection setup
var mongojs=require("mongojs");

var databaseUrl =  "mongodb://localhost:27017/MLSecation";
var collections = ["tests","modules","users","clients","questions","messages","rewards"];


// old version var db = mongojs.connection(databaseUrl, collections);
var db = mongojs(databaseUrl, collections); //new version
var ObjectId = mongojs.ObjectId;

var databaseUrl2 =  "mongodb://localhost:27017/emailMarketing";
var collections2 = ["badEmailAddresses","emailTemplates","us2014agents"];

// old version var db = mongojs.connection(databaseUrl, collections);
var db2 = mongojs(databaseUrl2, collections2); //new version
var ObjectId2 = mongojs.ObjectId;

app.listen(process.env.PORT || 8080, process.env.IP || "0.0.0.0", function(){
    var addr = app.address();
    console.log("app/server listening at", addr.address + ":" + addr.port);
});

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}

//Migrated Functions

function getExtension(filename) {
    ////console.log(filename)
    var z=filename.split('.').pop();
    ////console.log(z)
    return z;
}

///+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

var mailer = nodemailer.createTransport({
    host: 'smtp.1and1.com',
    port: 587,
    auth: {
        user: 'chris@prism-llc.com',
        pass: '$Godlovesme2'
    }
});

var mailer1 = nodemailer.createTransport({
    host: 'smtp.mailgun.org',
    port: 587,
    auth: {
        user: 'postmaster@mg.buytoinvestfinancing.com',
        pass: '495aa8bb87704ec0431143398afe0bbe'
    }
});

mailer.verify(function(error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages');
    }
});

router.get('/sendEmails3/',function (req, res) {
    console.log("Hello from sendEmail2");
    res.send("good email. ");
})

router.get('/sendEmails/',function(req,response){
//Find the template we will be working with  - db.getCollection('emailTemplates').findOne({ _id: new ObjectId("57ccd60a5564f2e25dffaee8")})
//Need to get unprocessed emails
//Need to update agent to show processed
//insert update daily counter
//insert update available email counter on rotation
//If bad with correct error message delete the email from the master
    console.log("Hello from sendEmail-1");
    for (var i = 0; i < 3; i++) {
        var templateID = '57ccd60a5564f2e25dffaee8';
        var emailState = 'ID';
        var campaignName = "New NODE email";
        var limitCount = 3;
        var stateOut = "ND";
        var newEmailSubject;
        var outMessage;
        var emailText;
        var emailHTML2;
        console.log(`Counter number - ${i}`);
        db2.emailTemplates.find({_id:db2.ObjectId(templateID)}).toArray(
            // cursor.each(function(err, doc) {
            function (err, items) {
                if (items.length == 0) {
                    //response.send("{\"results\":false}")
                    console.log("Nothing found ");
                } else if (err) {
                    //response.send(items);
                    console.log("Error on templates");
                    console.log("Error on templates ");
                } else {
                    //Need to get email address from the db based on form input
                    //var player = new GamePlayer("John Smith", 15, 3);
                    console.log("Getting into the db");
                    var workingEmailsAddress =   db2.us2014agents.find({"OfficeState": stateOut, $or: [{"campaignSent" :null} , {"campaignSent" : {$nin: [ "Asset loans" ]}}]}).limit( limitCount ).toArray(
                        function(err, items) {
                            if (items.length==0){
                                //response.send("{\"results\":false}")
                                console.log("Inside db call-1");
                            }else if (items.length > 0){

                                    //response.send(items);
                                    console.log("Inside db call-2 items greater than 0");
                                    //EmailAddressByState("ND", "Asset loans", 3);
                                    //if (workingEmailsAddress.length > 0) { printjson (workingEmailsAddress[0]); };
                                    console.log(items);
                                    //newEmailSubject= items[0].emailTemplateTitle;
                                    //emailText = items[0].emailTemplateTextBody;
                                    //emailHTML2 = items[0].emailTemplateHTMLBody;

                                mailer.sendMail({
                                    from: 'Buy To Invest Financing <chris@prism-llc.com>',
                                    to: 'chris@chrishimes.com',
                                    subject: newEmailSubject + " hello there",
                                    //text: emailText,
                                    // html: emailHTML2,
                                }, function (error, response, body) {


                                    if (error) {
                                        console.log(error);
                                        //Response.send(false)
                                        outMessage += "bad email1 - " + error.responseCode;
                                        outMessage += "<BR><BR>bad email2 - " + response;
                                        if (error.responseCode == 550) {
                                            outMessage += "<BR><BR>this email address need to be deleted"
                                        }
                                        ;
                                        //db.posts.remove({_id: req.param('id')}, function(err, post) {
                                        //if (err) return res.send(err.message, 500); // server error
                                        //res.send(200);
                                        //})
                                        res.send(outMessage);

                                    } else {
                                        console.log("Message sent: " + response.message);
                                        //                               res.send("good email. now it need to be updated as sent with the email parameters");
                                        //Response.send(true)
                                        emailText = "";
                                        emailHTML2 = "";
                                    };




                                });



                            }else {
                                console.log("Inside db call-2 default");
                            }
                        }
                    );
                } //closing function
            }// closing function

        ) //closing array
    };
    response.send("Goodbye from sendEmail-1");
})

router.get('/sendEmails2/',function(req,response){
//Find the template we will be working with  - db.getCollection('emailTemplates').findOne({ _id: new ObjectId("57ccd60a5564f2e25dffaee8")})
//Need to get unprocessed emails
//Need to update agent to show processed
//insert update daily counter
//insert update available email counter on rotation
//If bad with correct error message delete the email from the master
    console.log("Hello from sendEmail-1");
    var templateID = '57ccd60a5564f2e25dffaee8';
    var emailState = 'ID';
    var campaignName = "New NODE email";
    var limitCount = 3;
    var stateOut = "ND";
    var newEmailSubject;
    var outMessage;
    var emailText;
    var emailHTML2;

    function EmailAddressByState(emailState, campaignName, resultCount ){
        console.log("emailAddressByState called")
        db2.us2014agents.find({"OfficeState": emailState, $or: [{"campaignSent" :null} , {"campaignSent" : {$nin: [ campaignName ]}}]}).limit( resultCount ).toArray();
    }
        db2.emailTemplates.find({_id:db2.ObjectId(templateID)}).toArray(
            // cursor.each(function(err, doc) {
            function (err, items) {
                if (items.length == 0) {
                    //response.send("{\"results\":false}")
                    console.log("Nothing found ");
                } else if (err) {
                    //response.send(items);
                    console.log("Error on templates");
                    console.log("Error on templates ");
                } else {
                    //Need to get email address from the db based on form input
                    //var player = new GamePlayer("John Smith", 15, 3);
                    console.log("Getting into the db");

                        } //closing function
                    }// closing function
                ) //closing array

    response.send("Goodbye from sendEmail 2-2-2");

    var workingEmailsAddress =   db2.us2014agents.find({"OfficeState": stateOut, $or: [{"campaignSent" :null} , {"campaignSent" : {$nin: [ "Asset loans" ]}}]}).limit( limitCount ).toArray(
        function(err, items) {
            if (items.length==0){
                //response.send("{\"results\":false}")
                console.log("Inside db call-1");
            }else if (items.length > 0){
                //response.send(items);
                console.log("Inside db call-2 items greater than 0");
                //EmailAddressByState("ND", "Asset loans", 3);
                //if (workingEmailsAddress.length > 0) { printjson (workingEmailsAddress[0]); };
                console.log(items);
                //newEmailSubject= items[0].emailTemplateTitle;
                //emailText = items[0].emailTemplateTextBody;
                //emailHTML2 = items[0].emailTemplateHTMLBody;
                mailer.sendMail({
                    from: 'Buy To Invest Financing <chris@prism-llc.com>',
                    to: 'chris@chrishimes.com',
                    subject: newEmailSubject + " hello there!!!",
                    //text: emailText,
                    // html: emailHTML2,
                }, function (error, response, body) {
                    if (error) {
                        console.log(error);
                        //Response.send(false)
                        outMessage += "bad email1 - " + error.responseCode;
                        outMessage += "<BR><BR>bad email2 - " + response;
                        if (error.responseCode == 550) {
                            outMessage += "<BR><BR>this email address need to be deleted"
                        };
                        //db.posts.remove({_id: req.param('id')}, function(err, post) {
                        //if (err) return res.send(err.message, 500); // server error
                        //res.send(200);
                        //})
                        res.send(outMessage);
                    } else {
                        console.log("Message sent: " + response.message);
                        // es.send("good email. now it need to be updated as sent with the email parameters");
                        //Response.send(true)
                        emailText = "";
                        emailHTML2 = "";
                    };
                });
            }else {
                console.log("Inside db call-2 default");
            }
        }
    );
})
/*




    for (var i = 0; i < 3; i++) { ///    db.users.find({_id:db.ObjectId(xCat)}).toArray(
        var templateID = '57ccd60a5564f2e25dffaee8';
        var emailState = 'ID';
        var campaignName = "New NODE email";
        var newEmailSubject;
        var outMessage;
        var emailText;
        var emailHTML2;
        db2.emailTemplates.find({_id:db2.ObjectId(templateID)}).toArray(
            // cursor.each(function(err, doc) {
            function (err, items) {
                if (items.length == 0) {
                    //response.send("{\"results\":false}")
                    console.log("Nothing found ");
                } else if (err) {
                    //response.send(items);
                    console.log("Error on templates");
                    console.log("Error on templates ");
                } else {
                    //Need to get email address from the db based on form input
                    //var player = new GamePlayer("John Smith", 15, 3);
                    var workingEmailsAddress =   db2.us2014agents.find({"OfficeState": "ND", $or: [{"campaignSent" :null} , {"campaignSent" : {$nin: [ "Asset loans" ]}}]}).limit( 1 ).toArray(function(err, names) {
                        if (err) {
                            console.log(err);
                        }
                        else {

                            //EmailAddressByState("ND", "Asset loans", 3);
                            // if (workingEmailsAddress.length > 0) { printjson (workingEmailsAddress[0]); }


                            //console.log(workingEmailsAddress[0].FullName);
                            //newEmailSubject= items[0].emailTemplateTitle;
                            //emailText = items[0].emailTemplateTextBody;
                            //emailHTML2 = items[0].emailTemplateHTMLBody;
                            console.log("Something found emailHTML2 -  " + emailHTML2 + "<BR><BR>Something found emailText -  " + emailText);

                            //===================================
                            mailer.sendMail({
                                    from: 'Buy To Invest Financing <chris@prism-llc.com>',
                                    to: 'chris@chrishimes.com',
                                    subject: newEmailSubject + " hello there",
                                    //text: emailText,
                                    // html: emailHTML2,
                                }, function (error, response, body) {
                                    if (error) {
                                        console.log(error);
                                        //Response.send(false)
                                        outMessage += "bad email1 - " + error.responseCode;
                                        outMessage += "<BR><BR>bad email2 - " + response;
                                        if (error.responseCode == 550) {
                                            outMessage += "<BR><BR>this email address need to be deleted"
                                        }
                                        ;
                                        //db.posts.remove({_id: req.param('id')}, function(err, post) {
                                         //if (err) return res.send(err.message, 500); // server error
                                         //res.send(200);
                                         //})
                                        res.send(outMessage);

                                    } else {
                                        console.log("Message sent: " + response.message);
                                        //                               res.send("good email. now it need to be updated as sent with the email parameters");
                                        //Response.send(true)
                                        emailText = "";
                                        emailHTML2 = "";
};

*/


