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

    auctions = generateRandomAuctions(42)

    let l = 0;

    auctions.forEach(auction => {

        $thisAuction = $('.auction-template').clone().removeClass('auction-template')

        $thisAuction.find('.auction-img').css('background-image', `url('https://picsum.photos/500/550?${l}')`)

        $thisAuction.find('.auction-title').text(auction.title)
        $thisAuction.find('.auction-price').text('$' + auction.winningBidPrice)

        $thisAuction.find('.auction-bidders').text(auction.bids.length + ' bids')

        $('.auctions').append($thisAuction.removeClass('none'))

        l++;

    })


})