import { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar 
} from 'lucide-react';

function RightContainer({ todoLists, setTodoLists }) {
  // Compute statistics across all lists
  const stats = useMemo(() => {
    // Flatten all tasks from all lists
    const allTasks = todoLists.flatMap(list => list.data || []);

    // Task status breakdown
    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter(task => task.checked).length;
    const inProgressTasks = allTasks.filter(task => task.inProgress).length;
    const pendingTasks = totalTasks - completedTasks - inProgressTasks;

    // Priority breakdown
    const priorityBreakdown = {
      low: allTasks.filter(task => task.priority === 'low').length,
      mid: allTasks.filter(task => task.priority === 'mid').length,
      high: allTasks.filter(task => task.priority === 'high').length
    };

    // Tasks by list
    const tasksByList = todoLists.map(list => ({
      id: list.id,  // Use list ID instead of name
      name: list.name,
      tasks: (list.data || []).length
    }));

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      priorityBreakdown,
      tasksByList
    };
  }, [todoLists]);

  // Status pie chart data
  // Status Breakdown Pie Chart
// Status Breakdown Pie Chart

const statusData = [
  { name: 'Completed', value: stats.completedTasks, color: ' #CD7F32' }, // Indigo
  { name: 'In Progress', value: stats.inProgressTasks, color: '#6A7480 ' }, // Green
  { name: 'Pending', value: stats.pendingTasks, color: '#A6947D ' } // Red
];

// Priority Breakdown Bar Chart
const priorityData = [
  { name: 'Low', tasks: stats.priorityBreakdown.low, color: ' #808080' }, // Indigo
  { name: 'Mid', tasks: stats.priorityBreakdown.mid, color: '#F5F5F5' }, // Green
  { name: 'High', tasks: stats.priorityBreakdown.high, color: '#FFD54F' } // Red
];
  return (
    <div className="fixed right-0 top-0 w-96 h-full bg-neutral-800 p-4 overflow-y-auto">
      <h2 className="text-white text-xl font-bold mb-4">Dashboard</h2>
      
      {/* Overall Stats */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <StatCard 
          icon={<Clock className="text-yellow-500" />} 
          value={stats.totalTasks} 
          label="Total Tasks" 
        />
        <StatCard 
          icon={<CheckCircle2 className="text-green-500" />} 
          value={stats.completedTasks} 
          label="Completed" 
        />
        <StatCard 
          icon={<AlertTriangle className="text-red-500" />} 
          value={stats.inProgressTasks} 
          label="In Progress" 
        />
        <StatCard 
          icon={<Calendar className="text-blue-500" />} 
          value={stats.pendingTasks} 
          label="Pending" 
        />
      </div>

      {/* Status Breakdown Pie Chart */}
      <div className="mb-4">
        <h3 className="text-white text-md font-semibold mb-2">Task Status</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend 
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center"
              wrapperStyle={{ 
                paddingTop: '10px',
                marginBottom: '-10px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Priority Breakdown Bar Chart */}
      <div className="mb-4">
        <h3 className="text-white text-md font-semibold mb-2">Task Priorities</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={priorityData}>
            <XAxis dataKey="name" stroke="#ffffff" />
            <YAxis stroke="#ffffff" />
            <Tooltip />
            <Bar dataKey="tasks" fill="#8884d8">
              {priorityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Lists Overview */}
      <div>
        <h3 className="text-white text-md font-semibold mb-2">Lists Overview</h3>
        {stats.tasksByList.map((list) => (
          <div 
            key={list.id}  // Use list ID as key
            className="flex justify-between text-white text-sm mb-1"
          >
            <span>{list.name}</span>
            <span>{list.tasks} tasks</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper component for stat cards
function StatCard({ icon, value, label }) {
  return (
    <div className="bg-neutral-700 rounded-lg p-3 flex flex-col items-center justify-center">
      <div className="mb-1">{icon}</div>
      <span className="text-white font-bold text-lg">{value}</span>
      <span className="text-neutral-300 text-xs">{label}</span>
    </div>
  );
}

export default RightContainer;