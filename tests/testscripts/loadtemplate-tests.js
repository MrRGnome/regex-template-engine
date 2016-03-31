if (!Tests)
    var Tests = {};

Tests.TemplateTests = {};
var testArr = Tests.Utilities.MakeArray(10);

//load template
Tests.TemplateTests.LoadTemplate = {};
Tests.TemplateTests.LoadTemplate.template = "{{loadtemplate test-template.html at loadtemplateTest}}";
Tests.TemplateTests.LoadTemplate.expectedResult = "Template Loaded " + globalScopeVar;
Tests.TemplateTests.LoadTemplate.result = "";
Tests.TemplateTests.LoadTemplate.success = false;
Tests.TemplateTests.LoadTemplate.processingTime = 0;
Tests.TemplateTests.LoadTemplate.run = function () {
    var startTime = Date.now();
    TemplateEngine.settings.VIEWS_FOLDER = "/tests/testviews";
    $(document.getElementsByTagName("body")[0]).append("<div style='display: none;' id='loadtemplateTest'></div>");

    var callback = function () {
        Tests.TemplateTests.LoadTemplate.processingTime = Date.now() - this.startTime;
        Tests.TemplateTests.LoadTemplate.result = document.getElementById("loadtemplateTest").innerHTML;
        Tests.TemplateTests.LoadTemplate.success = Tests.TemplateTests.LoadTemplate.expectedResult == Tests.TemplateTests.LoadTemplate.result;
        Tests.results.push(Tests.TemplateTests.LoadTemplate.template + " : " + Tests.TemplateTests.LoadTemplate.success + " : " + Tests.TemplateTests.LoadTemplate.processingTime);
    }
    callback = callback.bind({ "startTime": startTime });

    TemplateEngine.ParseAndReplace(Tests.TemplateTests.LoadTemplate.template, null, null, null, callback);


};

//complex loadtemplate
/*
Tests.TemplateTests.LoadComplexTemplate = {};
Tests.TemplateTests.LoadComplexTemplate.intensity = 3;
Tests.TemplateTests.LoadComplexTemplate.template = "{{loadtemplate complex-template.html at loadcomplextemplateTest}}";
Tests.TemplateTests.LoadComplexTemplate.expectedResult = "";
Tests.TemplateTests.LoadComplexTemplate.result = "";
Tests.TemplateTests.LoadComplexTemplate.success = false;
Tests.TemplateTests.LoadComplexTemplate.processingTime = 0;
Tests.TemplateTests.LoadComplexTemplate.run = function () {
    
    sessionStorage['complex-template'] = "";
    for (var t in Tests.VariableTests)
    {
        sessionStorage['complex-template'] += Tests.Utilities.Repeate(Tests.VariableTests[t].template, Tests.TemplateTests.LoadComplexTemplate.intensity);
    }
    TemplateEngine.settings.ANTI_XHR_CACHING = true;
    //in order to make this work I am going to have to add a "actions" and "reset" method on objects which require thema nd trigger them as needed, including in this expected template

    $(document.getElementsByTagName("body")[0]).append("<div style='display: none;' id='loadcomplextemplateTest'></div>");
    var startTime = Date.now();
    var callback = function () {
        Tests.TemplateTests.LoadComplexTemplate.processingTime = Date.now() - this.startTime;
        Tests.TemplateTests.LoadComplexTemplate.result = document.getElementById("loadcomplextemplateTest").innerHTML;
        Tests.TemplateTests.LoadComplexTemplate.success = Tests.TemplateTests.LoadComplexTemplate.expectedResult == Tests.TemplateTests.LoadComplexTemplate.result;
        Tests.results.push(Tests.TemplateTests.LoadComplexTemplate.template + " : " + Tests.TemplateTests.LoadComplexTemplate.success + " : " + Tests.TemplateTests.LoadComplexTemplate.processingTime);
    }
    callback = callback.bind({ "startTime": startTime });

    TemplateEngine.ParseAndReplace(Tests.TemplateTests.LoadComplexTemplate.template, null, null, null, callback);


};*/

//foreach
Tests.TemplateTests.ForeachTemplate = {};
Tests.TemplateTests.ForeachTemplate.template = "{{foreach testArr loadtemplate foreach-template.html at foreachTest}}";
Tests.TemplateTests.ForeachTemplate.expectedResult = "";
for (var i = 0; i < testArr.length; i++) {
    Tests.TemplateTests.ForeachTemplate.expectedResult += "foreach " + testArr[i];
}
Tests.TemplateTests.ForeachTemplate.result = "";
Tests.TemplateTests.ForeachTemplate.success = false;
Tests.TemplateTests.ForeachTemplate.processingTime = 0;
Tests.TemplateTests.ForeachTemplate.run = function () {
    var startTime = Date.now();
    TemplateEngine.settings.VIEWS_FOLDER = "/tests/testviews";
    $(document.getElementsByTagName("body")[0]).append("<div style='display: none;' id='foreachTest'></div>");

    var callback = function () {
        Tests.TemplateTests.ForeachTemplate.processingTime = Date.now() - this.startTime;
        Tests.TemplateTests.ForeachTemplate.result = document.getElementById("foreachTest").innerHTML;
        Tests.TemplateTests.ForeachTemplate.success = Tests.TemplateTests.ForeachTemplate.expectedResult == Tests.TemplateTests.ForeachTemplate.result;
        Tests.results.push(Tests.TemplateTests.ForeachTemplate.template + " : " + Tests.TemplateTests.ForeachTemplate.success + " : " + Tests.TemplateTests.ForeachTemplate.processingTime);
    }
    callback = callback.bind({ "startTime": startTime });

    TemplateEngine.ParseAndReplace(Tests.TemplateTests.ForeachTemplate.template, null, null, null, callback);
};



//Stress test
Tests.TemplateTests.Stress = {};
Tests.TemplateTests.Stress.intensity = 1000;
Tests.TemplateTests.Stress.template = Tests.Utilities.Repeat("{{foreach testArr loadtemplate foreach-template.html at stressTest}}", Tests.TemplateTests.Stress.intensity);
Tests.TemplateTests.Stress.expectedResult = "";
for (var i = 0; i < testArr.length; i++) {
    Tests.TemplateTests.Stress.expectedResult += "foreach " + testArr[i];
}
Tests.TemplateTests.Stress.expectedResult = Tests.Utilities.Repeat(Tests.TemplateTests.Stress.expectedResult, Tests.TemplateTests.Stress.intensity);
Tests.TemplateTests.Stress.result = "";
Tests.TemplateTests.Stress.success = false;
Tests.TemplateTests.Stress.processingTime = 0;
Tests.TemplateTests.Stress.run = function () {
    TemplateEngine.settings.ANTI_XHR_CACHING = true;

    TemplateEngine.settings.VIEWS_FOLDER = "/tests/testviews";
    $(document.getElementsByTagName("body")[0]).append("<div style='display: none;' id='stressTest'></div>");

    var callback = function () {
        Tests.TemplateTests.Stress.processingTime = Date.now() - this.startTime;
        if (TemplateEngine.settings.DEBUG) console.log("done stress test, time:" + Tests.TemplateTests.Stress.processingTime);
        Tests.TemplateTests.Stress.result = document.getElementById("stressTest").innerHTML;
        Tests.TemplateTests.Stress.success = Tests.TemplateTests.Stress.expectedResult == Tests.TemplateTests.Stress.result;
        Tests.results.push(Tests.TemplateTests.Stress.template + " : " + Tests.TemplateTests.Stress.success + " : " + Tests.TemplateTests.Stress.processingTime);
    }
    var startTime = Date.now();
    callback = callback.bind({ "startTime": startTime });

    TemplateEngine.ParseAndReplace(Tests.TemplateTests.Stress.template, null, null, null, callback);
};