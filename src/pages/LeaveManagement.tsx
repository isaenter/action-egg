import { useState } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker,
  Space, 
  Typography,
  Message,
  Tag,
  Popconfirm,
  Tabs,
  Card
} from '@arco-design/web-react';
import { 
  IconPlus, 
  IconEye, 
  IconCheck, 
  IconClose
} from '@arco-design/web-react/icon';
import dayjs from 'dayjs';
import { useAppStore } from '../store';
import type { LeaveRequest } from '../types';

const { Title } = Typography;
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;

const LeaveManagement: React.FC = () => {
  const { 
    employees, 
    leaveRequests, 
    addLeaveRequest, 
    approveLeaveRequest,
    rejectLeaveRequest 
  } = useAppStore();
  
  const [visible, setVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('all');

  const leaveTypes = [
    { value: 'annual', label: '年假', color: 'blue' },
    { value: 'sick', label: '病假', color: 'orange' },
    { value: 'personal', label: '事假', color: 'purple' },
    { value: 'maternity', label: '产假', color: 'green' },
    { value: 'other', label: '其他', color: 'gray' }
  ];

  const getLeaveTypeInfo = (type: string) => {
    return leaveTypes.find(t => t.value === type) || leaveTypes[0];
  };

  const getStatusTag = (status: LeaveRequest['status']) => {
    const statusConfig = {
      pending: { color: 'orange', text: '待审批' },
      approved: { color: 'green', text: '已批准' },
      rejected: { color: 'red', text: '已拒绝' }
    };
    const config = statusConfig[status];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const filteredRequests = leaveRequests.filter(request => {
    if (activeTab === 'all') return true;
    return request.status === activeTab;
  });

  const handleAdd = () => {
    form.resetFields();
    setVisible(true);
  };

  const handleViewDetail = (record: LeaveRequest) => {
    setSelectedRequest(record);
    setDetailVisible(true);
  };

  const handleApprove = (id: string) => {
    approveLeaveRequest(id, '管理员', '申请已批准');
    Message.success('请假申请已批准');
  };

  const handleReject = (id: string) => {
    rejectLeaveRequest(id, '管理员', '申请被拒绝');
    Message.success('请假申请已拒绝');
  };

  const handleSubmit = () => {
    form.validate().then((values) => {
      const dateRange = values.dateRange;
      const startDate = dateRange[0].format('YYYY-MM-DD');
      const endDate = dateRange[1].format('YYYY-MM-DD');
      const days = dateRange[1].diff(dateRange[0], 'day') + 1;

      const newRequest: LeaveRequest = {
        id: Date.now().toString(),
        employeeId: values.employeeId,
        type: values.type,
        startDate,
        endDate,
        days,
        reason: values.reason,
        status: 'pending',
        appliedAt: new Date().toISOString()
      };

      addLeaveRequest(newRequest);
      Message.success('请假申请提交成功');
      setVisible(false);
    });
  };

  const columns = [
    {
      title: '申请人',
      dataIndex: 'employeeId',
      width: 120,
      render: (employeeId: string) => {
        const employee = employees.find(emp => emp.id === employeeId);
        return employee?.name || '未知';
      }
    },
    {
      title: '部门',
      dataIndex: 'employeeId',
      width: 120,
      render: (employeeId: string) => {
        const employee = employees.find(emp => emp.id === employeeId);
        return employee?.department || '未知';
      }
    },
    {
      title: '请假类型',
      dataIndex: 'type',
      width: 100,
      render: (type: string) => {
        const typeInfo = getLeaveTypeInfo(type);
        return <Tag color={typeInfo.color}>{typeInfo.label}</Tag>;
      }
    },
    {
      title: '开始日期',
      dataIndex: 'startDate',
      width: 120,
    },
    {
      title: '结束日期',
      dataIndex: 'endDate',
      width: 120,
    },
    {
      title: '请假天数',
      dataIndex: 'days',
      width: 100,
      render: (days: number) => `${days}天`
    },
    {
      title: '申请时间',
      dataIndex: 'appliedAt',
      width: 150,
      render: (appliedAt: string) => dayjs(appliedAt).format('YYYY-MM-DD HH:mm')
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: LeaveRequest['status']) => getStatusTag(status)
    },
    {
      title: '操作',
      width: 200,
      render: (_: any, record: LeaveRequest) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<IconEye />}
            onClick={() => handleViewDetail(record)}
          >
            查看
          </Button>
          {record.status === 'pending' && (
            <>
              <Popconfirm
                title="确定要批准这个请假申请吗？"
                onOk={() => handleApprove(record.id)}
              >
                <Button
                  type="text"
                  size="small"
                  status="success"
                  icon={<IconCheck />}
                >
                  批准
                </Button>
              </Popconfirm>
              <Popconfirm
                title="确定要拒绝这个请假申请吗？"
                onOk={() => handleReject(record.id)}
              >
                <Button
                  type="text"
                  size="small"
                  status="danger"
                  icon={<IconClose />}
                >
                  拒绝
                </Button>
              </Popconfirm>
            </>
          )}
        </Space>
      )
    }
  ];

  const getTabCounts = () => {
    return {
      all: leaveRequests.length,
      pending: leaveRequests.filter(req => req.status === 'pending').length,
      approved: leaveRequests.filter(req => req.status === 'approved').length,
      rejected: leaveRequests.filter(req => req.status === 'rejected').length
    };
  };

  const tabCounts = getTabCounts();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title heading={4} style={{ margin: 0 }}>
          请假管理
        </Title>
        <Button type="primary" icon={<IconPlus />} onClick={handleAdd}>
          申请请假
        </Button>
      </div>

      {/* 统计卡片 */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <Card style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 600, color: '#165DFF' }}>
            {tabCounts.all}
          </div>
          <div style={{ color: 'var(--color-text-3)' }}>总申请数</div>
        </Card>
        <Card style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 600, color: '#FF7D00' }}>
            {tabCounts.pending}
          </div>
          <div style={{ color: 'var(--color-text-3)' }}>待审批</div>
        </Card>
        <Card style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 600, color: '#00B42A' }}>
            {tabCounts.approved}
          </div>
          <div style={{ color: 'var(--color-text-3)' }}>已批准</div>
        </Card>
        <Card style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 600, color: '#F53F3F' }}>
            {tabCounts.rejected}
          </div>
          <div style={{ color: 'var(--color-text-3)' }}>已拒绝</div>
        </Card>
      </div>

      <Card>
        <Tabs activeTab={activeTab} onChange={setActiveTab}>
          <TabPane key="all" title={`全部 (${tabCounts.all})`} />
          <TabPane key="pending" title={`待审批 (${tabCounts.pending})`} />
          <TabPane key="approved" title={`已批准 (${tabCounts.approved})`} />
          <TabPane key="rejected" title={`已拒绝 (${tabCounts.rejected})`} />
        </Tabs>

        <Table
          columns={columns}
          data={filteredRequests}
          pagination={{
            pageSize: 10,
            showTotal: true,
            showJumper: true,
            sizeCanChange: true
          }}
          border
          stripe
        />
      </Card>

      {/* 申请请假弹窗 */}
      <Modal
        title="申请请假"
        visible={visible}
        onOk={handleSubmit}
        onCancel={() => setVisible(false)}
        autoFocus={false}
        focusLock={true}
        style={{ width: 600 }}
      >
        <Form form={form} layout="vertical">
          <FormItem
            label="申请人"
            field="employeeId"
            rules={[{ required: true, message: '请选择申请人' }]}
          >
            <Select placeholder="请选择申请人">
              {employees.filter(emp => emp.status === 'active').map(emp => (
                <Option key={emp.id} value={emp.id}>
                  {emp.name} - {emp.department}
                </Option>
              ))}
            </Select>
          </FormItem>
          
          <FormItem
            label="请假类型"
            field="type"
            rules={[{ required: true, message: '请选择请假类型' }]}
          >
            <Select placeholder="请选择请假类型">
              {leaveTypes.map(type => (
                <Option key={type.value} value={type.value}>
                  {type.label}
                </Option>
              ))}
            </Select>
          </FormItem>
          
          <FormItem
            label="请假时间"
            field="dateRange"
            rules={[{ required: true, message: '请选择请假时间' }]}
          >
            <RangePicker style={{ width: '100%' }} />
          </FormItem>
          
          <FormItem
            label="请假原因"
            field="reason"
            rules={[{ required: true, message: '请输入请假原因' }]}
          >
            <Input.TextArea
              placeholder="请详细说明请假原因"
              maxLength={500}
              showWordLimit
              autoSize={{ minRows: 3, maxRows: 6 }}
            />
          </FormItem>
        </Form>
      </Modal>

      {/* 详情查看弹窗 */}
      <Modal
        title="请假申请详情"
        visible={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={
          selectedRequest?.status === 'pending' ? (
            <Space>
              <Button onClick={() => setDetailVisible(false)}>
                关闭
              </Button>
              <Button
                status="danger"
                onClick={() => {
                  if (selectedRequest) {
                    handleReject(selectedRequest.id);
                    setDetailVisible(false);
                  }
                }}
              >
                拒绝
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  if (selectedRequest) {
                    handleApprove(selectedRequest.id);
                    setDetailVisible(false);
                  }
                }}
              >
                批准
              </Button>
            </Space>
          ) : (
            <Button onClick={() => setDetailVisible(false)}>
              关闭
            </Button>
          )
        }
        autoFocus={false}
        focusLock={true}
        style={{ width: 600 }}
      >
        {selectedRequest && (
          <div style={{ lineHeight: '2' }}>
            <div><strong>申请人：</strong>
              {employees.find(emp => emp.id === selectedRequest.employeeId)?.name || '未知'}
            </div>
            <div><strong>部门：</strong>
              {employees.find(emp => emp.id === selectedRequest.employeeId)?.department || '未知'}
            </div>
            <div><strong>请假类型：</strong>
              {getLeaveTypeInfo(selectedRequest.type).label}
            </div>
            <div><strong>开始日期：</strong>{selectedRequest.startDate}</div>
            <div><strong>结束日期：</strong>{selectedRequest.endDate}</div>
            <div><strong>请假天数：</strong>{selectedRequest.days}天</div>
            <div><strong>申请时间：</strong>
              {dayjs(selectedRequest.appliedAt).format('YYYY-MM-DD HH:mm:ss')}
            </div>
            <div><strong>状态：</strong>{getStatusTag(selectedRequest.status)}</div>
            {selectedRequest.approvedBy && (
              <div><strong>审批人：</strong>{selectedRequest.approvedBy}</div>
            )}
            {selectedRequest.approvedAt && (
              <div><strong>审批时间：</strong>
                {dayjs(selectedRequest.approvedAt).format('YYYY-MM-DD HH:mm:ss')}
              </div>
            )}
            <div style={{ marginTop: 16 }}>
              <strong>请假原因：</strong>
            </div>
            <div style={{ 
              backgroundColor: 'var(--color-fill-2)', 
              padding: '12px', 
              borderRadius: '6px',
              marginTop: '8px',
              whiteSpace: 'pre-wrap'
            }}>
              {selectedRequest.reason}
            </div>
            {selectedRequest.comments && (
              <>
                <div style={{ marginTop: 16 }}>
                  <strong>审批意见：</strong>
                </div>
                <div style={{ 
                  backgroundColor: 'var(--color-fill-2)', 
                  padding: '12px', 
                  borderRadius: '6px',
                  marginTop: '8px'
                }}>
                  {selectedRequest.comments}
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LeaveManagement;