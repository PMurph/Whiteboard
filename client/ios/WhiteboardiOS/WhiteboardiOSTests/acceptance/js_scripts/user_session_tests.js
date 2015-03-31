var target = UIATarget.localTarget();

var testName = "Login tab"

UIALogger.logStart(testName);
var tabbar = target.frontMostApp().mainWindow().tabBar();
tabbar.buttons()["Login"].tap();
target.pushTimeout(5);
var login_button = target.frontMostApp().mainWindow().buttons()["Login"];
target.popTimeout();
if(login_button.isValid()) {
    UIALogger.logPass(testName);
} else {
    UIALogger.logFail(testName);
}

testName = "Blank user registration fails";

UIALogger.logStart(testName);
target.frontMostApp().mainWindow().buttons()["Register"].tap();
target.pushTimeout(5);
var settingsBtn = tabbar.buttons()["Settings"];
target.popTimeout();
if(settingsBtn.isValid()) {
    UIALogger.logFail(testName);
} else {
    UIALogger.logPass(testName);
}

testName = "Register test user";

// Change user name if this test fails
var testUserName = "hyytfnnxxcmvnfcfd";
var testPassword = "fdgdbcvvcbvccv";

UIALogger.logStart(testName);
var userNameField = target.frontMostApp().mainWindow().textFields()[0];
var passwordField = target.frontMostApp().mainWindow().secureTextFields()[0];
userNameField.setValue(testUserName);
passwordField.setValue(testPassword);
target.frontMostApp().mainWindow().buttons()["Register"].tap();
target.pushTimeout(5);
var settingBtn = tabbar.buttons()["Settings"];
target.popTimeout();
if(settingBtn.isValid()) {
    UIALogger.logPass(testName);
} else {
    UIALogger.logFail(testName);
}

testName = "Logout of account";

UIALogger.logStart(testName);
var toolbar = target.frontMostApp().mainWindow().toolbar();
toolbar.buttons()["Logout"].tap();
target.pushTimeout(5);
var loginBtn = tabbar.buttons()["Login"];
target.popTimeout();
if(loginBtn.isValid()) {
    UIALogger.logPass(testName);
} else {
    UIALogger.logFail(testName);
}

testName = "Login to valid account";

UIALogger.logStart(testName);
tabbar.buttons()["Login"].tap();
target.pushTimeout(5);
userNameField = target.frontMostApp().mainWindow().textFields()[0];
passwordField = target.frontMostApp().mainWindow().secureTextFields()[0];
target.popTimeout();
userNameField.setValue(testUserName);
passwordField.setValue(testPassword);
target.frontMostApp().mainWindow().buttons()["Login"].tap();
target.pushTimeout(5);
settingBtn = tabbar.buttons()["Settings"];
target.popTimeout();
if(settingBtn.isValid()) {
    UIALogger.logPass(testName);
} else {
    UIALogger.logFail(testName);
}

testName = "Switch to settings";

UIALogger.logStart(testName);
tabbar.buttons()["Settings"].tap();
target.pushTimeout(5);
var saveBtn = target.frontMostApp().mainWindow().buttons()["Save"];
target.popTimeout();
if(saveBtn.isValid()) {
    UIALogger.logPass(testName);
} else {
    UIALogger.logFail(testName);
}

testName = "User settings save fail";

UIALogger.logStart(testName);
saveBtn.tap();
var saveSuccessful = target.frontMostApp().mainWindow().staticTexts()["Save Successful"];
if(saveSuccessful.isValid()) {
    UIALogger.logFail(testName);
} else {
    UIALogger.logPass(testName);
}

testName = "User settings save successful";

UIALogger.logStart(testName);
var displayNameField = target.frontMostApp().mainWindow().textFields()[0];
displayNameField.setValue("Sudsfdnvmncxv");
saveBtn.tap();
target.pushTimeout(5);
var saveSuccessful = target.frontMostApp().mainWindow().staticTexts()["Save Successful"];
target.popTimeout();
if(saveSuccessful.isValid()) {
    UIALogger.logPass(testName);
} else {
    UIALogger.logFail(testName);
}