/**
 * jQuery popup plugin
 *
 * Written by Clayton C. Gulick
 * Released under MIT license - http://www.opensource.org/licenses/mit-license.php
 *
 * Using normal jquery selector syntax, will display any element as a "popup".
 *
 *  This means it will:
 *  1) Center the element on the screen
 *  2) Fade out the background
 *  3) Prevent any object on the screen from being clicked until the popup is dismissed
 *
 * Several options can be used to customize this plugin:
 *
 * relativeToElement - if this is provided, the popup will be centered relative to the provided element and the background "dimming" will be constrained to the dimensions of the provided element.
 * offsetTop - if provided, dialog will not be centered vertically, it will be offset from the scroll top or relativeToElement
 * offsetLeft - if provided, dialog will not be centered horizontally, it will be offset from the scroll left or relativeToElement
 * backgroundColor - the color the background should fade to. Default: #FFFFFF
 * backgroundOpacity - the % opacity the background should fade to. Default: 50%
 * fadeSpeed - how long it takes (in millisecs) to fade the background to the specified backgroundOpacity
 * xPosition - override the x position of the element when it is displayed. By default this will be centered on the screen
 * yPosition - override the y position of the element when it is displayed. By default this will be centered on the current scroll y position.
 * closeElements - an array of elements you want to use to close the dialog. They will be wired up to a click event and will trigger a close call.
 * onClose - a callback function to execute when the dialog is closed
 *
 * To close the popup, just call $.closePopup()
 *
 * Example:
 *
 * $("#myCoolDiv").popup(
 *      {   backgroundOpacity: .3,
 *          fadeSpeed: 300
 *      });
 *
 * $("#someCloseButton").click(function(event)
 * {
 *      $.closePopup();
 *      //do other stuff here....
 * });
 *          
 *
 * History:
 *
 * Date             Author              Comment
 * ----------------------------------------------------------------------------------
 *  11/05/2010      Clay Gulick         Initial version created
 *  12/13/2010      Clay Gulick         Added relativeToElement option and functionality
 *  12/27/2010		Clay Gulick			Added support for multiple concurrent popups
 *  12/29/2010		Clay Gulick			Added options to support absolute offsets
 *
 **/

(function($)
{ 

    /**
     * The primary jquery call
     **/
    $.fn.popup = function(options)
    {
        //debug("popup");
        //our settings object
        var settings = setDefaults(options);
        //debug(settings);

        if(this.length != 1)
        {
            //if more or less than one element was matched, throw an error
            alert("Error in popup() - ensure that a single element is selected");
        }

        //the element we're poping up
        var $self = this; 

        //if this element is already being displayed in a popup, bail
        if($self[0].popupBackground) return this;
        
        //create the background div    
        var background = $("<div></div>");
        
        //store a reference to the background div on the DOM object
        $self[0].popupBackground=background;
        
        //if we're creating the popup relative to another element, adjust the top, left, height and width to the passed in element. Otherwise, use the screen coords
        var relativeWidth;
        var relativeHeight;
        var relativeScrollTop;
        var relativeScrollLeft;
        var relativeTop=0;
        var relativeLeft=0;
        var relativeZIndex = 9999;
        if(settings.relativeToElement)
        {
            var pos = $(settings.relativeToElement).offset();
            relativeTop = pos.top;
            relativeLeft = pos.left;
            relativeHeight = $(settings.relativeToElement).height();
            relativeWidth = $(settings.relativeToElement).width();
            relativeScrollTop = $(settings.relativeToElement).scrollTop();
            relativeScrollLeft = $(settings.relativeToElement).scrollLeft();
            tempRelativeZIndex = $(settings.relativeToElement).css("z-index");
            if(tempRelativeZIndex && tempRelativeZIndex == parseInt(tempRelativeZIndex)){
              relativeZIndex = tempRelativeZIndex;
            }            
        }
        else
        {
            relativeHeight = $(window).height();
            relativeWidth = $(window).width();
            relativeScrollTop = $(window).scrollTop();
            relativeScrollLeft = $(window).scrollLeft(); 
        }

        background.css({
            "background-color":settings.backgroundColor,
            "position":"absolute",
            "top": relativeTop + relativeScrollTop,
            "left": relativeLeft + relativeScrollLeft, 
            "width": relativeWidth, 
            "height": relativeHeight,
            "opacity":settings.backgroundOpacity,
            "z-index":relativeZIndex + 1,
            "display":"none"
        });

        $("body").append(background);
        //fade it in
        background.fadeIn(settings.fadeSpeed);

        //calculate the position of the dialog
        var dialogTop=0;
        var dialogLeft=0;
        
        //if we have a vertical offset, use it, don't center
        if(settings.offsetTop)
        {
        	dialogTop = relativeScrollTop + relativeTop + settings.offsetTop;
        }
        else //center vertically
        {
        	dialogTop = ((relativeHeight - this.height()) / 2) + relativeScrollTop + relativeTop;
        }
        
        //if we have a horizontal offset, use it, don't center
        if(settings.offsetLeft)
        {
        	dialogLeft = relativeScrollLeft + relativeLeft + offsetLeft;
        }
        else //center horizontally
        {
        	dialogLeft = ((relativeWidth - this.width()) / 2) + relativeScrollLeft + relativeLeft;
        }
        
        //pull the dialog out of the DOM and add it back in at the document root level so absolute positioning is /actually/ absolute.
        $self.detach();
        $("body").append($self);
        
        $self.css("position","absolute");
        $self.css("top", dialogTop);
        $self.css("left", dialogLeft);
        $self.css("display","block");
        $self.css("z-index",relativeZIndex + 2);
        $self.addClass("jquery_popup_plugin_popup");
        
        if(settings.afterDisplayCallback) settings.afterDisplayCallback();

        //maintain chainability
        return this;

    };

    /**
     * Close the dialog
     **/
    $.fn.closePopup = function(options)
    {    	
        //debug("closing...");
    	var $self=this;
    	
    	options = $.extend({useOffScreenHide:false},options);
    	
    	//if we're missing the background prop, this isn't a valid element. Just bail.
    	if(!$self[0].popupBackground) return this;
    	
    	if(options.useOffScreenHide)
    	{
    		$self
    			.css("top",-3300)
    			.removeClass("jquery_popup_plugin_popup");
    	}
    	else
    	{
	        $self
	            .css("display","none")
	            .removeClass("jquery_popup_plugin_popup");
    	}
      $self[0].popupBackground.remove();
      $self[0].popupBackground=null;
        
        
      return this;
    };

    /**
     * Resize the popup, maintaining it's current position. Defaults to 500ms animation, pass duration: 0 in options for instant resize
     */
    $.fn.resizePopup = function(options)
    {
      var $self = this;
      var newWidth = options.width || 200;
      var newHeight = options.height || 200;
      var currentWidth = $self.width();
      var currentHeight = $self.height();

    	//if we're missing the background prop, this isn't a valid element. Just bail.
    	if(!$self[0].popupBackground) return this;

      $self.animate({
                      height: newHeight,
                      width: newWidth,
                      top: "+=" + (currentHeight - newHeight)/2,
                      left: "+=" + (currentWidth - newWidth)/2
                    },
                    {
                      duration: options.duration || 500
                    });

    }




    /**
     * Initialize settings with default params. Override with passed in values
     **/
    function setDefaults(options)
    {
        var settings = {
            backgroundColor:"#FFFFFF",
            backgroundOpacity:.5,
            fadeSpeed:300,
            relativeToElement:null,
            offsetTop: 0,
            offsetLeft: 0
        }

        $.extend(settings,options);
        return settings;
    }


    /**
     * Generic debug/trace wrapper around console.log
     **/
    function debug(message)
    {
      /*
        if(!window.console)
        {
            alert(message);
            return;
        }

        window.console.log(message);
      */
    }



})(jQuery); 

