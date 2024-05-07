$(document).ready(function() {

	let username;
	
	getUsername(function(u) {


		if (u === 'undefined') {
			cl(`[profile.js] User is not logged in (received username: ${u}), sending to index.html!`); 
			sendToPage('login');
			username = u;
		} 
		
		else {
			
			populateInfo()
					
		    populateListings(); 
			
		}
		

	});
		
	
    
});

function populateInfo() {
	
	
	getSessionAtr(function(sa) {
		
		console.log(sa)
		
		$('.profile-username').text(sa.username);
		$('.profile-email').text(sa.username);
		
	})
	
}



// Function that populates "Your listings" in profile
function populateListings() {
	
    let i = 0;

    getAuctions(function(userListings) { 
		
		console.log(userListings)
		
		for (let listing in userListings) {

			listing = userListings[listing]

	        let $thisListing = $('.template-item').clone().removeClass('template-item');
	
	        $thisListing.find('.listing-title').text(listing.title);
	
	        /*let listingType;
	        if (listing.type === 'auction' && listing.active === true) {
	            listingType = 'Active auction';
	        } else if (listing.type === 'bin') {
	            listingType = 'Buy it now';
	        }
	        $thisListing.find('.listing-type').text(listingType);
	
	        $thisListing.find('.listing-time-remaining').text(listing.remaining + ' remaining');
	
	        $thisListing.find('.listing-price').text('$' + listing.winningPrice);
	
	        $thisListing.find('.listing-bids').text(listing.bids.length + ' bids');
	
	        $thisListing.find('.listing-stats').text(listing.views + ' views | ' + listing.favorites + ' favorites');*/
	
	        $thisListing.find('.listing-img').css('background-image', `url('https://picsum.photos/500/550?${i}')`);
	
	        $('.listings-list > :last-child').before($thisListing);
	        
	        i++;

    	};
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
