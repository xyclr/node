var extendBootstrap = (function(){
    $(".dropdown").each(function(item){
        var _this = $(this);
        _this.find(".dropdown-menu li a").click(function(){
            $(this).parents(".dropdown-menu").prev().text($(this).text()).attr({"data-type" : $(this).attr("data-type")});
        })
    })
})();