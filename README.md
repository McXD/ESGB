# Blockchain ESG System Demo

## Getting started

```bash
PROJECT_HOME = $(pwd)

# Setup the blockchain network
cd fabric/test-network
./network.sh up creatChannel
./network.sh deployCC -ccn esg -ccp ../chaincode -ccl javascript

cd $PROJECT_HOME
cd fabric/api
npm install
node app.js

cd $PROJECT_HOME
cd client
npm install
npm run dev
```
