"use client";

import { Modal, Form, Select, InputNumber, DatePicker } from "antd";
import { useEffect } from "react";
import dayjs from "dayjs";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: { studentId: string; price: number; date: string }) => void;
  students: { _id: string; name: string; group: string }[];
}

export default function PaymentModal({
  open,
  onClose,
  onSubmit,
  students,
}: PaymentModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) {
      form.resetFields(); // modal yopilganda formani tozalash
    }
  }, [open, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        studentId: values.studentId,
        price: values.price,
        date: values.date.format("YYYY-MM-DD"),
      };
      onSubmit(payload);
      form.resetFields();
    } catch (err) {
      console.log("Form xatolik:", err);
    }
  };

  return (
    <Modal
      open={open}
      title="Yangi to‘lov qo‘shish"
      okText="Saqlash"
      cancelText="Bekor qilish"
      onCancel={onClose}
      onOk={handleOk}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          date: dayjs(), // boshlang‘ich qiymat
        }}
      >
        {/* Student tanlash */}
        <Form.Item
          label="O‘quvchi"
          name="studentId"
          rules={[{ required: true, message: "O‘quvchini tanlang!" }]}
        >
          <Select placeholder="O‘quvchini tanlang">
            {students.map((student) => (
              <Select.Option key={student._id} value={student._id}>
                {student.name} ({student.group})
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* To‘lov summasi */}
        <Form.Item
          label="To‘lov summasi"
          name="price"
          rules={[{ required: true, message: "Summani kiriting!" }]}
        >
          <InputNumber
            placeholder="Masalan: 50000"
            min={1000}
            style={{ width: "100%" }}
          />
        </Form.Item>

        {/* To‘lov sanasi */}
        <Form.Item
          label="Sana"
          name="date"
          rules={[{ required: true, message: "Sanani tanlang!" }]}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
