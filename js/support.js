<<<<<<< HEAD
// Function to render a thread on the page
$(document).ready(function() {
    // Call getThreads() to fetch thread data when the page loads
    
    const threads = getThreads();
    threads.then(function(threads) {
        // Check if threads array is populated
        if (threads && threads.length > 0) {

			$('.no-messages').hide();
			 threads.forEach(thread => {
                renderThread(thread);
            });
        } else {
            // If no threads are found, display appropriate message
            $('.no-messages').show();
            console.log("THREADS:", threads);

        }
    }).catch(function(error) {
        console.error("Error fetching threads:", error);
    });

    // Handle click event for asking a new question
    $('.ask').click(function() {
        $('.new-thread').removeClass('none').show();
        $('.overlay').show();
    });

    // Handle click event for canceling new question
    $('.nevermind').click(function() {
        $('.overlay').hide();
        $('.new-thread').hide();
    });

    // Handle click event for posting a new question
    $('.ask-btn').click(function() {
        const question = $('.q-input').val();
        if (question) {
            postQuestion(question);
            $('.ask-btn').text('Posting question...');
            $('.nevermind').hide();
        } else {
            console.error("Question is empty");
        }
    });
});

// Function to render a thread on the page
function renderThread(thread) {
    const $threadItem = $('.example-thread').clone().removeClass('example-thread');
    $threadItem.find('.thread-question-title').text(thread['messageText']); // Use 'messageText' instead of 'thread-question-title'

    // Check if thread-messages property exists and is an array
    if (Array.isArray(thread['thread-messages']) && thread['thread-messages'].length > 0) {
        const lastMessage = thread['thread-messages'][thread['thread-messages'].length - 1];

        thread['thread-messages'].forEach(threadMessage => {
            const $threadMessagElm = $('.example-thread-message').clone().removeClass('example-thread-message');
            $threadMessagElm.find('.username').text(threadMessage['username']);
            $threadMessagElm.find('.role').text(threadMessage['role'] + ' |');
            $threadMessagElm.find('.message').text(threadMessage['message']);
            $threadItem.find('.message-list').append($threadMessagElm);
        });
    } else {
        // If no messages, display appropriate message
        $threadItem.find('.thread-latest-reply-time').text('No replies yet');
        $threadItem.find('.thread-chat-count').text('0 messages');
    }

    $threadItem.find('.thread-open').click(function() {
	   console.log("Open Thread button clicked"); // Add this line
	    $threadItem.find('.absolute-thread-messages-modal').removeClass('none');
	    $('.overlay').show();
	});

$threadItem.find('.close').click(function() {
	    $(this).closest('.absolute-thread-messages-modal').addClass('none');
	    $('.overlay').hide();
	});
=======
$(document).ready(function() {

    const threads = getThreads();

    threads.forEach(thread => {

        $threadItem = $('.example-thread').clone().removeClass('example-thread')
        $threadItem.find('.thread-question-title').text(thread['thread-question-title'])

        const lastMessage = thread['thread-messages'][thread['thread-messages'].length-1]

        $threadItem.find('.thread-latest-reply-time').text('Latest reply time: ' + lastMessage['datetime'])
        $threadItem.find('.thread-chat-count').text(thread['thread-messages'].length + ' messages')

        $threadItem.find('.thread-open').click(function() {

            $threadItem.find('.absolute-thread-messages-modal').removeClass('none')
            $('.overlay').show();

        })

        $threadItem.find('.close').click(function() {
            $threadItem.find('.absolute-thread-messages-modal').addClass('none')
            $('.overlay').hide();
        })

        thread['thread-messages'].forEach(threadMessage => {

            $threadMessagElm = $('.example-thread-message').clone().removeClass('example-thread-message')

            $threadMessagElm.find('.username').text(threadMessage['username'])
            $threadMessagElm.find('.role').text(threadMessage['role'] + ' |')
            $threadMessagElm.find('.datetime').text(threadMessage['datetime'])
            $threadMessagElm.find('.message').text(threadMessage['message'])

            $threadItem.find('.message-list').append($threadMessagElm)

        })

        console.log($threadItem)

        $('.message-wrapper').append($threadItem)

    })

    // no threads
    if (threads.length === 0) {
        $('.no-messages').removeClass('none')
    }

    $('.ask').click(function() {

        $('.new-thread').removeClass('none').show();
        $('.overlay').show();

    })

    $('.nevermind').click(function() {


        $('.overlay').hide();
        $('.new-thread').hide();
>>>>>>> 36665894b26ef2f1a844d36c33d6420aec4e7bcd

    })

    $('.ask-btn').click(function() {

        const question = $('.q-input').val()
        postQuestion(question)
        $('.ask-btn').text('Posting question...')
        $('.nevermind').hide();

    })

})

function postQuestion(question) {

    // Make a post request. Question is the question string!!

    // Reload the page on post request success to display new question!

}


function getThreads() {
    // get request to jsp here
    return exampleThreads // temporary

}



const exampleThreads = [
    {
        'thread-id': '5757',
        'thread-question-title': 'How do I make a new listing?',
        'thread-messages': [
            
            {
                'username': 'tatijoli',
                'role': 'asker',
                'message': 'Hi! how do I make a new auction?',
                'datetime': '5/5/2024, 4:14 PM'

            },
            {
                'username': 'admin123',
                'role': 'representative',
                'message': 'You make a new auction by clicking the new sell sidebar tab!!',
                'datetime': '5/7/2024, 7:14 PM'

            },
<<<<<<< HEAD
            error: function(xhr, status, error) {
                reject(error);
            }
        });
    });
}




function checkLoginStatus(callback) {
    $.ajax({
        type: "GET",
        url: "checkLoginStatus.jsp",
        headers: { "cache-control": "no-cache" },
        success: function(response) {
            const [loggedIn, username, role, sellerId] = response.trim().split("|");
            const isLoggedInStatus = loggedIn === "true";
            console.log("Is logged in:", isLoggedInStatus);
            console.log("Username:", username);
            console.log("Role:", role);
            console.log("Seller ID:", sellerId); // Log the seller ID
            callback({ loggedIn: isLoggedInStatus, username: username, role: role, sellerId: sellerId });
        },
        error: function(xhr, status, error) {
            console.error("Error checking login status:", error);
            callback({ loggedIn: false, username: null, role: null, sellerId: null });
        }
    });
}

// Usage
checkLoginStatus(function(status) {
    console.log(status); // Handle the login status here
});
=======
        ]         

    }
]
>>>>>>> 36665894b26ef2f1a844d36c33d6420aec4e7bcd
