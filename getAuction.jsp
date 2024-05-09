<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.io.*, java.util.*, java.sql.*" %>
<%@ page import="com.cs336.pkg.ApplicationDB" %>

<%
ApplicationDB db = new ApplicationDB();
Connection con = db.getConnection();

PreparedStatement stmt = null;
ResultSet rs = null;

try {
    // Get auction ID from request parameter
    int auctionId = Integer.parseInt(request.getParameter("auction_id"));

    // Query to retrieve auction data
    String query = "SELECT * FROM posted_auction WHERE auction_id = ?";
    stmt = con.prepareStatement(query);
    stmt.setInt(1, auctionId);

    // Execute query
    rs = stmt.executeQuery();

    // Check if auction data exists
    if (rs.next()) {
        // Retrieve auction data
        int sellerId = rs.getInt("seller_id");
        String whenCloses = rs.getString("when_closes");
        String description = rs.getString("description");
        String status = rs.getString("status");
        double bidIncrement = rs.getDouble("bid_increment");
        double reserve = rs.getDouble("reserve");
        int imageCount = rs.getInt("imageCount");
        String title = rs.getString("title");

        out.println("Auction ID: " + auctionId);
        out.println("Seller ID: " + sellerId);
        out.println("Closing Date: " + whenCloses);
        out.println("Description: " + description);
        out.println("Status: " + status);
        out.println("Bid Increment: " + bidIncrement);
        out.println("Reserve Price: " + reserve);
        out.println("Image Count: " + imageCount);
        out.println("Title: " + title);
    } else {
        out.println("Auction with ID " + auctionId + " not found.");
    }
} catch (SQLException e) {
    out.println("SQL Error: " + e.getMessage());
    e.printStackTrace(new PrintWriter(out));
} catch (NumberFormatException e) {
    out.println("Error parsing auction ID: " + e.getMessage());
    e.printStackTrace(new PrintWriter(out));
} catch (Exception e) {
    out.println("Error: " + e.getMessage());
    e.printStackTrace(new PrintWriter(out));
} finally {
    // Close resources
    try {
        if (rs != null) {
            rs.close();
        }
        if (stmt != null) {
            stmt.close();
        }
        if (con != null) {
            con.close();
        }
    } catch (SQLException e) {
        out.println("Error closing resources: " + e.getMessage());
        e.printStackTrace(new PrintWriter(out));
    }
}
%>