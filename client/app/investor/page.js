'use client';

import { Table, Button, Tag, Modal, Timeline, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';

const { Title, Paragraph } = Typography;

const InvestorView = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Fetch the ESG data from the backend
  useEffect(() => {
    fetchESGData();
  }, []);

  const fetchESGData = async () => {
    setLoading(true);

    try {
      const response = await axios.get('http://localhost:3001/queryAllESGData');
      setData(response.data.map((record) => record.value));
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch ESG data:', error);
      message.error('Failed to load ESG data.');
      setLoading(false);
    }
  };

  // Show modal with more details of the selected ESG record
  const showModal = (record) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: 'Company',
      dataIndex: 'companyName',
      key: 'companyName',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Metric Value',
      dataIndex: 'metricValue',
      key: 'metricValue',
    },
    {
      title: 'Submission Date',
      dataIndex: 'submissionDate',
      key: 'submissionDate',
    },
    {
      title: 'Blockchain Status',
      key: 'status',
      render: (text, record) => (
        <Tag color={record.status === 'Signed Off' ? 'green' : record.status === 'Rejected' ? 'red' : 'orange'}>
          {record.status}
        </Tag>
      ),
    },
    {
      title: 'Transaction ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
      render: (text) => <a href={`https://blockchain-explorer.com/tx/${text}`} target="_blank">{text}</a>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Button type="primary" onClick={() => showModal(record)}>
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Investor ESG Data View</Title>
      <Paragraph>
        As an investor, you can view verified ESG data along with relevant blockchain information such as transaction ID, block number, and verification status. Each record is immutably stored on the blockchain, providing transparency and trust in the data.
      </Paragraph>

      {/* ESG Data Table */}
      <Table dataSource={data} columns={columns} loading={loading} rowKey="key" />

      {/* Modal for detailed ESG data and blockchain info */}
      <Modal
        title="ESG Data Details"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        {selectedRecord && (
          <div>
            <Title level={4}>Details for {selectedRecord.companyName}</Title>
            <Paragraph>
              <strong>Category:</strong> {selectedRecord.category} <br />
              <strong>Metric Value:</strong> {selectedRecord.metricValue} <br />
              <strong>Submission Date:</strong> {selectedRecord.submissionDate} <br />
              <strong>Status:</strong> {selectedRecord.status} <br />
              <strong>Transaction ID:</strong> {selectedRecord.transactionId} <br />
              <strong>Block Number:</strong> {selectedRecord.blockNumber} <br />
            </Paragraph>

            <Title level={5}>Audit Trail</Title>
            <Timeline>
              <Timeline.Item>Data Submitted on {selectedRecord.submissionDate}</Timeline.Item>
              <Timeline.Item>Recorded on Blockchain at Block {selectedRecord.blockNumber}</Timeline.Item>
              {selectedRecord.status === 'Signed Off' && (
                <Timeline.Item color="green">Signed Off by Auditor</Timeline.Item>
              )}
              {selectedRecord.status === 'Rejected' && (
                <Timeline.Item color="red">Rejected by Auditor: {selectedRecord.rejectionReason}</Timeline.Item>
              )}
            </Timeline>

            <Button
              href={`https://blockchain-explorer.com/tx/${selectedRecord.transactionId}`}
              target="_blank"
              type="link"
            >
              View on Blockchain Explorer
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InvestorView;
