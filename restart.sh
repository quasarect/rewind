cd backend/
npm ci
tsc
cd ../frontend/
yarn
yarn build
cd ../backend/
pm2 start ./dist/app.js --name "server"
pm2 restart server