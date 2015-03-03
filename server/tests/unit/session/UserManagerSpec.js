"use strict";

describe("User Manager", function() {
    var UserManager = require("../../../src/session/UserManager"),
        mockMongoDB = require("mongoose-mock"),
        userManager,
        userModel,
        queryExec;
    beforeEach(function() {
        userManager = new UserManager(mockMongoDB);
        userModel = mockMongoDB.model("User");
        userModel.prototype.save = jasmine.createSpy("save");
        spyOn(userModel, "findOne").and.callFake(function() {
            queryExec = jasmine.createSpyObj("Query", ["exec"]); 
            return queryExec;
        });
    });
    describe("User Database Queries", function() {
        it("should create anonymous user document", function() {
            var testName = "TestName",
                testToken = "TestToken",
                testCallback = function testCB() {};

            var userDoc = userManager.createAnonymousUser(testName, testToken, testCallback);
            expect(userDoc.anonymous).toBe(true);
            expect(userDoc.displayName).toBe(testName);
            expect(userDoc.authToken).toBe(testToken);
            expect(userDoc.save).toHaveBeenCalledWith(testCallback);
        });
        it("should find user by login and set callback" , function() {
            var testLogin = "TestToken",
                testPassword = "TestPassword",
                testHashPassword = userManager.hashPassword(testPassword),
                testCallback = function testCB() {};
            userManager.findByLogin(testLogin, testPassword, testCallback);
            expect(userModel.findOne).toHaveBeenCalledWith(jasmine.objectContaining({
                login: testLogin,
                passwordHash: testHashPassword
            }));
            expect(queryExec.exec).toHaveBeenCalledWith(testCallback);
        });
        it("should find user by authToken and set callback" , function() {
            var testToken = "TestToken",
                testCallback = function testCB() {};

            userManager.findByAuthToken(testToken, testCallback);
            expect(userModel.findOne).toHaveBeenCalledWith(jasmine.objectContaining({
                authToken: testToken
            }));
            expect(queryExec.exec).toHaveBeenCalledWith(testCallback);
        });
        it("should find user by ID and set callback" , function() {
            var testUserId = "TestID",
                testCallback = function testCB() {};

            userManager.findById(testUserId, testCallback);
            expect(userModel.findOne).toHaveBeenCalledWith(jasmine.objectContaining({
                _id: testUserId
            }));
            expect(queryExec.exec).toHaveBeenCalledWith(testCallback);
        });
        describe("Update User", function() {
            var updateQueryExec,
                findQueryLimit,
                findQueryExec,
                removeQueryExec;
            beforeEach(function () {
                spyOn(userModel, "findByIdAndUpdate").and.callFake(function() {
                    updateQueryExec = jasmine.createSpyObj("Query", ["exec"]); 
                    return updateQueryExec;
                });
                spyOn(userModel, "find").and.callFake(function() {
                    findQueryLimit = jasmine.createSpyObj("Query", ["limit"]);
                    findQueryLimit.limit.and.callFake(function () {
                        findQueryExec = jasmine.createSpyObj("Query", ["exec"]); 
                        findQueryExec.exec.and.callFake(function(cb) {
                            cb(null, []);
                        });
                        return findQueryExec;
                    });
                    return findQueryLimit;
                });
                spyOn(userModel, "remove").and.callFake(function() {
                    removeQueryExec = jasmine.createSpyObj("Query", ["exec"]); 
                    return removeQueryExec;
                });
            });
            it("should set status online" , function() {
                var testUser = {
                        id: "testID"
                    },
                    testNewStatus = "online",
                    testUserChanges = {
                        status: testNewStatus
                    },
                    testCallback = function testCB() {};

                userManager.updateUser(testUser, testUserChanges, testCallback);
                expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(testUser.id, {
                    $set: jasmine.objectContaining({
                        status: testNewStatus
                    })
                });
                expect(updateQueryExec.exec).toHaveBeenCalledWith(testCallback);
            });
            it("should set status away" , function() {
                var testUser = {
                        id: "testID"
                    },
                    testNewStatus = "away",
                    testUserChanges = {
                        status: testNewStatus
                    },
                    testCallback = function testCB() {};

                userManager.updateUser(testUser, testUserChanges, testCallback);
                expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(testUser.id, {
                    $set: jasmine.objectContaining({
                        status: testNewStatus
                    })
                });
                expect(updateQueryExec.exec).toHaveBeenCalledWith(testCallback);
            });
            it("should set status offline" , function() {
                var testUser = {
                        id: "testID"
                    },
                    testNewStatus = "offline",
                    testUserChanges = {
                        status: testNewStatus
                    },
                    testCallback = function testCB() {};

                userManager.updateUser(testUser, testUserChanges, testCallback);
                expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(testUser.id, {
                    $set: jasmine.objectContaining({
                        status: testNewStatus
                    })
                });
                expect(updateQueryExec.exec).toHaveBeenCalledWith(testCallback);
            });
            it("should set status offline and delete user (Anonymous Set)" , function() {
                var testUser = {
                        id: "testID",
                        anonymous: true
                    },
                    testNewStatus = "offline",
                    testUserChanges = {
                        status: testNewStatus
                    },
                    testCallback = jasmine.createSpy("dbCallback");

                userManager.updateUser(testUser, testUserChanges, testCallback);
                expect(userModel.findByIdAndUpdate).not.toHaveBeenCalled();
                expect(userModel.remove).toHaveBeenCalledWith(jasmine.objectContaining({_id: testUser.id}));
                expect(testCallback).toHaveBeenCalledWith(200);
            });
            it("should NOT set status to invalid value" , function() {
                var testUser = {
                        id: "testID",
                        anonymous: true
                    },
                    testNewStatus = "invalid",
                    testUserChanges = {
                        status: testNewStatus
                    },
                    testCallback = jasmine.createSpy("dbCallback");

                userManager.updateUser(testUser, testUserChanges, testCallback);
                expect(userModel.findByIdAndUpdate).not.toHaveBeenCalled();
                expect(testCallback).toHaveBeenCalledWith(jasmine.any(String));
            });
            it("should upgrade from anonymous user when setting login and password" , function() {
                var testUser = {
                        id: "testID",
                        anonymous: true
                    },
                    testNewLogin = "testUsername",
                    testNewPassword = "testPassword",
                    testUserChanges = {
                        login: testNewLogin,
                        password: testNewPassword,
                        anonymous: false
                    },
                    testCallback = function() {};

                userManager.updateUser(testUser, testUserChanges, testCallback);
                expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(testUser.id, {
                    $set: jasmine.objectContaining({
                        login: testNewLogin,
                        passwordHash: jasmine.any(String),
                        anonymous: false
                    })
                });
                expect(updateQueryExec.exec).toHaveBeenCalledWith(testCallback);
            });
            it("should upgrade from anonymous user when setting login and base64 password" , function() {
                var testUser = {
                        id: "testID",
                        anonymous: true
                    },
                    testNewLogin = "testUsername",
                    testNewB64Password = "testB64Password",
                    testUserChanges = {
                        login: testNewLogin,
                        b64password: testNewB64Password,
                        anonymous: false
                    },
                    testCallback = function() {};

                userManager.updateUser(testUser, testUserChanges, testCallback);
                expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(testUser.id, {
                    $set: jasmine.objectContaining({
                        login: testNewLogin,
                        passwordHash: jasmine.any(String),
                        anonymous: false
                    })
                });
                expect(updateQueryExec.exec).toHaveBeenCalledWith(testCallback);
            });
            it("should NOT upgrade from anonymous user when login not set but base64 password is set" , function() {
                var testUser = {
                        id: "testID",
                        anonymous: true
                    },
                    testNewB64Password = "testB64Password",
                    testUserChanges = {
                        b64password: testNewB64Password,
                        anonymous: false
                    },
                    testCallback = jasmine.createSpy("cb");

                userManager.updateUser(testUser, testUserChanges, testCallback);
                expect(userModel.findByIdAndUpdate).not.toHaveBeenCalled();
                expect(testCallback).toHaveBeenCalledWith(jasmine.any(String));
            });
            it("should NOT upgrade from anonymous user when login not set but password is set" , function() {
                var testUser = {
                        id: "testID",
                        anonymous: true
                    },
                    testNewPassword = "testPassword",
                    testUserChanges = {
                        password: testNewPassword,
                        anonymous: false
                    },
                    testCallback = jasmine.createSpy("cb");

                userManager.updateUser(testUser, testUserChanges, testCallback);
                expect(userModel.findByIdAndUpdate).not.toHaveBeenCalled();
                expect(testCallback).toHaveBeenCalledWith(jasmine.any(String));
            });
            it("should NOT upgrade from anonymous user when password not set but login is set" , function() {
                var testUser = {
                        id: "testID",
                        anonymous: true
                    },
                    testNewLogin = "testUsername",
                    testUserChanges = {
                        login: testNewLogin,
                        anonymous: false
                    },
                    testCallback = jasmine.createSpy("cb");

                userManager.updateUser(testUser, testUserChanges, testCallback);
                expect(userModel.findByIdAndUpdate).not.toHaveBeenCalled();
                expect(testCallback).toHaveBeenCalledWith(jasmine.any(String));
            });
            it("should NOT upgrade from anonymous user when password and login not set" , function() {
                var testUser = {
                        id: "testID",
                        anonymous: true
                    },
                    testUserChanges = {
                        anonymous: false
                    },
                    testCallback = jasmine.createSpy("cb");

                userManager.updateUser(testUser, testUserChanges, testCallback);
                expect(userModel.findByIdAndUpdate).not.toHaveBeenCalled();
                expect(testCallback).toHaveBeenCalledWith(jasmine.any(String));
            });
            it("should NOT upgrade from anonymous user when password and login are set but anonymous is not set" , function() {
                var testUser = {
                        id: "testID",
                        anonymous: true
                    },
                    testNewLogin = "testUsername",
                    testNewPassword = "testPassword",
                    testUserChanges = {
                        login: testNewLogin,
                        password: testNewPassword,
                    },
                    testCallback = jasmine.createSpy("cb");

                userManager.updateUser(testUser, testUserChanges, testCallback);
                expect(userModel.findByIdAndUpdate).not.toHaveBeenCalled();
                expect(testCallback).toHaveBeenCalledWith(400);
            });
            it("should NOT upgrade from anonymous user when password and login are set but anonymous hasn't changed" , function() {
                var testUser = {
                        id: "testID",
                        anonymous: true
                    },
                    testNewLogin = "testUsername",
                    testNewPassword = "testPassword",
                    testUserChanges = {
                        login: testNewLogin,
                        password: testNewPassword,
                        anonymous: true
                    },
                    testCallback = jasmine.createSpy("cb");

                userManager.updateUser(testUser, testUserChanges, testCallback);
                expect(userModel.findByIdAndUpdate).not.toHaveBeenCalled();
                expect(testCallback).toHaveBeenCalledWith(400);
            });
            function getGoodPasswords() {
                var minLen = userManager.MIN_PASSWORD_LENGTH;
                var pass = "",
                    hash;

                for(var i = 0; i < minLen; i++){
                    pass += "a";
                }

                hash = userManager.hashPassword(pass);
                return [pass, hash];
            }
            function getGoodB64Passwords() {
                var minLen = userManager.MIN_PASSWORD_LENGTH;
                var pass = "",
                    hash,
                    b64pass;

                for(var i = 0; i < minLen; i++){
                    pass += "a";
                }
                
                b64pass = (new Buffer(pass)).toString('base64');

                hash = userManager.hashPassword(pass);
                return [b64pass, hash];
            }
            function getBadPassword() {
                var minLen = userManager.MIN_PASSWORD_LENGTH;
                var pass = "";

                for(var i = 0; i < minLen-1; i++){
                    pass += "a";
                }

                return pass;
            }
            function getBadB64Password() {
                var minLen = userManager.MIN_PASSWORD_LENGTH;
                var pass = "",
                    b64pass;

                for(var i = 0; i < minLen-1; i++){
                    pass += "a";
                }

                b64pass = (new Buffer(pass)).toString('base64');

                return b64pass;
            }
            it("should set password greater than minimum length" , function() {
                var testUser = {
                        id: "testID"
                    },
                    testNewPasswords = getGoodPasswords(),
                    testUserChanges = {
                        password: testNewPasswords[0]
                    },
                    testCallback = function testCB() {};

                userManager.updateUser(testUser, testUserChanges, testCallback);
                expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(testUser.id, {
                    $set: jasmine.objectContaining({
                        passwordHash: testNewPasswords[1]
                    })
                });
                expect(updateQueryExec.exec).toHaveBeenCalledWith(testCallback);
            });
            it("should set base64 password greater than minimum length" , function() {
                var testUser = {
                        id: "testID"
                    },
                    testNewPasswords = getGoodB64Passwords(),
                    testUserChanges = {
                        b64password: testNewPasswords[0]
                    },
                    testCallback = function testCB() {};

                userManager.updateUser(testUser, testUserChanges, testCallback);
                expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(testUser.id, {
                    $set: jasmine.objectContaining({
                        passwordHash: testNewPasswords[1]
                    })
                });
                expect(updateQueryExec.exec).toHaveBeenCalledWith(testCallback);
            });
            it("should NOT set password less than minimum length" , function() {
                var testUser = {
                        id: "testID"
                    },
                    testNewPassword = getBadPassword(),
                    testUserChanges = {
                        password: testNewPassword
                    },
                    testCallback = jasmine.createSpy("cb");

                userManager.updateUser(testUser, testUserChanges, testCallback);
                expect(userModel.findByIdAndUpdate).not.toHaveBeenCalled();
                expect(testCallback).toHaveBeenCalledWith(jasmine.any(String));
            });
            it("should NOT set base64 password less than minimum length" , function() {
                var testUser = {
                        id: "testID"
                    },
                    testNewPassword = getBadB64Password(),
                    testUserChanges = {
                        b64password: testNewPassword
                    },
                    testCallback = jasmine.createSpy("cb");

                userManager.updateUser(testUser, testUserChanges, testCallback);
                expect(userModel.findByIdAndUpdate).not.toHaveBeenCalled();
                expect(testCallback).toHaveBeenCalledWith(jasmine.any(String));
            });
        });

    });
});
