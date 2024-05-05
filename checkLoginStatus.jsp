<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1" import="java.io.*,java.util.*,java.sql.*" %>
<%@ page import="javax.servlet.http.*,javax.servlet.*" %>
<%@ page import="com.cs336.pkg.*" %>

<%
    HttpSession sessionObject = request.getSession(false);
    boolean loggedIn = false;
    String username = null;
    String role = null;
    
    if (sessionObject != null && sessionObject.getAttribute("loggedIn") != null) {
        loggedIn = (Boolean) sessionObject.getAttribute("loggedIn");
        if (loggedIn) {
            username = (String) sessionObject.getAttribute("username");
            
            // Fetch the role from the database
            ApplicationDB db = new ApplicationDB();
            Connection con = db.getConnection();
            String query = "SELECT role FROM end_user WHERE username = ?";
            PreparedStatement ps = con.prepareStatement(query);
            ps.setString(1, username);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                role = rs.getString("role");
            }
            con.close();
        }
    }
    
    out.print(loggedIn + "|" + (loggedIn ? username : "null") + "|" + (loggedIn && role != null ? role : "null"));
%>
