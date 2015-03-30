var target = UIATarget.localTarget()

var testName = "Room Appears Test";

UIALogger.logStart(testName);
var testRoom = target.frontMostApp().mainWindow().collectionViews()[0].cells()["Test"];
if(testRoom.isValid()) {
    UIALogger.logPass(testName);
} else {
    UIALogger.logFail(testName);
}

testName = "Room Opens";

UIALogger.logStart(testName);
target.frontMostApp().mainWindow().collectionViews()[0].cells()["Test"].tap();
target.pushTimeout(5);
var staticText = target.frontMostApp().mainWindow().staticTexts()["Room: Test"];
target.popTimeout();
if(staticText.isValid()) {
    UIALogger.logPass(testName);
} else {
    UIALogger.logFail(testName);
}

testName = "Room in tab bar";
var tabbar = target.frontMostApp().mainWindow().tabBar();
UIALogger.logStart(testName);
if(tabbar.buttons()["Test"].isValid()) {
    UIALogger.logPass(testName);
} else {
    UIALogger.logFail(testName);
}

testName = "Switch between tabs";
UIALogger.logStart(testName);

target.frontMostApp().tabBar().buttons()["Dashboard"].tap();
target.pushTimeout(5);
target.frontMostApp().mainWindow().staticTexts()["Dashboard"];
target.popTimeout();
if(!staticText.isValid()) {
    UIALogger.logFail(testName);
}

target.frontMostApp().tabBar().buttons()["Test"].tap();
target.pushTimeout(5);
staticText = target.frontMostApp().mainWindow().staticTexts()["Room: Test"];
target.popTimeout();
if(staticText.isValid()) {
    UIALogger.logPass(testName);
} else {
    UIALogger.logFail(testName);
}

testName = "Drawing doesn't break app";
UIALogger.logStart(testName);
target.frontMostApp().mainWindow().images()[1].dragInsideWithOptions({startOffset:{x:0.82, y:0.44}, endOffset:{x:0.07, y:0.47}, duration:3.9});
target.frontMostApp().mainWindow().images()[1].dragInsideWithOptions({startOffset:{x:0.36, y:0.09}, endOffset:{x:0.69, y:0.07}, duration:1.6});
if(target.frontMostApp().mainWindow().images()[1]) {
    UIALogger.logPass(testName);
} else {
    UIALogger.logFail(testName);
}

testName = "Leave room";
UIALogger.logStart(testName);
target.frontMostApp().mainWindow().toolbar().buttons()["Leave"].tap();
target.pushTimeout(5);
staticText = target.frontMostApp().mainWindow().staticTexts()["Dashboard"];
target.popTimeout();
if(target.frontMostApp().tabBar().buttons()["Leave"].isValid()) {
    UIALogger.logFail(testName);
} else {
    UIALogger.logPass(testName);
}
