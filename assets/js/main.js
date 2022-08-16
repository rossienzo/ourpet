// JQuery
jQuery(function() {  

    $("#Login").on('click', function () {
        $("#LoginModal").modal("show");
    });

    $('#PetsCategoriesCarousel').carousel({ interval: 5000 });

    $(window).on('resize', function() {
        if ($("#Navbar").hasClass("show"))
            $("#Navbar").removeClass("show");
    }); 

});