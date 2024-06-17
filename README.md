<p align="center">
  <img src="https://img.icons8.com/?size=512&id=43665&format=png&color=000000" width="100">
  <img src="https://img.icons8.com/?size=512&id=UeyNgv1VXSvl&format=png&color=000000" width="100">  
</p>
<p align="center">
    <h1 align="center">Pixshare Social App</h1>
</p>
<p align="center">
    <em>A full-stack web app featuring social interactions through image sharing.</em>
</p>
<p align="center">
    <img src="https://img.shields.io/github/license/katgithb/pix-share-social-app-fullstack-react-springboot?style=flat&logo=opensourceinitiative&logoColor=white&color=0080ff" alt="license">
    <img src="https://img.shields.io/github/last-commit/katgithb/pix-share-social-app-fullstack-react-springboot?style=flat&logo=git&logoColor=white&color=0080ff" alt="last-commit">
    <img src="https://img.shields.io/github/languages/top/katgithb/pix-share-social-app-fullstack-react-springboot?style=flat&color=0080ff" alt="repo-top-language">
    <img src="https://img.shields.io/github/languages/count/katgithb/pix-share-social-app-fullstack-react-springboot?style=flat&color=0080ff" alt="repo-language-count">
<p>
<p align="center">
        <em>Developed with the software and tools below.</em>
</p>
<p align="center">    
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=JavaScript&logoColor=black" alt="JavaScript">
    <img src="https://img.shields.io/badge/Vite-646CFF.svg?style=flat&logo=Vite&logoColor=white" alt="Vite">
    <img src="https://img.shields.io/badge/React-61DAFB.svg?style=flat&logo=React&logoColor=black" alt="React">
    <img src="https://img.shields.io/badge/Redux-764ABC.svg?style=flat&logo=redux&logoColor=white" alt="Redux">
    <img src="https://img.shields.io/badge/React_Router-CA4245.svg?style=flat&logo=react-router&logoColor=white" alt="React Router">
    <img src="https://img.shields.io/badge/Axios-5A29E4.svg?style=flat&logo=Axios&logoColor=white" alt="Axios">
    <br> 
    <img src="https://img.shields.io/badge/Java-ED8B00.svg?style=flat&logo=openjdk&logoColor=black" alt="Java">
    <img src="https://img.shields.io/badge/Spring_Boot-6DB33F.svg?style=flat&logo=spring-boot&logoColor=white" alt="Spring Boot">
    <img src="https://img.shields.io/badge/JPA-Hibernate-59666C.svg?style=flat&logo=hibernate&logoColor=white" alt="JPA-Hibernate">
    <img src="https://img.shields.io/badge/JWT-3BBAF1.svg?style=flat&logo=jsonwebtokens&logoColor=white" alt="JWT">
    <img src="https://img.shields.io/badge/PostgreSQL-336791.svg?style=flat&logo=postgresql&logoColor=white" alt="PostgreSQL">
    <br>   
    <img src="https://img.shields.io/badge/Docker-2496ED.svg?style=flat&logo=Docker&logoColor=white" alt="Docker">
    <img src="https://img.shields.io/badge/Git-F05032.svg?style=flat&logo=git&logoColor=white" alt="Git">
    <img src="https://img.shields.io/badge/GitHub%20Actions-2088FF.svg?style=flat&logo=GitHub-Actions&logoColor=white" alt="GitHub Actions">
    <img src="https://img.shields.io/badge/JUnit-25A162.svg?style=flat&logo=junit5&logoColor=white" alt="JUnit">
    <img src="https://img.shields.io/badge/Testcontainers-3186A1.svg?style=flat&logo=linuxcontainers&logoColor=white" alt="Testcontainers">
</p>

<br><!-- TABLE OF CONTENTS -->

<details>
  <summary>Table of Contents</summary><br>

- [📕 Overview](#-overview)

- [⭐ Features](#-features)

- [🧩 Architecture](#-architecture)

- [🚀 Getting Started](#-getting-started)

    - [⚙️ Running App Locally](#️-running-app-locally)
    - [📖 Usage](#-usage)
    - [🧪 Tests](#-tests)

- [📄 License](#-license)

- [👏 Acknowledgments](#-acknowledgments)

  </details>
  <hr>

## 📕 Overview

Pixshare is a robust social media platform that enables seamless sharing of images and community
interaction. Its core feature is an extensive feed of user-generated content where users can upload,
view, and engage with shared images. The platform fosters a vibrant community where individuals can
showcase their creativity, connect with others, share their perspectives through comments and
reactions, and discover inspiring content. It leverages React for the frontend and Spring Boot for
the backend, offering a user-friendly and scalable platform for image sharing and social engagement.

---

## ⭐ Features

- **User Authentication:** Sign up and log in securely using JWT tokens to access the platform's
  features.
- **User Profiles**: Create and customize your profile to showcase yourself and your interests.
- **Image Sharing and Management**: Upload and share images with your followers, and easily delete
  them when needed.
- **Follow System**: Follow users who pique your interest to see their content in your personalized
  feed. Share engaging posts to grow your own audience and attract new followers.
- **Feed and Discover**: Explore a feed of images from those you follow, and discover new interests
  and inspiring content from the community.
- **Likes and Comments**: Leave likes and comments on posts to share your thoughts, and spark
  conversations with creators and the community.
- **Responsive Design**: Optimized for both desktop and mobile screens, providing a seamless and
  functional experience across various devices.

---

## 🧩 Architecture

The application utilizes a client-server architecture with React for the frontend and Spring Boot
for the backend. It follows a clear separation of concerns and uses a RESTful API for communication
between the frontend and backend.

### Frontend

- **Framework**: React
- **UI Component Library**: Chakra UI
- **State Management**: Redux Toolkit
- **Routing**: React Router
- **HTTP Client**: Axios
- **Build Tool**: Vite

### Backend

- **Framework**: Spring Boot
- **Database**: PostgreSQL
- **ORM**: Hibernate
- **Security**: Spring Security with JWT
- **Testing**: JUnit, Mockito, Testcontainers
- **Build Tool**: Maven

### DevOps

- Docker (Containerization)
- GitHub Workflows (CI/CD pipelines using GitHub Actions)

---

## 🚀 Getting Started

**Prerequisites**

- Node.js: `v18.17.x or later`
- npm or yarn
- Java Development Kit (JDK): `v17 or later`
- PostgreSQL: `v15 or later`
- Docker
- Git

### ⚙️ Running App Locally

> Clone the repository:
>
> ```console
> $ git clone https://github.com/katgithb/pix-share-social-app-fullstack-react-springboot.git
> ```

> Navigate to the project directory:
>
> ```console
> $ cd pix-share-social-app-fullstack-react-springboot
> ```

> Create the `.env` files:
>
> * In the project root directory, copy the template file `.env.example` to a new file named `.env`
    for backend and database configuration.
> * In the frontend directory, copy the template file `.env.example` to `.env` for frontend
    configuration.
> * Refer to the comments and instructions provided within the `.env.example` file for guidance on
    setting the properties.

<h4>Configure <code>PostgreSQL Database</code></h4>

> 1. Create **pixshare_db** and **pixshare_test_db** databases in your locally installed PostgreSQL
     instance.
>
> 2. Populate the `.env` file (in project root folder):
     >
     >    * Replace the placeholder values in the `.env` file with your actual database credentials
     and Spring Datasource configuration details for both the `pixshare_db` and `pixshare_test_db`
     databases.
>
> 3. You can use Docker Compose to set up and start containers for **pixshare_db** and *
     *pixshare_test_db** databases, instead of creating those databases in your local PostgreSQL
     instance:
     >
     >    ```console
     > $ docker-compose up -d db test-db
     >    ```

     >
     >    **Note:** Ensure the `.env` file (located in the project root) contains all necessary database credentials (username, password) and Spring Datasource configuration for *pixshare_db* and *pixshare_test_db* before running the above Docker Compose command to avoid errors.

<h4>Setup <code>Backend</code></h4>

> 1. Populate the `.env` file (in project root folder):
     >
     >    * Fill in the remaining placeholders in the `.env` file with the values specific to your
     desired configuration.
>
> 2. In the project root, navigate to the backend directory:
     >
     >    ```console
     > $ cd backend
     >    ```
>
> 3. Build and run the backend:
     >
     >    ```console
     > $ ./mvnw spring-boot:run
     >    ```
>
> 4. The backend will be available at `http://localhost:8081`.

<h4>Setup <code>Frontend</code></h4>

> 1. In the project root, navigate to the frontend directory:
     >
     >    ```console
     > $ cd frontend
     >    ```
>
> 2. Populate the `.env` file (in frontend folder):
     >
     >    * In the `.env` file, replace placeholders with your backend API configuration and other
     relevant frontend configurations.
>
> 3. Install the dependencies:
     >
     >    ```console
     > $ npm install
     >    ```
>
> 4. Start the development server:
     >
     >    ```console
     > $ npm run dev
     >    ```
>
> 5. The frontend will be available at `http://localhost:5173`.

### 📖 Usage

> To use the application, open your browser and access the frontend interface
> at `http://localhost:5173`. Ensure the backend server is running at `http://localhost:8081` to
> enable API interactions.

### 🧪 Tests

<h4>Backend</h4>

> Run the test suite for backend using the commands below:
>
> ```console
> $ cd backend
> $ ./mvnw test
> ```

---

## 📄 License

This project is licensed under the [GNU GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html)
License. For more details, refer to
the [LICENSE](https://github.com/katgithb/pix-share-social-app-fullstack-react-springboot/blob/main/LICENSE)
file.

---

## 👏 Acknowledgments

- This project was inspired by the need for a simple and intuitive platform for sharing images and
  fostering social interactions.
- Special thanks to the open-source community for providing the tools and frameworks that made this
  project possible.

<p align="right">
  <a href="#-overview"><b>Return</b></a>
</p>

---