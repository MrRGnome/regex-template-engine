var TemplateEngine = {};

TemplateEngine.DEBUG = true;
TemplateEngine.BINDING = false;

//Set this folder to wherever your html templates are that will be loaded
TemplateEngine.VIEWS_FOLDER = "/views";

//Template Engine start point
TemplateEngine.Start = function () {
    $(document.getElementsByTagName("body")[0]).html(TemplateEngine.ParseAndReplace($(document.getElementsByTagName("body")[0]).html()));//document.getElementsByTagName("html")[0].innerHTML = TemplateEngine.ParseAndReplace(document.getElementsByTagName("html")[0].innerHTML);
};

document.addEventListener('DOMContentLoaded', TemplateEngine.Start, false);

//ParseAndReplace executes a regex search for curly braces in the provided html text and parses their inner content, looking for variable names, template load requests, and repeating logic
//Accepted html syntax are:
//{{variableName}} - outputs variable content
//{{scope.variableName}} - outputs variable content
//{{variableName.json}} - outputs variable as stringified json
//{{variableName.todate}} - outputs variable as ISO datetime
//{{variableName.local}} - outputs variable as local machine datetime
//{{this}} - outputs the local scope, useful in templates called with "foreach"
//{{loadtemplate template.html at htmlElementId}} - loads an html document and insert it into htmlElementId
//{{loadtemplate template.html at htmlElementId with variableName}} - loads an html document and inserts it into htlmElementId using variableName to populate the template
//{{foreach iterableVariable loadtemplate template.html at htmlElementId}} - loads a template and iterates over an object or array. The template is loaded as many times as the iterableVariable is iterable, with theiterableVariable being passed as the local context for another round of ParsAndReplace on the loaded template.

//ParseAndreplace also accepts a replaceMatrix which can be used to define for more sohpisticated templating needs. In the example below the html {{email_subscription}} is replaced by the word "CHECKED" which checks a checkbox if the user is subscribed to email newsletters.
// $("#userProfileBody").html(ParseAndReplace(sessionStorage["userProfileBody.html"], {
//"{{email_subscrption}}": user.preferences.email_subscription ? "CHECKED" : ""
//}));

TemplateEngine.ParseAndReplace = function (html, replaceMatrix, localScope, fullScope) {
    if (!fullScope)
        fullScope = "";

    if (!localScope)
        localScope = window;

    if (replaceMatrix) {
        for (var key in replaceMatrix) {
            var re = new RegExp(key, "g");
            html = html.replace(re, replaceMatrix[key]);
            if (TemplateEngine.DEBUG) console.log(key + " = " + replaceMatrix[key]);
        }
    }

    //find and replace variable names
    var matchNames = html.match(/{{*[^\s}]*}}/g);
    if (matchNames) {
        for (var i = 0; i < matchNames.length; i++) {
            var namesArr = TemplateEngine.ClearBraceTags(matchNames[i]);
            var variableDictionary = {};
            for (var n = 0; n < namesArr.length; n++) {
                var variableValue;
                var binding = TemplateEngine.BINDING;

                if (namesArr[n].match(/.nobind/g))
                {
                    binding = false;
                    namesArr[n].replace(/.nobind/g, "");
                }
                    
                if (namesArr[n].match(/.bind/g))
                {
                    binding = true;
                    namesArr[n].replace(/.bind/g, "");
                }

                if (variableDictionary[namesArr[n]])
                    variableValue = variableDictionary[namesArr[n]];
                else {
                    variableValue = TemplateEngine.GetObjFromString(namesArr[n], localScope);
                    variableDictionary[namesArr[n]] = variableValue;
                    if (TemplateEngine.DEBUG) console.log("setting value " + namesArr[n] + " = " + variableValue);
                }

                //add binding hooks
                if (binding) {
                    variableValue = "<span class='binding_hook_" + fullScope + namesArr[n] + "'>" + variableValue + "</span>";
                    var parentScope = TemplateEngine.GetObjFromString(namesArr[n], localScope, true);
                    var lastTerm = TemplateEngine.GetLastPathTerm(namesArr[n], localScope);

                    if (parentScope && lastTerm) {
                        var setFunc = function (val) {
                            if (TemplateEngine.DEBUG) console.log("Searching for binding hook: binding_hook_" + this.prop);

                            var elements = document.getElementsByClassName("binding_hook_" + fullScope + this.prop);
                            for (var index = 0; index < elements.length; index++) {
                                elements[index].innerHTML = val;
                            }
                            parentScope[lastTerm] = val;
                        };

                        var boundSetFunc = setFunc.bind({ prop: namesArr[n], parentScope: parentScope, lastTerm: lastTerm, fullScope: fullScope });

                        parentScope.__defineSetter__("_" + lastTerm, boundSetFunc);


                    }
                    else
                        if (TemplateEngine.DEBUG) console.log("Unable to perform binding, variable undefined");


                    /*
                    parentScope = {
                        set value(val) {
                            if (TemplateEngine.DEBUG) console.log("Searching for binding hook: binding_hook_" + namesArr[n]);
                            var elements = document.GetElementsByClassName("binding_hook_" + namesArr[n]);
                            for (element in elements) {
                                element.innerHTML = val;
                            }
                        }
                    };
    
                    parentScope[lastTerm] = undefined;
    
    
                    Object.defineProperty(parentScope, lastTerm, {
                        set: function (val) {
                            if (TemplateEngine.DEBUG) console.log("Searching for binding hook: binding_hook_" + namesArr[n]);
                            var elements = document.GetElementsByClassName("binding_hook_" + namesArr[n]);
                            for(element in elements)
                            {
                                element.innerHTML = val;
                            }
                        },
                        configurable: true
                    });
    
                    parentScope[lastTerm] = variableValue;*/
                }

                var re = new RegExp("{{" + namesArr[n] + "}}", "g");
                html = html.replace(re, variableValue);
            }
        }

    }


    //find foreach
    var match = html.match(/{{foreach.*}}/g);
    if (match) {
        for (var i = 0; i < match.length; i++) {

            if (TemplateEngine.DEBUG) console.log("Executing: " + match[i]);

            //Trim tags
            var matchArr = TemplateEngine.ClearBraceTags(match[i]);
            var lastMatch = matchArr[matchArr.length - 1];

            //Get foreach object
            var foreachArr = localScope ? TemplateEngine.GetObjFromString(matchArr[1], localScope) : TemplateEngine.GetObjFromString(matchArr[1]);
            if (TemplateEngine.DEBUG) console.log("foreach length: " + foreachArr.length);

            //look for keywords
            var loadtemplate = matchArr.indexOf("loadtemplate");
            var preDivIndex = matchArr.indexOf("at");
            var divId = matchArr[preDivIndex + 1];

            if (loadtemplate != -1 && preDivIndex != -1) {
                var templateName = matchArr[loadtemplate + 1];
                //Do template binding
                var callback = function (ret, divId) {

                    //foreach through template
                    for (var x = 0; x < foreachArr.length; x++) {
                        $("#" + divId).append(TemplateEngine.ParseAndReplace(ret, {}, this.foreachArr[x], this.arrPath + "[" + x + "].")); //document.getElementById(divId).innerHTML += TemplateEngine.ParseAndReplace(ret, {}, this.foreachArr[x], this.arrPath + "[" + x + "].");
                    }

                    document.getElementById(divId).className = document.getElementById(divId).className.replace(/( |\b)hidden( |\b)/g, " ");
                    return true;
                };

                var boundCallback = callback.bind({ arrPath: matchArr[1], foreachArr: foreachArr });

                //load template
                TemplateEngine.LoadTemplate(matchArr[loadtemplate + 1], boundCallback, divId);

            }

            //Clear foreach content
            html = html.replace(/{{foreach.*}}/g, "");
        }

    }


    //find loadtemplate
    match = html.match(/{{loadtemplate.*}}/g);
    if (match) {
        for (var x = 0; x < match.length; x++) {

            if (TemplateEngine.DEBUG) console.log("Executing " + match[x]);

            //Trim tags
            var matchArr = TemplateEngine.ClearBraceTags(match[x]);
            var templateName = matchArr[1];
            var preDivIndex = matchArr.indexOf("at");
            var divId = matchArr[preDivIndex + 1];
            var withIndex = matchArr.indexOf("with");
            var varName = matchArr[withIndex + 1];


            if (preDivIndex == -1) {
                if (TemplateEngine.DEBUG) console.log("unable to load without 'at' keyword. Include 'at div_id' in your code referencing the location you wish to populate with a template on statement: " + match[x]);
                return;
            }

            if (!templateName) {
                if (TemplateEngine.DEBUG) console.log("Could not retrieve template name from: " + match[x]);
                return;
            }

            var scopeVariable = localScope ? TemplateEngine.GetObjFromString(varName, localScope) : TemplateEngine.GetObjFromString(varName);

            var callback = function (ret, divId) {
                if (TemplateEngine.DEBUG) console.log("Executing template callback " + divId);
                $("#" + divId).html(TemplateEngine.ParseAndReplace(ret, {}, scopeVariable)); //document.getElementById(divId).innerHTML = TemplateEngine.ParseAndReplace(ret, {}, scopeVariable);
                document.getElementById(divId).className = document.getElementById(divId).className.replace(/( |\b)hidden( |\b)/g, " ");
            };

            TemplateEngine.LoadTemplate(templateName, callback, divId);
        }
    }

    return html;
};


//Load template creates a request to load additional content, stores it to session storage if a load is successful, and calls the HandleResponse call back.
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

//GetObjectFromString attempts to search through the scope provided for a defined variable in the typical javascript format, for example "TemplateEngine.DEBUG"
//Accepts keywords such as "this", ".json" (which provides the JSON.stringify-ied version of the variable), ".todate" (Converts variable to ISO date), ".local" (Converts to local machine date and time)
TemplateEngine.GetObjFromString = function (objectPath, localScope, getLocalScope) {

    if (localScope == undefined)
        localScope = window;

    objectPath = objectPath.split(".");
    var foundVariable;

    if (getLocalScope) {
        if (objectPath.length == 1)
            return localScope;
    }

    var json = false;
    if (objectPath[objectPath.length - 1] == "json") {
        json = true;
        objectPath = objectPath.slice(0, objectPath.length - 1);
    }

    if (objectPath[0] == "this") {
        objectPath = objectPath.slice(1, objectPath.length);
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
        while (!foundVariable && tmp != undefined) {
            tmp = tmp[objectPath[n]];

            if (n == objectPath.length - 1) {
                foundVariable = tmp;
                break;
            }

            if ((getLocalScope && n == objectPath.length - 2))
                return tmp;
            n++;
        }

    if (foundVariable == undefined || foundVariable == "NaN")
        foundVariable = "";

    if (todate && foundVariable != "") {

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

    if (json)
        foundVariable = JSON.stringify(foundVariable);

    return foundVariable;
};


//ClearBraceTags is a function designed to remove curly braces from the outside of a string so the contents may be cleanly parsed
TemplateEngine.ClearBraceTags = function (arr) {

    arr = arr.toString().replace(/{{/g, "");
    arr = arr.replace(/}}/g, "");
    return arr.split(" ");
};

TemplateEngine.GetLastPathTerm = function (objectPath, localScope) {
    objectPath = objectPath.split(".");
    var suffixs = ["this", "json", "todate", "local"];
    while (suffixs[objectPath[objectPath.length - 1]])
        objectPath = objectPath.slice(0, objectPath.length - 1);
    if (objectPath.length == 0)
        return localScope;
    else
        return objectPath[objectPath.length - 1];
};
