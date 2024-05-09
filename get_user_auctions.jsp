<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.sql.*, java.util.*" %>
<%@ page import="com.cs336.pkg.ApplicationDB" %>

<%
// Get the userId parameter from the request
int userId = Integer.parseInt(request.getParameter("userId"));

// Create a list to store the auction data
List<Map<String, Object>> auctionList = new ArrayList<>();

try {
    // Get the database connection
    ApplicationDB db = new ApplicationDB();
    Connection con = db.getConnection();

    // Prepare the SQL query to fetch the auction data
    String query = "SELECT * FROM posted_auction WHERE seller_id = ?";
    PreparedStatement stmt = con.prepareStatement(query);
    stmt.setInt(1, userId);

    // Execute the query and get the result set
    ResultSet rs = stmt.executeQuery();

    // Iterate over the result set and populate the auctionList
    while (rs.next()) {
        Map<String, Object> auctionData = new HashMap<>();
        ResultSetMetaData metaData = rs.getMetaData();
        int columnCount = metaData.getColumnCount();

        for (int i = 1; i <= columnCount; i++) {
            String columnName = metaData.getColumnName(i);
            Object columnValue = rs.getObject(i);
            auctionData.put(columnName, columnValue);
        }

        auctionList.add(auctionData);
    }

    // Close the database resources
    rs.close();
    stmt.close();
    con.close();
} catch (Exception e) {
    // Handle any exceptions
    e.printStackTrace();
}

// Convert the auctionList to JSON and write it to the response
response.setContentType("application/json");
StringBuilder jsonBuilder = new StringBuilder("[");
for (Map<String, Object> auctionData : auctionList) {
    jsonBuilder.append("{");
    for (Map.Entry<String, Object> entry : auctionData.entrySet()) {
        String key = entry.getKey();
        Object value = entry.getValue();
        jsonBuilder.append("\"").append(key).append("\":\"").append(value).append("\",");
    }
    if (jsonBuilder.charAt(jsonBuilder.length() - 1) == ',') {
        jsonBuilder.setCharAt(jsonBuilder.length() - 1, '}');
    } else {
        jsonBuilder.append("}");
    }
    jsonBuilder.append(",");
}
if (jsonBuilder.length() > 1) {
    jsonBuilder.setCharAt(jsonBuilder.length() - 1, ']');
} else {
    jsonBuilder.append("]");
}
out.println(jsonBuilder.toString());
%>