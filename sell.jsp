<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.io.*, java.util.*, java.sql.*" %>
<%@ page import="com.cs336.pkg.ApplicationDB" %>

<%
ApplicationDB db = new ApplicationDB();
Connection con = db.getConnection();

PreparedStatement stmt = null;
PreparedStatement itemStmt = null;

try {
    // Get form data
    String title = request.getParameter("sell-title");
    String category = request.getParameter("sell-category");
    String description = request.getParameter("sell-description");
    String listingType = request.getParameter("listing-type"); // Auction or Buy it Now
    String endDate = request.getParameter("sell-end-date");
    String condition = request.getParameter("sell-condition");

    // Parse numeric values with default values if parameters are null or empty
    double bidIncrement = 0.0; // Optional bid increment, default to 0 if not provided
    double reserve = 0.0;
    int imageCount = 0;
    double price = 0.0; // Initialize price with default value
    
    if (request.getParameter("sell-price") != null && !request.getParameter("sell-price").isEmpty()) {
        price = Double.parseDouble(request.getParameter("sell-price"));
    }
    
    if (request.getParameter("sell-increment") != null && !request.getParameter("sell-increment").isEmpty()) {
        bidIncrement = Double.parseDouble(request.getParameter("sell-increment"));
    }
    
    if (request.getParameter("sell-reserve") != null && !request.getParameter("sell-reserve").isEmpty()) {
        reserve = Double.parseDouble(request.getParameter("sell-reserve"));
    }

    if (request.getParameter("imageCount") != null && !request.getParameter("imageCount").isEmpty()) {
        imageCount = Integer.parseInt(request.getParameter("imageCount"));
    }

    // Get seller ID from session and parse it as an integer
    //String userIdString = (String) session.getAttribute("sellerId");
    String userIdString = "1";
    int sellerId = 0;

    try {
        sellerId = Integer.parseInt(userIdString);
    } catch (NumberFormatException e) {
        out.println("Error parsing seller ID: " + e.getMessage());
        e.printStackTrace(new PrintWriter(out));
        return; // Return from the JSP page if seller ID is not valid
    }

    // Verify that the seller ID exists in the end_user table
    String verifySellerQuery = "SELECT COUNT(*) FROM end_user WHERE user_id = ?";
    PreparedStatement verifySellerStmt = con.prepareStatement(verifySellerQuery);
    verifySellerStmt.setInt(1, sellerId);
    ResultSet sellerResult = verifySellerStmt.executeQuery();

    if (sellerResult.next() && sellerResult.getInt(1) == 0) {
        out.println("Seller ID does not exist in the end_user table.");
        return; // Return from the JSP page if seller ID does not exist
    }

    // Generate unique auction_id manually
    // You can use a sequence, timestamp, or any other unique identifier generation method
    int auctionId = (int) (Math.random() * (100000 - 10 + 1)) + 10;

    // Insert new listing into the posted_auction table
    String query = "INSERT INTO posted_auction (auction_id, seller_id, when_closes, description, bid_increment, reserve, imageCount) VALUES (?, ?, ?, ?, ?, ?, ?)";
    stmt = con.prepareStatement(query);
    stmt.setInt(1, auctionId);
    stmt.setInt(2, sellerId);
    stmt.setString(3, endDate); // Assuming you're passing the closing date from the form
    stmt.setString(4, description);
    stmt.setDouble(5, bidIncrement); // Convert bidIncrement to double
    stmt.setDouble(6, reserve); // Convert reserve to double
    stmt.setInt(7, imageCount); // Convert imageCount to integer

    // Execute the query
    int rowsAffected = stmt.executeUpdate();

    if (rowsAffected > 0) {
        out.println("Auction posted successfully!"); // Output success message
    } else {
        out.println("Failed to post auction!"); // Output failure message
    }

    // Insert new listing into the included_item table
    // Use the manually generated auctionId
    
    int itemId = (int) (Math.random() * (100000 - 10 + 1)) + 10;
    
    String itemQuery = "INSERT INTO included_item (item_id, auction_id, category) VALUES (?, ?, ?)";
    itemStmt = con.prepareStatement(itemQuery);
    itemStmt.setInt(1, itemId);
    itemStmt.setInt(2, auctionId);
    itemStmt.setString(3, category); // Replace category with the actual category value
    
    int itemRowsAffected = itemStmt.executeUpdate();
    if (itemRowsAffected > 0) {
        out.println("Item inserted successfully!"); // Output success message
    } else {
        out.println("Failed to insert item!"); // Output failure message
    }
} catch (SQLException e) {
    
    out.println("SQL Error: " + e.getMessage()); // Output SQL error message
    e.printStackTrace(new PrintWriter(out)); // Print stack trace
    
} catch (NumberFormatException e) {
    
    out.println("Error parsing numeric values: " + e.getMessage()); // Output error message
    e.printStackTrace(new PrintWriter(out)); // Print stack trace
    
} catch (Exception e) {
    
    out.println("Error: " + e.getMessage()); // Output general error message
    e.printStackTrace(new PrintWriter(out)); // Print stack trace
    
} finally {
    // Close resources
    try {
        if (itemStmt != null) {
            itemStmt.close();
        }
        if (stmt != null) {
            stmt.close();
        }
        if (con != null) {
            con.close();
        }
    } catch (SQLException e) {
        
        out.println("Error closing resources: " + e.getMessage()); // Output error message
        e.printStackTrace(new PrintWriter(out)); // Print stack trace
        
    }
}
%>
