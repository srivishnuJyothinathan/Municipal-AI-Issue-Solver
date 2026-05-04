# 🏙️ Municipal Issue Priority Solver

An AI-powered smart municipal complaint management system that helps citizens report issues and enables authorities to prioritize and resolve them efficiently.

---

## 🚀 Features

### 👤 User Side

* Submit complaints (water, garbage, roads, etc.)
* Upload location
* Track complaint status (Pending → In Progress → Resolved)

### 🤖 AI Priority Prediction

* Uses Machine Learning to classify complaints:

  * 🔴 High Priority
  * 🟡 Medium Priority
  * 🟢 Low Priority
* NLP-based text analysis (TF-IDF)
* Rule-based boosting for urgent keywords

### 🛠️ Admin Dashboard

* View all complaints with priority sorting
* Assign workers
* Update complaint status
* Real-time monitoring

### 📊 Analytics Dashboard

* Complaint categories visualization
* Priority distribution (Pie chart)
* Complaints over time (Line graph)
* Location-based heatmaps

---

## 🏗️ Project Structure

```
backend/
│── crud.py
│── database.py
│── main.py
│── ml_engine.py
│── models.py
│── schemas.py
│── municipal.db
│── requirements.txt

frontend/
│── src/
│   ├── pages/
│   │   ├── AdminDashboard.jsx
│   │   ├── UserDashboard.jsx
│   │   ├── SubmitComplaint.jsx
│   │   ├── Login.jsx
│   ├── api.js
│   ├── App.jsx
│   ├── main.jsx
│── public/
│── package.json
│── vite.config.js
```

---

## ⚙️ Tech Stack

### Backend

* Python
* FastAPI
* SQLite (municipal.db)
* Scikit-learn (ML model)

### Frontend

* React (Vite)
* CSS / Custom UI

---

## 🧠 Machine Learning

* Algorithm: Logistic Regression
* Text Processing: TF-IDF Vectorizer
* Input:

  * Complaint description
  * Category
* Output:

  * Priority level

---

## 🛠️ Installation & Setup

### 🔹 Clone the Repository

```bash
git clone https://github.com/your-username/municipal-issue-solver.git
cd municipal-issue-solver
```

---

### 🔹 Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Mac/Linux
venv\Scripts\activate      # Windows

pip install -r requirements.txt
uvicorn main:app --reload
```


---

### 🔹 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```


---

## 🔗 API Endpoints (Sample)

| Method | Endpoint         | Description             |
| ------ | ---------------- | ----------------------- |
| POST   | /complaints      | Submit complaint        |
| GET    | /complaints      | Get all complaints      |
| PUT    | /complaints/{id} | Update status           |
| POST   | /predict         | Get priority prediction |

---

## 📸 Screenshots

* User Complaint Submission
* Admin Dashboard
* AI Priority Prediction
* Analytics Dashboard
  <img width="1470" height="956" alt="Screenshot 2026-05-04 at 10 32 24 PM" src="https://github.com/user-attachments/assets/86467016-cefc-41f6-84fe-68da8b119dad" />
  <img width="1470" height="956" alt="Screenshot 2026-05-04 at 10 32 04 PM" src="https://github.com/user-attachments/assets/a1178b65-2cad-479f-9a74-b17af6a2bc50" />






---

---

## 🧑‍💻 Author

**Your Name**

---

## 📄 License

This project is for educational purposes.
