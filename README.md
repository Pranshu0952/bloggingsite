# Social App (MERN)

## Run Backend

```
cd backend
npm install
cp .env.example .env # if you have one, or fill env vars as described below
npm run dev
```

Required env vars in `backend/.env`:

```
MONGO_URI=mongodb://localhost:27017/social_app
JWT_SECRET=your_jwt_secret_here
PORT=5000

# Optional Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## Run Frontend

```
cd frontend
npm install
npm run dev
```

The app expects the API at `http://localhost:5000/api` by default. You can set `VITE_API_URL` in `frontend/.env`.


