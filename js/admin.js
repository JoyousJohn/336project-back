let selectedUser; // Holds the currently selected user

$(document).ready(function() {

    // If the user isn't an admin return them back to home page
    if (!isAdmin()) {
        window.location.href = 'index.html';
    }

    const users = getFakeUsers();
    // const users = getUsers(); // Uncomment this once JSP endpoint is integrated

    for (let userKey in users) {

        const user = users[userKey];
        user['username'] = userKey;

        const $userElm = `
            <div username="${user.username}">${user.username}<span class="user-role user-role-${user.role}">${user.role}</span></div>
            <div username="${user.username}">${user.name}</div>
            <div username="${user.username}">${user.email}</div>
        `;

        $('.user-list').append($userElm);

    }

    $('.manage-users').text(`Manage users (${Object.keys(users).length})`);

    // Highlight in blue on hover
    $('.user-list > div:not(.list-head)').hover(function() {
        const name = $(this).attr('username');
        $(`div[username="${name}"]`).addClass('user-hover');
    // Unhover
    }, function() {
        const name = $(this).attr('username');
        $(`div[username="${name}"]`).removeClass('user-hover');
    });

    // Show user management options when a user is clicked
    $('.user-list > div:not(.list-head)').click(function() {

        $('.managing-user').removeClass('managing-user');
        const name = $(this).attr('username');
        selectedUser = users[name];
        $(`div[username="${name}"]`).addClass('managing-user');
        $('.user-management-example').hide().insertAfter($(`div[username="${name}"]`).last()).slideDown();

        // Fill in input placeholders
        $('.change-username-input').attr('placeholder', name).val('');
        $('.change-name-input').attr('placeholder', users[name].name).val('');
        $('.change-email-input').attr('placeholder', users[name].email).val('');
        $('.change-password-input').attr('placeholder', '*****...').val('');
        $('.change-role-input').val(users[name].role.toLowerCase()); // Change selected role to current role

        // If error message telling user they didn't change anything is showing, clear it and reset the button to "Save changes"
        // no-changes just makes the background red and sets cursor to default
        $('.save-changes').text("Save changes").removeClass('no-changes');

    });

    $('.user-management-example').hide();

    // If error message telling user they didn't change anything is showing, clear it and reset the button to "Save changes"
    // no-changes just makes the background red and sets cursor to default
    $('input').click(function() {
        $('.save-changes').text("Save changes").removeClass('no-changes');
    });  

});


// Return all users from users table and their basic data via JSP endpoint
function getUsers() {

    $.ajax({
        type: 'GET',
        url: 'get_all_users', // change this as you wish
        success: function(response) {
            return response.data;
        },
        error: function(xhr, status, error) {
            console.error('Error getting users:', error);
        }
    });

}

// Send changes to username, email, password, and/or role to server
function saveUserChanges() {

    const newUsername = $('.change-username-input').val();
    const newName = $('.change-name-input').val();
    const newEmail = $('.change-email-input').val();
    const newPassword = $('.change-password-input').val();
    const newRole = $('.change-role-input').val();

    let changes = {};

    // Only add user attributes that actually changed to the object that will be sent to server
    // Don't set the attributes if they're the same to the current one
    if (newUsername && newUsername !== selectedUser.username) {
        changes['username'] = newUsername;
    }
    if (newName && newName !== selectedUser.name) {
        changes['name'] = newName;
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
        url: 'change_user_data', // change this as you wish
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

// Get some test users until JSP implementation
function getFakeUsers() {

    const users = {
        'happyjohn': {
          'name': 'Happy J',
          'email': 'j.hoppy@rutger.edu',
          'role': 'ADMIN'
        },
        'tatijoli': {
          'name': 'Tatiana',
          'email': 'jolitati@joli.tati',
          'role': 'REP'
        },
        'doblonick': {
          'name': 'Nick',
          'email': 'doblo.nick@dey.mious',
          'role': 'USER'
        },
        'rosebryan': {
          'name': 'Bryan',
          'email': 'president@linkedin.com',
          'role': 'USER'
        },
        'agarcia': {
          'name': 'Antonio',
          'email': 'hill218@center.rut',
          'role': 'REP'
        }
    }

    return users
}