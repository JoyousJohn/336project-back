function isLoggedIn() {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "GET",
            url: "checkLoginStatus.jsp",
            headers: { "cache-control": "no-cache" },
            success: function(response) {
                const [loggedIn, username, role, userId, sellerId] = response.trim().split("|");
                const isLoggedInStatus = loggedIn === "true";
                console.log("Is logged in:", isLoggedInStatus);
                console.log("Username check:", username);
                console.log("Role:", role);
                console.log("User ID:", userId); // Log the user ID
                resolve({ loggedIn: isLoggedInStatus, username: username, role: role, userId: userId, sellerId: sellerId });
            },
            error: function(xhr, status, error) {
                console.error("Error checking login status:", error);
                resolve({ loggedIn: false, username: null, role: null, userId: null, sellerId: null });
            }
        });
    });
}

function updateSidebar() {
		
    return new Promise((resolve, reject) => {
		
        isLoggedIn().then((result) => {
						
            const { loggedIn, username, role, userId } = result;
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

                $('.sidebar-logout').removeClass('none')
                
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

            // Set the seller ID equal to the user ID
            const sellerIdValue = userId;
            console.log("Seller ID:", sellerIdValue);

            // Resolve the Promise with the result
            resolve(result);
        }).catch((error) => {
            console.error("Error updating sidebar:", error);
            // Reject the Promise with the error
            reject(error);
        });
    });
}

// Function to render fetched listings on the page
function renderListings(listings) {
	
	console.log("Fetched Listings:", listings); 
	
	if (typeof listings !== 'object' || !Array.isArray(listings)) {
        console.error('Error: listings is not an array or object');
        return;
    }
	
    // Check if listings is an array or object
    if (Array.isArray(listings) || typeof listings === 'object') {
        // Get the auctions container
        var auctionsContainer = $('.auctions');
        auctionsContainer.empty(); // Clear existing listings
        
        // If listings is an array, iterate over it
        if (Array.isArray(listings)) {
            listings.forEach(function(listing) {
                // Generate HTML for each listing
                var listingHTML = `
                    <div class="auction">
                        <h3>${listing.title}</h3>
                        <p>Description: ${listing.description}</p>
                        <p>Starting Price: $${listing.starting_price}</p>
                    </div>
                `;
                // Append the listing HTML to the auctions container
                auctionsContainer.append(listingHTML);
            });
        } else {
            // If listings is an object, handle it as a single listing
            var listingHTML = `
                <div class="auction">
                    <h3>${listings.title}</h3>
                    <p>Description: ${listings.description}</p>
                    <p>Starting Price: $${listings.starting_price}</p>
                </div>
            `;
            // Append the listing HTML to the auctions container
            auctionsContainer.append(listingHTML);
        }
    } else {
        // Handle case where listings is not an array or object
        console.error('Error: listings is not an array or object');
    }
}


// Function to fetch listings from the server
function fetchListings() {
    // Make an AJAX request to fetch listings
    $.ajax({
        url: 'fetchListings.jsp',
        method: 'GET',
        success: function(response) {
            // Assuming response contains listings data
            // Log the response to verify its structure and data
            console.log('Fetched Listings:', response);

            // Pass the fetched listings to the renderListings function
            renderListings(response);
        },
        error: function(xhr, status, error) {
            console.error('Error fetching listings:', error);
        }
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

let sessionUsername

$(document).ready(function() {
    
    updateSidebar(); // Call the function to update sidebar links

    // Add click event listener to the auction titles
    $('.auction-title').on('click', function() {
        const uuid = $(this).parent().attr('data-uuid');
        window.location.href = `item.html?uuid=${uuid}`;
    });
    
    $('.sidebar-logout').click(function() {
    // Perform logout action here
    $.ajax({
	      url: 'logout.jsp',
	      type: 'POST',
	      success: function(response) {
	        // Handle successful logout
	        console.log('Logout successful');
	        // Optionally, you can redirect the user or perform other actions
	        window.location.href = 'index.html'
	      },
	      error: function(xhr, status, error) {
	        // Handle error
	        console.error('Logout error:', error);
	      }
	    });
	});
	
	$.get('get-username.jsp', function(data) {
		sessionUsername = data
	});

});

function sendToPage(page) {
	window.location.href = `${page}.html`
}

function cl(input_) {
	console.log(input_)
}


