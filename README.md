# URL Shortener with Next.js and Prisma

This project is a **URL shortener application** built with **Next.js** and **Prisma**. It allows users to convert long URLs into custom or automatically generated short links. Additionally, it includes features to manage and view statistics of the generated links.

## 🚀 Project Description

This web application enables users to generate short links from long URLs, with the option to customize the short link identifier. It also includes a REST API for managing these links and querying statistics.

## ✨ Key Features

1. **Shorten URLs**:
   - Allows users to input a long URL and get a short link.
   - Option to customize the short link identifier.
2. **URL Management**:
   - Update existing short links.
   - Retrieve details of a link by its identifier.
3. **Statistics**:
   - Track the number of clicks on each short link.
4. **Link Expiration**:
   - Generated links are valid for 3 days.
5. **User-Friendly Interface**:
   - Clean and responsive design using **Tailwind CSS**.
   - Error page for expired or invalid links.
6. **REST API**:
   - Endpoints for creating, updating, retrieving, and redirecting links.

## 🌍 Production Demo

This project has been deployed on Vercel and is available at the following link:

🔗 [URL Shortener - Vercel Deployment](https://url-shortener-ckdknshk2-maria-rivs-projects.vercel.app/)

## 🛠️ Technologies Used

- **Frontend**: React with Next.js.
- **Backend**: Next.js API Routes.
- **Database**: PostgreSQL managed with **Prisma**.
- **Styling**: Tailwind CSS.
- **Dependency Management**: Node.js and NPM.

## 📂 Project Structure

```
📦 app
 ┣ 📂 api
 ┃ ┗ 📂 [shortUrl]           # Dynamic route for managing URL actions
 ┃    ┗ 📜 route.js          # Main file for handling routes in [shortUrl]
 ┃ ┣ 📂 generate       # Endpoint to generate a short link
 ┃ ┃ ┗ 📜 route.js     # Logic for creating a new short link
 ┃ ┣ 📂 getUrl         # Endpoint to retrieve link details
 ┃ ┃ ┗ 📜 route.js     # Logic for fetching short link information
 ┃ ┣ 📂 updateUrl      # Endpoint to update an existing short link
 ┃ ┃ ┗ 📜 route.js     # Logic for modifying short link information
 ┣ 📂 errorPage # Page to display errors (e.g., expired or invalid link)
 ┃ ┗ 📜 page.jsx            # Error page component
 ┣ 📂 moreInfo              # Page with additional project information
 ┃ ┗ 📜 page.jsx            # Component showing more details or usage instructions
 ┣ 📜 favicon.ico         # Website icon
 ┣ 📜 globals.css         # Global styles for the application
 ┣ 📜 layout.js           # Main layout wrapping all app pages
 ┗ 📜 page.jsx            # Main application page
📂 components
 ┣ 📜 Navbar.jsx          # Top navigation bar component
 ┗ 📜 StatsModal.jsx      # Modal component to display statistics (e.g., link clicks)
📂 lib
 ┣ 📜 db.js                  # Database configuration and connection using Prisma
 ┗ 📜 urlService.js          # Business logic for creating, updating, and querying URLs
📂 prisma
 ┗ 📜 schema.prisma          # Data model definition and Prisma ORM configuration

```

## 📦 Installation and Setup

### 🔧 Prerequisites

Ensure the following are installed on your machine:

- **Node.js** (>= 16)
- **NPM** or **Yarn**
- **PostgreSQL**

### 🔑 Database Configuration

This project uses **PostgreSQL** as the database, managed in the cloud with [Tembo.io](https://tembo.io/). To run it locally, you will need a security certificate provided by Tembo. In the cloud, the configuration is already managed through the `.env-example` file.

### ⚙️ Installing Dependencies

Clone the repository and navigate to the project folder:

```bash
# Clone the repository
git clone https://github.com/Maria-riv/url-shortener
cd url-shortener

# Install dependencies
npm install

```

Set up the `.env` file based on `.env-example` and define the database credentials.

### 🚀 Running Locally

To start the server in development mode:

```bash
npm run dev

```

To build the project for production:

```bash
npm run build

```

To start the server in production:

```bash
npm start

```

## 📜 Main Commands

| Command | Description |
| --- | --- |
| `npm install` | Installs project dependencies. |
| `npm run dev` | Starts the server in development mode. |
| `npm run build` | Builds the project for production. |
| `npm start` | Starts the server in production mode. |
| `npm run prisma:generate` | Generates the Prisma client. |
| `npm run prisma:deploy` | Applies database migrations. |

## 🏗️ Architecture

This project follows a **monolithic architecture based on Next.js**, where both the frontend and backend are integrated into the same application, leveraging Next.js API Routes for URL management.

## 📚 Data Model

The data model defined in the `schema.prisma` file describes a single entity called **Url**, which is used to manage shortened URLs. Below are the details of each field in the model:

### **Url** Model

- **id**:
   - **Type:** `Int`
   - **Description:** Unique identifier for each record.
   - **Properties:**
      - `@id`: Defines this field as the primary key.
      - `@default(autoincrement())`: The value is auto-generated and increments with each new record.
- **originalUrl**:
   - **Type:** `String`
   - **Description:** Stores the original URL to be shortened.
- **shortUrl**:
   - **Type:** `String`
   - **Description:** Stores the shortened version of the URL.
   - **Properties:**
      - `@unique`: This field must be unique in the database.
- **expiryDate**:
   - **Type:** `DateTime`
   - **Description:** Date and time when the shortened link expires.
- **clicks**:
   - **Type:** `Int`
   - **Description:** Stores the number of clicks the shortened URL has received.
   - **Properties:**
      - `@default(0)`: The initial value is 0.

## Relational Database Schema

| Field | Data Type |
| --- | --- |
| id | Int (PK, auto-increment) |
| originalUrl | String |
| shortUrl | String (unique) |
| expiryDate | DateTime |
| clicks | Int (default: 0) |

## 🌐 API Endpoints

Below are the API endpoints and their functionalities:

1. **Generate a Short URL**
   - **Path:** `/api/generate`
   - **Method:** `POST`
   - **Description:** Creates a new short URL from an original URL.
   - **Request Body:** Data required to generate the URL (e.g., `originalUrl` and optionally a custom identifier for `shortUrl`).
   - **Response:**
      - **Success (201):** Returns the shortened URL and its details.
      - **Error (400 or 500):** Corresponding error message.
2. **Update a Short URL**
   - **Path:** `/api/updateUrl`
   - **Method:** `PUT`
   - **Description:** Updates an existing short URL, allowing modifications to the original URL, short link, or expiration date.
   - **Request Body:** Data to update.
   - **Response:**
      - **Success (200):** Confirms the update and returns the updated URL.
      - **Error (400 or 500):** Corresponding error message.
3. **Retrieve URL Details**
   - **Path:** `/api/getUrl`
   - **Method:** `GET`
   - **Description:** Retrieves details of a short URL by its identifier.
   - **Query Parameters:**
      - `id`: The unique identifier of the URL.
   - **Response:**
      - **Success (200):** Returns the URL details.
      - **Error (400, 404, or 500):** Corresponding error message.
4. **Redirect a Short URL**
   - **Path:** `/api/[shortUrl]`
   - **Method:** `GET`
   - **Description:** Redirects the user to the original URL associated with the short link.
   - **Parameters:**
      - `shortUrl`: The unique identifier of the short link (dynamic part of the URL).
   - **Response:**
      - **Success (302):** Redirects to the original URL.
      - **Error (302):** Redirects to an error page if the link is invalid or expired.

### Route Summary

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/generate` | POST | Generate a new short URL. |
| `/api/updateUrl` | PUT | Update an existing short URL. |
| `/api/getUrl` | GET | Retrieve details of a short URL by its ID. |
| `/api/[shortUrl]` | GET | Redirect to the original URL from a short link. |

# 🚀💻 Technological Decisions and Technical Considerations

The choice of technologies used in this project was based on my personal experience and the specific requirements of the system. Given the limited requirements, adopting an overly complex and unnecessary stack would have been irresponsible, considering that in a real-world environment, economic and infrastructure resources are often constrained.

In this context, a simple solution using **Next.js** was proposed. The advantage of Next.js lies in its ability to manage both the frontend and a lightweight backend within the same framework, making it ideal for deployments in free and resource-limited environments. This allows for the construction of a compact and efficient full-stack application, avoiding the overhead of an overly broad technological ecosystem.

Additionally, **Prisma** was chosen as the ORM because it facilitates database migration and management in an agile and secure manner. Prisma enables robust and scalable handling of requests while maintaining high performance and reducing complexity in data management.

To organize the code and ensure its maintainability and scalability, a design pattern based on **Layered Architecture** was implemented. This approach, similar to the **Service Layer** pattern, clearly separates the business logic, database interaction, and application presentation. This separation simplifies optimization and code maintenance, ensuring that each component fulfills specific responsibilities without unnecessary coupling.

## 📚 Documentation and Support

If you need help or want to contribute, you can:

- Review the **Next.js** documentation: https://nextjs.org/docs
- Read about **Prisma**: https://www.prisma.io/docs
- Report issues in the **Issues** section of the repository.

## 👥 Authors

- María Luisa Rivera - Lead Developer

## 📜 License

This project is licensed under the MIT License. Feel free to modify and use it as you wish!