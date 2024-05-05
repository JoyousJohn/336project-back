$(document).ready(function() {
    $('#login').submit(function(event) {
        event.preventDefault();

        var username = $('.login-username').val();
        var password = $('.login-password').val();

        $.ajax({
            type: 'POST',
            url: 'login.jsp',
            data: { username: username, password: password },
            success: function(response) {
                if (response.trim().includes("success")) {
                    // Extract username and email from response
                    var parts = response.trim().split("|");
                    var username = parts[1];
                    var email = parts[2];
                    //var role = parts[3];

                    // Update profile details on the page
                    $('.profile-username').text(username);
                    $('.profile-email').text(email);

                    // Redirect to profile page
                    window.location.href = 'profile.html';
                    console.log(window.location.href);
                } else {
                    $('#error-message').text("Invalid username or password").show();
                }
            },
            error: function(xhr, status, error) {
                console.error('Error during login:', error);
                $('#error-message').text("An error occurred. Please try again.").show();
            }
        });
    });

    // Function to handle logout form submission
    $('#logout').submit(function(event) {
        event.preventDefault(); // Prevent default form submission
        
        // Make an AJAX request to logout.jsp
        $.ajax({
            type: 'GET',
            url: 'logout.jsp',
            success: function() {
                // If logout is successful, display success message
                $('#error-message').text("Successfully logged out!").show();
                $('.login-username, .login-password').val(''); // Reset username and password fields
            },
            error: function(xhr, status, error) {
                console.error('Error during logout:', error);
                // Display an error message
                $('#error-message').text("An error occurred. Please try again.").show();
            }
        });
    });
});
