# Blockchain ESG System Demo

## Getting started

```bash
export PROJECT_HOME=$(pwd)

# Setup the blockchain network
# Check hyperledger fabric website for prerequisites (e.g., docker)
cd fabric/test-network
./network.sh up createChannel
./network.sh deployCC -ccn esg -ccp ../chaincode -ccl javascript
# To cleanup
# ./network.sh down

# Start the blockchain API
cd $PROJECT_HOME/fabric/api
npm install
node app.js

# Start web client
cd $PROJECT_HOME/client
npm install
npm run dev

# Available at http://localhost:3000
```
