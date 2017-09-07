var express = require("express");
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var MongoClient = require("mongodb").MongoClient;


var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
var url = "mongodb://heroku_vxr8k48q:uk3quacbn4u8tk63ungijlmh3n@ds119064.mlab.com:19064/heroku_vxr8k48q";


function getAuth(authorization, response) {
    MongoClient.connect(url, {native_parser: true}, function (err, db) {
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
                    "createdDate": new Date(),
                    "reportedBy": {
                        "name": result[0].firstName + " " + result[0].lastName,
                        "username": result[0].username,
                        "agency": result[0].agency

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
function createUser(authorization, body, response) {
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
            if (result.length === 1 && result[0].role === 'admin') {
                db.collection("users").find({email: body.email}, {password: 0, _id: 0}).toArray(function (err, ifUserExist) {
                    if (err)
                    {
                        throw err;
                        var orders = {"data": [{"message": "Something wrong with database"}], "success": true};
                        response.status(500);
                        response.send(orders);
                        db.close();
                    }
                    if (ifUserExist.length === 0)
                    {
                        db.collection("users").insert({
                            "firstName": body.firstName,
                            "lastName": body.lastName,
                            "email": body.email,
                            "password": body.password,
                            "role": body.role,
                            "createdDate": new Date(),
                            "createdBy": {
                                "name": result[0].firstName + " " + result[0].lastName,
                                "username": result[0].username,
                                "agency": result[0].agency

                            },
                            "isActive": body.isActive
                        });
                        sendEmail(body.role,body.email,body.password);
                        response.status(200);
                        response.send({"status": "success", "data": "user created successfully"});
                    } else {
                        response.status(200);
                        response.send({"status": "error", "message": "user already exist with same email"});
                    }
                    ;
                    ;
                    response.send(orders);
                    db.close();
                });
            } else
            {
                response.status(401);
                response.send({"status": "error", "message": "user creation failed"});
            }
            ;

        });
    });

}
function sendEmail(role,to,password)
{
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'javageekscode@gmail.com',
    pass: 'lyckrs@123'
  }
});

var mailOptions = {
  to: to,
  subject: 'Registration - Philips Admin',
  text: 'Admin has registered you '+to+ ' as '+role+' and password is '+password
};
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

}
function submitIdea(authorization, body, response) {
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
                var idea = {"data": [{"message": "Something wrong with database"}], "success": true};
                response.status(500);
                response.send(idea);
                db.close();
            }


            console.log(result);
            if (result.length === 1) {
                db.collection("feedback").insert({"productfamily": body.productFamily,"productType":body.productType,
                    "productname": body.productName,
                    "referencecustomer": body.referenceCustomer,
                    "attachment": body.attachment,
                    "comments": body.comments,
                    "createdDate": new Date(),
                    "reportedBy": {
                        "name": result[0].firstName + " " + result[0].lastName,
                        "username": result[0].username,
                        "agency": result[0].agency
                    }});
                response.status(200);
                response.send({"status": "success", "data": "successfully submitted"});
            } else {
                response.status(401);
                response.send({"status": "error", "message": "authorization failed"});
            }
            ;
            response.send(idea);
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
            }
            ;

        });
    });

}
function getIdea(authorization, body, response) {
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
                var productfamily = body.productFamily;
                var productname = body.productName;
                var referencecustomer = body.referenceCustomer;
                var productType = body.productType;


                var query = {};

                if (productfamily !== null && productfamily !== undefined && productfamily !== '')
                    query.productfamily = productfamily;
                if (productname !== null && productname !== undefined && productname !== '')
                    query.productname = productname;
                if (referencecustomer !== null && referencecustomer !== undefined && referencecustomer !== '')
                    query.referencecustomer = referencecustomer;
                if (productType !== null && productType !== undefined && productType !== '' && productType !== 'All')
                    query.productType = productType;
                console.log(query);
                db.collection("feedback").find(query).toArray(function (err, result) {
                    if (err)
                        throw err;
                    var responseData = {"data": result, "success": true};
                    response.send(responseData);
                    db.close();
                });
            }
            ;

        });
    });

}
app.get('/philips/api/auth', function (request, response) {
    console.log("/philips/api/auth");
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
app.post('/philips/api/getMarketIntelligence', function (request, response) {
    console.log("/philips/api/getMarketIntelligence");
    var authorization = request.headers.authorization;
    if (authorization !== "" && authorization !== undefined)
    {
        getMarketIntelligence(authorization, request.body, response);
    } else
    {
        response.status(401);
        response.send({"status": "error", "message": "missing credentials"});
    }
});
app.post('/philips/api/getIdea', function (request, response) {
    console.log("/philips/api/getIdea");
    var authorization = request.headers.authorization;
    if (authorization !== "" && authorization !== undefined)
    {
        getIdea(authorization, request.body, response);
    } else
    {
        response.status(401);
        response.send({"status": "error", "message": "missing credentials"});
    }
});
app.post('/philips/api/submitMarketIntelligence', function (request, response) {
    console.log('/philips/api/submitMarketIntelligence');
    var authorization = request.headers.authorization || request.headers.Authorization;
    if (authorization !== "" && authorization !== undefined)
    {
        submitMarketIntelligence(authorization, request.body, response);
    } else
    {
        response.status(401);
        response.send({"status": "error", "message": "missing credentials"});
    }
});
app.post('/philips/api/submitIdea', function (request, response) {
    console.log('/philips/api/submitIdea');
    var authorization = request.headers.authorization || request.headers.Authorization;
    if (authorization !== "" && authorization !== undefined)
    {
        submitIdea(authorization, request.body, response);
    } else
    {
        response.status(401);
        response.send({"status": "error", "message": "missing credentials"});
    }
});
app.post('/philips/api/createUser', function (request, response) {
    console.log('/philips/api/createUser');
    var authorization = request.headers.authorization || request.headers.Authorization;
    if (authorization !== "" && authorization !== undefined)
    {
        createUser(authorization, request.body, response);
    } else
    {
        response.status(401);
        response.send({"status": "error", "message": "missing credentials"});
    }
});
var port = process.env.PORT || 5556;
app.listen(port, function () {
    console.log("Listening on " + port);
});
