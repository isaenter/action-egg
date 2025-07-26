import { useState, useRef } from 'react';
import { HotTable } from '@handsontable/react';
import { 
  Card, 
  Select, 
  Button, 
  Space, 
  Typography,
  DatePicker,
  Message
} from '@arco-design/web-react';
import { IconDownload, IconRefresh } from '@arco-design/web-react/icon';
import dayjs from 'dayjs';
import { useAppStore } from '../store';
import type { AttendanceRecord } from '../types';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const Option = Select.Option;

const AttendanceReport: React.FC = () => {
  const { employees, attendanceRecords, departments } = useAppStore();
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs()
  ]);
  const hotTableRef = useRef<any>(null);

  // 生成模拟考勤数据
  const generateMockData = () => {
    const mockRecords: AttendanceRecord[] = [];
    const [startDate, endDate] = dateRange;
    
    employees.forEach(employee => {
      for (let date = startDate.clone(); date.isBefore(endDate.add(1, 'day')); date = date.add(1, 'day')) {
        // 跳过周末
        if (date.day() === 0 || date.day() === 6) continue;
        
        const random = Math.random();
        let status: AttendanceRecord['status'] = 'normal';
        let checkInTime = '09:00';
        let checkOutTime = '18:00';
        let workHours = 8;
        let overtimeHours = 0;

        if (random < 0.1) {
          status = 'late';
          checkInTime = '09:30';
        } else if (random < 0.15) {
          status = 'early_leave';
          checkOutTime = '17:30';
          workHours = 7.5;
        } else if (random < 0.2) {
          status = 'overtime';
          checkOutTime = '20:00';
          workHours = 10;
          overtimeHours = 2;
        } else if (random < 0.25) {
          status = 'absent';
          checkInTime = undefined as string | undefined;
          checkOutTime = undefined as string | undefined;
          workHours = 0;
        }

        mockRecords.push({
          id: `${employee.id}-${date.format('YYYY-MM-DD')}`,
          employeeId: employee.id,
          date: date.format('YYYY-MM-DD'),
          checkInTime,
          checkOutTime,
          workHours,
          status,
          overtimeHours
        });
      }
    });

    return mockRecords;
  };

  const [mockData] = useState(() => generateMockData());
  const allRecords = [...attendanceRecords, ...mockData];

  const getFilteredData = () => {
    let filteredRecords = allRecords;

    // 按部门过滤
    if (selectedDepartment) {
      const departmentEmployees = employees.filter(emp => emp.department === selectedDepartment);
      const employeeIds = departmentEmployees.map(emp => emp.id);
      filteredRecords = filteredRecords.filter(record => employeeIds.includes(record.employeeId));
    }

    // 按日期范围过滤
    const [startDate, endDate] = dateRange;
    filteredRecords = filteredRecords.filter(record => {
      const recordDate = dayjs(record.date);
      return recordDate.isAfter(startDate.subtract(1, 'day')) && recordDate.isBefore(endDate.add(1, 'day'));
    });

    // 转换为表格数据格式
    return filteredRecords.map(record => {
      const employee = employees.find(emp => emp.id === record.employeeId);
      return [
        employee?.name || '未知',
        employee?.employeeId || '未知',
        employee?.department || '未知',
        record.date,
        record.checkInTime || '-',
        record.checkOutTime || '-',
        record.workHours,
        record.overtimeHours || 0,
        getStatusText(record.status)
      ];
    });
  };

  const getStatusText = (status: AttendanceRecord['status']) => {
    const statusMap = {
      normal: '正常',
      late: '迟到',
      early_leave: '早退',
      absent: '缺勤',
      overtime: '加班'
    };
    return statusMap[status] || '未知';
  };

  const handleExport = () => {
    const hot = hotTableRef.current?.hotInstance;
    if (hot) {
      const plugin = hot.getPlugin('exportFile');
      plugin.downloadFile('csv', {
        filename: `考勤报表_${dayjs().format('YYYY-MM-DD')}`
      });
      Message.success('导出成功');
    }
  };

  const handleRefresh = () => {
    // 这里可以重新获取数据
    Message.success('数据已刷新');
  };

  const tableData = getFilteredData();

  const columns = [
    { data: 0, title: '姓名', width: 100 },
    { data: 1, title: '工号', width: 120 },
    { data: 2, title: '部门', width: 120 },
    { data: 3, title: '日期', width: 120 },
    { data: 4, title: '签到时间', width: 100 },
    { data: 5, title: '签退时间', width: 100 },
    { data: 6, title: '工作时长(h)', width: 120, type: 'numeric' },
    { data: 7, title: '加班时长(h)', width: 120, type: 'numeric' },
    { data: 8, title: '状态', width: 80 }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title heading={4} style={{ margin: 0 }}>
          考勤报表
        </Title>
        <Space>
          <Button icon={<IconRefresh />} onClick={handleRefresh}>
            刷新
          </Button>
          <Button type="primary" icon={<IconDownload />} onClick={handleExport}>
            导出Excel
          </Button>
        </Space>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <Space size="large">
          <div>
            <span style={{ marginRight: 8 }}>部门:</span>
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
          </div>
          
          <div>
            <span style={{ marginRight: 8 }}>日期范围:</span>
            <RangePicker
              value={dateRange}
              onChange={(dates) => {
              if (dates && dates.length === 2) {
                setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs]);
              }
            }}
              style={{ width: 280 }}
            />
          </div>
        </Space>
      </Card>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <span>共 {tableData.length} 条记录</span>
            <span style={{ color: '#00B42A' }}>
              正常: {tableData.filter(row => row[8] === '正常').length}
            </span>
            <span style={{ color: '#F53F3F' }}>
              迟到: {tableData.filter(row => row[8] === '迟到').length}
            </span>
            <span style={{ color: '#FF7D00' }}>
              早退: {tableData.filter(row => row[8] === '早退').length}
            </span>
            <span style={{ color: '#86909C' }}>
              缺勤: {tableData.filter(row => row[8] === '缺勤').length}
            </span>
            <span style={{ color: '#165DFF' }}>
              加班: {tableData.filter(row => row[8] === '加班').length}
            </span>
          </Space>
        </div>
        
        <div style={{ height: '600px', width: '100%' }}>
          <HotTable
            ref={hotTableRef}
            data={tableData}
            columns={columns}
            width="100%"
            height="100%"
            rowHeaders={true}
            colHeaders={true}
            columnSorting={true}
            filters={true}
            dropdownMenu={true}
            contextMenu={true}
            manualColumnResize={true}
            manualRowResize={true}
            stretchH="all"
            licenseKey="non-commercial-and-evaluation"
          />
        </div>
      </Card>
    </div>
  );
};

export default AttendanceReport;