let selectedAucType = null;
let imageCount = 0;

$(document).ready(function() {
	
	
    $('.type-auction').click(function() {

        $('.type-selected').removeClass('type-selected')
        $(this).addClass('type-selected')

        $('.auction-inputs, .sell-end').removeClass('none')
        $('.bin-inputs').addClass('none')

        selectedAucType = 'auction';
    
    })

    $('.type-bin').click(function() {

        $('.type-selected').removeClass('type-selected')
        $(this).addClass('type-selected')
    
        $('.bin-inputs, .sell-end').removeClass('none')
        $('.auction-inputs').addClass('none')

        selectedAucType = 'bin';

    })

    $('.sell-add-image').click(function() {

        const imageCount = $('.sell-image-wrapper').children().length - 1 // -1 for the + div
        alert(imageCount)
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
    });
    
})


// Triggered when user clicks "publish"
function publish() {
    // If a listing type wasn't selected show an error and return
    if (!selectedAucType) {
        $('.publish').text('Please select a listing type!!').addClass('publish-error');
        return;
    }

    // Call the updateSidebar function to get the seller ID
    updateSidebar()
        .then(function(response) {
            // Seller ID retrieved successfully, proceed to publish auction
            const sellerId = response.userId; // Assuming the seller ID is returned in the response

            // Gather form data
            const title = $('#sell-title').val();
            const category = $('#sell-category').val();
            const description = $('#sell-description').val();
            const endDate = $('.sell-end-date').val(); // Move this line here

			console.log(title, category, description, endDate)

            // Check if any values were empty and show error if so
            if (title === '' || category === '' || description === '' || endDate === '') { // Pass form data to hasEmptyValues
                $('.publish').text('Please fill in all fields!').addClass('publish-error');
                return;
            }

            // Initialize newListing object
            const newListing = {
                title,
                category,
                description,
                type: selectedAucType,
                endDate,
                sellerId // Add sellerId to the newListing object
            };

            // Gather auction price info
            if (selectedAucType === 'auction') {
                newListing.startPrice = $('.sell-auc-price').val(); // Change to startPrice
                newListing.increment = $('.sell-increment').val(); // Change to increment
                newListing.reserve = $('.sell-reserve').val(); // Change to reserve
            }

            // Gather buy it now price info
            else if (selectedAucType === 'bin') {
                newListing.price = $('.sell-bin-price').val(); // Change to price
            }

            // Publish the listing
            publishAuction(newListing);
        })
        .catch(function(error) {
            console.error('Error retrieving seller ID:', error);
        });
}

// Function to fetch listings from the server
function fetchListings() {
    $.ajax({
        type: 'GET',
        url: 'fetchListings.jsp', // Replace with your server-side endpoint
        success: function(response) {
            // Handle successful response
            //renderListings(response); // Call the renderListings function with the response data
        },
        error: function(xhr, status, error) {
            console.error('Error fetching listings:', error);
        }
    });
}

$(document).ready(function() {
    fetchListings(); // Fetch listings when the page loads
});



// Check if any values in the object are empty
function hasEmptyValues(obj) {
    for (const key in obj) {
        if (!obj[key]) {
            return true;
        }
    }
    return false;
}


// Implent a publish_new_listing endpoint in JSP
// newListing is the new listing object
// Use session object to get username
// Add newListing values to auction table
// Use newListing.uuid as primary key
// Add newListing.uuid to user's list of auctions in user data table
// Publish the auction
function publishAuction(newListing) {


    console.log("Publishing auction with data:", newListing);
    
    // Return a Promise
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: 'sell.jsp',
            method: 'POST', 
            data: $('form').serialize(), // Serialize form data
            success: function(response) {
                console.log('Auction published successfully!!');
                console.log('Response:', response);
                window.location.href = 'profile.html'
                resolve(response); // Resolve the Promise with the response
            },
            error: function(xhr, status, error) {
                console.error('Error publishing auction:', error);
                console.log('XHR:', xhr);
                console.log('Status:', status);
                reject(error); // Reject the Promise with the error
            }
        });
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