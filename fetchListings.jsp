<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8" import="java.sql.*, java.util.*" %>
<%@ page import="com.cs336.pkg.ApplicationDB" %> <!-- Import your ApplicationDB class or any other necessary classes -->

<%
    // Initialize a list to hold the fetched listings
    List<Map<String, Object>> listings = new ArrayList<>();

    // Fetch listings from the database
    ApplicationDB db = new ApplicationDB();
    Connection con = db.getConnection();
    PreparedStatement stmt = null;
    ResultSet rs = null;

    try {
        // Prepare the SQL query to fetch listings
        String query = "SELECT * FROM posted_auction";
        stmt = con.prepareStatement(query);
        rs = stmt.executeQuery();

        // Iterate over the result set and populate the listings list
        while (rs.next()) {
            Map<String, Object> listing = new HashMap<>();
            // Populate listing attributes from the result set
            ResultSetMetaData metaData = rs.getMetaData();
            int columnCount = metaData.getColumnCount();
            for (int i = 1; i <= columnCount; i++) {
                String columnName = metaData.getColumnName(i);
                Object columnValue = rs.getObject(i);
                listing.put(columnName, columnValue);
            }
            // Add the listing to the list of listings
            listings.add(listing);
        }
    } catch (SQLException e) {
        e.printStackTrace();
    } finally {
        // Close resources
        if (rs != null) {
            try {
                rs.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        if (stmt != null) {
            try {
                stmt.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        if (con != null) {
            try {
                con.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    // Output the fetched listings as HTML
    for (Map<String, Object> listing : listings) {
%>
    <div class="auction">
        <%-- Output all attributes dynamically --%>
        <% for (Map.Entry<String, Object> entry : listing.entrySet()) { %>
            <p><%= entry.getKey() %>: <%= entry.getValue() %></p>
        <% } %>
    </div>
<%
    }
%>
