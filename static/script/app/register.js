(function($)
{
  $(document).ready(
    function()
    {
      $(".next_button").click(
        function()
        {
          TweenMax.to(
            $("#steps"), //target
            1, //duration
            {
              css: { left: "-=1024" },
              ease: Bounce.easeOut
            });
        });

      $(".back_button").click(
        function()
        {
          TweenMax.to(
            $("#steps"), //target
            1, //duration
            {
              css: { left: "+=1024" },
              ease: Bounce.easeOut
            });
        });
      
    });
})(jQuery);
