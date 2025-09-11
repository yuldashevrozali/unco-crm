"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "./components/layouts/dashboard";
import { Card, Avatar, Descriptions, Tag, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

interface User {
  id: string;
  username: string;
  phone: string;
  role: string;
  photo?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("user");
    if (data) {
      const parsed = JSON.parse(data);
      setUser(parsed.user);
    }
  }, []);

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (user) {
        const updatedUser = { ...user, photo: reader.result as string };
        localStorage.setItem("user", JSON.stringify({ user: updatedUser }));
        setUser(updatedUser);
        message.success("Rasm yangilandi!");
      }
    };
    reader.readAsDataURL(file);
    return false; // antd default uploadni bloklaymiz
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Foydalanuvchi maʼlumotlari topilmadi</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex justify-center mt-10">
        <Card style={{ width: 500 }} title="Profil ma'lumotlari">
          <div className="flex flex-col items-center mb-6">
            <Avatar
              size={80}
              src={user.photo}
              style={{ backgroundColor: "#1677ff", marginBottom: "10px" }}
            >
              {!user.photo && user.username.charAt(0).toUpperCase()}
            </Avatar>
            <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>
              {user.username}
            </h2>
            <Tag color="blue" style={{ marginTop: "5px" }}>
              {user.role}
            </Tag>

            {/* Rasm yuklash */}
            <Upload beforeUpload={handleUpload} showUploadList={false}>
              <button className="mt-3 bg-indigo-500 text-white px-4 py-1.5 rounded-lg shadow hover:bg-indigo-600 transition">
                <UploadOutlined /> Rasm yuklash
              </button>
            </Upload>
          </div>

          <Descriptions column={1} bordered>
            <Descriptions.Item label="ID">{user.id}</Descriptions.Item>
            <Descriptions.Item label="Telefon">{user.phone}</Descriptions.Item>
            <Descriptions.Item label="Role">{user.role}</Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
    </DashboardLayout>
  );
}
