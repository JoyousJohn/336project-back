$(document).ready(function() {
	
    // Check if the user is logged in
    isLoggedIn().then((result) => {
        const { loggedIn, username, role } = result;
        if (loggedIn) {
            // Execute code dependent on loggedIn status here
            $('.profile-username').text(username);
            //$('.profile-email').text(email);
            // Populate listings only after updating isLoggedInStatus
            populateListings(); // Make sure this function works correctly

            // Check if the user is an admin
            if (role === 'ADMIN') {
                $('#adminLink').attr('href', 'admin.html');
            } else {
                // Prevent access to admin page if not admin
                $('#adminLink').attr('href', 'javascript:void(0)');
                $('#adminLink').off('click');
                $('#adminLink').on('click', function(event) {
                    event.preventDefault();
                    alert("You are not authorized to access the admin page.");
                });
            }
        } else {
            // Redirect or handle the case where user is not logged in
            window.location.href = 'login.html';
        }
    }).catch((error) => {
        console.error("Error checking login status:", error);
    });
});


// Function to check if the user is logged in and log the role
function isLoggedIn() {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "GET",
            url: "checkLoginStatus.jsp",
            headers: { "cache-control": "no-cache" },
            success: function(response) {
                const [loggedIn, username, role] = response.trim().split("|");
                const isLoggedInStatus = loggedIn === "true";
                console.log("Role:", role); // Log the role
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

        if (loggedIn) {
            // User is logged in
            profileLink.attr('href', 'profile.html');
            sellLink.attr('href', 'sell.html');

            if (role === 'ADMIN') {
                adminLink.attr('href', 'admin.html');
            } else {
                // If not an admin, prevent default action on admin link
                adminLink.attr('href', 'javascript:void(0)');
                adminLink.off('click'); // Remove previous click event handler
                adminLink.on('click', function(event) {
                    event.preventDefault();
                    alert("You are not authorized to access the admin page.");
                });
            }
        } else {
            // User is not logged in
            profileLink.attr('href', 'login.html');
            sellLink.attr('href', 'javascript:void(0)');
            adminLink.attr('href', 'javascript:void(0)');
            adminLink.off('click'); // Remove previous click event handler
            adminLink.on('click', function(event) {
                event.preventDefault();
                alert("Please log in to access the admin page.");
            });
        }
    }).catch((error) => {
        console.error("Error updating sidebar:", error);
    });
}


// Function that populates "Your listings" in profile
function populateListings() {
    const userListings = getListings();

    let i = 0;

    userListings.forEach(listing => {

        let $thisListing = $('.template-item').clone().removeClass('template-item');

        $thisListing.find('.listing-title').text(listing.title);

        let listingType;
        if (listing.type === 'auction' && listing.active === true) {
            listingType = 'Active auction';
        } else if (listing.type === 'bin') {
            listingType = 'Buy it now';
        }
        $thisListing.find('.listing-type').text(listingType);

        $thisListing.find('.listing-time-remaining').text(listing.remaining + ' remaining');

        $thisListing.find('.listing-price').text('$' + listing.winningPrice);

        $thisListing.find('.listing-bids').text(listing.bids.length + ' bids');

        $thisListing.find('.listing-stats').text(listing.views + ' views | ' + listing.favorites + ' favorites');

        $thisListing.find('.listing-img').css('background-image', `url('https://picsum.photos/500/550?${i}')`);

        $('.listings-list > :last-child').before($thisListing);
        
        i++;

    });
}


// Implement a get request here that returns a user's auctions from SQL db
function getListings() {

    // Temporarily return js obj data until someone implements this
    return sampleAuctions

}

const sampleAuctions = [
    {
        'title': 'Pineapple Energy Drink 12 Pack',
        'type': 'auction',
        'isActive': true,
        'remaining': '12H 18M',
        'winningPrice': 14.21,
        'bids': [
            {
                'bidder': 'hillcenter',
                'bidPrice': 14.20,
                'bidTime': undefined,
                'bidNum': 3
            },
            {
                'bidder': 'corebuilding',
                'bidPrice': 5.20,
                'bidTime': undefined,
                'bidNum': 2
            },
            {
                'bidder': 'caffeineaddict',
                'bidPrice': 3.70,
                'bidTime': undefined,
                'bidNum': 1
            }
        ],
        'views': 15,
        'favorites': 3
    },
    {
        'title': 'Vintage Polaroid Camera',
        'type': 'auction',
        'isActive': false,
        'remaining': '0H 0M',
        'winningPrice': 85.99,
        'bids': [
            {
                'bidder': 'photographyfan',
                'bidPrice': 85.99,
                'bidNum': 10
            },
            {
                'bidder': 'vintagelover',
                'bidPrice': 75.00,
                'bidNum': 9
            },
            {
                'bidder': 'retrocollector',
                'bidPrice': 60.50,
                'bidNum': 8
            },
            {
                'bidder': 'cameraenthusiast',
                'bidPrice': 50.00,
                'bidNum': 7
            },
            {
                'bidder': 'classicphotography',
                'bidPrice': 40.00,
                'bidNum': 6
            },
            {
                'bidder': 'antiquelover',
                'bidPrice': 30.00,
                'bidNum': 5
            },
            {
                'bidder': 'photographyfan',
                'bidPrice': 85.99,
                'bidNum': 4
            },
            {
                'bidder': 'vintagelover',
                'bidPrice': 75.00,
                'bidNum': 3
            },
            {
                'bidder': 'retrocollector',
                'bidPrice': 60.50,
                'bidNum': 2
            },
            {
                'bidder': 'cameraenthusiast',
                'bidPrice': 50.00,
                'bidNum': 1
            }
        ],
        'views': 92,
        'favorites': 18
    },
    {
        'title': 'Handmade Ceramic Vase',
        'type': 'auction',
        'isActive': true,
        'remaining': '3D 8H',
        'winningPrice': 28.75,
        'bids': [
            {
                'bidder': 'artlover',
                'bidPrice': 28.75,
                'bidNum': 7
            },
            {
                'bidder': 'homedecor',
                'bidPrice': 25.00,
                'bidNum': 6
            },
            {
                'bidder': 'craftsmanship',
                'bidPrice': 20.00,
                'bidNum': 5
            },
            {
                'bidder': 'ceramicfan',
                'bidPrice': 18.00,
                'bidNum': 4
            },
            {
                'bidder': 'artenthusiast',
                'bidPrice': 15.00,
                'bidNum': 3
            },
            {
                'bidder': 'uniquefinds',
                'bidPrice': 12.50,
                'bidNum': 2
            },
            {
                'bidder': 'handmadecollector',
                'bidPrice': 10.00,
                'bidNum': 1
            }
        ],
        'views': 47,
        'favorites': 9
    }
];
