let uuid

$(document).ready(function() {

    uuid = new URLSearchParams(window.location.search).get('uuid'); // SQL primary key for the auction data
    // const listingData = getItemData(uuid) // uncomment this once getItemData() is implemented

	$.ajax({
    type: "POST",
    url: "get_auction_info.jsp", // Replace with the actual path to your JSP file
    data: { auctionId: uuid },
    dataType: "json",
    success: function(data) {
			populateListingInfo(data)	      	      
	    },
	    error: function(xhr, status, error) {
	      	//console.error("Error:", error);
	    }
  	});


    $('.bid-price-input').val('')

    $('input').on('input', function(event) {
        let currentValue = $(this).val();
    
        if (!currentValue.startsWith('$')) {
            currentValue = '$' + currentValue;
        }
    
        const numericRegex = /^\$?\d*\.?\d{0,2}$/;
        if (numericRegex.test(currentValue)) {
            $(this).val(currentValue);
        } else {
            const prevValue = $(this).data('prevValue') || '';
            $(this).val(prevValue);
        }
        $(this).data('prevValue', $(this).val());

        $('.missing-inputs').addClass('none')

    });

})

let bidData

function populateListingInfo(data) {
				
	console.log(data)
		
	$('.listing-title').text(data.title)
    $('.listing-description').text(data.description)

	let x = formatDatetime(data.when_closes)
	
	days = x[0]
	hours = x[1]
	minutes = x[2]
	
	$('.listing-ending-in').text(`${days}d ${hours}h ${minutes}m remaining`);

    //$('.bids-count').text(listingData['bids'].length + ' bids')
    //$('.ends-in').text('Ends in ' + listingData['endsIn'])

    //$('.listing-condition').text(listingData['condition'])
    //$('.listing-category').text(listingData['category'])
    //$('.listing-seller').text(listingData['seller']).attr('href', 'user.html/' + listingData['seller'])

    for (let i = 0; i < data.imageCount; i++) {

       const $galleryImg = $(`<div class="gallery-img"></div>`)

       $galleryImg.css('background-image', `url('https://picsum.photos/500/550?${i}')`)

       $('.img-gallery').append($galleryImg)

    }
      
    let bidInfo = JSON.parse(data.bid_info.replaceAll(`'`, `"`))
 
 	bidData = bidInfo
 
 	const currentBid = bidInfo[bidInfo.length-1].bid
 
 	$('.winning-price').text('US $' + currentBid)
 
 	if (data.reserve > currentBid) {
    	$('.reserve-not-met').show();
    }
    
    let u = 0;
 
 	bidInfo.forEach(bid => {
		
		console.log(bid)
 
 		const id = bid.seller_id
 		
 		$.ajax({
			  type: "POST",
			  url: "get_username_from_id.jsp",
			  data: { id: id }, // Replace 123 with the desired user ID
			  success: function(response) {
			    
			    const $bidElm = $(`
			    	<a href="/user.html/${response}">${response}</a>
			    	<div>$${bid.bid}</div>
			    	<div>${bid.time}</div>
			    `)
			    
			    $('.bid-breakdown').append($bidElm)

				console.log('u: ', u)

				if (u === 0) {
					$('.listing-seller').text(response.trim()).attr('href', 'profile.html?uuid=' + bid.seller_id)
				}
			    
			  },
			  error: function(xhr, status, error) {
			    console.error("Error:", error);
			    // Handle the error
			  },
			  done: function() {
			   	u++;
			  }
		});
		
 
	 	
	    
	});
	
	const minBid = parseFloat(currentBid) + parseFloat(data.bid_increment)
	
	$('.minimum-bid').text('Minimum bid: $' + minBid)

  
}

// Get auction info from the auction table in SQL via JSP via uuid primary key
function getItemData(uuid) {

    $.ajax({
        type: 'GET',
        url: 'get_auction_info', // change this as you wish
        success: function(response) {
            return response.data;
        },
        error: function(xhr, status, error) {
            console.error('Error getting auction data:', error);
        }
    });

}

// Add +1 view to the item in the auctions table with input uuid
function addAVew(uuid) {

    $.ajax({
        type: 'POST',
        url: 'add_view', // change this as you wish
        data: JSON.stringify(uuid),
        contentType: 'application/json',
    });

}

function placeBid() {

    const bidAmount = $('.bid-price-input').val()
   
    // Confirm inputs aren't blank
    if (bidAmount === '' || bidAmount === '$') {
        $('.missing-inputs').removeClass('none')
        return
    }

	

    /*const bidInfo = {
        'bidAmount': bidAmount,
    }*/

    //postBid(bidInfo)

}

// Make a post request to some endpoint to add the new bid!
// bidInfo is guaranteed to have 3 keys: 'bidAmount', 'bidType', and the 'uuid' of the current item
// bidType is either "auto" or "manual"
// if bidType is auto (in the case of secret bidding), the keys bidLimit and bidIncrement will also be set
// Add the bid to the bids attribute of the item in the auction table with uuid primary key!
function postBid(bidInfo) {

    bidInfo['uuid'] = uuid

    $.ajax({
        type: 'POST',
        url: 'post_bid', // change this as you wish
        data: JSON.stringify(bidInfo),
        contentType: 'application/json',
        success: function(response) {
            // Eventually do visual stuff to show the user their bid was made
        },
        // An error could occur if the auction has ended
        error: function(error) {
            // Tell the user there was an error
        }
    });

}