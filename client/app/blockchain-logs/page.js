'use client';

import { Typography } from 'antd'; // Import Typography components
const { Paragraph } = Typography; // Destructure Paragraph from Typography
import { useEffect, useState, useRef } from 'react';
import Terminal from 'react-terminal-ui'; // Import the Terminal component

// Helper function to get the appropriate color for log messages
const getLogStyle = (logMessage) => {
  if (logMessage.toLowerCase().includes('error')) {
    return { color: 'red', fontWeight: 'bold', fontSize: '12px' }; // Smaller font size
  } else if (logMessage.toLowerCase().includes('warn')) {
    return { color: 'yellow', fontWeight: 'bold', fontSize: '12px' }; // Smaller font size
  } else if (logMessage.toLowerCase().includes('info')) {
    return { color: 'cyan', fontSize: '12px' }; // Smaller font size
  } else {
    return { color: 'white', fontSize: '12px' }; // Default color with smaller font size
  }
};

const BlockchainLogsTerminal = () => {
  const [org1Logs, setOrg1Logs] = useState([]); // Store logs for Org1
  const [org2Logs, setOrg2Logs] = useState([]); // Store logs for Org2
  const logsEndRef1 = useRef(null); // Ref for scrolling Org1 logs
  const logsEndRef2 = useRef(null); // Ref for scrolling Org2 logs

  // Function to scroll to the bottom for Org1
  const scrollToBottom1 = () => {
    logsEndRef1.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Function to scroll to the bottom for Org2
  const scrollToBottom2 = () => {
    logsEndRef2.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Function to fetch logs from the API for Org1 (on page load/refresh)
  const fetchOrg1Logs = async () => {
    try {
      const response = await fetch('/api/logs/org1');
      const data = await response.json();
      setOrg1Logs(data.logs); // Set logs on initial load
    } catch (error) {
      console.error('Error fetching Org1 logs:', error);
    }
  };

  // Function to fetch logs from the API for Org2 (on page load/refresh)
  const fetchOrg2Logs = async () => {
    try {
      const response = await fetch('/api/logs/org2');
      const data = await response.json();
      setOrg2Logs(data.logs); // Set logs on initial load
    } catch (error) {
      console.error('Error fetching Org2 logs:', error);
    }
  };

  // Fetch Org1 logs on component mount (only once)
  useEffect(() => {
    fetchOrg1Logs();
  }, []);

  // Fetch Org2 logs on component mount (only once)
  useEffect(() => {
    fetchOrg2Logs();
  }, []);

  // Scroll to bottom whenever org1Logs changes
  useEffect(() => {
    if (org1Logs.length) {
      setTimeout(() => {
        console.log('Scrolling to bottom for Org1');
        scrollToBottom1();
      }, 2000); // 100ms delay ensures smooth transition
    }
  }, [org1Logs]);

  // Scroll to bottom whenever org2Logs changes, with a small delay
  useEffect(() => {
    if (org2Logs.length) {
      // Add a slight delay to allow independent scrolling
      setTimeout(() => {
        console.log('Scrolling to bottom for Org2');
        scrollToBottom2();
      }, 2500); // 100ms delay ensures smooth transition
    }
  }, [org2Logs]);

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{textAlign: "center"}}>Blockchain Logs</h1>

      <Paragraph>
        This page displays real-time logs generated by the Hyperledger Fabric network. The logs provide valuable insights into the operations of the network's components, including peers, orderers, and chaincode transactions. Common log levels include INFO for standard operations, WARN for potential issues, and ERROR for critical problems. For example, WARN logs might indicate temporary communication failures with the orderer, while INFO logs often confirm successful block processing and transaction commitments. Logs are structured with timestamps, log levels, and detailed messages that help monitor network health. You can observe activities like the reception and validation of blocks, execution of chaincode, and membership changes in the network.
      </Paragraph>

      {/* Terminal UI for Org1 Logs */}
      <div style={{ marginBottom: '20px' }}>
        <Terminal name="Org1 (GreenCo) Blockchain Logs" height="400px" width="100%" prompt={false}>
          {org1Logs.map((log, index) => (
            <div key={index} style={getLogStyle(log)}>{log}</div> // Render each line with appropriate styling
          ))}
          {/* This div ensures we scroll to the bottom */}
          <div ref={logsEndRef1} />
        </Terminal>
      </div>

      {/* Terminal UI for Org2 Logs */}
      <div>
        <Terminal name="Org2 (GreenAudit) Blockchain Logs" height="400px" width="100%" prompt={false}>
          {org2Logs.map((log, index) => (
            <div key={index} style={getLogStyle(log)}>{log}</div> // Render each line with appropriate styling
          ))}
          {/* This div ensures we scroll to the bottom */}
          <div ref={logsEndRef2} />
        </Terminal>
      </div>
    </div>
  );
};

export default BlockchainLogsTerminal;
