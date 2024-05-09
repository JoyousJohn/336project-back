<%@ page language="java" contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.sql.*, java.util.*, java.text.*, com.cs336.pkg.ApplicationDB" %>

<%
ApplicationDB db = new ApplicationDB();
Connection conn = null;
PreparedStatement pstmt = null;
ResultSet rs = null;

try {
    conn = db.getConnection();
    pstmt = conn.prepareStatement("SELECT message_id, messageText, user_id FROM message WHERE response_thread IS NOT NUL");

    rs = pstmt.executeQuery();

    out.print("[");
    boolean first = true;
    while (rs.next()) {
        if (!first) {
            out.print(",");
        }
        out.print("{");
        out.print("\"message_id\": " + rs.getInt("message_id") + ",");
        out.print("\"messageText\": \"" + rs.getString("messageText").replace("\"", "\\\"") + "\",");
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        out.print("\"userId\": " + rs.getInt("user_id"));
        out.print("}");
        first = false;
    }
    out.print("]");
} catch (SQLException e) {
    // Log the exception
    e.printStackTrace();
    // Return an error message as JSON
    out.print("[{\"error\": \"An error occurred while fetching threads.\"}]");
} finally {
    // Close resources
    if (rs != null) { try { rs.close(); } catch (SQLException e) { e.printStackTrace(); } }
    if (pstmt != null) { try { pstmt.close(); } catch (SQLException e) { e.printStackTrace(); } }
    if (conn != null) { try { conn.close(); } catch (SQLException e) { e.printStackTrace(); } }
}
%>
