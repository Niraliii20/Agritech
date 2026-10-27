# AgriTech — Smart Farming Management System

> **Tagline:** *"Smart Farming, Better Tomorrow."*  
> **Mission:** Empowering Indian farmers by unifying hyper-local weather insights, crop lifecycle management, soil health scorecards, pest early warnings, certified agricultural inputs, and verified expert consultations into a single modern, responsive digital platform.

---

## 🌾 Overview & Features

AgriTech is a full-stack MERN agricultural platform tailored to the socio-economic and agro-climatic realities of Indian farmers:

1. **Modern Responsive Landing Page**:
   - Nature-inspired design palette: Forest Green (`#1B5E20`), Fresh Green (`#4CAF50`), Golden Yellow (`#FBC02D`), and Soft Off-White (`#F7F9F4`).
   - Feature showcases, 3-step farmer onboarding guide, clearly identified illustrative statistics, and demonstration testimonials.
2. **Multilingual Architecture (English & हिन्दी)**:
   - Dynamic i18n language toggle across all navigations, forms, cards, and agricultural advisories with local persistence.
3. **Role-Based Authentication & Security**:
   - Secure bcrypt password hashing and JWT token authorization.
   - Separate, protected Farmer and Administrator portals.
   - Public registration cannot create Administrator privileges without administrative authorization keys.
4. **Farmer Dashboard**:
   - Personalized greeting with farmer name, date, and district location.
   - Weather overview with real-time temperature, humidity, wind, and specialized spraying and irrigation advisories.
   - Active farm acreage metrics, crop lifecycle progression stepper, and soil health scorecard.
   - Regional pest alerts and agricultural task reminders.
5. **Farm Profile Management**:
   - Register multiple agricultural plots with area measurements in **Acres, Hectares, Bigha, and Guntha**.
   - Soil classification (Alluvial, Black, Red, Loamy, etc.) and irrigation method recording (Drip, Sprinkler, Tube Well, Canal).
   - Associated crop linking with cascade management.
6. **End-to-End Crop Management**:
   - Full CRUD tracking across 8 distinct agronomic growth stages: *Land Preparation → Sowing → Germination → Vegetative Growth → Flowering → Fruiting → Harvesting → Completed*.
   - Activity loggers for irrigation water depth, basal/top-dressing fertilizers, and field observations.
7. **Hyper-Local Weather & Agro-Advisory**:
   - Live OpenWeather API integration with a comprehensive demonstration agro-weather model covering major Indian agricultural hubs (Ludhiana, Pune, Nashik, Karnal, Varanasi, Nagpur, Jaipur, Indore).
   - Dedicated agricultural advisories: Irrigation timing, foliar spraying wind-speed windows, and harvest drying conditions.
8. **Soil Health Analysis & Agronomic Scorecard**:
   - Interactive diagnostic calculator for pH, Nitrogen (N), Phosphorus (P), Potassium (K), and Moisture (%).
   - Comparative Recharts data visualization benchmarking user values against ICAR soil standards.
   - Specific liming and gypsum recommendations for acidic/alkaline soils, plus target crop advisories.
   - Save and archive digital Soil Health Cards with historical review.
9. **Pest & Crop Disease Surveillance Center**:
   - Symptom-based preliminary diagnostic matching for Yellow Rust, Rice Blast, Pink Bollworm, Blights, and Sucking Pests.
   - Severity tags (**Low, Medium, High**) with IPM organic and scientific treatment protocols.
   - Follow-up treatment tracker to log chemical/biological spray results.
10. **Agricultural Input Marketplace & Demo Checkout**:
    - Catalog of certified seeds, water-soluble fertilizers, automated drip kits, and protective sprayers with prices in ₹.
    - Persistent shopping cart with real-time quantity adjustments.
    - Demonstration checkout flow with farm shipping address input and immediate order confirmation.
    - Order history with tracking statuses: *Pending → Confirmed → Processing → Shipped → Delivered*.
11. **Expert Consultation & Community Forum**:
    - Verified directory of agricultural scientists from PAU Ludhiana, MPKV Rahuri, and ICAR institutes.
    - Farmer consultation submission with status tracker and doctor response view.
    - Kisan Community Forum categorized by *Crop Management, Soil Health, Irrigation, Pest Control, Organic Farming, and Government Schemes* with upvotes and discussion comments.
12. **Administrator Control Panel**:
    - Aggregate platform metrics: Total farmers, active acreage, crops, orders, and consultations.
    - User account management with role modification (Farmer <-> Admin) and security auditing.
    - Marketplace inventory management (create, update pricing/stock, delete listings).
    - Order fulfillment dispatch tracking (update shipping stages).
    - Consultation reply manager (publish agronomic advisory responses).
    - Community forum content moderation.

---

## 🛠 Technology Stack

- **Frontend**:
  - React 19 with Vite
  - Tailwind CSS v4 with nature-inspired color theme
  - React Router DOM v7 for seamless client-side routing
  - Axios with interceptors for JWT token attachment
  - Lucide React for crisp agricultural and UI iconography
  - Recharts for interactive charts and soil nutrient comparisons
- **Backend**:
  - Node.js & Express.js
  - RESTful API design with centralized error handling and Morgan logging
  - Express Rate Limiting on authentication endpoints
  - JSON Web Tokens (JWT) & bcryptjs
  - OpenWeather API client with robust fallback simulation
- **Database**:
  - MongoDB with Mongoose ODM
  - Robust schemas with ObjectId cross-references, cascade cleanups, and validation

---

## 📁 Project Structure

```
agritech/
├── client/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── i18n/
│       │   ├── en.json
│       │   └── hi.json
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   ├── LanguageContext.jsx
│       │   └── CartContext.jsx
│       ├── services/
│       │   └── api.js
│       ├── components/
│       │   └── common/
│       │       ├── Navbar.jsx
│       │       ├── Footer.jsx
│       │       ├── Sidebar.jsx
│       │       ├── ProtectedRoute.jsx
│       │       ├── Modal.jsx
│       │       ├── LoadingSpinner.jsx
│       │       └── EmptyState.jsx
│       ├── layouts/
│       │   ├── PublicLayout.jsx
│       │   ├── FarmerLayout.jsx
│       │   └── AdminLayout.jsx
│       └── pages/
│           ├── public/ (HomePage, AboutPage, FeaturesPage, LoginPage, RegisterPage)
│           ├── farmer/ (DashboardPage, FarmsPage, FarmDetailPage, CropsPage, CropDetailPage, WeatherPage, SoilAnalysisPage, PestDiseasePage, MarketplacePage, ProductDetailPage, CartPage, OrdersPage, ExpertConsultationPage, CommunityPage, NotificationsPage, ProfilePage)
│           └── admin/ (AdminDashboardPage, UserManagementPage, ProductManagementPage, OrderManagementPage, ConsultationManagementPage, ContentModerationPage)
├── server/
│   ├── package.json
│   ├── server.js
│   ├── .env.example
│   ├── config/
│   │   ├── db.js
│   │   └── seed.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── adminAuth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Farm.js
│   │   ├── Crop.js
│   │   ├── SoilReport.js
│   │   ├── PestReport.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Expert.js
│   │   ├── Consultation.js
│   │   ├── CommunityPost.js
│   │   ├── Comment.js
│   │   ├── Notification.js
│   │   └── FarmingActivity.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── farmRoutes.js
│   │   ├── cropRoutes.js
│   │   ├── weatherRoutes.js
│   │   ├── soilRoutes.js
│   │   ├── pestRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── expertRoutes.js
│   │   ├── communityRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── adminRoutes.js
│   ├── services/
│   │   ├── weatherService.js
│   │   ├── soilAnalysisService.js
│   │   └── advisoryService.js
│   └── utils/
│       └── generateToken.js
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Installation & Setup Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher (Tested on Node.js v24)
- **MongoDB**: Running instance locally on port 27017 or a MongoDB Atlas URI

### 1. Clone & Configure Environment Variables
Inside `server/`, create a `.env` file (or copy from `.env.example`):

```bash
cd server
copy .env.example .env
```

Ensure the variables are set:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/agritech
JWT_SECRET=agritech_super_secret_jwt_key_2026_secure
JWT_EXPIRE=30d
OPENWEATHER_API_KEY=your_openweather_api_key_optional
ADMIN_CREATION_SECRET=agritech_admin_setup_secret_9981
```
*(Note: If `OPENWEATHER_API_KEY` is not provided, the platform automatically activates realistic Indian regional agro-weather demonstration models).*

### 2. Install Server Dependencies & Seed Data
```bash
# In server/
npm install
npm run seed
```
This populates realistic demo accounts, farms, crops, certified marketplace products, experts, and community discussions.

### 3. Install Client Dependencies
```bash
# In client/
npm install --legacy-peer-deps
```

### 4. Run the Project
**Start the Backend Server (Port 5000):**
```bash
cd server
npm start
```
*(Server will listen at `http://localhost:5000`)*

**Start the Frontend Client (Port 5173):**
```bash
cd client
npm run dev
```
*(Open `http://localhost:5173` in your browser)*

---

## 🔑 Demo Login Credentials

The database comes pre-seeded with two fully configured roles:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Demo Farmer** | `farmer@agritech.in` | `Farmer@123` | Rajesh Patel (Ludhiana, Punjab). Pre-seeded with 2 farms, 3 active crops, soil test card, active pest alert, and orders. |
| **Demo Administrator** | `admin@agritech.in` | `Admin@123` | AgriTech Admin. Full access to user permissions, inventory editing, order tracking, and expert queries. |

*(The Login page also features convenient **1-Click Quick Fill** buttons for both accounts).*

---

## 📡 API Reference & Example Requests

### 1. Authentication
- `POST /api/auth/register` — Register new farmer account
- `POST /api/auth/login` — Sign in and obtain JWT
  ```json
  // Request POST /api/auth/login
  {
    "email": "farmer@agritech.in",
    "password": "Farmer@123"
  }
  // Response
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": "...",
      "fullName": "Rajesh Patel",
      "role": "farmer"
    }
  }
  ```
- `GET /api/auth/me` — Retrieve current user profile (`Bearer <token>`)

### 2. Farm Profiles
- `GET /api/farms` — List farms owned by authenticated user
- `POST /api/farms` — Add farm plot
  ```json
  {
    "farmName": "Green Valley Agro Estate",
    "totalArea": 14.5,
    "areaUnit": "Acres",
    "state": "Punjab",
    "district": "Ludhiana",
    "soilType": "Loamy",
    "irrigationMethod": "Tube Well / Borewell"
  }
  ```
- `GET /api/farms/:id` — View farm details and associated crops
- `PUT /api/farms/:id` — Update farm details
- `DELETE /api/farms/:id` — Delete farm and cascade associated crops

### 3. Crops Lifecycle Management
- `GET /api/crops` — List farmer's crops
- `POST /api/crops` — Register crop on farm
  ```json
  {
    "farmId": "<farm_id>",
    "cropName": "Sharbati Wheat",
    "variety": "PBW-502 Certified",
    "category": "Cereal",
    "sowingDate": "2026-10-15",
    "fieldArea": 9.0,
    "growthStage": "Vegetative Growth"
  }
  ```
- `PUT /api/crops/:id` — Advance growth stage or update metrics
- `POST /api/crops/:id/activity` — Log irrigation, fertilizer, or field observation

### 4. Weather Intelligence
- `GET /api/weather?q=Ludhiana` — Get atmospheric parameters, 5-day forecast, and agricultural advisories

### 5. Soil Health Analysis
- `POST /api/soil/analyze` — Run calculation engine on pH and NPK values
- `POST /api/soil` — Save digital soil health card (`Bearer <token>`)
- `GET /api/soil` — Retrieve past soil reports

### 6. Pest Surveillance
- `POST /api/pest/diagnose` — Preliminary scientific diagnosis for symptoms
- `POST /api/pest` — Log observed pest or disease outbreak
- `PUT /api/pest/:id/treatment` — Record chemical/organic treatment applied

### 7. Marketplace & Orders
- `GET /api/products` — Catalog listing with category and search filter
- `POST /api/orders` — Place order (demonstration checkout flow)
- `GET /api/orders/my` — Farmer's order history

### 8. Administrator Telemetry
- `GET /api/admin/stats` — Platform metrics summary (`admin only`)
- `GET /api/admin/users` — List and audit accounts
- `PUT /api/admin/users/:id/role` — Update user role permissions

---

## ⚖️ Disclaimers & Fair Use

1. **Demonstration & Advisory Scope**: AgriTech is designed as an educational and farm management software prototype. Weather advice, pest symptom matching, and soil health ratings reflect standard agronomic reference models. Farmers should consult their local Krishi Vigyan Kendra (KVK) or official soil testing laboratory for statutory certification or large-scale financial commitments.
2. **Demonstration Checkout**: The marketplace uses a simulated checkout workflow. No real financial credentials or payment gateways are accessed.
3. **Illustrative Statistics**: Statistics on the landing page represent demonstration modeling and are clearly marked accordingly.

---

*AgriTech — Smart Farming, Better Tomorrow.*
