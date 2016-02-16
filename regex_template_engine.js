var TemplateEngine = {};

TemplateEngine.debug = true;

//Set this folder to wherever your html templates are that will be loaded
TemplateEngine.VIEWS_FOLDER = "/views";

//Template Engine start point
TemplateEngine.Start = function () {
    document.getElementsByTagName("html")[0].innerHTML = TemplateEngine.ParseAndReplace(document.getElementsByTagName("html")[0].innerHTML, {});
};

document.addEventListener('DOMContentLoaded', TemplateEngine.Start, false);

//ParseAndReplace executes a regex search for curly braces in the provided html text and parses their inner content, looking for variable names, template load requests, and repeating logic
//Accepted html syntax are:
//{{ variableName }} - outputs variable content
//{{ scope.variableName }} - outputs variable content
//{{ variableName.json }} - outputs variable as stringified json
//{{ variableName.todate }} - outputs variable as ISO datetime
//{{ variableName.local }} - outputs variable as local machine datetime
//{{ this }} - outputs the local scope, useful in templates called with "foreach"
//{{ loadtemplate template.html at htmlElementId }} - loads an html document and insert it into htmlElementId
//{{ foreach iterableVariable loadtemplate template.html at htmlElementId }} - loads a template and iterates over an object or array. The template is loaded as many times as the iterableVariable is iterable, with theiterableVariable being passed as the local context for another round of ParsAndReplace on the loaded template.

//ParseAndreplace also accepts a replaceMatrix which can be used to define for more sohpisticated templating needs. In the example below the html {{email_subscription}} is replaced by the word "CHECKED" which checks a checkbox if the user is subscribed to email newsletters.
// $("#userProfileBody").html(ParseAndReplace(sessionStorage["userProfileBody.html"], {
//"{{email_subscrption}}": user.preferences.email_subscription ? "CHECKED" : ""
//}));

TemplateEngine.ParseAndReplace = function (html, replaceMatrix, localScope) {
    if (!localScope)
        localScope = window;

    if (replaceMatrix) {
        for (var key in replaceMatrix) {
            var re = new RegExp(key, "g");
            html = html.replace(re, replaceMatrix[key]);
            if (TemplateEngine.debug) console.log(key + " = " + replaceMatrix[key]);
        }
    }

    //find and replace variable names
    var matchNames = html.match(/{{*[^\s}]*}}/g);
    if (matchNames) {
        for (var i = 0; i < matchNames.length; i++)
        {
            var namesArr = TemplateEngine.ClearBraceTags(matchNames[i]);
            var variableDictionary = {};
            for (var n = 0; n < namesArr.length; n++)
            {
                var variableValue;

                if (variableDictionary[namesArr[n]])
                    variableValue = variableDictionary[namesArr[n]];
                else {
                    variableValue = GetObjFromString(namesArr[n], localScope);
                    variableDictionary[namesArr[n]] = variableValue;
                    if (TemplateEngine.debug) console.log("binding " + namesArr[n] + " = " + variableValue);
                }

                if(TemplateEngine.debug) console.log("localScope parsing: " + namesArr[n] + " = " + variableValue);
                var re = new RegExp("{{" + namesArr[n] + "}}", "g");
                html = html.replace(re, variableValue);
            }
        }
        
    }


    //find foreach
    var match = html.match(/{{foreach.*}}/g);
    if (match) {
        if (TemplateEngine.debug) console.log("length " + match.length);
        for (var i = 0; i < match.length; i++)
        {
            //Trim tags
            var matchArr = TemplateEngine.ClearBraceTags(match[i]);
            var lastMatch = matchArr[matchArr.length - 1];

            //Get foreach object
            var foreachArr = localScope ? TemplateEngine.GetObjFromString(matchArr[1], localScope) : TemplateEngine.GetObjFromString(matchArr[1]);

            //look for keywords
            var loadtemplate = matchArr.indexOf("loadtemplate");
            var preDivIndex = matchArr.indexOf("at");
            var divId = matchArr[preDivIndex + 1];

            if (loadtemplate != -1 && preDivIndex != -1) {
                var templateName = matchArr[loadtemplate + 1];
                //Do template binding
                var callback = function (ret) {

                    //foreach through template
                    for (var x = 0; x < foreachArr.length; x++) {
                        document.getElementById(divId).innerHTML += TemplateEngine.ParseAndReplace(ret, {}, foreachArr[x]);
                    }

                    document.getElementById(divId).classList.remove("hidden");

                    return true;
                };

                //load template
                TemplateEngine.LoadTemplate(matchArr[loadtemplate + 1], callback);

            }

            //Clear foreach content
            html = html.replace(/{{foreach.*}}/g, "");
        }

    }


    //find loadtemplate
    match = html.match(/{{loadtemplate.*}}/g);
    if (match) {
        for (var x = 0; x < match.length; x++)
        {

            if (TemplateEngine.debug) console.log("Executing " + match[x]);

            //Trim tags
            var matchArr = TemplateEngine.ClearBraceTags(match[x]);
            var templateName = matchArr[1];
            var preDivIndex = matchArr.indexOf("at");
            var divId = matchArr[preDivIndex + 1];
            var withIndex = matchArr.indexOf("with");
            var varName = matchArr[withIndex + 1];


            if (preDivIndex == -1) {
                if (TemplateEngine.debug) console.log("unable to load without 'at' keyword. Include 'at div_id' in your code referencing the location you wish to populate with a template on statement: " + match[x]);
                return;
            }

            if (!templateName) {
                if (TemplateEngine.debug) console.log("Could not retrieve template name from: " + match[x]);
                return;
            }

            var scopeVariable = localScope ? TemplateEngine.GetObjFromString(varName, localScope) : TemplateEngine.GetObjFromString(varName);

            var callback = function (ret, divId) {
                if (TemplateEngine.debug) console.log(" Executing template callback " + divId);
                document.getElementById(divId).innerHTML = TemplateEngine.ParseAndReplace(ret, {}, scopeVariable);
                document.getElementById(divId).classList.remove("hidden");
            };

            TemplateEngine.LoadTemplate(templateName, callback, divId);
        }
    }

    return html;
};


//Load template creates a request to load additional content, stores it to session storage if a load is successful, and calls the HandleResponse call back.
TemplateEngine.loadAttempts = 0;
TemplateEngine.LoadTemplate = function (filename, callback, divId) {

    var fileDir = "";
    if (!filename.match(/http.*:\/\//)) {
        fileDir = TemplateEngine.VIEWS_FOLDER + "/";
    }

    var r = new XMLHttpRequest();
    r.open("GET", fileDir + filename, true);
    r.onreadystatechange = function () {
        if (r.readyState != 4 || r.status != 200) return;
        callback(r.responseText, divId);
    };
    r.send(null);
};

//GetObjectFromString attempts to search through the scope provided for a defined variable in the typical javascript format, for example "TemplateEngine.views"
//Accepts keywords such as "this", ".json" (which provides the JSON.stringify-ied version of the variable), ".todate" (Converts variable to ISO date), ".local" (Converts to local machine date and time)
TemplateEngine.GetObjFromString = function (objectPath, localScope) {

    if (localScope == undefined)
        localScope = window;

    objectPath = objectPath.split(".");
    var foundVariable;

    if (objectPath[0] == "this" && objectPath[1] == "json" && localScope != window) {
        return JSON.stringify(localScope);
    }

    var todate = false;
    var local = false;
    if (objectPath[objectPath.length - 1] == "todate") {
        todate = true;
        objectPath = objectPath.slice(0, objectPath.length - 1);

        if (objectPath[objectPath.length - 1] == "local") {
            local = true;
            objectPath = objectPath.slice(0, objectPath.length - 1);
        }
    }

    var n = 0;
    var tmp = localScope;
    if (objectPath.length == 0)
        foundVariable = localScope;
    else
        while (!foundVariable) {
            tmp = tmp[objectPath[n]];

            if (n == objectPath.length - 1) {
                foundVariable = tmp;
                break;
            }
            n++;
        }

    if (foundVariable == undefined)
        return "";

    if (todate && foundVariable != "") {
        if (foundVariable == "NaN")
            return "";

        var date;
        if (local) {
            date = new Date(foundVariable);
            foundVariable = date.toLocaleString();
        }

        else {
            date = new Date(parseInt(foundVariable));
            foundVariable = date.toISOString().substr(0, 10);
        }

    }

    return foundVariable;
};

//ClearBraceTags is a function designed to remove curly braces from the outside of a string so the contents may be cleanly parsed
TemplateEngine.ClearBraceTags = function (arr) {

    arr = arr.toString().replace(/{{/g, "");
    arr = arr.replace(/}}/g, "");
    return arr.split(" ");
};