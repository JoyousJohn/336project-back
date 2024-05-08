<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1" import="java.io.*, java.util.*, java.sql.*" %>
<%@ page import="com.cs336.pkg.ApplicationDB" %>

<%
    ApplicationDB db = new ApplicationDB();
    Connection con = db.getConnection();

    String bidderId = (String) session.getAttribute("user_id");
    String auctionId = request.getParameter("uuid");
    String bidAmount = request.getParameter("bidAmount");
    
    // add these
    // String auctionId = request.getParameter("auctionId");
    // String upperLimit = request.getParameter("upperLimit");
    // String isHighest = request.getParameter("isHighest");

    String sql = "INSERT INTO bids_on (bidder_id, amount, auctionId, when_placed) VALUES (?, ?, ?, NOW())";
    PreparedStatement insertStmt = con.prepareStatement(sql);

    insertStmt.setInt(1, 0);
    insertStmt.setDouble(2, 19.9);
    insertStmt.setInt(3, 0);

    int rowsAffected = insertStmt.executeUpdate();
    if (rowsAffected > 0) {
        out.print("success|Bid successfully placed");
    } else {
        out.print("failure|Unable to place bid");
    }

    con.close();
%>
