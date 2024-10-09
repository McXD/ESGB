'use client';

import { Table, Button, Tag, Modal, message } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FilePdfOutlined } from '@ant-design/icons'; // Import the PDF icon
import { Typography } from 'antd';
const { Paragraph } = Typography;

const AuditESGData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [actionRecord, setActionRecord] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [hashCheckStatus, setHashCheckStatus] = useState({}); // Store hash check results

  // Fetch the ESG data from the backend
  useEffect(() => {
    fetchESGData();
  }, []);

  const fetchESGData = async () => {
    try {
      const response = await axios.get('/api/proxy/queryAllESGData');
      setData(response.data.map((record) => record.value));
    } catch (error) {
      console.error('Failed to fetch ESG data:', error);
      message.error('Failed to load ESG data.');
    }
  };

  // Show confirmation modal for Sign Off or Reject
  const showModal = (record, action) => {
    setActionRecord(record);
    setActionType(action);
    setIsModalVisible(true);
  };

  // Handle Sign Off or Reject action
  const handleOk = async () => {
    setLoading(true);

    try {
      if (actionType === 'signOff') {
        // Call the backend API to sign off the ESG data
        await axios.post('/api/proxy/signOffESGData', {
          id: actionRecord.id,
          auditorName: 'GreenAudit', // Replace with real auditor's name or ID
        });
        message.success(`ESG data signed off successfully!`);
      } else if (actionType === 'reject') {
        // Call the backend API to reject the ESG data
        await axios.post('/api/proxy/rejectESGData', {
          id: actionRecord.id,
          auditorName: 'GreenAudit', // Replace with real auditor's name or ID
          reason: 'Data quality insufficient', // Replace with real reason from the auditor
        });
        message.success(`ESG data rejected successfully!`);
      }

      // Refresh the data after the action is taken
      fetchESGData();
    } catch (error) {
      console.error(`Failed to ${actionType === 'signOff' ? 'sign off' : 'reject'} ESG data:`, error);
      message.error(`Failed to ${actionType === 'signOff' ? 'sign off' : 'reject'} ESG data.`);
    } finally {
      setIsModalVisible(false);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Function to calculate SHA-256 hash of a file
  const calculateHash = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };

  // Function to compare file hashes
  const checkFileHash = async (file, expectedHash, recordId) => {
    const actualHash = await calculateHash(file);
    const isMatched = actualHash === expectedHash;
    setHashCheckStatus((prevStatus) => ({
      ...prevStatus,
      [recordId]: isMatched ? 'Matched' : 'Unmatched',
    }));
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
      title: 'Hash Match',
      key: 'hashMatch',
      render: (text, record) => (
        hashCheckStatus[record.id] ? (
          <Tag color={hashCheckStatus[record.id] === 'Matched' ? 'green' : 'red'}>
            {hashCheckStatus[record.id]}
          </Tag>
        ) : (
          <Button
            onClick={async () => {
              try {
                // Fetch the file and compare the hash
                const response = await axios.get(`/api/download/${record.id}.pdf`, { responseType: 'blob' });
                await checkFileHash(response.data, record.fileHash, record.id);
              } catch (error) {
                console.error('Error comparing file hash:', error);
                message.error('Failed to compare file hash.');
              }
            }}
          >
            Check Hash
          </Button>
        )
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = status === 'Signed Off' ? 'green' : status === 'Rejected' ? 'red' : 'orange';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          {record.status === 'Pending' && (
            <>
              <Button type="primary" onClick={() => showModal(record, 'signOff')}>
                Sign Off
              </Button>{' '}
              <Button type="danger" onClick={() => showModal(record, 'reject')}>
                Reject
              </Button>
            </>
          )}
        </span>
      ),
    },
  ];

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '24px',
   }}>
      <h1 style={{textAlign: 'center'}}>Audit ESG Data Records</h1>

      <Paragraph>
        This page allows auditors to review, verify, and take action on submitted environmental, social, and governance (ESG) data from companies. Each submission includes key ESG metrics, such as carbon emissions, energy usage, or governance scores, along with supporting documentation. Auditors can view the submitted data, check the integrity of the attached files by verifying their hash values, and decide to either sign off on or reject the data. The sign-off indicates that the data has been reviewed and validated, while a rejection requires providing a reason for insufficient data quality. All decisions made by the auditor are logged for transparency and accountability.
      </Paragraph>

      {/* Table to display ESG data */}
      <Table dataSource={data} columns={columns} loading={loading} rowKey="key" />

      {/* Modal for Sign Off/Reject Confirmation */}
      <Modal
        title={`Confirm ${actionType === 'signOff' ? 'Sign Off' : 'Rejection'}`}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
      >
        <p>
          Are you sure you want to{' '}
          {actionType === 'signOff' ? 'sign off on' : 'reject'} the record for{' '}
          <strong>{actionRecord?.category}</strong> by <strong>{actionRecord?.companyName}</strong>?
        </p>
      </Modal>
    </div>
  );
};

export default AuditESGData;
