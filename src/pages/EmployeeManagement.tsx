import { useState } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Space, 
  Typography,
  Message,
  Tag,
  Popconfirm,
  Avatar
} from '@arco-design/web-react';
import { IconPlus, IconEdit, IconDelete, IconSearch } from '@arco-design/web-react/icon';
import { useAppStore } from '../store';
import type { Employee } from '../types';

const { Title } = Typography;
const FormItem = Form.Item;
const Option = Select.Option;

const EmployeeManagement: React.FC = () => {
  const { employees, departments, addEmployee, updateEmployee, deleteEmployee } = useAppStore();
  const [visible, setVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  const filteredEmployees = employees.filter(emp => 
    emp.name.includes(searchText) || 
    emp.employeeId.includes(searchText) ||
    emp.department.includes(searchText)
  );

  const handleAdd = () => {
    setEditingEmployee(null);
    form.resetFields();
    setVisible(true);
  };

  const handleEdit = (record: Employee) => {
    setEditingEmployee(record);
    form.setFieldsValue(record);
    setVisible(true);
  };

  const handleDelete = (id: string) => {
    deleteEmployee(id);
    Message.success('删除成功');
  };

  const handleSubmit = () => {
    form.validate().then((values) => {
      if (editingEmployee) {
        updateEmployee(editingEmployee.id, values);
        Message.success('更新成功');
      } else {
        const newEmployee: Employee = {
          ...values,
          id: Date.now().toString(),
          hireDate: new Date().toISOString().split('T')[0]
        };
        addEmployee(newEmployee);
        Message.success('添加成功');
      }
      setVisible(false);
    });
  };

  const columns = [
    {
      title: '头像',
      dataIndex: 'avatar',
      width: 80,
      render: (_: any, record: Employee) => (
        <Avatar size={40}>
          {record.name.charAt(0)}
        </Avatar>
      )
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 120,
    },
    {
      title: '工号',
      dataIndex: 'employeeId',
      width: 120,
    },
    {
      title: '部门',
      dataIndex: 'department',
      width: 120,
    },
    {
      title: '职位',
      dataIndex: 'position',
      width: 150,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 140,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '在职' : '离职'}
        </Tag>
      )
    },
    {
      title: '入职日期',
      dataIndex: 'hireDate',
      width: 120,
    },
    {
      title: '操作',
      width: 150,
      render: (_: any, record: Employee) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<IconEdit />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除该员工吗？"
            onOk={() => handleDelete(record.id)}
          >
            <Button
              type="text"
              size="small"
              status="danger"
              icon={<IconDelete />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title heading={4} style={{ margin: 0 }}>
          人员管理
        </Title>
        <Space>
          <Input
            style={{ width: 240 }}
            placeholder="搜索姓名、工号或部门"
            prefix={<IconSearch />}
            value={searchText}
            onChange={setSearchText}
          />
          <Button type="primary" icon={<IconPlus />} onClick={handleAdd}>
            添加员工
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        data={filteredEmployees}
        pagination={{
          pageSize: 10,
          showTotal: true,
          showJumper: true,
          sizeCanChange: true
        }}
        border
        stripe
      />

      <Modal
        title={editingEmployee ? '编辑员工' : '添加员工'}
        visible={visible}
        onOk={handleSubmit}
        onCancel={() => setVisible(false)}
        autoFocus={false}
        focusLock={true}
      >
        <Form form={form} layout="vertical">
          <FormItem
            label="姓名"
            field="name"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </FormItem>
          
          <FormItem
            label="工号"
            field="employeeId"
            rules={[{ required: true, message: '请输入工号' }]}
          >
            <Input placeholder="请输入工号" />
          </FormItem>
          
          <FormItem
            label="部门"
            field="department"
            rules={[{ required: true, message: '请选择部门' }]}
          >
            <Select placeholder="请选择部门">
              {departments.map(dept => (
                <Option key={dept.id} value={dept.name}>
                  {dept.name}
                </Option>
              ))}
            </Select>
          </FormItem>
          
          <FormItem
            label="职位"
            field="position"
            rules={[{ required: true, message: '请输入职位' }]}
          >
            <Input placeholder="请输入职位" />
          </FormItem>
          
          <FormItem
            label="手机号"
            field="phone"
            rules={[
              { required: true, message: '请输入手机号' },
              { match: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
            ]}
          >
            <Input placeholder="请输入手机号" />
          </FormItem>
          
          <FormItem
            label="邮箱"
            field="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入正确的邮箱格式' }
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </FormItem>
          
          <FormItem
            label="状态"
            field="status"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value="active">在职</Option>
              <Option value="inactive">离职</Option>
            </Select>
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
};

export default EmployeeManagement;