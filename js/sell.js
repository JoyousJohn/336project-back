let selectedAucType

$(document).ready(function() {

    $('.type-auction').click(function() {

        $('.type-selected').removeClass('type-selected')
        $(this).addClass('type-selected')

        $('.auction-inputs, .sell-end').removeClass('none')
        $('.bin-inputs').addClass('none')

        selectedAucType = 'auction'
    
    })

    $('.type-bin').click(function() {

        $('.type-selected').removeClass('type-selected')
        $(this).addClass('type-selected')
    
        $('.bin-inputs, .sell-end').removeClass('none')
        $('.auction-inputs').addClass('none')

        selectedAucType = 'bin'

    })

    $('.sell-add-image').click(function() {

        const imageCount = $('.sell-image-wrapper').children().length - 1 // -1 for the + div
        const maxImages = 8

        if (imageCount < maxImages) {

            const $newImg = $(`<div class="sell-img"></div>`)
            $newImg.css('background-image', `url('https://picsum.photos/500/550?${imageCount}')`)

            $('.sell-image-wrapper > :last-child').before($newImg);

            if (imageCount === maxImages) {

                $('.sell-add-image').hide(); // Don't allow more than 8 images

            }

        }

    })

    // If "Please fill in all fields/select listing type" is shown reset it to the publish button when an input is clicked
    $('input').click(function() {
        $('.publish').text('PUBLISH').removeClass('publish-error')
    })

})


// Triggered when user clicks "publish"
function publish() {

    // If a listing type wasn't selected show an error and return
    if (!selectedAucType) {
        $('.publish').text('Please select a listing type!!').addClass('publish-error')
        return;
    }

    // Gather data common to both auction types
    let newAuction = {
        'title': $('.sell-title').val(),
        'category': $('.sell-category-select').val(),
        'description': $('.sell-description').val(),
        'type': selectedAucType,
        'endDate': $('.sell-end-date').val()
    }

    // Gather auction price info
    if (selectedAucType === 'auction') {
        newAuction['startPrice'] = $('.sell-auc-price').val(),
        newAuction['reserve'] = $('.sell-reserve').val()
    }

    // Gather buy it now price info
    else if (selectedAucType === 'bin') {
        newAuction['price'] = $('.sell-bin-price').val()
    }

    // Check if any values were empty and show error if so
    const emptyValues = hasEmptyValues(newAuction)
    if (emptyValues) {
        // publish-error turns the background red
        $('.publish').text('Please fill in all fields!').addClass('publish-error')
        return
    }

    // Otherwise it's a valid listing that should be published!
    // But first give it a UUID to use as a primary key
    newAuction['uuid'] = generateUUID()
    publishAuction(newAuction)
    
}

// Implent a publish_new_listing endpoint in JSP
// newListing is the new listing object
// Use session object to get username
// Add newListing values to auction table
// Use newListing.uuid as primary key
// Add newListing.uuid to user's list of auctions in user data table
function publishAuction(newListing) {

    $.ajax({
        type: 'POST',
        url: 'publish_new_listing', // change this as you wish
        data: JSON.stringify(newListing),
        contentType: 'application/json',

        // Optional console logs
        success: function(response) {
            console.log('Auction published successfully!');
        },
        error: function(xhr, status, error) {
            console.error('Error publishing auction:', error);
        }
    });
    
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