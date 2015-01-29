'use strict';

var UserSession = require("../../src/UserSession"),
    mongooseMock = require("mongoose-mock");

describe("User Session Unit Test", function () {
    var userSession;

    beforeEach(function() {
        userSession = new UserSession(mongooseMock);
    });

    it("should initalize database schema and user model", function() {
        expect(userSession).not.toBeNull();
    });

    it("should create proper route function", function() {
        var routeF = userSession.getRouteF();

        expect(routeF instanceof Function).toBe(true);
    });

    describe("Anonymous Autentication", function() {
        var anonAuthTest = {
            wellFormedName: {
                anonymous: true,
                name: "TestNameSet"
            },
            wellFormed: {
                anonymous: true
            },
            malformedAnonFalse: {
                anonymous: false
            },
            malformedAuthTokenSet: {
                anonymous: true,
                authToken: "TestAuthenticationToken"
            },
            malformedEmpty: {

            }
        };

        var routeF,
            res,
            req;

        beforeEach(function () {
            routeF = userSession.getRouteF();

            req = jasmine.createSpyObj("req", ["method", "body"]);
            res = jasmine.createSpyObj("res", ["send", "sendStatus", "json"]);

        });

        it("should respond with User Document (Well Formed Name)", function() {
            req.method = "POST";
            req.body = anonAuthTest.wellFormedName;

            routeF(req, res);

            expect(res.json).toHaveBeenCalled();
        });

        it("should respond with User Document on (Well Formed)", function() {
            req.method = "POST";
            req.body = anonAuthTest.wellFormed;

            routeF(req, res);

            expect(res.json).toHaveBeenCalled();
        });

        it("should NOT respond (Malformed Anonymous False)", function() {
            req.method = "POST";
            req.body = anonAuthTest.malformedAnonFalse;

            routeF(req, res);

            expect(res.sendStatus).toHaveBeenCalledWith(400);
        });

        it("should NOT respond (Malformed AuthToken Set)", function() {
            req.method = "POST";
            req.body = anonAuthTest.malformedAuthTokenSet;

            routeF(req, res);

            expect(res.sendStatus).toHaveBeenCalledWith(400);
        });
        
        it("should NOT respond (Malformed Empty)", function() {
            req.method = "POST";
            req.body = anonAuthTest.malformedAnonFalse;

            routeF(req, res);

            expect(res.sendStatus).toHaveBeenCalledWith(400);
        });
    });
});
