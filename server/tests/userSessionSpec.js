'use strict';

var request = require('supertest'),
    Server = require('../src/server');

var testRequest = {
    authAnon: {
        wellFormed: {
            anonymous: true
        },
        malformedAnonFalse: {
            anonymous: false
        },
        malformedAnonAuthTokenSet: {
            authToken: "authTokenIsSet",
            anonymous: true
        }
    }
};

describe("Server User Session", function () {
    var server = null;

    it("should start server", function(done) {
        server = new Server();
        server.start(3333, "localhost", done);
    });
    describe("autenticate user", function() {
        var req;
        beforeEach(function() {
            req = request("http://127.0.0.1:3333");
        });
        it("should authenticate anonymous (Well Formed)", function(done) {
            req
            .post('/api/user')
            .send(testRequest.authAnon.wellFormed)
            .expect(200)
            .end(function(err, response) {
                var body = response.body;

                if(err) {
                    done(err);
                }

                expect(body.name).toBe("Anon");
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
    });
    it("should stop server", function(done) {
        server.stop(done);
    });
});
