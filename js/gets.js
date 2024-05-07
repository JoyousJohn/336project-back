function getUsername(callback) {
    $.get('get_username.jsp', function(data) {
        callback(data);
    }).fail(function(xhr, status, error) {
        console.error('Error:', error); // Log any errors
        callback(null); // Or handle the error as needed
    });
}

function getAuctions(callback) {
    $.get('fetchListings.jsp', function(responseHTML) {
        var auctions = {};

        // Create a temporary div element to parse the HTML
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = responseHTML;

        // Find all elements with class 'auction'
        var auctionElements = tempDiv.getElementsByClassName('auction');

        // Iterate over each auction element
        for (var i = 0; i < auctionElements.length; i++) {
            var auctionData = auctionElements[i].innerText.trim().split('\n');

            // Create an object to store auction data
            var auction = {};
            auctionData.forEach(function(line) {
                var parts = line.split(':');
                if (parts.length >= 2) { // Add a check here
                    var key = parts[0].trim();
                    var value = parts.slice(1).join(':').trim(); // Join the remaining parts to handle colons in values
                    auction[key] = value;
                }
            });

            // Add the auction data to the auctions object
            auctions['auction_' + i] = auction;
        }

        // Invoke the callback function with the auctions object
        callback(auctions);
    }).fail(function(xhr, status, error) {
        console.error('Error:', error); // Log any errors
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
