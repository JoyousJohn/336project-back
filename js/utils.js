function isLoggedIn() {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "GET",
            url: "checkLoginStatus.jsp",
            headers: { "cache-control": "no-cache" },
            success: function(response) {
                const [loggedIn, username, role] = response.trim().split("|");
                const isLoggedInStatus = loggedIn === "true"; // Update isLoggedInStatus variable
                console.log("Is logged in:", isLoggedInStatus);
                console.log("Username check:", username);
                console.log("Role:", role);

                resolve({ loggedIn: isLoggedInStatus, username: username, role: role });
            },
            error: function(xhr, status, error) {
                console.error("Error checking login status:", error);
                resolve({ loggedIn: false, username: null, role: null });
            }
        });
    });
}

function updateSidebar() {
    isLoggedIn().then((result) => {
        const { loggedIn, username, role } = result;
        const profileLink = $('#profileLink');
        const sellLink = $('.sidebar-sell');
        const adminLink = $('.sidebar-admin');
        const exploreLink = $('.sidebar-explore');

        if (loggedIn) {
            // User is logged in
            profileLink.attr('href', 'profile.html');
            sellLink.attr('href', 'sell.html');

            if (role === 'ADMIN') {
                adminLink.attr('href', 'admin.html');
            } else {
                adminLink.attr('href', 'javascript:void(0)');
                adminLink.off('click');
                adminLink.on('click', function(event) {
                    event.preventDefault();
                    alert("You are not authorized to access the admin page.");
                });
            }
            // Set the Explore link to index.html when logged in
            exploreLink.attr('href', 'index.html');
        } else {
            // User is not logged in
            profileLink.attr('href', 'login.html'); // Set profile link to login.html when not logged in
            sellLink.attr('href', 'javascript:void(0)');
            adminLink.attr('href', 'javascript:void(0)');
            adminLink.off('click');
            adminLink.on('click', function(event) {
                event.preventDefault();
                alert("Please log in to access the admin page.");
            });

            // Set the Explore link to index.html when not logged in
            exploreLink.attr('href', 'index.html');
        }
    }).catch((error) => {
        console.error("Error updating sidebar:", error);
    });
}

// when on log in and go to explore, doesn't work !



//function hasEmptyValues(obj) {
  //  const values = Object.values(obj);
   // return values.some(value => value === '' || value === null || value === undefined);
//}

