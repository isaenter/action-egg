import { useState } from 'react';
import { 
  Card, 
  Grid, 
  Select, 
  DatePicker, 
  Typography, 
  Space,
  Statistic,
  Progress
} from '@arco-design/web-react';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';
import { useAppStore } from '../store';

const { Row, Col } = Grid;
const { Title } = Typography;
const { RangePicker } = DatePicker;
const Option = Select.Option;

const AttendanceAnalysis: React.FC = () => {
  const { employees, departments } = useAppStore();
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs()
  ]);

  // 生成模拟数据用于分析
  const generateAnalysisData = () => {
    const data = {
      attendanceRate: 92.5,
      punctualityRate: 87.3,
      overtimeHours: 245,
      averageWorkHours: 8.2,
      dailyTrend: [] as any[],
      departmentStats: [] as any[],
      statusDistribution: [] as any[]
    };

    // 每日考勤趋势
    for (let i = 29; i >= 0; i--) {
      const date = dayjs().subtract(i, 'day');
      if (date.day() !== 0 && date.day() !== 6) { // 排除周末
        data.dailyTrend.push({
          date: date.format('MM-DD'),
          attendance: Math.floor(Math.random() * 10) + 85,
          punctuality: Math.floor(Math.random() * 15) + 80
        });
      }
    }

    // 部门统计
    departments.forEach(dept => {
      const deptEmployees = employees.filter(emp => emp.department === dept.name).length;
      data.departmentStats.push({
        department: dept.name,
        total: deptEmployees,
        present: Math.floor(deptEmployees * (0.85 + Math.random() * 0.15)),
        late: Math.floor(deptEmployees * Math.random() * 0.1),
        absent: Math.floor(deptEmployees * Math.random() * 0.05)
      });
    });

    // 状态分布
    data.statusDistribution = [
      { name: '正常', value: 75, color: '#00B42A' },
      { name: '迟到', value: 12, color: '#F53F3F' },
      { name: '早退', value: 8, color: '#FF7D00' },
      { name: '缺勤', value: 3, color: '#86909C' },
      { name: '加班', value: 2, color: '#165DFF' }
    ];

    return data;
  };

  const analysisData = generateAnalysisData();

  // 考勤趋势图配置
  const trendChartOption = {
    title: {
      text: '30天考勤趋势',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      top: 30,
      data: ['出勤率', '准时率']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: analysisData.dailyTrend.map(item => item.date)
    },
    yAxis: {
      type: 'value',
      min: 70,
      max: 100,
      axisLabel: {
        formatter: '{value}%'
      }
    },
    series: [
      {
        name: '出勤率',
        type: 'line',
        data: analysisData.dailyTrend.map(item => item.attendance),
        smooth: true,
        itemStyle: {
          color: '#165DFF'
        }
      },
      {
        name: '准时率',
        type: 'line',
        data: analysisData.dailyTrend.map(item => item.punctuality),
        smooth: true,
        itemStyle: {
          color: '#00B42A'
        }
      }
    ]
  };

  // 部门对比图配置
  const departmentChartOption = {
    title: {
      text: '部门考勤对比',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      top: 30,
      data: ['出勤', '迟到', '缺勤']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: analysisData.departmentStats.map(item => item.department)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '出勤',
        type: 'bar',
        data: analysisData.departmentStats.map(item => item.present),
        itemStyle: {
          color: '#00B42A'
        }
      },
      {
        name: '迟到',
        type: 'bar',
        data: analysisData.departmentStats.map(item => item.late),
        itemStyle: {
          color: '#F53F3F'
        }
      },
      {
        name: '缺勤',
        type: 'bar',
        data: analysisData.departmentStats.map(item => item.absent),
        itemStyle: {
          color: '#86909C'
        }
      }
    ]
  };

  // 状态分布饼图配置
  const pieChartOption = {
    title: {
      text: '考勤状态分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}% ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle'
    },
    series: [
      {
        name: '考勤状态',
        type: 'pie',
        radius: '50%',
        center: ['50%', '60%'],
        data: analysisData.statusDistribution.map(item => ({
          ...item,
          itemStyle: { color: item.color }
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title heading={4} style={{ margin: 0 }}>
          考勤分析
        </Title>
        <Space>
          <Select
            style={{ width: 200 }}
            placeholder="请选择部门"
            allowClear
            value={selectedDepartment}
            onChange={setSelectedDepartment}
          >
            {departments.map(dept => (
              <Option key={dept.id} value={dept.name}>
                {dept.name}
              </Option>
            ))}
          </Select>
          <RangePicker
            value={dateRange}
            onChange={(dates) => {
              if (dates && dates.length === 2) {
                setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs]);
              }
            }}
            style={{ width: 280 }}
          />
        </Space>
      </div>

      {/* 统计卡片 */}
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="出勤率"
              value={analysisData.attendanceRate}
              precision={1}
              suffix="%"
            />
            <Progress
              percent={analysisData.attendanceRate}
              status={analysisData.attendanceRate >= 90 ? 'success' : 'normal'}
              showText={false}
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="准时率"
              value={analysisData.punctualityRate}
              precision={1}
              suffix="%"
            />
            <Progress
              percent={analysisData.punctualityRate}
              status={analysisData.punctualityRate >= 85 ? 'success' : 'normal'}
              showText={false}
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="本月加班时长"
              value={analysisData.overtimeHours}
              suffix="小时"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均工作时长"
              value={analysisData.averageWorkHours}
              precision={1}
              suffix="小时/天"
            />
          </Card>
        </Col>
      </Row>

      {/* 图表分析 */}
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card>
            <ReactECharts
              option={trendChartOption}
              style={{ height: '400px' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={16}>
          <Card>
            <ReactECharts
              option={departmentChartOption}
              style={{ height: '400px' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <ReactECharts
              option={pieChartOption}
              style={{ height: '400px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 部门详细统计 */}
      <Row gutter={24} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="部门考勤详情">
            <Row gutter={16}>
              {analysisData.departmentStats.map((dept, index) => (
                <Col span={6} key={index} style={{ marginBottom: 16 }}>
                  <div style={{ 
                    padding: '16px', 
                    border: '1px solid var(--color-border-2)', 
                    borderRadius: '6px' 
                  }}>
                    <div style={{ fontWeight: 600, marginBottom: 12 }}>
                      {dept.department}
                    </div>
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>总人数:</span>
                        <span style={{ fontWeight: 600 }}>{dept.total}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>出勤:</span>
                        <span style={{ color: '#00B42A', fontWeight: 600 }}>{dept.present}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>迟到:</span>
                        <span style={{ color: '#F53F3F', fontWeight: 600 }}>{dept.late}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>缺勤:</span>
                        <span style={{ color: '#86909C', fontWeight: 600 }}>{dept.absent}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>出勤率:</span>
                        <span style={{ 
                          color: dept.present / dept.total >= 0.9 ? '#00B42A' : '#FF7D00',
                          fontWeight: 600 
                        }}>
                          {((dept.present / dept.total) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </Space>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AttendanceAnalysis;