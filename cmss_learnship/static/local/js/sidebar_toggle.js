;(function () {
  "use strict";

  $(function () {

    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
        $(".content").toggleClass("toggle-full");
    });
  });
}());
