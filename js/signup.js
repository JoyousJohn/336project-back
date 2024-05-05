$(document).ready(function() {
    $('#signupForm').submit(function(event) {
        event.preventDefault();

        var password = $('#password').val();
        var confirmPassword = $('#confirmPassword').val();

        // Check if the passwords match
        if (password !== confirmPassword) {
            $('#passwordError').text("Passwords do not match"); // Display error message
            return; // Prevent form submission
        }

        // If passwords match, proceed with form submission
        $.ajax({
            type: 'POST',
            url: 'signup.jsp',
            data: $(this).serialize(), // Serialize form data for submission
            success: function(response) {
                var parts = response.trim().split("|");
                if (parts[0] === "success") {
                    // Signup successful, redirect to profile.html
                    window.location.href = 'profile.html';
                } else {
                    // Signup failed, display error message
                    alert("Signup failed: " + parts[1]);
                    console.log("no");
                }
            },
            error: function(xhr, status, error) {
                console.error('Error during signup:', error);
                alert("An error occurred during signup. Please try again.");
            }
        });
    });
});
