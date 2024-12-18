import { useState, useEffect } from "react";

function prioritySort(a, b) {
  const priorityOrder = {
    'high': 0,    // Highest priority (first)
    'mid': 1,     // Medium priority
    'low': 2,     // Lowest priority (last)
    '': 3        // No priority assigned
  };

  // Safely get priority, converting to lowercase and defaulting to empty string
  const priorityA = (a.priority || '').toLowerCase();
  const priorityB = (b.priority || '').toLowerCase();

  // First sort by priority
  if (priorityOrder[priorityA] !== priorityOrder[priorityB]) {
    return priorityOrder[priorityA] - priorityOrder[priorityB];
  }

  // Secondary sorting by date
  const dateStartA = a.dateStart ? new Date(a.dateStart).getTime() : Infinity;
  const dateStartB = b.dateStart ? new Date(b.dateStart).getTime() : Infinity;

  // If start dates are the same, compare end dates
  if (dateStartA === dateStartB) {
    const dateEndA = a.dateEnd ? new Date(a.dateEnd).getTime() : Infinity;
    const dateEndB = b.dateEnd ? new Date(b.dateEnd).getTime() : Infinity;
    return dateEndA - dateEndB;
  }

  return dateStartA - dateStartB;
}

function TodoList(props) {
  const [sortedTasks, setSortedTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find the active list or default to the first list
    const todoList = props.todoLists.find(list => list.id === props.activeListId) || props.todoLists[0];
    const tasksData = todoList.data || [];

    // Sort tasks by priority first, always
    let sortedData = [...tasksData].sort(prioritySort);

    // Separate tasks into unchecked and checked
    const uncheckedTasks = sortedData.filter(todo => !todo.checked);
    const checkedTasks = sortedData.filter(todo => todo.checked);

    // Combine unchecked tasks (prioritized) with checked tasks at the end
    setSortedTasks([...uncheckedTasks, ...checkedTasks]);
    setLoading(false);
  }, [props.todoLists, props.activeListId]);

  return (
    <>
      {loading ? (
        <div className="text-white pt-10 text-sm">
          Loading...
        </div>
      ) : sortedTasks.length === 0 ? (
        <div className="text-white pt-10 text-sm">
          No Data
        </div>
      ) : (
        sortedTasks.map(props.mapTodo)
      )}
    </>
  )
}

export default TodoList;