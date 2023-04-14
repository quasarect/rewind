cd backend/
npm ci
tsc
cd ../frontend/
yarn
yarn build
sudo pm2 restart app