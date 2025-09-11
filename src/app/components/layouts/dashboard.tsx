"use client";

import { Layout, Menu, Button } from "antd";
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
import { useEffect, useState } from "react";

const { Header, Sider, Content } = Layout;

interface User {
  username: string;
  role: string;
  photo?: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed.user);
    }
  }, []);

  const menuItems = [
    { key: "/", icon: <UserOutlined />, label: "Profil" },
    { key: "/lids", icon: <UserOutlined />, label: "Lidlar" },
    { key: "/students", icon: <TeamOutlined />, label: "O‘quvchilar" },
    { key: "/groups", icon: <BookOutlined />, label: "Guruhlar" },
    { key: "/payments", icon: <DollarOutlined />, label: "To‘lovlar" },
    { key: "/employees", icon: <TeamOutlined />, label: "Xodimlar" },
    { key: "/table", icon: <CalendarOutlined />, label: "Dars jadvali" },
    { key: "/statistic", icon: <FileTextOutlined />, label: "Hisobotlar" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/signin");
  };

  return (
    <Layout className="h-screen">
      {/* Sidebar */}
      <Sider breakpoint="lg" collapsedWidth="0" className="bg-[#003366] h-screen">
        <div className="h-16 flex items-center justify-center text-white text-lg font-bold border-b border-gray-700">
          <span>Learning Center</span>
        </div>

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
          {/* Profil qismi */}
          <div className="flex items-center space-x-4 ml-auto">
            <img
              src={user?.photo || "https://i.pravatar.cc/100"}
              alt="user"
              className="rounded-full w-10 h-10 border-2 border-indigo-500 shadow-md"
            />
            <div className="flex flex-col items-start">
              <span className="text-white font-semibold text-base tracking-wide">
                {user ? user.username : "Guest"}
              </span>
              <span
                className={`mt-0.5 text-xs font-medium px-2 py-0.5 rounded-full ${
                  user?.role === "director"
                    ? "bg-green-100 text-green-700"
                    : user?.role === "admin"
                    ? "bg-purple-100 text-purple-700"
                    : user?.role === "teacher"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {user ? user.role : "no-role"}
              </span>
            </div>

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
