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
        ]         

    }
]