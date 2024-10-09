'use client';

import { Table, Button, Tag, Modal, Timeline, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FilePdfOutlined } from '@ant-design/icons'; // Import the PDF icon


const { Title, Paragraph } = Typography;

const InvestorView = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [history, setHistory] = useState([]); // Store history

  // Fetch the ESG data from the backend
  useEffect(() => {
    fetchESGData();
  }, []);

  const fetchESGData = async () => {
    setLoading(true);

    try {
      const response = await axios.get('/api/proxy/queryAllESGData');
      setData(response.data.map((record) => record.value));
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch ESG data:', error);
      message.error('Failed to load ESG data.');
      setLoading(false);
    }
  };

  // Fetch ESG data history for the selected record
  const fetchESGDataHistory = async (recordId) => {
    try {
      const response = await axios.get(`/api/proxy/queryESGDataHistory?id=${recordId}`);
      setHistory(response.data); // Set the history data
    } catch (error) {
      console.error('Failed to fetch ESG data history:', error);
      message.error('Failed to load ESG data history.');
    }
  };

  // Show modal with more details of the selected ESG record
  const showModal = async (record) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
    await fetchESGDataHistory(record.id); // Fetch history when modal opens
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setHistory([]); // Clear history when modal closes
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
      title: 'File',
      key: 'file',
      render: (text, record) => (
        <a href={`/api/download/${record.id}.pdf`} target="_blank" rel="noopener noreferrer">
          <FilePdfOutlined style={{ fontSize: '24px', color: '#ff4d4f' }} />
        </a>
      ),
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
    <div style={{ maxWidth: '1000px',
      margin: '0 auto',
      padding: '24px',
     }}>
      <h2 style={{textAlign: 'center'}}>Investor ESG Data View</h2>
      <Paragraph>
        As an investor, you can view verified ESG data along with relevant blockchain information such as transaction ID, and verification status. Each record is immutably stored on the blockchain, providing transparency and trust in the data.
      </Paragraph>

      {/* ESG Data Table */}
      <Table dataSource={data} columns={columns} loading={loading} rowKey="key" />

      {/* Modal for detailed ESG data and blockchain info */}
      <Modal
        title="ESG Data Details"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={700}
      >
        {selectedRecord && (
          <div>
            <Title level={4}>Details for {selectedRecord.companyName}</Title>
            <Paragraph>
              <strong>Category:</strong> {selectedRecord.category} <br />
              <strong>Metric Value:</strong> {selectedRecord.metricValue} <br />
              <strong>Submission Date:</strong> {selectedRecord.submissionDate} <br />
              <strong>Status:</strong> {selectedRecord.status} <br />
            </Paragraph>

            <Title level={5}>Audit Trail</Title>
            <Timeline>
              {history.length > 0 ? (
                history.map((entry, index) => (
                  <Timeline.Item key={index} color={entry.isDeleted ? 'red' : 'green'}>
                    <Paragraph>
                      <strong>Timestamp:</strong> {new Date(entry.timestamp.seconds * 1000).toLocaleString()} <br />
                      <strong>Transaction ID:</strong> {entry.txId} <br />
                      {entry.value && (
                        <>
                          <strong>Status:</strong> {entry.value.status} <br />
                          <strong>Company:</strong> {entry.value.companyName} <br />
                          <strong>Category:</strong> {entry.value.category} <br />
                          <strong>Metric Value:</strong> {entry.value.metricValue} <br />
                          <strong>Submission Date:</strong> {entry.value.submissionDate} <br />
                          <strong>File Hash:</strong> {entry.value.fileHash} <br />

                          {/* Signed off by */}
                          {entry.value.signedOffBy && (
                            <Paragraph type="success">
                              <strong>Signed Off By:</strong> {entry.value.signedOffBy}
                            </Paragraph>
                          )}

                          {/* Rejected by */}
                          {entry.value.rejectedBy && (
                            <Paragraph type="danger">
                              <strong>Rejected By:</strong> {entry.value.rejectedBy}
                            </Paragraph>
                          )}
                        </>
                      )}
                      {entry.isDeleted && <strong>(Record Deleted)</strong>}
                    </Paragraph>
                  </Timeline.Item>
                ))
              ) : (
                <Timeline.Item>No transaction history available</Timeline.Item>
              )}
            </Timeline>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InvestorView;
