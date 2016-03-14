# regex-template-engine
A simple, light-weight templating engine using regex and javascript.

The Regex Templating Engine (RTE) can be used to load HTML templates and insert javascript content into them before display on the page. It automatically parses an html document for templating keywords and inserts HTML, Javascript, and CSS templates into the DOM.


#Setup

To begin using RTE users must examine the TemplateEngine.settings, defined at the top of regex_template_engine.js or set in your root HTML documents. First users should specify the path to their HTML templates relative to their root directory by setting the variable:

    TemplateEngine.settings.VIEWS_FOLDER = "/views";

Setting TemplateEngine.settings.VIEWS_FOLDER to "" will load templates from the root directory, while subdirectories can be specified in the template loading command itself.


The RTE uses a css class to hide templated content before it is loaded. If you create a CSS class with the "display: none;" property set and apply it to your templated content, RTE will remove that class once the template is loaded. You can specify the name of the class you are using to hide templating keywords with the settings variable:

    TemplateEngine.settings.HIDDEN_CLASS = "hidden";


The RTE will automatically parse any template logic it finds inside the document it is linked to. Link it to your root HTML document where templating is to occur (not inside your templates themselves) and the RTE will execute on page load. To disable this feature you can change the value of:

    TemplateEngine.settings.AUTOLOAD = false;

Once autoload is disabled templating logic must be called manually using:

    TemplateEngine.ParseAndReplace(templateLogic, replacementMatrix*, localScope*, fullScope*, callback*) //(*) denotes optional parameters

The parameters of TemplateEngine.ParseAndReplace are described as follows:

  * templateLogic - Required - Template logic is a string denoted by double curly brackets bracing templating keywords, such as:
  ```{{loadtemplate subfolder/contact_card.html at contact_card_div}}```
  which will load contact_card.html from the local domain using the folder path described by TemplateEngine.settings.VIEWS_FOLDER and insert that content into the HTML element IDed as "contact_card_div".
  * replacementMatrix - Optional - A replacement matrix is a javascript object with keys representing values you would like to replace, and values representing the values that you would like to replace the keys with. An example replacement matrix which replaces the text {{greeting}} with "Hello World!" and {{author}} with "admin" would be:
  ```{ "{{greeting}}": "Hello World!", "{{author}}": "admin" };```
  * localScope - Optional - A javascript object which will represent the local scope for the parse and replace operation from which template values are pulled
  * fullScope - Optional - An internally used value which is used recursively to keep track of full object paths during binding operations of nested templates
  * callback - Optional - A callback that will fire once the asynchronous operation is compelete. No paramters are called, so bind any required parameters to your callback.


One-way binding is an alpha feature and can be globally enabled for every variable by setting:

    TemplateEngine.settings.BINDING = true;

which will create a setter variable in the same location as the bound variable, but with an underscore preceding, which when set will update the original bound variable as well as the UI the variable was bound to. Example:

    {{scope.variable.bind}}

will bind the variable `scope._variable` to both `scope.variable` and the UI where `{{scope.variable.bind}}` is used. Setting the value of `scope._variable` will update all bound values. The .bind suffix is unnecessary if the global bind setting is set to true.


Users may also wish to turn off console logging of the library by setting the debug variable to false. (It's true by default, but false provides some performance gains)

    TemplateEngine.settings.DEBUG = false;



#Keywords and Examples

    {{variableName}}
Outputs variable content


    {{scope.variableName}}
Outputs variable content


    {{variableName.json}}
Outputs variable as stringified json


    {{variableName.todate}}
Outputs variable as ISO datetime


    {{variableName.local}}
Outputs variable as local machine datetime


    {{variableName.replace-whitespace._}}
Replaces white space in variable string with "_" literal (or any other literal characters in its place), useful for using string values as html attributes for deeply nested templates


    {{variableName.bind}}
Binds the template to the javascript variable, where-in a binding interface is created with the same name as the javascript variable being bound except with an underscore preceding. I.E. scope._variableName. Any value set to the binding interface (_variableName) will propogate to the UI as well as the original javascript variable. (Does not require TemplateEngine.settings.BINDING to be true)


    {{variableName.unbind}}
If global binding is enabled, .unbind will not bind this specific variable when templated.


    {{this}}
Outputs the local scope, useful in templates called with "foreach"


    {{this.variableName}}
Outputs a variable within the local scope, useful in templates with "foreach"


    {{loadtemplate template.html at htmlElementId}}
Loads an html document from TemplateEngine.settings.VIEWS_FOLDER and inserts it into htmlElementId


    {{loadtemplate subdirectory/template.html at htmlElementId with scope.variable}}
Loads an html document from TemplateEngine.settings.VIEWS_FOLDER/subdirectory and insert it into htmlElementId using scope.variable to populate the template


    {{foreach iterableVariable loadtemplate template.html at htmlElementId}}
Loads a template and iterates over an object or array. The template is loaded as many times as the iterableVariable is iterable, with the iterableVariable being passed as the local context for another round of templating on the loaded template.


#Advanced Templating

Users may wish to perform more significant templating logic, for which they may use a replacement matrix which will define keywords to look for and logic to execute in replacing those keywords.

TemplateEngine.ParseAndReplace (defined in detail in the SETUP section) accepts a replaceMatrix which can be used to define more sohpisticated templating needs. In the example below the html {{email_subscription}} is replaced by the word "CHECKED" which checks a checkbox if the user is subscribed to email newsletters.

    var callback = function(htmlTemplate, divId) {
        document.getElementById(divId).innerHTML = TemplateEngine.ParseAndReplace(htmlTemplate, {
            "{{email_subscrption}}": user.preferences.email_subscription ? "CHECKED" : ""
        });
    }
    TemplateEngine.LoadTemplate("subdir/user_email.html", callback, "email_div"); //LoadTemplate accepts a path to the file, a callback to fire post load, and the ID of a DOM element in which to input the resulting template.
    
