import React from 'react';
import { Card, Tabs } from 'antd';
import type { TabsProps } from 'antd';

interface Lesson {
  room: string;
  time: string;
  title: string;
  color: string;
}

type ScheduleData = Record<string, Lesson[]>;

const timeSlots: string[] = Array.from({ length: 16 }, (_, i) => {
  const hour = i + 5;
  return `${hour.toString().padStart(2, '0')}:00`;
});

const rooms: string[] = ['1-xona', '2-xona', '3-xona', '4-xona', '5-xona', '6-xona'];

const data: ScheduleData = {
  SESH: [
    { room: '1-xona', time: '05:00', title: 'Fn ...', color: 'red' },
    { room: '4-xona', time: '09:30', title: 'fn1, doe d...', color: 'blue' }, // Note: 09:30 not in main slots
    { room: '1-xona', time: '10:00', title: 'Fn17, Rasul', color: 'red' },
    { room: '2-xona', time: '10:00', title: 'fn1...', color: 'green' },
  ],
  DUSH: [
    { room: '1-xona', time: '05:00', title: 'Fn ...', color: 'blue' },
    { room: '1-xona', time: '10:00', title: 'Fn17, Rasul', color: 'blue' },
  ]
};

const ScheduleTable: React.FC = () => {
  const days: string[] = ['DUSH', 'SESH', 'CHOR', 'PAY', 'JUM', 'SHAN', 'YAK'];

  const items: TabsProps['items'] = days.map(day => ({
    key: day,
    label: day,
    children: (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${timeSlots.length + 1}, 1fr)`,
          gap: 1
        }}
      >
        <div></div>
        {timeSlots.map((time) => (
          <div key={time} style={{ padding: 5, textAlign: 'center', fontWeight: 'bold' }}>
            {time}
          </div>
        ))}

        {rooms.map((room) => (
          <React.Fragment key={room}>
            <div style={{ padding: 5, fontWeight: 'bold' }}>{room}</div>
            {timeSlots.map((time) => {
              const lesson = data[day]?.find(e => e.room === room && e.time === time);
              return (
                <div
                  key={`${room}-${time}`}
                  style={{ border: '1px solid #ddd', height: 60 }}
                >
                  {lesson && (
                    <Card size="small" style={{ backgroundColor: lesson.color, color: 'white' }}>
                      {lesson.title}
                    </Card>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    )
  }));

  return <Tabs defaultActiveKey="SESH" items={items} />;
};

export default ScheduleTable;
