function isLoggedIn() {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "GET",
            url: "checkLoginStatus.jsp",
            headers: { "cache-control": "no-cache" },
            success: function(response) {
                const [loggedIn, username, role] = response.trim().split("|");
                const isLoggedInStatus = loggedIn === "true"; // Update isLoggedInStatus variable
                console.log("Is logged in:", isLoggedInStatus);
                console.log("Username check:", username);
                console.log("Role:", role);

                resolve({ loggedIn: isLoggedInStatus, username: username, role: role });
            },
            error: function(xhr, status, error) {
                console.error("Error checking login status:", error);
                resolve({ loggedIn: false, username: null, role: null });
            }
        });
    });
}

function updateSidebar() {
    isLoggedIn().then((result) => {
        const { loggedIn, username, role } = result;
        const profileLink = $('#profileLink');
        const sellLink = $('.sidebar-sell');
        const adminLink = $('.sidebar-admin');
        const exploreLink = $('.sidebar-explore');

        if (loggedIn) {
            // User is logged in
            profileLink.attr('href', 'profile.html');
            sellLink.attr('href', 'sell.html');

            if (role === 'ADMIN') {
                adminLink.attr('href', 'admin.html');
            } else {
                adminLink.attr('href', 'javascript:void(0)');
                adminLink.off('click');
                adminLink.on('click', function(event) {
                    event.preventDefault();
                    alert("You are not authorized to access the admin page.");
                });
            }
            // Update the Explore link to point to index.html
            exploreLink.attr('href', 'index.html');
        } else {
            // User is not logged in
            exploreLink.attr('href', 'index.html');

            profileLink.attr('href', 'login.html');
            sellLink.attr('href', 'javascript:void(0)');
            adminLink.attr('href', 'javascript:void(0)');
            adminLink.off('click');
            adminLink.on('click', function(event) {
                event.preventDefault();
                alert("Please log in to access the admin page.");
            });
            // Update the Explore link to point to index.html
                    }
    }).catch((error) => {
        console.error("Error updating sidebar:", error);
    });
}



function hasEmptyValues(obj) {
	const values = Object.values(obj);
   return values.some(value => value === '' || value === null || value === undefined);
}



// Get a random UUID
function generateUUID() {
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
          v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  
    return uuid;
}  



// Example auction data, this should actually be fetched from db with a get request later on

// Example obj format
let auction = [
    {
        'title': '',
        'startingPrice': 0,
        'winningBidPrice': 0,
        'publishDateTime': undefined,
        'endDateTime': undefined,
        'bids': [
            {
                'bidder': '',
                'maxBidPrice': 0,
                'bidDateTime': undefined
            }
        ]
    }
]

let auctions = []
const amntOfSampleAuctions = 27

$(document).ready(function() {
    auctions = generateRandomAuctions(42);
    let l = 0;

    auctions.forEach(auction => {
        $thisAuction = $('.auction-template').clone().removeClass('auction-template');
        $thisAuction.find('.auction-img').css('background-image', `url('https://picsum.photos/500/550?${l}')`);
        $thisAuction.find('.auction-title').text(auction.title);
        $thisAuction.find('.auction-price').text('$' + auction.winningBidPrice);
        $thisAuction.find('.auction-bidders').text(auction.bids.length + ' bids');

        // Set the data-uuid attribute instead of href
        const uuid = generateUUID(); // get a random uuid for testing purposes
        $thisAuction.attr('data-uuid', uuid);

        $('.auctions').append($thisAuction.removeClass('none'));

        l++;
    });

    // Add click event listener to the auction titles
    $('.auction-title').on('click', function() {
        const uuid = $(this).parent().attr('data-uuid');
        window.location.href = `item.html?uuid=${uuid}`;
    });
});
