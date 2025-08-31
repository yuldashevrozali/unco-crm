"use client";

import { Layout, Menu, Button, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import {
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
  DollarOutlined,
  FileTextOutlined,
  BookOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const { Header, Sider, Content } = Layout;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { key: "/lidlar", icon: <UserOutlined />, label: "Lidlar" },
    { key: "/oquvchilar", icon: <TeamOutlined />, label: "O‘quvchilar" },
    { key: "/guruhlar", icon: <BookOutlined />, label: "Guruhlar" },
    { key: "/tolovlar", icon: <DollarOutlined />, label: "To‘lovlar" },
    { key: "/xodimlar", icon: <TeamOutlined />, label: "Xodimlar" },
    { key: "/dars-jadvali", icon: <CalendarOutlined />, label: "Dars jadvali" },
    { key: "/hisobotlar", icon: <FileTextOutlined />, label: "Hisobotlar" },
  ];

  const handleLogout = () => {
    // TODO: tokenni tozalash
    router.push("/signin");
  };

  return (
    <Layout className="h-screen">
      {/* Sidebar */}
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        className="bg-[#003366] h-screen"
      >
        {/* Logo joyi */}
        <div className="h-16 flex items-center justify-center text-white text-lg font-bold border-b border-gray-700">
          <span>Learning Center</span>
        </div>

        {/* Menu */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems.map((item) => ({
            ...item,
            label: <Link href={item.key}>{item.label}</Link>,
          }))}
        />
      </Sider>

      {/* Right Layout */}
      <Layout>
        {/* Header */}
        <Header className="bg-white shadow flex justify-between items-center px-6 h-16 sticky top-0 z-10">
          {/* Qidiruv input */}
          <input
            type="text"
            placeholder="Qidirish..."
            className="w-64 h-9 px-3 text-sm text-gray-700 border border-gray-300 rounded-lg 
             focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
             placeholder-gray-400 shadow-sm hover:border-gray-400 transition"
          />

          {/* Profil qismi */}
          <div className="flex items-center space-x-4">
            <img
              src="https://i.pravatar.cc/40"
              alt="user"
              className="rounded-full w-10 h-10 border-2 border-indigo-500 shadow-md"
            />
            <span className="font-medium text-gray-700">Admin</span>
            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Chiqish
            </Button>
          </div>
        </Header>

        {/* Content */}
        <Content className="p-6 bg-gray-100 min-h-[calc(100vh-64px)] overflow-auto">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
