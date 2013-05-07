/**
 * This is the main template compiling caching module.
 *
 * We use handlebars for compilation, and export an array of precompiled 
 * template functions ready for use
 *
 * These can be consumed by:
 *
 * var templates = require("./templates").templates;
 * templates["my_fancy_page.html"]({"some_key":"a value"});
 *
 * all templates in the "views" path will be compiled. this is set in server.js
 */
var fs = require("fs");
var hb = require("handlebars");
var server = require("./server");
var app = server.app;
var templates = [];
var template_path = app.set("views");
var files = fs.readdirSync(template_path);

console.log("Compiling template cache...");
files.forEach(
  function(file,index,arr)
  {
    if(file.indexOf("html",file.length - 4) == -1) return; //skip any files that don't end in .html
    console.log("Compiling template: " + file);
    var markup = fs.readFileSync(template_path + file).toString();
    templates[file] = hb.compile(markup);
  });

//set up partials
hb.registerPartial("header",templates["header.html"]);
hb.registerPartial("footer",templates["footer.html"]);
exports.templates = templates;

console.log("Completed compiling templates.");

