$(document).ready(function() {
    
    $('.navbar-bell').click(function() {

        const alertMenuExpanded = $('.alert-wrapper').is(':visible')
    
        // Show the alert menu if it's hidden
        if (alertMenuExpanded === false) {
    
            $('.alert-wrapper').removeClass('none').hide().slideDown();
            $('.navbar-bell').addClass('navbar-bell-selected')
    
        // Hide the alert menu if it's  shown
        } else {

            $('.alert-wrapper').slideUp();
            $('.navbar-bell').removeClass('navbar-bell-selected')

        }
    
    })

})

