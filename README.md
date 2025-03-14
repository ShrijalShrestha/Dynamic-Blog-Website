# 📝 Dynamic Blog Website  
A **full-stack blog website** where users can **create, edit, delete, and view blog posts**. Users need to **register and log in** to manage their own posts. The project is built with **Node.js, Express, MongoDB, EJS, and Bootstrap**.

🌍 **Live Demo**: [Dynamic Blog Website](https://dynamicblogwebsite.azurewebsites.net/home)

---

## 🚀 Features  
✅ **User Authentication** (Login & Register)  
✅ **Create, Edit, Delete Blog Posts**  
✅ **User-Specific Profiles & Posts**  
✅ **Category-Based Post Filtering**  
✅ **Responsive UI with Bootstrap**  
✅ **Secure Session-Based Authentication**  

---

## 🛠 Tech Stack  
- **Backend**: Node.js, Express.js, MongoDB, Mongoose  
- **Frontend**: EJS, Bootstrap, CSS  
- **Authentication**: Express-Session, bcrypt  
- **Templating**: EJS (Embedded JavaScript)  
- **Database**: MongoDB (Atlas or Local)  

---

## 📌 Setup & Installation  

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/YOUR_USERNAME/blog-website.git
cd blog-website
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Setup Environment Variables
```sh
PORT=8080
MONGO_URL=your_mongodb_connection_string
SECRET_KEY=your_secret_key
```

### 4️⃣ Run the Server
```sh
node app.js
```

---

```plaintext
📂 Dynamic Blog Website
 ┣ 📂 models
 ┃ ┣ 📜 list.js
 ┃ ┣ 📜 user.js
 ┣ 📂 views
 ┃ ┣ 📂 includes
 ┃ ┃ ┣ 📜 navbar.ejs
 ┃ ┃ ┣ 📜 footer.ejs
 ┃ ┣ 📜 home.ejs
 ┃ ┣ 📜 new.ejs
 ┃ ┣ 📜 login.ejs
 ┃ ┣ 📜 register.ejs
 ┃ ┣ 📜 profile.ejs
 ┃ ┣ 📜 show.ejs
 ┃ ┣ 📜 edit.ejs
 ┃ ┣ 📂 includes
 ┃ ┃ ┣ 📜 boilerplate.ejs
 ┣ 📂 public
 ┃ ┣ 📜 style.css
 ┣ 📜 .env
 ┣ 📜 .gitignore
 ┣ 📜 package.json
 ┣ 📜 app.js
 ┣ 📜 README.md
```

## 🌟 Features in Detail  

### 1️⃣ User Authentication  
- Users can **register, log in, and log out** securely.  
- **Session-based authentication** using `express-session` & `bcrypt`.  

### 2️⃣ Blog Management  
- Users can **create, edit, delete** their own posts.  
- Each post is **linked to its author**.  

### 3️⃣ Profile Page  
- Users can **view only their own posts** on their profile.  

### 4️⃣ Category Filtering  
- Posts are displayed by **categories** (Tech, Food, Travel, etc.).  
- **Bootstrap tab navigation** allows quick filtering.  

### 5️⃣ Mobile-Friendly UI  
- Built with **Bootstrap 5** for responsiveness.  

