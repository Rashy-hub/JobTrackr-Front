# Job Tracker Frontend

## Project Overview

This project is the frontend static website of a **Job Tracker** web service, designed to help users manage their job applications efficiently. The app includes features like creating and updating job entries, filtering and sorting jobs, and managing user profiles. It interacts seamlessly with a backend API and includes several modern UI/UX elements such as animations, modals, and customizable particle effects.

## Technologies Used

-   **SASS (SCSS)**: Organized and modular stylesheets for enhanced maintainability and flexibility.
-   **Particles.js**: Adds interactive particle backgrounds for visual appeal.
-   **Isotope.js**: Provides sorting and filtering functionality for job cards.
-   **JavaScript ES6+**: Core functionality and API handling using ES modules.
-   **MongoDB**: Stores user and job-related data via a backend connection.

## File Structure

### SCSS Organization

The styling for the application is organized using **SASS (SCSS)**. There are distinct `.scss` files for base layouts and page-specific styles, ensuring a clean and maintainable structure. Each page in the app has its own SCSS file for custom styling:

-   **Base SCSS**: For layout, global styles, and variables.
-   **Page-Specific SCSS**:
    -   `createJob.scss`
    -   `updateJob.scss`
    -   `dashboard.scss`
    -   `jobDetails.scss`
    -   `profile.scss`
    -   `login.scss/register.scss` (for login and register pages)

### Pages

The project is organized into a **Pages** folder, containing the main views of the application:

-   **Create Job Page**: Allows users to create a new job entry.
-   **Update Job Page**: Pre-fills job fields for editing.
-   **Dashboard**: Displays all jobs, with filtering and sorting options.
-   **Job Details Page**: Shows detailed information for a specific job.
-   **My Profile Page**: Displays and allows users to edit their profile, including photo and CV uploads.
-   **Login and Register Pages**: Handles user authentication.

### JavaScript Libraries

The frontend code includes various JS libraries that manage different aspects of the application:

-   **apiHandlers**: A custom library I created to better factor and categorize API calls using efficient design patterns. This improves the maintainability and clarity of the code.
-   **modalHandler**: Another custom library that centralizes the creation and management of customized modals. Each modal has its own context management system, making the UX more consistent.
-   **particlesWrapper**: A simple wrapper around the `Particles.js` library, which controls the particle effects used across various pages.

### Graphic Features

-   **Particles.js**: Adds particle animations on certain pages, giving the UI a modern and interactive feel.
-   **Isotope.js**: Used in the Dashboard to filter job cards by categories such as "CV Sent" or "Spontaneous Application", and to sort them in ascending or descending order.

## Main Features

1. **User Authentication**:

    - Register and Login pages with validations.
    - Syncs data with MongoDB.
    - JWT-based authentication.

2. **Profile Management**:

    - Users can upload a CV and profile picture during registration or update these details from the "My Profile" page.
    - Media files are stored on Cloudinary, and the backend handles the synchronization with MongoDB.

3. **Job Management**:

    - Create, update, and delete job entries.
    - Filter and sort jobs based on different categories.
    - Detailed job view for in-depth information.

4. **API Integration**:

    - The app is connected to a backend that manages job data, user authentication, and file uploads. The custom `apiHandlers` library ensures clean and efficient API interactions.
    - The application integrates with a REST API to manage user authentication and job data. It also handles file uploads for profile pictures and CVs into Cloudinary.
    - The API is categorized and managed through the custom apiHandlers library, which improves code modularity and reusability.

5. **Animations and UX Enhancements**:
   _The app includes several user experience enhancements:_

    - Loader Animations: Between view transitions, a loading animation provides feedback to the user.
    - Modal Management: Custom modals are handled via modalHandler, allowing context-aware popups across the app.
    - Page Transitions: Smooth transitions between views for an enhanced experience.
    - Isotope.js Filtering and Sorting: Allows users to sort and filter job entries dynamically on the dashboard.
