'use strict';

describe("User Session Intergration", function () {
    var request = require('supertest'),
        Express = require('express'),
        mockMongoose = require('mongoose-mock'),
        mockSocketIO,
        Server = require('../../src/server'),
        server, req, app;

    var testDisplayName = "Test Display Name",
        testAuthToken = "testAuthToken",
        testLogin = "testUsername",
        testPassword = "testpassword";

    beforeAll(function(done) {
        var dbOptions = {
                mongoose: mockMongoose,
                hostname: "localhost",
                name: "testWhiteboard"
            };
        
        mockSocketIO = jasmine.createSpyObj("socketIO", ["listen"]);
        mockSocketIO.listen.and.callFake(function() {
            return jasmine.createSpyObj("socketManager", ["use", "emit", "on"]);
        });

        spyOn(mockMongoose, "connect");
        mockMongoose.disconnect = jasmine.createSpy("disconnect");
        server = new Server(app = new Express(), mockSocketIO, dbOptions);
        server.start(3333, "localhost", done);

        var userModel = mockMongoose.model("User");
        var user = jasmine.createSpyObj("User", ["toObject"]);

        user.save = userModel.prototype.save = jasmine.createSpy("save").and.callFake(function(cb) {
            cb(null, this);  
        });

        spyOn(userModel, "findOne").and.callFake(function () {
           var query = jasmine.createSpyObj("query", ["exec"]);
           query.exec.and.callFake(function (cb) {
                cb(null, user);
           });
           return query;
        });
    });
    afterAll(function(done) {
        server.stop(done);
    });
    beforeEach(function() {
        req = request("http://127.0.0.1:3333");
    });
    describe("Autenticate Anonymous", function() {
        var testRequest = {
            authAnon: {
                wellFormed: {
                    name: testDisplayName,
                    anonymous: true
                },
                wellFormedNoName: {
                    anonymous: true
                },
                malformedAnonFalse: {
                    name: testDisplayName,
                    anonymous: false
                },
                malformedAnonAuthTokenSet: {
                    authToken: testAuthToken,
                    name: testDisplayName,
                    anonymous: true
                },
                malformedEmpty: {

                }
            }
        };
        it("should authenticate anonymous (Well Formed Name)", function(done) {
            req
            .post('/api/user')
            .send(testRequest.authAnon.wellFormed)
            .expect(200)
            .end(function(err, response) {
                var body;

                if(response){
                    body = response.body;
                }else{
                    body = {};
                }

                expect(err).toBeNull();
                expect(body.displayName).toBe(testDisplayName);
                expect(body.id).not.toBeNull();
                expect(body.authToken).not.toBeNull();
                done();
            });
        });
        it("should authenticate anonymous and set default name (Well Formed No Name)", function(done) {
            req
            .post('/api/user')
            .send(testRequest.authAnon.wellFormed)
            .expect(200)
            .end(function(err, response) {
                var body;

                if(response){
                    body = response.body;
                }else{
                    body = {};
                }


                expect(err).toBeNull();
                expect(body.name).not.toBeNull();
                expect(body.id).not.toBeNull();
                expect(body.authToken).not.toBeNull();
                done();
            });
        });
        it("should NOT authenticate anonymous (Malformed Anonymous False)", function(done) {
            req
            .post('/api/user')
            .send(testRequest.authAnon.malformedAnonFalse)
            .expect(400, function(err) {
                expect(err).toBeNull();
                done();
            });
        });
        it("should NOT authenticate anonymous (Malformed AuthToken Set)", function(done) {
            req
            .post('/api/user')
            .send(testRequest.authAnon.malformedAnonAuthTokenSet)
            .expect(400, function(err) {
                expect(err).toBeNull();
                done();
            });
        });
        it("should NOT authenticate anonymous (Malformed Empty)", function(done) {
            req
            .post('/api/user')
            .send(testRequest.authAnon.malformedEmpty)
            .expect(400, function(err) {
                expect(err).toBeNull();
                done();   
            });
        });
    });
    describe("Authentiate User", function() {
        var testRequest = {
            wellFormed: {
                login: testLogin,
                password: testPassword,
            },
            wellFormedAuthTokenSet: {
                authToken: testAuthToken,
                login: testLogin,
                password: testPassword,
            },
            malformedNoPassword: {
                login: testLogin
            },
            malformedNoUsername: {
                password: testPassword
            },
            malformedEmpty: {

            }
        };
        it("should authenticate user (Well Formed)", function(done) {
            req
            .get('/api/user')
            .query(testRequest.wellFormed)
            .expect(200, function(err) {
                expect(err).toBeNull();
                done();   
            });
        });
        it("should authenticate user (Well Formed Auth Token Set)", function(done) {
            req
            .get('/api/user')
            .query(testRequest.wellFormedAuthTokenSet)
            .expect(200, function(err) {
                expect(err).toBeNull();
                done();   
            });
        });
        it("should NOT authenticate anonymous (Malformed No Password)", function(done) {
            req
            .get('/api/user')
            .query(testRequest.malformedNoPassword)
            .expect(400, function(err) {
                expect(err).toBeNull();
                done();   
            });
        });
        it("should NOT authenticate anonymous (Malformed No Username)", function(done) {
            req
            .get('/api/user')
            .query(testRequest.malformedNoUsername)
            .expect(400, function(err) {
                expect(err).toBeNull();
                done();   
            });
        });
        it("should NOT authenticate anonymous (Malformed Empty)", function(done) {
            req
            .get('/api/user')
            .query(testRequest.malformedEmpty)
            .expect(400, function(err) {
                expect(err).toBeNull();
                done();   
            });
        });
    });
});
