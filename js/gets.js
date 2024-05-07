function getUsername(callback) {
    $.get('get_username.jsp', function(data) {
        callback(data);
    }).fail(function(xhr, status, error) {
        console.error('Error:', error); // Log any errors
        callback(null); // Or handle the error as needed
    });
}


function isUserLoggedIn() {
	return getUsername() !== undefined
}

function getSessionAtr(callback) {
    $.get('get_session_atr.jsp').then(function(data) {
        var attributes = {};
        var lines = data.trim().split('\n');
        lines.forEach(function(line) {
            var parts = line.split(':');
            var key = parts[0].trim();
            var value = parts[1].trim();
            attributes[key] = value;
        });
        // Invoke the callback function with the session attributes data
        callback(attributes);
    }).fail(function(xhr, status, error) {
        console.error('Error:', error); // Log any errors
        callback(null); // Or handle the error as needed
    });
}

getSessionAtr().then(function(attributes) {
    return attributes
});

function getAttributes() {
    return getSessionAtr().then(function(attributes) {
        return attributes;
    });
}
