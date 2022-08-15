// JQuery
jQuery(function() {  

    $('#PetsCategoriesCarousel').carousel({ interval: 2000 });
    $(window).on('resize', function() {
        if ($("#Navbar").hasClass("show"))
            $("#Navbar").removeClass("show");
    }); 

});