'use client';

import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

const Introduction = () => {
  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={1}>Introduction to the ESG Blockchain Demo</Title>

      <Paragraph>
        This demo showcases the implementation of a blockchain-based system for managing Environmental, Social, and Governance (ESG) data submissions, auditing, and investor transparency using <strong>Hyperledger Fabric</strong> as the blockchain infrastructure. The system allows companies to submit ESG-related data, auditors to verify and sign off on the data, and investors to view verified data along with its blockchain provenance, ensuring transparency, trust, and immutability of the information.
      </Paragraph>

      <Title level={2}>Scope of the Demo</Title>
      <Paragraph>
        The demo illustrates the core functionality of a blockchain system designed to:
        <ul>
          <li><strong>Collect and record ESG data:</strong> Companies submit ESG metrics (e.g., carbon emissions, energy usage, governance scores), which are stored immutably on the blockchain.</li>
          <li><strong>Audit and verify ESG data:</strong> Auditors can review submitted data, sign off or reject it, and ensure the information is accurate and reliable.</li>
          <li><strong>Provide transparent access to investors:</strong> Investors can access verified ESG data, along with its blockchain transaction history, ensuring data provenance and integrity.</li>
        </ul>
      </Paragraph>

      <Title level={2}>Scenario</Title>
      <Paragraph>
        In this scenario, a company named <strong>GreenCo</strong> submits its ESG data for the year 2024. An auditor named <strong>GreenAudit</strong> then verifies the data and signs off on it, marking it as valid and accurate. Meanwhile, an investor views the ESG data through a user-friendly interface, allowing them to see not only the data itself but also its verification status and blockchain transaction details. This ensures the investor can trust that the information is immutable and has been verified by a trusted party.
      </Paragraph>

      <Title level={2}>Features and Functions</Title>
      <Title level={3}>1. Submit ESG Data (GreenCo Tab)</Title>
      <Paragraph>
        <strong>User:</strong> Company representatives.
        <br />
        <strong>Description:</strong> Companies can submit their ESG metrics, including categories like carbon emissions, energy usage, or governance scores. This demo lets companies submit via a simple form. Submission can be easily extended to integrate with existing data sources or APIs.
        <br />
        <strong>Blockchain Integration:</strong> Once submitted, the ESG data is stored immutably on the blockchain, ensuring no tampering or alterations.
        <br />
        <strong>Frontend Integration:</strong> The company fills in the details in the <em>Submit ESG Data</em> form and submits it. This triggers an API call to the backend to store the data on the blockchain.
      </Paragraph>

      <Title level={3}>2. Audit ESG Data (GreenAudit Tab)</Title>
      <Paragraph>
        <strong>User:</strong> Auditors.
        <br />
        <strong>Description:</strong> Auditors are responsible for reviewing and verifying the ESG data submitted by companies. They can either <em>sign off</em> on the data, marking it as valid, or <em>reject</em> it if there are discrepancies or insufficient data quality.
        <br />
        <strong>Blockchain Integration:</strong> Auditors’ decisions (sign off or rejection) are recorded on the blockchain, along with any reasons provided for rejection, ensuring that a clear audit trail exists.
        <br />
        <strong>Frontend Integration:</strong> The auditor sees a list of all pending ESG data submissions. They can click to sign off or reject any submission, and their action is recorded on the blockchain.
      </Paragraph>

      <Title level={3}>3. Investor View (Investor Tab)</Title>
      <Paragraph>
        <strong>User:</strong> Investors or stakeholders.
        <br />
        <strong>Description:</strong> Investors can view all ESG data. They can access detailed records of each ESG submission, including the company’s name, the category of the data (e.g., carbon emissions), and the submission status (verified, rejected, or pending).
        <br />
        <strong>Blockchain Integration:</strong> Each ESG data record is linked to a blockchain transaction ID, which can be viewed on a blockchain explorer for further verification. This provides investors with confidence in the data’s immutability and provenance.
        <br />
        <strong>Frontend Integration:</strong> The investor can view the data in a table format with key details like transaction ID, status, and audit trail. Clicking on "View Details" provides more in-depth information.
      </Paragraph>

      <Title level={2}>API Endpoints and Interactions</Title>
      <Paragraph>
        The backend API serves as the bridge between the frontend user interactions and the Hyperledger Fabric blockchain. The following key API endpoints are used:
        <ul>
          <li><strong>POST `/submitESGData`:</strong> Submits ESG data to the blockchain.</li>
          <li><strong>POST `/signOffESGData`:</strong> Auditors sign off on a specific ESG data record.</li>
          <li><strong>POST `/rejectESGData`:</strong> Auditors reject an ESG data record with a reason.</li>
          <li><strong>GET `/queryAllESGData`:</strong> Fetches all ESG data records for auditing or viewing purposes.</li>
          <li><strong>GET `/queryESGData`:</strong> Retrieves a specific ESG data record by its ID for detailed viewing.</li>
          <li><strong>GET `/queryESGDataHistory`:</strong> Fetches the audit trail history of a specific ESG data record.</li>
        </ul>
      </Paragraph>

      <Title level={2}>User Roles</Title>
      <Paragraph>
        <ul>
          <li><strong>Company Representative:</strong> Submits ESG data, ensuring that the company is compliant with reporting standards.</li>
          <li><strong>Auditor:</strong> Reviews the submitted data and determines its validity, either signing it off or rejecting it based on its accuracy.</li>
          <li><strong>Investor:</strong> Views ESG data with full transparency and confidence, knowing that the data has been verified and stored immutably on the blockchain.</li>
        </ul>
      </Paragraph>

      <Title level={2}>Hyperledger Fabric Blockchain Setup</Title>
      <Paragraph>
        The <strong>Hyperledger Fabric setup</strong> for this demo involves a <strong>two-organization network</strong> where each organization represents a key participant in the ESG data lifecycle: one for companies submitting ESG data and another for auditors verifying and signing off on that data.
      </Paragraph>
      <Paragraph>
        The blockchain is built on Hyperledger Fabric's permissioned framework, meaning only authenticated participants can interact with the blockchain. This setup utilizes <strong>peer nodes</strong> for each organization, which are responsible for simulating and endorsing transactions. The <strong>Orderer</strong> component (can be operated by governmants, not shown in this demo) in the network handles the ordering of transactions into blocks and their final commitment to the ledger.
      </Paragraph>
      <Paragraph>
        The core functionality is driven by the <strong>ESG chaincode</strong>, written in JavaScript, that defines smart contract logic for submitting, auditing, and querying ESG data. The chaincode provides three key functions:
        <ul>
          <li><strong>submitESGData:</strong> Allows companies to submit ESG-related metrics (e.g., carbon emissions, energy usage). This function ensures the submitted data is securely stored on the ledger. Automated data quality inspection can be implemented here.</li>
          <li><strong>signOffESGData:</strong> Allows auditors to review and sign off on submitted ESG data, marking it as verified. This action is recorded immutably on the blockchain, providing transparency and accountability.</li>
          <li><strong>rejectESGData:</strong> Allows auditors to reject data submissions if discrepancies are found, recording the rejection reason in the blockchain for audit purposes.</li>
        </ul>
      </Paragraph>
      <Paragraph>
        The <strong>peer nodes</strong> across the organizations are configured with endorsement policies to ensure that each transaction requires approval from both organizations before being committed to the blockchain. This ensures that the data verification process involves both company and auditor approvals. Each transaction is recorded with its <strong>transaction ID</strong> and <strong>block number</strong>, providing an immutable audit trail that investors can verify using blockchain explorers (not used in this demo).
      </Paragraph>
      <Paragraph>
        You can see the real-time logs generated by the two peer nodes in the <strong>Blockchain Logs</strong> tab, which provides details on the network's operations, including block processing, chaincode execution, and transaction validations.
      </Paragraph>
    </div>
  );
};

export default Introduction;
