
var express = require("express");
var mongodb = require("mongodb");
var bodyParser = require('body-parser');
var moment = require('moment');

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/phillips";


function getAuth(authorization, response) {
    MongoClient.connect(url, function (err, db) {
        if (err)
        {
            var resp = {"message": "Something wrong with database", "success": false};
            return resp;
            //db.close();
        }

        var auth = authorization;
        if (auth)
            auth = auth.split(" ");
        auth = new Buffer.from(auth[1], 'base64').toString('utf8');
        console.log(auth);
        var authArray = auth.split(":");
        console.log(authArray);
        var username = authArray[0];
        var password = authArray[1];
        var filter = {"username": username.toLowerCase(), "password": password};
        console.log(filter);
        db.collection("users").find(filter, {password: 0, _id: 0}).toArray(function (err, result) {
            if (err)
            {
                throw err;
                var orders = {"data": [{"message": "Something wrong with database"}], "success": true};
                response.status(500);
                response.send(orders);
                db.close();
            }
            console.log(result);

            if (result.length === 1) {
                response.status(200);
                response.send({"status": "success", "data": result[0]});
            } else {
                response.status(401);
                response.send({"status": "error", "message": "authorization failed"});
            }
            ;
            response.send(orders);
            db.close();
        });
    });
}
function submitMarketIntelligence(authorization, body, response) {
    MongoClient.connect(url, function (err, db) {
        if (err)
        {
            var resp = {"message": "Something wrong with database", "success": false};
            return resp;
            //db.close();
        }

        var auth = authorization;
        if (auth)
            auth = auth.split(" ");
        auth = new Buffer.from(auth[1], 'base64').toString('utf8');
        console.log(auth);
        var authArray = auth.split(":");
        console.log(authArray);
        var username = authArray[0];
        var password = authArray[1];
        var filter = {"username": username.toLowerCase(), "password": password};
        console.log(filter);
        db.collection("users").find(filter, {password: 0, _id: 0}).toArray(function (err, result) {
            if (err)
            {
                throw err;
                var orders = {"data": [{"message": "Something wrong with database"}], "success": true};
                response.status(500);
                response.send(orders);
                db.close();
            }


            console.log(result);
            if (result.length === 1) {
                db.collection("market_intelligence").insert({"geography": body.geography,
                    "competitor": body.competitor,
                    "comments": body.comments,
                    "attachment": body.attachment,
                    "reportedBy": {
                        "name": result[0].firstName + " " + result[0].lastName,
                        "username": result[0].username
                    }});
                response.status(200);
                response.send({"status": "success", "data": "successfully submitted"});
            } else {
                response.status(401);
                response.send({"status": "error", "message": "authorization failed"});
            }
            ;
            response.send(orders);
            db.close();
        });
    });

}
function getMarketIntelligence(authorization, body, response) {
    MongoClient.connect(url, function (err, db) {
        if (err)
        {
            var resp = {"message": "Something wrong with database", "success": false};
            return resp;
            //db.close();
        }

        var auth = authorization;
        if (auth)
            auth = auth.split(" ");
        auth = new Buffer.from(auth[1], 'base64').toString('utf8');
        console.log(auth);
        var authArray = auth.split(":");
        console.log(authArray);
        var username = authArray[0];
        var password = authArray[1];
        var filter = {"username": username.toLowerCase(), "password": password};
        console.log(filter);
        db.collection("users").find(filter, {password: 0, _id: 0}).toArray(function (err, result) {
            if (err)
            {
                throw err;
                var orders = {"data": [{"message": "Something wrong with database"}], "success": true};
                response.status(500);
                response.send(orders);
                db.close();
            }


            console.log(result);
            if (result.length === 1) {
                var geography = body.geography;
                var competitor = body.competitor;
                var username = body.username;


                var query = {};

                if (geography !== null && geography !== undefined && geography !== '')
                    query.geography = geography;
                if (competitor !== null && competitor !== undefined && competitor !== '')
                    query.competitor = competitor;
                if (username !== null && username !== undefined && username !== '')
                    query.username = username;

                db.collection("market_intelligence").find(query).toArray(function (err, result) {
                    if (err)
                        throw err;
                    var responseData = {"data": result, "success": true};
                    response.send(responseData);
                    db.close();
                });
            };

        });
    });

}
app.get('/api/auth', function (request, response) {
    console.log("/api/auth");
    var authorization = request.headers.authorization;
    if (authorization !== "" && authorization !== undefined)
    {
        getAuth(authorization, response);
    } else
    {
        response.status(401);
        response.send({"status": "error", "message": "missing credentials"});
    }
});
app.post('/api/getMarketIntelligence', function (request, response) {
    console.log("/api/getMarketIntelligence");
    var authorization = request.headers.authorization;
    if (authorization !== "" && authorization !== undefined)
    {
        getMarketIntelligence(authorization,request.body, response);
    } else
    {
        response.status(401);
        response.send({"status": "error", "message": "missing credentials"});
    }
});
app.post('/api/submitMarketIntelligence', function (request, response) {
    console.log('/api/submitFeedback');
    var authorization = request.headers.authorization||request.headers.Authorization;
    if (authorization !== "" && authorization !== undefined)
    {
        submitMarketIntelligence(authorization, request.body, response);
    } else
    {
        response.status(401);
        response.send({"status": "error", "message": "missing credentials"});
    }
});
var port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log("Listening on " + port);
});

