let selectedUser; // Holds the currently selected user
let users; // Define users at a higher scope

function getUsers() {
    $.ajax({
        type: 'GET',
        url: 'admin.jsp',
        success: function(response) {
            console.log('Success:', response); // Log the response
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
                    role: fields[3],
                    userId: fields[4]
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
	console.log(usersData)
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

    // Reapply event binding for click event on user list items
    $('.user-list > div:not(.list-head)').off('click').on('click', function() {
        const name = $(this).attr('username')
        if (selectedUser && name === selectedUser.username) return;
        console.log(name);
        $('.managing-user').removeClass('managing-user')
        selectedUser = users.find(user => user.username === name)
        $(`div[username="${name}"]`).addClass('managing-user')

        $('.manage-col-selected').removeClass('manage-col-selected')
        $('.manage-info-wrap, .manage-danger-wrap, .manage-auctions-wrap').hide(); // Hide all wrapper
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
        
        console.log(selectedUser)
        
        populateUserAuctions(selectedUser.userId)


    })

    	
    }
    
$(document).ready(function() {

    // Fetch real users from the server
    getUsers();

    // Highlight in blue on hover
    $('.user-list > div:not(.list-head)').hover(function() {
        $(this).addClass('user-hover');
    }, function() {
        $(this).removeClass('user-hover');
    });

 
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

        $('.manage-info-wrap, .manage-danger-wrap, .manage-auctions-wrap').hide(); // Hide all wrapper

        const managing = $(this).attr('managing')
        console.log(managing)
        $(`.${managing}-wrap`).show().removeClass('none');
    })

    // Delete user button click event
    $('.delete-user-btn').click(function() {
        const username = selectedUser.username;
        const confirmed = confirm("Are you sure you want to delete this user?");
        if (confirmed) {
            deleteUser(username);
        }
    });
    
    // Create new user button click event
    $('.create-user-confirm').click(createNewUser);

    // Save changes button click event
    $('.save-changes').click(saveUserChanges);

})

function populateUserAuctions(userId) {
	
	$.ajax({
    url: "get_user_auctions.jsp",
    type: "GET",
    data: { userId: userId}, // Replace "123" with the actual user ID
    success: function(listings) {
		
		console.log(listings)
		
		$('.manage-auctions').text('Auctions (' + listings.length + ')')
        
        listings.forEach(listing => {
			
			$thisAuc = $('.m-auc-item-template').clone().removeClass('m-auc-item-template')
			
			$thisAuc.find('.title').text(listing.title)
			
			let x = formatDatetime(listing.when_closes)
	
			days = x[0]
			hours = x[1]
			minutes = x[2]
			
			const remaining_text = `${days}d ${hours}h ${minutes}m remaining`;
					
			$thisAuc.find('.time-remaining').text(remaining_text);
			
			$thisAuc.attr('href', `index.html?uuid=${listing.auction_id}`)
			
			$('.manage-auctions-wrap').append($thisAuc)
			
		})
        
    },
    error: function(xhr, status, error) {
        console.error(error);
    }
});
	
}

// Function to delete a user via AJAX
function deleteUser(username) {
    if (confirm("Are you sure you want to delete this user?")) {
        // Send AJAX request to delete the user
        $.ajax({
            type: "POST",
            url: "admin.jsp",
            data: {
                deleteUser: "true",
                username: username
            },
            success: function(response) {
                // Handle success response
                var responseParts = response.split("|");
                if (responseParts[0] === "success") {
                    alert(responseParts[1]); // Display the success message
                    // Reload the page after successful deletion
                    getUsers();
                } else {
                    alert(responseParts[1]); // Display the error message
                }
            },
            error: function(xhr, status, error) {
                // Handle error
                console.error("Error deleting user: " + error);
                alert("Error deleting user. Please try again later.");
            }
        });
    }
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

function saveUserChanges() {
    const newUsername = $('.change-username-input').val();
    const newName = $('.change-name-input').val();
    const newEmail = $('.change-email-input').val();
    const newPassword = $('.change-password-input').val();
    const newRole = $('.change-role-input').val();

    let changes = {};

    // Only add user attributes that actually changed to the object that will be sent to server
    // Don't set the attributes if they're the same as the current one
    if (newUsername && newUsername !== selectedUser.username) {
        changes['username'] = newUsername;
    }
    if (newName && newName !== selectedUser.name) {
        changes['name'] = newName;
    }
    if (newEmail && newEmail !== selectedUser.email) {
        changes['email'] = newEmail;
    }
    if (newPassword && newPassword !== selectedUser.password) {
        changes['password'] = newPassword;
    }
    if (newRole && newRole.toUpperCase() !== selectedUser.role) {
        changes['role'] = newRole;
    }

    // If no changes, tell the user they didn't make any changes
    if (Object.keys(changes).length === 0) {
        $('.save-changes').text("You didn't make any changes!").addClass('no-changes');
        return;
    }

    // Make an AJAX POST request to the server with the new data
    postUserChanges(selectedUser.username, changes);
}

// Make a POST request to update user data on the server
function postUserChanges(username, changesObj) {
    $.ajax({
        type: 'POST',
        url: 'admin.jsp',
        data: Object.assign({ updateUser: 'true', username: username }, changesObj), // Combine objects
        success: function(response) {
            if (response.includes("success")) {
                // Optionally, you can refresh the user list after successful update
                location.reload();

            } else if (response.startsWith("failure")) {
                var responseData = response.split("|");
                alert("Failed to update user data: " + responseData[1]);
            } else {
                alert("Unexpected response from server.");
            }
        },
        error: function(xhr, status, error) {
            console.error('Error changing user data:', error);
            alert('Error: Unable to save changes');
        }
    });
}
