import { Card, Grid, Typography, Space } from '@arco-design/web-react';
import { 
  IconUser, 
  IconCalendar, 
  IconCheckCircle, 
  IconCloseCircle,
  IconSchedule,
  IconFile
} from '@arco-design/web-react/icon';
import { useAppStore } from '../store';

const { Row, Col } = Grid;
const { Title } = Typography;

const Dashboard: React.FC = () => {
  const { employees, attendanceRecords, leaveRequests } = useAppStore();

  // 计算统计数据
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.status === 'active').length;
  const todayRecords = attendanceRecords.filter(record => 
    record.date === new Date().toISOString().split('T')[0]
  );
  const presentToday = todayRecords.filter(record => record.status === 'normal').length;
  const lateToday = todayRecords.filter(record => record.status === 'late').length;
  const pendingLeaves = leaveRequests.filter(request => request.status === 'pending').length;

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    suffix?: string;
  }> = ({ title, value, icon, color, suffix = '' }) => (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ color: 'var(--color-text-2)', marginBottom: 8 }}>
            {title}
          </div>
          <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--color-text-1)' }}>
            {value}{suffix}
          </div>
        </div>
        <div style={{ 
          backgroundColor: color + '20', 
          color: color,
          width: 48,
          height: 48,
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20
        }}>
          {icon}
        </div>
      </div>
    </Card>
  );

  return (
    <div>
      <Title heading={4} style={{ marginBottom: 24 }}>
        考勤系统仪表盘
      </Title>
      
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <StatCard
            title="总员工数"
            value={totalEmployees}
            icon={<IconUser />}
            color="#165DFF"
            suffix="人"
          />
        </Col>
        <Col span={6}>
          <StatCard
            title="在职员工"
            value={activeEmployees}
            icon={<IconCheckCircle />}
            color="#00B42A"
            suffix="人"
          />
        </Col>
        <Col span={6}>
          <StatCard
            title="今日出勤"
            value={presentToday}
            icon={<IconCalendar />}
            color="#FF7D00"
            suffix="人"
          />
        </Col>
        <Col span={6}>
          <StatCard
            title="今日迟到"
            value={lateToday}
            icon={<IconSchedule />}
            color="#F53F3F"
            suffix="人"
          />
        </Col>
      </Row>

      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card title="今日考勤概况">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>正常出勤</span>
                <span style={{ color: '#00B42A', fontWeight: 600 }}>{presentToday}人</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>迟到</span>
                <span style={{ color: '#F53F3F', fontWeight: 600 }}>{lateToday}人</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>缺勤</span>
                <span style={{ color: '#86909C', fontWeight: 600 }}>
                  {activeEmployees - presentToday - lateToday}人
                </span>
              </div>
            </Space>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="请假申请">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>待审批</span>
                <span style={{ color: '#FF7D00', fontWeight: 600 }}>{pendingLeaves}件</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>已批准</span>
                <span style={{ color: '#00B42A', fontWeight: 600 }}>
                  {leaveRequests.filter(req => req.status === 'approved').length}件
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>已拒绝</span>
                <span style={{ color: '#F53F3F', fontWeight: 600 }}>
                  {leaveRequests.filter(req => req.status === 'rejected').length}件
                </span>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={24}>
          <Card title="快捷操作">
            <Space size="large">
              <div style={{ textAlign: 'center', cursor: 'pointer', padding: '16px' }}>
                <div style={{ fontSize: 24, marginBottom: 8, color: '#165DFF' }}>
                  <IconUser />
                </div>
                <div>员工管理</div>
              </div>
              <div style={{ textAlign: 'center', cursor: 'pointer', padding: '16px' }}>
                <div style={{ fontSize: 24, marginBottom: 8, color: '#00B42A' }}>
                  <IconCalendar />
                </div>
                <div>排班管理</div>
              </div>
              <div style={{ textAlign: 'center', cursor: 'pointer', padding: '16px' }}>
                <div style={{ fontSize: 24, marginBottom: 8, color: '#FF7D00' }}>
                  <IconFile />
                </div>
                <div>考勤报表</div>
              </div>
              <div style={{ textAlign: 'center', cursor: 'pointer', padding: '16px' }}>
                <div style={{ fontSize: 24, marginBottom: 8, color: '#F53F3F' }}>
                  <IconCloseCircle />
                </div>
                <div>请假管理</div>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;