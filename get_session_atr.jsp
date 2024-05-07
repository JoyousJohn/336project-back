<%@ page contentType="text/plain" %>
<%
    // Get the session object

    // Create a StringBuilder to hold session data
    StringBuilder sessionData = new StringBuilder();

    // Get all attribute names in the session
    java.util.Enumeration<String> attributeNames = session.getAttributeNames();
    
    // Iterate over the attribute names
    while (attributeNames.hasMoreElements()) {
        String attributeName = attributeNames.nextElement();
        Object attributeValue = session.getAttribute(attributeName);
        // Append attribute name and value to the StringBuilder
        sessionData.append(attributeName).append(":").append(attributeValue).append("\n");
    }

    // Print the session data as a string
    out.print(sessionData.toString());
%>
