
function generateRandomAuctions(n) {
    const auctions = [];
    
    for (let i = 0; i < n; i++) {
        const auction = {
            'title': generateRandomTitle(),
            'startingPrice': getRandomNumber(1, 19),
            'winningBidPrice': parseFloat(getRandomNumber(20, 200) + '.' + getRandomNumber(10, 99)),
            'publishDateTime': getRandomDateTimeString(-9, 0),
            'endDateTime': getRandomDateTimeString(8, 15),
            'bids': []
        };

        const numBids = getRandomNumber(1, 10);
        for (let j = 0; j < numBids; j++) {
            auction.bids.push({
                'bidder': generateRandomName(),
                'maxBidPrice': getRandomNumber(auction.startingPrice + 1, auction.startingPrice * 2),
                'bidDateTime': getRandomDateTimeString(-5, 0)
            });
        }

        auctions.push(auction);
    }

    return auctions;
}

function generateRandomTitle() {
    const adjectives = ['Stylish', 'Vintage', 'Luxurious', 'Modern', 'Antique'];
    const nouns = ['Watch', 'Painting', 'Car', 'Furniture', 'Jewelry'];
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${randomAdjective} ${randomNoun}`;
}

function generateRandomName() {
    const firstNames = ['John', 'Emma', 'Michael', 'Sophia', 'William', 'Olivia', 'James', 'Ava', 'Alexander', 'Isabella'];
    const lastNames = ['Smith', 'Johnson', 'Brown', 'Taylor', 'Jones', 'Garcia', 'Miller', 'Davis', 'Martinez', 'Hernandez'];
    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${randomFirstName} ${randomLastName}`;
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Assuming getRandomDateTimeString function is defined earlier in your code

function getRandomDateTimeString(startOffset, endOffset) {
    if (startOffset > endOffset) {
        throw new Error('Start offset must be less than or equal to end offset');
    }

    const now = new Date();
    const startDate = new Date(now.getTime() + startOffset * 24 * 60 * 60 * 1000);
    const endDate = new Date(now.getTime() + endOffset * 24 * 60 * 60 * 1000);

    // Ensure that the generated dates fall within a valid range
    const validStartDate = new Date(Math.max(startDate.getTime(), Date.now() - 100 * 365 * 24 * 60 * 60 * 1000));
    const validEndDate = new Date(Math.min(endDate.getTime(), Date.now() + 100 * 365 * 24 * 60 * 60 * 1000));

    const randomTimestamp = validStartDate.getTime() + Math.random() * (validEndDate.getTime() - validStartDate.getTime());
    const randomDateTime = new Date(randomTimestamp);

    return randomDateTime.toISOString();
}