$(document).ready(function() {

    // Highlight search bar border when clicked
    $('.search-input').on('focus', function() {
        $('.search-form').css('border-color', 'blue')
    })
    
    // Remove search bar border when unfocused
    $('.search-input').on('blur', function() {
        $('.search-form').css('border-color', 'gray')
    })
    
    getAuctions(function(auctions) {
		
		let l = 0;

		console.log(auctions)

	    for (let auction in auctions) {
			
			auction = auctions[auction]
			
			console.log(auction)
	
			console.log('auction title: ', auction.title)
	
	        $thisAuction = $('.auction-template').clone().removeClass('auction-template')
	
	        $thisAuction.find('.auction-img').css('background-image', `url('https://picsum.photos/500/550?${l}')`)
	
	        $thisAuction.find('.auction-title').text(auction.title)
	        //$thisAuction.find('.auction-price').text('$' + auction.winningBidPrice)
	
			$thisAuction.attr('href', 'item.html?uuid=' + auction.auction_id)
	
	        //$thisAuction.find('.auction-bidders').text(auction.bids.length + ' bids')
	
	        $('.auctions').append($thisAuction.removeClass('none'))
	
			console.log('this auction: ', $thisAuction.get())
	
	        l++;
	
	    }
		
		
	})

})