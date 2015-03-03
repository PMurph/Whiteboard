'use strict';




describe("User Session Intergration", function () {
    var request = require('supertest'),
        Express = require('express'),
        mockMongoose = require('mongoose-mock'),
        UserManager = require('../../src/session/UserManager'),
        UserSession = require('../../src/session/UserSession'),
        UserRequest = require('../../src/session/UserRequest'),
        Server = require('../../src/server'),
        server, req, app;

    var testDisplayName = "Test Display Name",
        testAuthToken = "testAuthToken",
        testLogin = "testUsername",
        testPassword = "testpassword";

    beforeAll(function(done) {
        var userManager = new UserManager(mockMongoose),
            userSession = new UserSession(userManager),
            userRequest = new UserRequest(userManager, userSession),
            dbOptions = {
                mongoose: mockMongoose,
                hostname: "localhost",
                name: "testWhiteboard"
            };
                
        spyOn(mockMongoose, "connect");
        mockMongoose.disconnect = jasmine.createSpy("disconnect");
        var userModel = mockMongoose.model("User");
        var user = jasmine.createSpyObj("User", ["toObject"]);

        userModel.prototype.save = jasmine.createSpy("save").and.callFake(function(cb) {
            cb(null, this);  
        });

        spyOn(userModel, "findOne").and.callFake(function () {
           var query = jasmine.createSpyObj("query", ["exec"]);
           query.exec.and.callFake(function (cb) {
                cb(null, user);
           });
           return query;
        });
        server = new Server(app = new Express(), userRequest, dbOptions);
        server.start(3333, "localhost", done);
    });
    afterAll("should stop server", function(done) {
        console.log("Stopping:");
        server.stop(done);
    });
    beforeEach(function() {
        req = request(app);
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
            .expect(400, done);
        });
        it("should NOT authenticate anonymous (Malformed AuthToken Set)", function(done) {
            req
            .post('/api/user')
            .send(testRequest.authAnon.malformedAnonAuthTokenSet)
            .expect(400, done);
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
            .post('/api/user')
            .send(testRequest.wellFormed)
            .expect(200, done);
        });
        it("should authenticate user (Well Formed Auth Token Set)", function(done) {
            req
            .post('/api/user')
            .send(testRequest.wellFormedAuthTokenSet)
            .expect(200, done);
        });
        it("should NOT authenticate anonymous (Malformed No Password)", function(done) {
            req
            .post('/api/user')
            .send(testRequest.malformedNoPassword)
            .expect(400, done);
        });
        it("should NOT authenticate anonymous (Malformed No Username)", function(done) {
            req
            .post('/api/user')
            .send(testRequest.malformedNoUsername)
            .expect(400, done);
        });
        it("should NOT authenticate anonymous (Malformed Empty)", function(done) {
            req
            .post('/api/user')
            .send(testRequest.malformedEmpty)
            .expect(400, done);
        });
    });
    it("hack to end test", function(done) {
        server.stop(done);
    });
});
