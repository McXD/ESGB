'use client';

import { Form, Input, Button, Select, Upload, DatePicker, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import axios from 'axios'; // Axios for API requests

const { Option } = Select;

const SubmitESGData = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Handle form submission with API integration
  const onFinish = async (values) => {
    setLoading(true); // Show loading spinner

    // Create payload for API
    const payload = {
      id: `esg-${Date.now()}`, // Create a unique ID (can be improved)
      companyName: "GreenCo", // Hardcoded for now, can be dynamic
      category: values.dataCategory,
      metricValue: values.metricValue,
      submissionDate: values.submissionDate.format('YYYY-MM-DD'),
      fileHash: 'hash_of_file' // Mocking file hash, you can calculate the hash for real data
    };

    try {
      // Make API call to backend
      const response = await axios.post('http://localhost:3001/submitESGData', payload);

      // Handle success response
      message.success('ESG data submitted successfully!');
      console.log(response.data);
      form.resetFields(); // Reset the form
    } catch (error) {
      // Handle error response
      console.error('Error submitting ESG data:', error);
      message.error('Failed to submit ESG data.');
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  // Handle file upload (mock implementation for now)
  const normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  // Inline styles
  const styles = {
    container: {
      maxWidth: '600px',
      margin: '0 auto',
      padding: '24px',
    },
    header: {
      textAlign: 'center',
      marginBottom: '24px',
    },
    formItem: {
      marginBottom: '16px',
    },
    submitButton: {
      width: '100%',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Submit ESG Data</h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ dataCategory: 'carbon-emissions' }}
      >
        {/* Data Category Dropdown */}
        <Form.Item
          label="Data Category"
          name="dataCategory"
          rules={[{ required: true, message: 'Please select a data category!' }]}
          style={styles.formItem}
        >
          <Select placeholder="Select a category">
            <Option value="carbon-emissions">Carbon Emissions</Option>
            <Option value="energy-usage">Energy Usage</Option>
            <Option value="governance-scores">Governance Scores</Option>
          </Select>
        </Form.Item>

        {/* Data Metric Input */}
        <Form.Item
          label="Metric Value"
          name="metricValue"
          rules={[{ required: true, message: 'Please enter the metric value!' }]}
          style={styles.formItem}
        >
          <Input type="number" placeholder="Enter the value (e.g., tons of carbon)" />
        </Form.Item>

        {/* Date Picker for Data Submission */}
        <Form.Item
          label="Date of Data Submission"
          name="submissionDate"
          rules={[{ required: true, message: 'Please select the submission date!' }]}
          style={styles.formItem}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        {/* File Upload (Mocked for now) */}
        <Form.Item
          label="Upload Supporting Documents"
          name="upload"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          extra="Upload related documents (CSV, PDF, etc.)"
          style={styles.formItem}
        >
          <Upload name="documents" action="/upload" listType="text" multiple>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>

        {/* Submit Button */}
        <Form.Item style={styles.formItem}>
          <Button type="primary" htmlType="submit" loading={loading} style={styles.submitButton}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SubmitESGData;
