# Backend (Node.js + Express + MongoDB)

## Setup

1. Copy `.env` and fill in your values:

```
MONGO_URI=mongodb://localhost:27017/social_app
JWT_SECRET=your_jwt_secret_here
PORT=5000

# Optional (for Cloudinary uploads)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

2. Install dependencies and run:

```
npm install
npm run dev
```

The server will start at `http://localhost:5000`.


