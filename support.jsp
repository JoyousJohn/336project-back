<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1" import="java.io.*, java.util.*, java.sql.*, java.util.UUID" %>
<%@ page import="com.cs336.pkg.ApplicationDB" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="java.util.Date" %>



<%
// Create an instance of ApplicationDB to obtain a database connection
ApplicationDB db = new ApplicationDB();
Connection con = db.getConnection();

String question = request.getParameter("question");
String userIdParam = request.getParameter("user_id"); // Assuming user_id is passed from the client

try {
    int userId = (int) session.getAttribute("userId");
    
    // Prepare the SQL statement to insert the question into the database
    String insertQuery = "INSERT INTO message (message_id, user_id, messageText, response_thread) VALUES (?, ?, ?, ?)";
    PreparedStatement insertStatement = con.prepareStatement(insertQuery);
    
    // Generate a message ID using Math.random() (Note: It's better to use auto-increment in production)
    int messageId = (int) (Math.random() * (1000 - 10 + 1)) + 10;
    

    // Set parameters for the insert statement
    insertStatement.setInt(1, messageId);
    insertStatement.setInt(2, userId);
    insertStatement.setString(3, question);
    insertStatement.setString(4, "0"); // Default response_thread value for a new thread (string instead of integer)
    
    // Execute the insert statement
    int rowsInserted = insertStatement.executeUpdate();
    
    if (rowsInserted > 0) {
        // Insert successful
        out.println("Question posted successfully");
    } else {
        // Insert failed
        out.println("Failed to post question");
    }
} catch (NumberFormatException e) {
    // Handle NumberFormatException (e.g., invalid user_id parameter)
    out.println("Invalid user ID parameter: " + userIdParam);
} catch (SQLException e) {
    // Handle any SQL exceptions
    out.println("Error posting question: " + e.getMessage());
} finally {
    // Close the database connection
    try {
        if (con != null) {
            con.close();
        }
    } catch (SQLException e) {
        out.println("Error closing connection: " + e.getMessage());
    }
}
%>
