const express = require("express");
const { connect } = require("@hyperledger/fabric-gateway");
const { newGrpcConnection, newIdentity, newSigner } = require("./connect");
const { TextDecoder } = require("util");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
const utf8Decoder = new TextDecoder();

async function buildGateway() {
  const client = await newGrpcConnection();
  return connect({
    client,
    identity: await newIdentity(),
    signer: await newSigner(),
    evaluateOptions: () => {
      return { deadline: Date.now() + 5000 }; // 5 seconds
    },
    endorseOptions: () => {
      return { deadline: Date.now() + 15000 }; // 15 seconds
    },
    submitOptions: () => {
      return { deadline: Date.now() + 5000 }; // 5 seconds
    },
    commitStatusOptions: () => {
      return { deadline: Date.now() + 60000 }; // 1 minute
    },
  });
}

// Submit ESG data
app.post("/submitESGData", async (req, res) => {
  const { id, companyName, category, metricValue, submissionDate, fileHash } = req.body;

  try {
    const gateway = await buildGateway();
    const network = await gateway.getNetwork("mychannel");
    const contract = network.getContract("esg");

    await contract.submitTransaction(
      "submitESGData",
      id,
      companyName,
      category,
      metricValue,
      submissionDate,
      fileHash
    );
    gateway.close();

    res.status(200).send("ESG data submitted successfully");
  } catch (error) {
    console.trace();
    console.log(error);
    res.status(500).send(`Failed to submit ESG data: ${error}`);
  }
});

// Sign off ESG data (by an auditor)
app.post("/signOffESGData", async (req, res) => {
  const { id, auditorName } = req.body;

  try {
    const gateway = await buildGateway();
    const network = await gateway.getNetwork("mychannel");
    const contract = network.getContract("esg");

    await contract.submitTransaction("signOffESGData", id, auditorName);
    gateway.close();

    res.status(200).send("ESG data signed off successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send(`Failed to sign off ESG data: ${error}`);
  }
});

// Reject ESG data (by an auditor)
app.post("/rejectESGData", async (req, res) => {
  const { id, auditorName, reason } = req.body;

  try {
    const gateway = await buildGateway();
    const network = await gateway.getNetwork("mychannel");
    const contract = network.getContract("esg");

    await contract.submitTransaction("rejectESGData", id, auditorName, reason);
    gateway.close();

    res.status(200).send("ESG data rejected successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send(`Failed to reject ESG data: ${error}`);
  }
});

// Query ESG data by ID
app.get("/queryESGData", async (req, res) => {
  const { id } = req.query;

  console.log("Querying ESG data with ID:", id);

  try {
    const gateway = await buildGateway();
    const network = await gateway.getNetwork("mychannel");
    const contract = network.getContract("esg");

    const result = await contract.evaluateTransaction("queryESGData", id);
    gateway.close();

    const esgData = JSON.parse(utf8Decoder.decode(result));
    res.status(200).json(esgData);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Failed to query ESG data: ${error}`);
  }
});

// Query ESG data history by ID
app.get("/queryESGDataHistory", async (req, res) => {
  const { id } = req.query;

  try {
    const gateway = await buildGateway();
    const network = await gateway.getNetwork("mychannel");
    const contract = network.getContract("esg");

    const result = await contract.evaluateTransaction("getHistoryForRecord", id);
    gateway.close();

    const esgDataHistory = JSON.parse(utf8Decoder.decode(result));
    res.status(200).json(esgDataHistory);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Failed to query ESG data history: ${error}`);
  }
});

// Query all ESG data
app.get("/queryAllESGData", async (req, res) => {
  try {
    const gateway = await buildGateway();
    const network = await gateway.getNetwork("mychannel");
    const contract = network.getContract("esg");

    const result = await contract.evaluateTransaction("queryAllESGData");
    gateway.close();

    const allESGData = JSON.parse(utf8Decoder.decode(result));
    res.status(200).json(allESGData);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Failed to query all ESG data: ${error}`);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
