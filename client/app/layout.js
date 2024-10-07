'use client';

import { Layout, Menu } from 'antd';
import Link from 'next/link';

const { Header, Footer, Sider, Content } = Layout;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* You can add meta tags, title, or external scripts here */}
        <title>Blockchain ESG</title>
      </head>
      <body>
        <Layout style={{ minHeight: '100vh' }}>
          {/* Header */}
          <Header>
            <div className="logo" style={{ color: '#fff', fontSize: '20px', textAlign: 'center' }}>
              Blockchain ESG System Demo
            </div>
          </Header>

          <Layout>
            {/* Sider */}
            <Sider>
              <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                <Menu.Item key="1">
                  <Link href="/submit-esg-data">GreenCo</Link>
                </Menu.Item>
                <Menu.Item key="2">
                  <Link href="/audit-esg-data">GreenAudit</Link>
                </Menu.Item>
                <Menu.Item key="3">
                  <Link href="/investor">Investor</Link>
                </Menu.Item>
                {/* Add more menu items here for navigation */}
              </Menu>
            </Sider>

            {/* Content */}
            <Content style={{ padding: '24px', background: '#fff' }}>
              {children}
            </Content>
          </Layout>
        </Layout>
      </body>
    </html>
  );
}
