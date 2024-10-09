'use client';

import { Layout, Menu } from 'antd';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import './globals.css'

const { Header, Sider, Content } = Layout;

export default function RootLayout({ children }) {
  const [selectedKey, setSelectedKey] = useState('1');
  const pathname = usePathname(); // Get the current path

  useEffect(() => {
    // Mapping URL paths to menu keys
    const pathToKey = {
      '/introduction': '1',
      '/submit-esg-data': '2',
      '/audit-esg-data': '3',
      '/investor': '4',
      '/blockchain-logs': '5',
    };

    // Update the selectedKey based on the current path
    const currentKey = pathToKey[pathname] || '1'; // Default to '1' if path doesn't match
    setSelectedKey(currentKey);
  }, [pathname]); // Re-run the effect when pathname changes

  return (
    <html lang="en">
      <head>
        <title>Blockchain ESG</title>
      </head>
      <body>
        <Layout style={{ minHeight: '100vh' }}>
          {/* Header */}
          <Header style={{ background: '#001529', color: '#fff', padding: '0 20px' }}>
            <div className="logo" style={{ color: '#fff', fontSize: '20px', textAlign: 'center' }}>
              Blockchain ESG System Demo
            </div>
          </Header>

          <Layout>
            {/* Sider */}
            <Sider style={{ background: '#001529' }}>
              <Menu theme="dark" mode="inline" selectedKeys={[selectedKey]} style={{ height: '100%' }}>
                <Menu.Item key="1">
                  <Link href="/introduction">Introduction</Link>
                </Menu.Item>
                <Menu.Item key="2">
                  <Link href="/submit-esg-data">GreenCo</Link>
                </Menu.Item>
                <Menu.Item key="3">
                  <Link href="/audit-esg-data">GreenAudit</Link>
                </Menu.Item>
                <Menu.Item key="4">
                  <Link href="/investor">Investor</Link>
                </Menu.Item>
                <Menu.Item key="5">
                  <Link href="/blockchain-logs">Blockchain Logs</Link>
                </Menu.Item>
              </Menu>
            </Sider>

            {/* Content */}
            <Content style={{ margin: '24px 16px 0', padding: 24, background: '#fff' }}>
              {children}
            </Content>
          </Layout>
        </Layout>
      </body>
    </html>
  );
}
