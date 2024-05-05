<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1" import="java.io.*, java.util.*, java.sql.*, java.util.UUID" %>
<%@ page import="com.cs336.pkg.ApplicationDB" %>

<%
    ApplicationDB db = new ApplicationDB();
    Connection con = null;

    try {
        con = db.getConnection();
        String action = request.getParameter("action");

        if (action != null) {
            if (action.equals("delete")) {
                String username = request.getParameter("username");
                // Delete user
                PreparedStatement deleteStmt = con.prepareStatement("DELETE FROM users WHERE username = ?");
                deleteStmt.setString(1, username);
                int rowsAffected = deleteStmt.executeUpdate();
                if (rowsAffected > 0) {
                    out.print("success|User " + username + " deleted successfully");
                } else {
                    out.print("failure|Failed to delete user " + username);
                }
            } else if (action.equals("create")) {
                String username = request.getParameter("username");
                String email = request.getParameter("email");
                String password = request.getParameter("password");
                String name = request.getParameter("name");

                // Check if username or email already exists
                PreparedStatement usernameCheckStmt = con.prepareStatement("SELECT * FROM users WHERE username = ?");
                usernameCheckStmt.setString(1, username);
                ResultSet usernameResult = usernameCheckStmt.executeQuery();

                PreparedStatement emailCheckStmt = con.prepareStatement("SELECT * FROM users WHERE email = ?");
                emailCheckStmt.setString(1, email);
                ResultSet emailResult = emailCheckStmt.executeQuery();

                if (usernameResult.next() || emailResult.next()) {
                    out.print("failure|Username or email already exists");
                } else {
                    // Insert new user
                    PreparedStatement insertStmt = con.prepareStatement("INSERT INTO users (username, email, password, name, role) VALUES (?, ?, ?, ?, 'USER')");
                    insertStmt.setString(1, username);
                    insertStmt.setString(2, email);
                    insertStmt.setString(3, password);
                    insertStmt.setString(4, name);

                    int rowsAffected = insertStmt.executeUpdate();
                    if (rowsAffected > 0) {
                        out.print("success|User " + username + " created successfully");
                    } else {
                        out.print("failure|Failed to create user " + username);
                    }
                }
            } else if (action.equals("update")) {
                String username = request.getParameter("username");
                String email = request.getParameter("email");
                String password = request.getParameter("password");
                String name = request.getParameter("name");
                String role = request.getParameter("role");

                // Update user
                PreparedStatement updateStmt = con.prepareStatement("UPDATE users SET email = ?, password = ?, name = ?, role = ? WHERE username = ?");
                updateStmt.setString(1, email);
                updateStmt.setString(2, password);
                updateStmt.setString(3, name);
                updateStmt.setString(4, role);
                updateStmt.setString(5, username);

                int rowsAffected = updateStmt.executeUpdate();
                if (rowsAffected > 0) {
                    out.print("success|User " + username + " updated successfully");
                } else {
                    out.print("failure|Failed to update user " + username);
                }
            }
        }
    } catch (SQLException e) {
        e.printStackTrace(); // Log the exception for debugging
        out.print("failure|An error occurred: " + e.getMessage()); // Provide error message to client
    } finally {
        try {
            if (con != null) {
                con.close();
            }
        } catch (SQLException e) {
            e.printStackTrace(); // Log the exception for debugging
        }
    }
%>
