'use client';

import { Table, Button, Tag, Modal, message } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';

const AuditESGData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [actionRecord, setActionRecord] = useState(null);
  const [actionType, setActionType] = useState(null);

  // Fetch the ESG data from the backend
  useEffect(() => {
    fetchESGData();
  }, []);

  const fetchESGData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/queryAllESGData');
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
        await axios.post('http://localhost:3001/signOffESGData', {
          id: actionRecord.id,
          auditorName: 'GreenAudit', // Replace with real auditor's name or ID
        });
        message.success(`ESG data signed off successfully!`);
      } else if (actionType === 'reject') {
        // Call the backend API to reject the ESG data
        await axios.post('http://localhost:3001/rejectESGData', {
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
    <div style={{ padding: '24px' }}>
      <h2>Audit ESG Data Records</h2>

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
