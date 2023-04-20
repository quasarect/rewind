cd backend/
npm ci
tsc
cd ../frontend/
yarn
yarn build
cd ../backend/
sudo pm2 restart app