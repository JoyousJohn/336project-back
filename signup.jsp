<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1" import="java.io.*, java.util.*, java.sql.*, java.util.UUID" %>
<%@ page import="com.cs336.pkg.ApplicationDB" %>

<%
    ApplicationDB db = new ApplicationDB();
    Connection con = db.getConnection();

    String username = request.getParameter("username");
    String email = request.getParameter("email");
    String password = request.getParameter("password");
    String name = request.getParameter("name");

    // Generate a random user ID within the range of 10 to 1000
    int userId = (int) (Math.random() * (1000 - 10 + 1)) + 10;

    // Check if the username already exists
    PreparedStatement usernameCheckStmt = con.prepareStatement("SELECT * FROM end_user WHERE username = ?");
    usernameCheckStmt.setString(1, username);
    ResultSet usernameResult = usernameCheckStmt.executeQuery();

    // Check if the email already exists
    PreparedStatement emailCheckStmt = con.prepareStatement("SELECT * FROM end_user WHERE email = ?");
    emailCheckStmt.setString(1, email);
    ResultSet emailResult = emailCheckStmt.executeQuery();

    // If username or email already exists, return failure
    if (usernameResult.next() || emailResult.next()) {
        out.print("failure|Username or email already exists");
    } else {
        // Insert the user into the database
        PreparedStatement insertStmt = con.prepareStatement("INSERT INTO end_user (user_id, username, email, password, name, role) VALUES (?, ?, ?, ?, ?, 'USER')");
        insertStmt.setInt(1, userId);
        insertStmt.setString(2, username);
        insertStmt.setString(3, email);
        insertStmt.setString(4, password);
        insertStmt.setString(5, name);

        int rowsAffected = insertStmt.executeUpdate();
        if (rowsAffected > 0) {
            // Set session attributes and return success
            session.setAttribute("user_id", userId);
            session.setAttribute("username", username);
            session.setAttribute("email", email);
            session.setAttribute("loggedIn", true); // Set loggedIn attribute to true
            session.setAttribute("role", "USER"); // Set role attribute

            out.print("success|" + username + "|" + email + "|" + "USER");
        } else {
            // Signup failed
            out.print("failure|An error occurred during signup");
        }
    }

    con.close();
%>
