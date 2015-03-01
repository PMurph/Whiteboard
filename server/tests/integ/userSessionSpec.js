'use strict';

var request = require('supertest'),
    express = require('express'),
    mongoose = require('mongoose'),
    UserManager = require('../../src/session/UserManager'),
    UserSession = require('../../src/session/UserSession'),
    UserRequest = require('../../src/session/UserRequest'),
    Server = require('../../src/server');



describe("User Session Intergration", function () {
    var server = null;

    beforeAll(function(done) {
        var userManager = new UserManager(mongoose),
            userSession = new UserSession(userManager),
            userRequest = new UserRequest(userManager, userSession);

        server = new Server(new express(), userRequest);
        server.start(3333, "localhost", done);
    });
    describe("autenticate user", function() {
        var testRequest = {
            authAnon: {
                wellFormed: {
                    name: "AnonNameTest",
                    anonymous: true
                },
                wellFormedNoName: {
                    anonymous: true
                },
                malformedAnonFalse: {
                    name: "AnonNameTest",
                    anonymous: false
                },
                malformedAnonAuthTokenSet: {
                    authToken: "authTokenIsSet",
                    name: "AnonNameTest",
                    anonymous: true
                },
                malformedEmpty: {

                }
            }
        };
        var req;
        beforeAll(function() {
            req = request("http://127.0.0.1:3333");
        });
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

                if(err){
                    done(err);
                }

                expect(body.displayName).toBe("AnonNameTest");
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

                if(err) {
                    done(err);
                }

                expect(body.name).not.toBeNull();
                expect(body.id).not.toBeNull();
                expect(body.authToken).not.toBeNull();
                done();
            });
        });
        it("should authenticate anonymous (Malformed Anonymous False)", function(done) {
            req
            .post('/api/user')
            .send(testRequest.authAnon.malformedAnonFalse)
            .expect(400, done);
        });
        it("should authenticate anonymous (Malformed AuthToken Set)", function(done) {
            req
            .post('/api/user')
            .send(testRequest.authAnon.malformedAnonAuthTokenSet)
            .expect(400, done);
        });
        it("should authenticate anonymous (Malformed Empty)", function(done) {
            req
            .post('/api/user')
            .send(testRequest.authAnon.malformedEmpty)
            .expect(400, done);
        });
    });
    afterAll("should stop server", function(done) {
        server.stop(done);
    });
});
