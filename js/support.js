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

    $('.message-wrapper').append($threadItem);
}


// Function to post a new question
function postQuestion(question) {
    // Make AJAX request to post the question
    $.ajax({
        type: "POST",
        url: "support.jsp",
        data: { question: question },
        success: function(response) {
            console.log("Question posted successfully");
            // Refresh the page to reflect the new question (or update threads array and UI dynamically)
            location.reload();
        },
        error: function(xhr, status, error) {
            console.error("Error posting question:", error);
            // Reset button text and show "Nevermind" button
            $('.ask-btn').text('Ask Question');
            $('.nevermind').show();
        }
    });
}

// Function to fetch threads from the server
function getThreads() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'getThreads.jsp',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                if (data && Array.isArray(data)) {
                    resolve(data);
                } else {
                    reject("Invalid response data");
                }
            },
            error: function(xhr, status, error) {
                reject(error);
            }
        });
    });
}


// Function to post a new question
function postQuestion(question) {
    // Make AJAX request to post the question
    $.ajax({
        type: "POST",
        url: "support.jsp",
        data: { question: question },
        success: function(response) {
            console.log("Question posted successfully");
            // Refresh the page to reflect the new question (or update threads array and UI dynamically)
            location.reload();
        },
        error: function(xhr, status, error) {
            console.error("Error posting question:", error);
            // Reset button text and show "Nevermind" button
            $('.ask-btn').text('Ask Question');
            $('.nevermind').show();
        }
    });
}

// Function to fetch threads from the server
function getThreads() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'getThreads.jsp',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                if (data && Array.isArray(data)) {
                    resolve(data);
                } else {
                    reject("Invalid response data");
                }
            },
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
