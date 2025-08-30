"use client";

import Image from "next/image";
import { Form, Input, Select, Button, Typography, Card, message } from "antd";

import authSvg from "../../../public/auth.svg";

const { Title, Paragraph } = Typography;
const { Option } = Select;

export default function Signup() {


 

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-10 items-center">
        {/* Chap qism - Form */}
        <Card className="shadow-lg rounded-xl p-8">
          <div className="text-center mb-6">
            <Title
              level={2}
              style={{ color: "#252525", fontWeight: 700, fontSize: "40px" }}
            >
              Xush kelibsiz!
            </Title>
            <Paragraph
              style={{
                color: "#4B4B4B",
                fontSize: "18px",
                marginBottom: "20px",
              }}
            >
              Login va parol yasab Sign In sahifasiga o‘ting.
            </Paragraph>
          </div>

          <Form
            layout="vertical"
          
            initialValues={{ role: "teacher" }} // default qiymat
          >
            {/* Ism */}
            <Form.Item
              label="Ism"
              name="username"
              rules={[{ required: true, message: "Ismni kiriting!" }]}
            >
              <Input placeholder="Ism kiriting" />
            </Form.Item>

            {/* Telefon */}
            <Form.Item
              label="Telefon raqam"
              name="phone"
              rules={[
                { required: true, message: "Telefon raqamni kiriting!" },
                { len: 12, message: "Telefon raqam 12 ta belgidan iborat bo‘lishi kerak!" },
              ]}
            >
              <Input placeholder="998901234567" />
            </Form.Item>

            {/* Parol */}
            <Form.Item
              label="Parol"
              name="password"
              rules={[{ required: true, message: "Parolni kiriting!" }]}
            >
              <Input.Password placeholder="Parol kiriting" />
            </Form.Item>

            {/* Role */}
            <Form.Item
              label="Kim sifatida?"
              name="role"
              rules={[{ required: true, message: "Rolni tanlang!" }]}
            >
              <Select placeholder="Rolni tanlang">
                <Option value="admin">Admin</Option>
                <Option value="director">Director</Option>
                <Option value="teacher">Teacher</Option>
              </Select>
            </Form.Item>

            {/* Button */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                className="!bg-indigo-500 hover:!bg-white hover:!text-indigo-500 hover:!border-indigo-500"
              >
                Ro‘yxatdan o‘tish
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* O‘ng qism - Rasm */}
        <div className="hidden md:flex justify-center">
          <Image
            src={authSvg}
            alt="Avtorizatsiya rasmi"
            className="max-w-md w-full"
          />
        </div>
      </div>
    </div>
  );
}
