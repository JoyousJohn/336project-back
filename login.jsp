<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1" import="java.io.*,java.util.*,java.sql.*"%>
<%@ page import="javax.servlet.http.*,javax.servlet.*" %>
<%@ page import="com.cs336.pkg.*" %>

<%
    ApplicationDB db = new ApplicationDB();
    Connection con = db.getConnection();

    String username = request.getParameter("username");
    String password = request.getParameter("password");

    // Query to check if the user exists and retrieve user details
    String query = "SELECT username, email, role " +
                   "FROM end_user " +
                   "WHERE username = ? AND password = ?";
    
    PreparedStatement ps = con.prepareStatement(query);
    ps.setString(1, username);
    ps.setString(2, password);

    ResultSet rs = ps.executeQuery();

    if (rs.next()) {
        // Fetch user details from the result set
        String fetchedUsername = rs.getString("username");
        String email = rs.getString("email");
        String role = rs.getString("role");

        // Set the session attributes
        session.setAttribute("username", fetchedUsername);
        session.setAttribute("email", email);
        session.setAttribute("loggedIn", true); // Set loggedIn attribute to true
        session.setAttribute("role", role); // Set role attribute

        // Send back the response indicating success
        out.print("success|" + fetchedUsername + "|" + email + "|" + role);
    } else {
        // Send back the response indicating failure
        out.print("failure");
    }

    con.close();
%>
