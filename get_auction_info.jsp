<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.sql.*, java.util.*" %>
<%@ page import="com.cs336.pkg.ApplicationDB" %>

<%
// Get the auctionId parameter from the POST request
String auctionId = request.getParameter("auctionId");

// Create a map to store the auction data
Map<String, Object> auctionData = new HashMap<>();

try {
    // Get the database connection
    ApplicationDB db = new ApplicationDB();
    Connection con = db.getConnection();

    // Prepare the SQL query to fetch the auction data
    String query = "SELECT * FROM posted_auction WHERE auction_id = ?";
    PreparedStatement stmt = con.prepareStatement(query);
    stmt.setString(1, auctionId);

    // Execute the query and get the result set
    ResultSet rs = stmt.executeQuery();

    // Check if the result set has a row
    if (rs.next()) {
        // Populate the auctionData map with data from the result set
        ResultSetMetaData metaData = rs.getMetaData();
        int columnCount = metaData.getColumnCount();

        for (int i = 1; i <= columnCount; i++) {
            String columnName = metaData.getColumnName(i);
            Object columnValue = rs.getObject(i);
            auctionData.put(columnName, columnValue);
        }
    }

    // Close the database resources
    rs.close();
    stmt.close();
    con.close();
} catch (Exception e) {
    // Handle any exceptions
    e.printStackTrace();
}

// Convert the auctionData map to JSON and write it to the response
response.setContentType("application/json");
StringBuilder jsonBuilder = new StringBuilder("{");

for (Map.Entry<String, Object> entry : auctionData.entrySet()) {
    String key = entry.getKey();
    Object value = entry.getValue();
    jsonBuilder.append("\"").append(key).append("\":");
    jsonBuilder.append("\"").append(value).append("\",");
}

if (jsonBuilder.length() > 1) {
    jsonBuilder.setCharAt(jsonBuilder.length() - 1, '}');
} else {
    jsonBuilder.append("}");
}

out.println(jsonBuilder.toString());
%>