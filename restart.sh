cd backend/
npm ci
tsc
cd ../frontend/
yarn
yarn build
cd ../ai
pip3 install -r requirements.txt
pm2 start ./files/app.py --name "ai" --interpreter python3
cd ../backend/
pm2 start ./dist/app.js --name "server"
pm2 restart server
pm2 restart ai
sudo service nginx restart