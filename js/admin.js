$(document).ready(function() {
    let selectedUser; // Holds the currently selected user
    let users; // Define users at a higher scope

    // Fetch real users from the server
    getUsers();

    // Function to fetch users from the server
    function getUsers() {
        $.ajax({
            type: 'GET',
            url: 'admin.jsp',
            success: function(response) {
                if (response.startsWith("failure")) {
                    console.error('Error getting users:', response.split('|')[1]);
                    return;
                }
                if (!response) {
                    console.error('Empty response received from the server');
                    return;
                }
                // Process the response text to extract user data
                users = parseUsers(response);
                displayUsers(users); // Call a function to display users
            },
            error: function(xhr, status, error) {
                console.error('Error getting users:', error);
            }
        });
    }

    // Function to parse user data from plain text response
    function parseUsers(response) {
        const lines = response.trim().split('\n');
        const userList = [];
        lines.forEach(function(line) {
            const fields = line.trim().split('|');
            if (fields.length >= 4) {
                const user = {
                    username: fields[0],
                    name: fields[1],
                    email: fields[2],
                    role: fields[3]
                };
                userList.push(user);
            } else {
                console.error('Invalid user data:', line);
            }
        });
        return userList;
    }

    // Function to display users received from the server
    function displayUsers(usersData) {
        $('.user-list').empty(); // Clear existing user list
        usersData.forEach(function(user) {
            const $userElm = `
                <div username="${user.username}">${user.username}<span class="user-role user-role-${user.role.toLowerCase()}">${user.role}</span></div>
                <div username="${user.username}">${user.name}</div>
                <div username="${user.username}">${user.email}</div>
            `;
            $('.user-list').append($userElm);
        });
        $('.manage-users').text(`Manage users (${usersData.length})`); // Update the manage users count
    }

    // Highlight in blue on hover
    $('.user-list > div:not(.list-head)').hover(function() {
        const name = $(this).attr('username')
        $(`div[username="${name}"]`).addClass('user-hover')
    }, function() {
        const name = $(this).attr('username')
        $(`div[username="${name}"]`).removeClass('user-hover')
    })

    // Show user management options when a user is clicked
    $('.user-list > div:not(.list-head)').click(function() {
        const name = $(this).attr('username')
        if (selectedUser && name === selectedUser.username) return

        $('.managing-user').removeClass('managing-user')
        selectedUser = users.find(user => user.username === name)
        $(`div[username="${name}"]`).addClass('managing-user')

        $('.manage-col-selected').removeClass('manage-col-selected')
        $('.manage-info-wrap, .manage-danger-wrap').hide(); // Hide all wrapper
        $('.manage-info-wrap').show();
        $('.manage-account-info').addClass('manage-col-selected')
        
        $('.user-management-example').hide().insertAfter($(`div[username="${name}"]`).last()).slideDown();

        // Fill in input placeholders
        $('.change-username-input').attr('placeholder', name).val('')
        $('.change-name-input').attr('placeholder', selectedUser.name).val('')
        $('.change-email-input').attr('placeholder', selectedUser.email).val('')
        $('.change-password-input').attr('placeholder', '*****...').val('')
        $('.change-role-input').val(selectedUser.role.toLowerCase()) // Change selected role to current role

        // If error message telling user they didn't change anything is showing, clear it and reset the button to "Save changes"
        $('.save-changes').text("Save changes").removeClass('no-changes')

        // Remove any delete confirmation from past users being deleted
        $('.delete-user-btn').removeClass('delete-confirming').css('cursor', 'pointer').text('Delete user')
        $('.no-undone').hide();

    })

    $('.user-management-example').hide();

    // If error message telling user they didn't change anything is showing, clear it and reset the button to "Save changes"
    $('.manage-info input').click(function() {
        $('.save-changes').text("Save changes").removeClass('no-changes')
    })  

    // Remove button message saying "Please fill in all fields!"
    $('.create-user-form input').click(function() {
        $('.create-user-confirm').text("Create New User").removeClass('create-user-error')
    }) 

    // Show create new user input form when new user button is clicked
    $('.create-user').click(function() {
        if ($('.create-user-form').is(':visible')) {
            $('.create-user-form').slideUp();
            return
        }
        $(this).addClass('create-user-expanded')
        $('.create-user-form').removeClass('none').hide().slideDown();
    })

    $('.manage-columns > div').click(function() {
        if ($(this).hasClass('manage-col-selected')) return;

        $('.manage-col-selected').removeClass('manage-col-selected')
        $(this).addClass('manage-col-selected')

        $('.manage-info-wrap, .manage-danger-wrap').hide(); // Hide all wrapper

        const managing = $(this).attr('managing')
        console.log(managing)
        $(`.${managing}-wrap`).show().removeClass('none');
    })

    $('.delete-user-btn').click(function() {
        const isConfirming = $(this).hasClass('delete-confirming') // require a 2nd confirmation 
        // Ask admin/rep to confirm first
        if (!isConfirming) {
            $(this).text('Confirm Deletion').addClass('delete-confirming')
            $('.no-undone').removeClass('none').hide().fadeIn('fast');
            return
        }
        // Actually delete the user
        else {
            $(this).text('Deleting user...').css('cursor', 'default')
            deleteUser(selectedUser.username)
        }
    })
    
    $('.create-user-confirm').click(createNewUser);

})

// Delete this user from SQL via POST request.
function deleteUser(username) {
    $.ajax({
        type: 'POST',
        url: 'admin.jsp', // change this as you wish
        data: { deleteUsername: username }, // Modified to pass username in data
        success: function(response) {
            // alert("User successfully deleted!") // For now just show an alert, will add some absolute/fixed button later
            $(`div[username="${username}"]`).remove();
            $('.user-management-example').slideUp();
        },
        error: function(xhr, status, error) {
            console.error('Error deleting user:', status);
            $('.delete-user-btn').text('Error deleting user: ' +  status)
        }
    });
}


var creatingUser = false; // Global flag to track if a user creation process is already ongoing

function createNewUser() {
    if (creatingUser) {
        console.log("User creation process already in progress.");
        return; // Exit the function if user creation is already in progress
    }

    // Get user data from the input fields
    var username = $('.new-user-username').val();
    var name = $('.new-user-name').val();
    var email = $('.new-user-email').val();
    var password = $('.new-user-password').val();
    var role = $('.new-user-role').val();

    // Check if any field is empty
    if (!username || !name || !email || !password || !role) {
        // If any field is empty, show an error message and exit
        $('.create-user-confirm').text("Please fill in all fields!").addClass('create-user-error');
        return;
    }

    console.log("Attempting to create new user...");
    creatingUser = true; // Set flag to indicate user creation process has started

    // Send AJAX request to the server
    $.ajax({
        type: 'POST',
        url: 'admin.jsp',
        data: {
            createNewUser: 'true', // Add this parameter to indicate new user creation
            username: username,
            name: name,
            email: email,
            password: password,
            role: role
        },
        success: function(response) {
            console.log("Server response:", response);
            if (response.includes("success")) {
                alert("User created successfully.");
                // After the user clicks OK on the alert, reload the page
                window.location.reload();
            } else if (response.startsWith("failure")) {
                var responseData = response.split("|");
                alert("Failed to create user: " + responseData[1]);
            } else {
                alert("Unexpected response from server.");
            }
            creatingUser = false; // Reset flag when user creation process completes
        },
        error: function(xhr, status, error) {
            console.error("Error:", error);
            console.log("Respose:",response);
            alert("Error: Unable to create user.");
            creatingUser = false; // Reset flag on error as well
        }
    });
}



// Send create new user via admin panel post request to server
// This can be the same endpoint and logic as creating a new user on the profile/login/sign up page
function postNewUser(newUser) {

    $.ajax({
        type: 'POST',
        url: 'admin.jsp', // change this as you wish
        data: JSON.stringify(newUser),
        contentType: 'application/json',

        success: function(response) {
            console.log('User created successfully');
            // We can show some visual element that the user was created successfully sometime later
        },
        error: function(xhr, status, error) {
            console.error('Error changing user data:', error);
            // Show error if there was one (i.e. username already exists)
            $('.create-user-confirm').text(status).addClass('create-user-error')
        }
    });

}

// Send changes to username, email, password, and/or role to server
function saveUserChanges() {

    const newUsername = $('.change-username-input').val()
    const newName = $('.change-name-input').val()
    const newEmail = $('.change-email-input').val()
    const newPassword = $('.change-password-input').val()
    const newRole = $('.change-role-input').val()

    let changes = {}

    // Only add user attributes that actually changed to the object that will be sent to server
    // Don't set the attributes if they're the same to the current one
    if (newUsername && newUsername !== selectedUser.username) {
        changes['username'] = newUsername
    }
    if (newName && newName !== selectedUser.name) {
        changes['name'] = newName
    }
    if(newEmail && newEmail !== selectedUser.email) {
        changes['email'] = newEmail
    }
    if(newPassword && newPassword !== selectedUser.password) {
        changes['password'] = newPassword
    }
    if(newRole && newRole.toUpperCase() !== selectedUser.role) {
        changes['role'] = newRole
    }

    // Prints only the changed properties in console
    console.table(changes)

    // If no changes tell the user they didn't change anything
    if (Object.keys(changes).length === 0) {
        $('.save-changes').text("You didn't make any changes!").addClass('no-changes')
        return
    }

    // Else, make an ajax post request to server with the new data!!
    postUserChanges(changes)

}

// MAKE A POST REQUEST TO JSP WITH OBJECT HOLDING USER ATTRIBUTES TO CHANGE!
// It only holds keys of the attributes that were actually changed, so make sure to loop them - don't change all!
// For example, if only username and name was changed, changesObj would be { 'username': 'newusername', 'name': 'newname' }
function postUserChanges(changesObj) {

    console.log(changesObj)
    // Prints something like: Object { username: "newusername", email: "newemail", role: "admin" } with whatever data was changed

    $.ajax({
        type: 'POST',
        url: 'admin.jsp', // change this as you wish
        data: JSON.stringify(changesObj),
        contentType: 'application/json',

        success: function(response) {
            console.log('User data changed successfully!');
            // Change the button with the confirmation message
            $('.save-changes').text(response.message) // response.something, depends how you implement it
        },
        error: function(xhr, status, error) {
            console.error('Error changing user data:', error);
            // Show the error on the button if there was one
            $('.save-changes').text(status).addClass('.no-change')
        }
    });

}