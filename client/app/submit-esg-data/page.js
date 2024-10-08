'use client';

import { Form, Input, Button, Select, Upload, DatePicker, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import axios from 'axios'; // Axios for API requests

const { Option } = Select;

const SubmitESGData = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]); // Ensure this is always an array

  // Utility function to calculate the SHA-256 hash
  const calculateHash = async (file) => {
    const arrayBuffer = await file.arrayBuffer(); // Read file as arrayBuffer
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer); // Hash the buffer
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // Convert to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // Convert to hex string
    return hashHex;
  };

  // Handle form submission with API integration
  const onFinish = async (values) => {
    if (!Array.isArray(fileList) || fileList.length === 0) {
      message.error('Please upload a file!');
      return;
    }

    setLoading(true); // Show loading spinner

    const fileHash = await calculateHash(fileList[0].originFileObj);

    // Create payload for API
    const payload = {
      id: `esg-${Date.now()}`, // Create a unique ID (can be improved)
      companyName: "GreenCo", // Hardcoded for now, can be dynamic
      category: values.dataCategory,
      metricValue: values.metricValue,
      submissionDate: values.submissionDate.format('YYYY-MM-DD'),
      fileHash, // Single file hash
    };

    try {
      // Calculate hash for the uploaded file (single file)

      const originalFile = fileList[0].originFileObj;
      const renamedFile = new File(
        [originalFile],
        `${payload.id}${originalFile.name.substring(originalFile.name.lastIndexOf('.'))}`,
        { type: originalFile.type }
      );


      // Send file
      const fileFormData = new FormData();
      fileFormData.append('recordId', payload.id); // Add the record ID to the form
      fileFormData.append('documents', renamedFile); // Add the renamed file to the form

      const response1 = await axios.post('/api/upload', fileFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const response2 = await axios.post('/api/proxy/submitESGData', payload);

      if (response1.status === 200 && response2.status === 200) {
        message.success('ESG data submitted successfully!');
      }

      form.resetFields(); // Reset the form
      setFileList([]); // Clear the file list
    } catch (error) {
      // Handle error response
      console.error('Error submitting ESG data:', error);
      message.error('Failed to submit ESG data.');
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  // Handle file upload event (only allow one file, but still use an array)
  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList.slice(-1)); // Only keep the last file (restrict to 1 file)
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

        {/* File Upload (only allow one file) */}
        <Form.Item
          label="Upload Supporting Document"
          name="upload"
          valuePropName="fileList"
          getValueFromEvent={
            (e) => Array.isArray(e) ? e : e && e.fileList
          } // Ensure fileList is always an array
          extra="Upload a related document (PDF only)"
          style={styles.formItem}
        >
          <Upload
            name="documents"
            action="/api/upload"
            listType="text"
            onChange={handleFileChange} // Handle file change
            fileList={fileList} // Display the selected file
            defaultFileList={fileList || []} // Ensure default is an array
            beforeUpload={() => false}
          >
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
