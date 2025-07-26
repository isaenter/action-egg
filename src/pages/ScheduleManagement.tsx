import { useState } from 'react';
import { 
  Calendar, 
  Card, 
  Button, 
  Modal, 
  Form, 
  Select, 
  Typography, 
  Space,
  Tag,
  Message,
  Grid
} from '@arco-design/web-react';
import { IconPlus } from '@arco-design/web-react/icon';
import dayjs from 'dayjs';
import { useAppStore } from '../store';
import type { Schedule } from '../types';

const { Title } = Typography;
const { Row, Col } = Grid;
const FormItem = Form.Item;
const Option = Select.Option;

const ScheduleManagement: React.FC = () => {
  const { employees, schedules, addSchedule, updateSchedule } = useAppStore();
  const [visible, setVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [form] = Form.useForm();

  const shiftTypes = [
    { value: 'morning', label: '早班', color: 'blue', time: '08:00-16:00' },
    { value: 'afternoon', label: '中班', color: 'orange', time: '16:00-24:00' },
    { value: 'night', label: '夜班', color: 'purple', time: '00:00-08:00' },
    { value: 'rest', label: '休息', color: 'gray', time: '全天休息' }
  ];

  const getShiftInfo = (shift: string) => {
    return shiftTypes.find(s => s.value === shift) || shiftTypes[0];
  };

  const getDaySchedules = (date: string) => {
    return schedules.filter(schedule => schedule.date === date);
  };

  const handleAddSchedule = (date?: string) => {
    setEditingSchedule(null);
    setSelectedDate(date || selectedDate);
    form.resetFields();
    form.setFieldValue('date', date || selectedDate);
    setVisible(true);
  };

  const handleEditSchedule = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    form.setFieldsValue(schedule);
    setVisible(true);
  };

  const handleSubmit = () => {
    form.validate().then((values) => {
      const shiftInfo = getShiftInfo(values.shift);
      const scheduleData = {
        ...values,
        startTime: values.shift === 'rest' ? undefined : shiftInfo.time.split('-')[0],
        endTime: values.shift === 'rest' ? undefined : shiftInfo.time.split('-')[1]
      };

      if (editingSchedule) {
        updateSchedule(editingSchedule.id, scheduleData);
        Message.success('排班更新成功');
      } else {
        const newSchedule: Schedule = {
          ...scheduleData,
          id: Date.now().toString()
        };
        addSchedule(newSchedule);
        Message.success('排班添加成功');
      }
      setVisible(false);
    });
  };


  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title heading={4} style={{ margin: 0 }}>
          排班管理
        </Title>
        <Button type="primary" icon={<IconPlus />} onClick={() => handleAddSchedule()}>
          添加排班
        </Button>
      </div>

      <Row gutter={24}>
        <Col span={18}>
          <Card title="排班日历">
            <Calendar
              style={{ width: '100%' }}
            />
          </Card>
        </Col>
        
        <Col span={6}>
          <Card title={`${selectedDate} 排班详情`}>
            <div style={{ marginBottom: 16 }}>
              <Button 
                type="primary" 
                size="small" 
                icon={<IconPlus />} 
                onClick={() => handleAddSchedule(selectedDate)}
                style={{ width: '100%' }}
              >
                添加排班
              </Button>
            </div>
            
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              {getDaySchedules(selectedDate).map(schedule => {
                const employee = employees.find(emp => emp.id === schedule.employeeId);
                const shiftInfo = getShiftInfo(schedule.shift);
                
                return (
                  <div
                    key={schedule.id}
                    style={{
                      padding: '8px',
                      border: '1px solid var(--color-border-2)',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleEditSchedule(schedule)}
                  >
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>
                      {employee?.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Tag color={shiftInfo.color} size="small">
                        {shiftInfo.label}
                      </Tag>
                      <span style={{ fontSize: '12px', color: 'var(--color-text-3)' }}>
                        {shiftInfo.time}
                      </span>
                    </div>
                  </div>
                );
              })}
              
              {getDaySchedules(selectedDate).length === 0 && (
                <div style={{ 
                  textAlign: 'center', 
                  color: 'var(--color-text-3)', 
                  padding: '20px 0' 
                }}>
                  暂无排班
                </div>
              )}
            </Space>
          </Card>
          
          <Card title="班次说明" style={{ marginTop: 16 }}>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              {shiftTypes.map(shift => (
                <div key={shift.value} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Tag color={shift.color} size="small">
                    {shift.label}
                  </Tag>
                  <span style={{ fontSize: '12px' }}>
                    {shift.time}
                  </span>
                </div>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>

      <Modal
        title={editingSchedule ? '编辑排班' : '添加排班'}
        visible={visible}
        onOk={handleSubmit}
        onCancel={() => setVisible(false)}
        autoFocus={false}
        focusLock={true}
      >
        <Form form={form} layout="vertical">
          <FormItem
            label="日期"
            field="date"
            rules={[{ required: true, message: '请选择日期' }]}
          >
            <input 
              type="date" 
              style={{ 
                width: '100%', 
                padding: '6px 12px',
                border: '1px solid var(--color-border-2)',
                borderRadius: '6px'
              }}
            />
          </FormItem>
          
          <FormItem
            label="员工"
            field="employeeId"
            rules={[{ required: true, message: '请选择员工' }]}
          >
            <Select placeholder="请选择员工">
              {employees.filter(emp => emp.status === 'active').map(emp => (
                <Option key={emp.id} value={emp.id}>
                  {emp.name} - {emp.department}
                </Option>
              ))}
            </Select>
          </FormItem>
          
          <FormItem
            label="班次"
            field="shift"
            rules={[{ required: true, message: '请选择班次' }]}
          >
            <Select placeholder="请选择班次">
              {shiftTypes.map(shift => (
                <Option key={shift.value} value={shift.value}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{shift.label}</span>
                    <span style={{ color: 'var(--color-text-3)', fontSize: '12px' }}>
                      {shift.time}
                    </span>
                  </div>
                </Option>
              ))}
            </Select>
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
};

export default ScheduleManagement;