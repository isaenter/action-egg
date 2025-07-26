# 考勤管理系统

一个基于React + TypeScript的现代化考勤管理系统，使用Arco Design UI框架和Handsontable数据表格。

## 功能特色

### 📊 核心模块
- **仪表盘** - 实时考勤数据统计和概览
- **人员管理** - 员工信息的增删改查，支持搜索和筛选
- **排班管理** - 可视化日历排班，支持多班次管理
- **考勤报表** - 强大的数据表格展示，支持导出Excel
- **考勤分析** - 多维度图表分析，包含趋势和统计数据
- **请假管理** - 完整的请假申请和审批流程

### 🛠 技术栈
- **前端框架**: React 18 + TypeScript
- **UI组件库**: Arco Design
- **数据表格**: Handsontable
- **图表库**: ECharts
- **状态管理**: Zustand
- **路由**: React Router
- **构建工具**: Vite
- **样式**: CSS + CSS Variables

### 🎯 技术亮点
- 响应式设计，适配移动端
- 模块化架构，易于扩展
- 完整的TypeScript类型支持
- 丰富的模拟数据展示
- 现代化的用户界面设计

## 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

应用将在 `http://localhost:5173` 运行

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 项目结构

```
src/
├── components/          # 公共组件
│   └── Layout.tsx      # 主布局组件
├── pages/              # 页面组件
│   ├── Dashboard.tsx   # 仪表盘
│   ├── EmployeeManagement.tsx  # 人员管理
│   ├── ScheduleManagement.tsx  # 排班管理
│   ├── AttendanceReport.tsx    # 考勤报表
│   ├── AttendanceAnalysis.tsx  # 考勤分析
│   └── LeaveManagement.tsx     # 请假管理
├── store/              # 状态管理
│   └── index.ts        # Zustand store
├── types/              # TypeScript 类型定义
│   └── index.ts        # 通用类型
├── utils/              # 工具函数
├── App.tsx             # 根组件
├── App.css             # 全局样式
└── main.tsx            # 应用入口
```

## 主要功能说明

### 人员管理
- 支持添加、编辑、删除员工信息
- 按姓名、工号、部门搜索
- 头像显示和状态管理

### 排班管理
- 日历视图展示排班信息
- 支持早班、中班、夜班、休息四种班次
- 可视化编辑排班安排

### 考勤报表
- 基于Handsontable的强大数据表格
- 支持按部门和日期范围筛选
- 数据导出Excel功能
- 实时统计各种考勤状态

### 考勤分析
- 30天考勤趋势图表
- 部门考勤对比分析
- 考勤状态分布饼图
- 关键指标统计

### 请假管理
- 支持多种请假类型（年假、病假、事假等）
- 完整的申请和审批流程
- 申请状态跟踪
- 详情查看和审批操作

## 开发说明

### 数据结构
系统使用了完整的TypeScript类型定义，主要包括：
- `Employee` - 员工信息
- `Schedule` - 排班信息  
- `AttendanceRecord` - 考勤记录
- `LeaveRequest` - 请假申请
- `Department` - 部门信息

### 状态管理
使用Zustand进行状态管理，包含：
- 员工数据的CRUD操作
- 排班数据管理
- 考勤记录管理
- 请假申请管理

### 样式系统
- 使用CSS Variables实现主题系统
- 响应式设计适配移动端
- 统一的组件样式规范

## 浏览器支持

- Chrome >= 88
- Firefox >= 85  
- Safari >= 14
- Edge >= 88

## License

MIT License
