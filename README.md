# Travel Planner with Weather and Location Visualization

### **Live Website:**

[Travel Planner](https://saishadow.github.io/) \
https://saishadow.github.io/

Github: https://github.com/SaiShadow/SaiShadow.github.io

---

## **Overview**

The **Travel Planner** is a responsive web application that helps users organize and visualize their travel plans.
It allows users to add destinations, view current weather information, and visualize travel locations dynamically using
a canvas. Designed for usability and performance, this project incorporates modern web development techniques to provide
a seamless experience across devices.

---

## **Key Features**

### **1. Weather Information**

- Displays real-time weather data for the user's current location or chosen travel destinations.
- Includes intuitive weather icons and brief descriptions.

### **2. Add and Manage Locations**

- Users can add destinations via an input field and view them in a well-organized list.
- Each location card displays:
    - Distance from the user's location.
    - Estimated travel times (by car, cycle, or walking).
    - An option to delete a location.

### **3. Location Visualization**

- Visualizes travel locations on a **Canvas**, with dynamic connections between destinations.
- Color-coded indicators represent distances:
    - Local (< 50 km).
    - Regional (50–200 km).
    - Long Haul (200–1000 km).
    - Global (> 1000 km).

### **4. Responsive Design**

- Optimized for mobile, tablet, and desktop devices.
- Ensures a consistent layout with adjustable elements based on screen size.

### **5. Additional Features, for example:**

- **Dark Mode**: Toggle light and dark themes for personalized viewing.
- **Reset View**: Reset the canvas to its original state.
- **Loading Spinner**: Provides visual feedback when fetching weather data.

---

## **HTML5 Features Used:**

- **Location Awareness / Geolocation API**:
    - Fetches the user's current location to provide accurate weather information.
- **Local Storage and Session Storage**:
    - Saves user data (e.g., locations) for persistent access.
      - Local Storage: Stores the user's saved locations
      - Session Storage: Stores the saved locations weather details and user 
      coordinates for the current session.
- **Responsive Design**:
    - Uses `rem` and media queries to ensure compatibility across devices.
- **Canvas**:
    - Dynamically visualizes travel locations and their connections.

---

## **Technologies Used**

- **Frontend**: HTML5, CSS3, JavaScript
- **Libraries/Frameworks**:
    - **Bootstrap**: For responsive components and icons.
    - **Bootstrap Icons**: For additional UI elements (e.g., weather icons).
    - **jQuery**
- **APIs**: Fetches weather and location data dynamically.

---

## **Browser Compatibility**

- Tested on:
    - **Google Chrome**
    - **Safari**

---

## **How to Use**

1. Open the [website](https://saishadow.github.io/), https://saishadow.github.io/ .
2. Use the **Add Location** input field to enter a travel destination.
3. View the destination details, including:
    - Weather conditions.
    - Travel distances and times.
4. Toggle **Dark Mode** or visualize locations dynamically on the **Canvas** by pressing the **Visualize Locations**
   button.

---

## **Future Improvements**

- Integrate more travel data (e.g., traffic, public transport routes).
- ~~Add more visualization options (e.g., maps or charts).~~ -Already implemented
- Add pinning or sorting locations based on distance.

---

Feel free to explore and plan your trips! Feedback and contributions are welcome. 😊
