<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1" import="java.io.*,java.util.*,java.sql.*"%>
<%@ page import="javax.servlet.http.*,javax.servlet.*" %>
<%@ page import="com.cs336.pkg.*" %>

<%
    ApplicationDB db = new ApplicationDB();
    Connection con = db.getConnection();

    // Check if the request is for creating a new user
    String createNewUser = request.getParameter("createNewUser");

    if (createNewUser != null && createNewUser.equals("true")) {
        // Get user details from the request parameters
        String username = request.getParameter("username");
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        String name = request.getParameter("name");
        String role = request.getParameter("role"); // Get role from request parameters
        role = (role != null && !role.isEmpty()) ? role : "USER"; // Default role to "USER" if not provided

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
            // Generate a random user ID within the range of 10 to 1000
            int userId = (int) (Math.random() * (1000 - 10 + 1)) + 10;

            // Insert the new user into the database
            PreparedStatement insertStmt = con.prepareStatement("INSERT INTO end_user (user_id, username, email, password, name, role) VALUES (?, ?, ?, ?, ?, ?)");
            insertStmt.setInt(1, userId);
            insertStmt.setString(2, username);
            insertStmt.setString(3, email);
            insertStmt.setString(4, password);
            insertStmt.setString(5, name);
            insertStmt.setString(6, role);

            int rowsAffected = insertStmt.executeUpdate();
            if (rowsAffected > 0) {
                // Return success response
                out.print("success|User created successfully");
            } else {
                // Return failure response
                out.print("failure|An error occurred while creating the user");
            }
        }
    } else {
        // Check if the request is for updating user data
        String updateUser = request.getParameter("updateUser");

        if (updateUser != null && updateUser.equals("true")) {
            // Get user details from the request parameters
            String username = request.getParameter("username");
            String email = request.getParameter("email");
            String password = request.getParameter("password");
            String name = request.getParameter("name");
            String role = request.getParameter("role");

            // Construct the SQL update query dynamically based on provided parameters
            StringBuilder updateQuery = new StringBuilder("UPDATE end_user SET ");
            List<String> updateColumns = new ArrayList<>();
            if (email != null && !email.isEmpty()) {
                updateColumns.add("email = ?");
            }
            if (password != null && !password.isEmpty()) {
                updateColumns.add("password = ?");
            }
            if (name != null && !name.isEmpty()) {
                updateColumns.add("name = ?");
            }
            if (role != null && !role.isEmpty()) {
                updateColumns.add("role = ?");
            }
            updateQuery.append(String.join(", ", updateColumns))
                      .append(" WHERE username = ?");

            try {
                // Prepare the dynamic update statement
                PreparedStatement updateStmt = con.prepareStatement(updateQuery.toString());

                // Set parameters based on provided values
                int parameterIndex = 1;
                if (email != null && !email.isEmpty()) {
                    updateStmt.setString(parameterIndex++, email);
                }
                if (password != null && !password.isEmpty()) {
                    updateStmt.setString(parameterIndex++, password);
                }
                if (name != null && !name.isEmpty()) {
                    updateStmt.setString(parameterIndex++, name);
                }
                if (role != null && !role.isEmpty()) {
                    updateStmt.setString(parameterIndex++, role);
                }
                // Set the username parameter
                updateStmt.setString(parameterIndex, username);

                // Execute the update statement
                int rowsAffected = updateStmt.executeUpdate();
                if (rowsAffected > 0) {
                    // Return success response
                    out.print("success|User data updated successfully");
                } else {
                    // Return failure response
                    out.print("failure|No changes were made to user data");
                }
            } catch (Exception e) {
                // Print the exception stack trace
                e.printStackTrace();
                // Return failure response
                out.print("failure|Error updating user data: " + e.getMessage());
            }
        } else {
            // Check if the request is for deleting a user
            String deleteUser = request.getParameter("deleteUser");

            if (deleteUser != null && deleteUser.equals("true")) {
                // Get the username of the user to be deleted from the request parameters
                String usernameToDelete = request.getParameter("username");

                // Check if the username is provided
                if (usernameToDelete != null && !usernameToDelete.isEmpty()) {
                    try {
                        // Prepare a SQL query to delete the user from the database
                        PreparedStatement deleteStmt = con.prepareStatement("DELETE FROM end_user WHERE username = ?");
                        deleteStmt.setString(1, usernameToDelete);

                        // Execute the delete statement
                        int rowsAffected = deleteStmt.executeUpdate();

                        // Check if the user was successfully deleted
                        if (rowsAffected > 0) {
                            // Return success response
                            out.print("success|User deleted successfully");
                        } else {
                            // Return failure response if the user was not found
                            out.print("failure|User not found");
                        }
                    } catch (SQLException e) {
                        // Handle any database errors
                        e.printStackTrace();
                        out.print("failure|Error deleting user: " + e.getMessage());
                    }
                } else {
                    // Return failure response if username is not provided
                    out.print("failure|Username not provided");
                }
            } else {
                // Query to fetch all users
                String query = "SELECT username, name, email, role FROM end_user";

                PreparedStatement ps = con.prepareStatement(query);
                ResultSet rs = ps.executeQuery();

                // Initialize a StringBuilder to build the response
                StringBuilder responseBuilder = new StringBuilder();

                while (rs.next()) {
                    // Fetch user details from the result set
                    String username = rs.getString("username");
                    String name = rs.getString("name");
                    String email = rs.getString("email");
                    String role = rs.getString("role");

                    // Append user details to the response
                    responseBuilder.append(username).append("|")
                                   .append(name).append("|")
                                   .append(email).append("|")
                                   .append(role).append("\n");
                }

                // Close resources
                rs.close();
                ps.close();

                // Send back the response
                out.print(responseBuilder.toString());
            }
        }
    }

    con.close();
%>
