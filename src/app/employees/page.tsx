"use client";

import { Button, Modal, Table, Form, Input, DatePicker, Select, Space, Typography } from "antd";
import { useState } from "react";
import DashboardLayout from "../components/layouts/dashboard";
import moment from "moment";

const { Title } = Typography;

interface Employee {
  key: string;
  name: string;
  phone: string;
  dob: string;
  role: "CEO" | "Admin";
}

export default function EmployeesPage() {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([
    {
      key: "1",
      name: "asdfs asdfasd",
      phone: "+998 (12) 345-67-89",
      dob: "2009-10-14",
      role: "CEO",
    },
    {
      key: "2",
      name: "Ozodbek 11 Gafurov",
      phone: "+998 (33) 447-22-27",
      dob: "2005-10-10",
      role: "CEO",
    },
    {
      key: "3",
      name: "Alisher Sanayev",
      phone: "+998 (90) 562-93-05",
      dob: "2024-06-13",
      role: "Admin",
    },
  ]);

  const columns = [
    {
      title: "T/r",
      dataIndex: "key",
      key: "key",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Ismi",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Telefon",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Tug'ilgan sana",
      dataIndex: "dob",
      key: "dob",
    },
    {
      title: "Amallar",
      key: "actions",
      render: () => <span>👁️</span>,
    },
  ];

  const handleAddEmployee = (values: any) => {
    const newEmployee: Employee = {
      key: (employees.length + 1).toString(),
      name: values.name,
      phone: values.phone,
      dob: values.dob.format("YYYY-MM-DD"),
      role: values.role,
    };

    setEmployees([...employees, newEmployee]);
    form.resetFields();
    setIsModalOpen(false);
  };

  const ceoData = employees.filter((e) => e.role === "CEO");
  const adminData = employees.filter((e) => e.role === "Admin");

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="!mb-0">Xodimlar</Title>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          + Xodim qo‘shish
        </Button>
      </div>

      <div className="mb-10">
        <Title level={4}>CEO</Title>
        <Table
          columns={columns}
          dataSource={ceoData}
          pagination={false}
          bordered
        />
      </div>

      <div>
        <Title level={4}>Administratorlar</Title>
        <Table
          columns={columns}
          dataSource={adminData}
          pagination={false}
          bordered
        />
      </div>

      {/* Modal */}
      <Modal
        title="Yangi xodim qo‘shish"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText="Qo‘shish"
        cancelText="Bekor qilish"
      >
        <Form form={form} layout="vertical" onFinish={handleAddEmployee}>
          <Form.Item
            name="name"
            label="Ismi"
            rules={[{ required: true, message: "Iltimos, ismni kiriting" }]}
          >
            <Input placeholder="Masalan: Alisher Sanayev" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Telefon"
            rules={[{ required: true, message: "Telefon raqam kiriting" }]}
          >
            <Input placeholder="+998 (__) ___-__-__" />
          </Form.Item>
          <Form.Item
            name="dob"
            label="Tug‘ilgan sana"
            rules={[{ required: true, message: "Tug‘ilgan sanani tanlang" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="role"
            label="Lavozimi"
            rules={[{ required: true, message: "Lavozimni tanlang" }]}
          >
            <Select placeholder="Tanlang">
              <Select.Option value="CEO">CEO</Select.Option>
              <Select.Option value="Admin">Admin</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </DashboardLayout>
  );
}
