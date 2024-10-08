# Blockchain ESG System Demo

## Getting started

```bash
export PROJECT_HOME=$(pwd)

# Setup the blockchain network
cd fabric/test-network
./network.sh up createChannel
./network.sh deployCC -ccn esg -ccp ../chaincode -ccl javascript

cd $PROJECT_HOME/fabric/api
npm install
node app.js &

cd $PROJECT_HOME/client
npm install
npm run dev &
```
