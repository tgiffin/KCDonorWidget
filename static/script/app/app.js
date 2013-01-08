
//main script router. defines scripts to load for each page
scripts = {
  "global"                               : [
                                            "/script/lib/jquery-1.7.2.min.js",
                                            null //all scripts block until jquery is loaded
                                          ],
  "/authenticate_complete.html"         : [
                                            "/script/lib/jquery.formatCurrency-1.4.0.min.js",
                                            null,
                                            "/script/app/authenticate_complete.js"
                                          ],
  "/confirm_amount"                     : [
                                            "/script/lib/jquery.popup.js",
                                            "/script/app/confirm_amount.js"
                                          ],

  "/thank_you.html"                     : [
                                            "/script/app/thank_you.js"
                                          ],

  "/register.html"                      : [
                                            "/script/lib/greensock/TweenMax.js",
                                            null, //block until TweenMax is loaded
                                            "/script/lib/jquery.popup.js",
                                            "/script/lib/jquery.html5-placeholder-shim.js",
                                            "/script/lib/spin.js",
                                            "/script/lib/URI.js",
                                            null, //block until libs are loaded
                                            "/script/app/register.js"
                                          ]


};



//dynamically load LABjs. Once loaded, invoke LAB based on the scripts router
(function (global, oDOC, handler) {
    var head = oDOC.head || oDOC.getElementsByTagName("head");

    function LABjsLoaded() {
      $LAB.setGlobalDefaults({CacheBust: true});
      var $L=$LAB;
      var queue;

      for(var key in scripts)
      {
        if(oDOC.location.pathname == key || key=='global')
        {
          queue = scripts[key];
          for (var i=0, len=queue.length; i<len; i++) 
          {
            if (typeof queue[i] == "string") { // script string source found
              $L = $L.script(queue[i]);
            }
            else if (!queue[i]) { // null/false found
              $L = $L.wait();
            }
            else if (typeof queue[i] == "function") { // inline function found
              $L = $L.wait(queue[i]);
            }
          }

        }
      }
      
    }

    // loading code borrowed directly from LABjs itself
    setTimeout(function () {
        if ("item" in head) { // check if ref is still a live node list
            if (!head[0]) { // append_to node not yet ready
                setTimeout(arguments.callee, 25);
                return;
            }
            head = head[0]; // reassign from live node list ref to pure node ref -- avoids nasty IE bug where changes to DOM invalidate live node lists
        }
        var scriptElem = oDOC.createElement("script"),
            scriptdone = false;
        scriptElem.onload = scriptElem.onreadystatechange = function () {
            if ((scriptElem.readyState && scriptElem.readyState !== "complete" && scriptElem.readyState !== "loaded") || scriptdone) {
                return false;
            }
            scriptElem.onload = scriptElem.onreadystatechange = null;
            scriptdone = true;
            LABjsLoaded();
        };
        scriptElem.src = "/script/lib/LAB.js";
        head.insertBefore(scriptElem, head.firstChild);
    }, 0);

    // required: shim for FF <= 3.5 not having document.readyState
    if (oDOC.readyState == null && oDOC.addEventListener) {
        oDOC.readyState = "loading";
        oDOC.addEventListener("DOMContentLoaded", handler = function () {
            oDOC.removeEventListener("DOMContentLoaded", handler, false);
            oDOC.readyState = "complete";
        }, false);
    }
})(window, document);

