<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.sql.*, java.util.*" %>
<%@ page import="com.cs336.pkg.ApplicationDB" %>

<%
// Get the id parameter from the POST request
String userId = request.getParameter("id");

String username = "";

try {
    // Get the database connection
    ApplicationDB db = new ApplicationDB();
    Connection con = db.getConnection();

    // Prepare the SQL query to fetch the username
    String query = "SELECT username FROM end_user WHERE user_id = ?";
    PreparedStatement stmt = con.prepareStatement(query);
    stmt.setString(1, userId);

    // Execute the query and get the result set
    ResultSet rs = stmt.executeQuery();

    // Check if the result set has a row
    if (rs.next()) {
        username = rs.getString("username");
    }

    // Close the database resources
    rs.close();
    stmt.close();
    con.close();
} catch (Exception e) {
    // Handle any exceptions
    e.printStackTrace();
}

// Write the username to the response
response.setContentType("text/plain");
out.println(username);
%>