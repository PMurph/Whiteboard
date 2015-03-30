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
var errorText = target.frontMostApp().mainWindow().staticTexts()["Registration failed"]; 
target.popTimeout();
if(errorText.isValid()) {
    UIALogger.logPass(testName);
} else {
    UIALogger.logFail(testName);
}

testName = "Register test user";

var testUserName = "hgjfdshgjdsfg";
var testPassword = "fdgsfdbfdbvbcb";

UIALogger.logStart(testName);
var userNameField = target.frontMostApp().mainWindow().textFields()[0];
var passwordField = target.frontMostApp().mainWindow().secureTextFields()[0];
userNameField.setValue(testUserName);
passwordField.setValue(testPassword);
target.frontMosApp().mainWindow().buttons()["Register"].tap();
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
UIALogger.logFail(testName);

testName = "Login to valid account";

UIALogger.logStart(testName);
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

testName = "User settings save fail";

UIALogger.logStart(testName);

UIAlogger.logFail(testName);