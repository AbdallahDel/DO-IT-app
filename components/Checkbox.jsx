import { doc, updateDoc } from 'firebase/firestore';
import { db } from './config/config';
import { Loader2 } from 'lucide-react';

function Checkbox(props) {
  const priorityColors = {
    low: {
      border: 'border-neutral-400',
      background: 'bg-transparent',
      inProgressIcon: 'text-neutral-500',
      completedBackground: 'bg-neutral-400'
    },
    mid: {
      border: 'border-amber-100',
      background: 'bg-transparent',
      inProgressIcon: 'text-amber-300',
      completedBackground: 'bg-amber-100'
    },
    high: {
      border: 'border-amber-300',
      background: 'bg-transparent', 
      inProgressIcon: 'text-amber-500',
      completedBackground: 'bg-amber-300'
    }
  };

  async function handleClick(e) {
    e.stopPropagation();
  
    let newStatus;
    if (props.todo.checked) {
      newStatus = 'default';
    } else if (props.todo.inProgress) {
      newStatus = 'completed';
    } else {
      newStatus = 'inProgress';
    }
  
    try {
      // If the task has an ID, update it in Firestore
      if (props.todo.id) {
        const taskDocRef = doc(db, 'tasks', props.todo.id);
        await updateDoc(taskDocRef, {
          checked: newStatus === 'completed',
          inProgress: newStatus === 'inProgress'
        });
      }
  
      // Update local state
      if (props.todoLists === undefined) {
        // Checkbox in todo creator
        props.setTodo({ 
          ...props.todo, 
          checked: newStatus === 'completed', 
          inProgress: newStatus === 'inProgress' 
        });
      } else {
        props.setTodoLists((prevLists) => 
          prevLists.map((list) => {
            // Only modify if this is the active list
            if (list.id === props.activeListId) {
              return {
                ...list,
                data: list.data.map(task => 
                  task.id === props.todo.id 
                    ? { 
                        ...task,
                        checked: newStatus === 'completed', 
                        inProgress: newStatus === 'inProgress' 
                      }
                    : task
                )
              };
            }
            return list;
          })
        );
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }

  // Add a fallback for priority
  const priority = (props.todo.priority || 'low').toLowerCase();
  const currentPriority = ['low', 'mid', 'high'].includes(priority) ? priority : 'low';

  let icon, bgColor, borderColor;

  if (props.todo.checked) {
    // Completed state
    bgColor = priorityColors[currentPriority].completedBackground;
    borderColor = priorityColors[currentPriority].border;
    icon = (
      <svg width="10" height="10" className="mx-auto self-center">
        <path stroke="black" fill="transparent" d="M 1 3 L 4 9 L 8 0" />
      </svg>
    );
  } else if (props.todo.inProgress) {
    // In Progress state
    bgColor = priorityColors[currentPriority].background;
    borderColor = priorityColors[currentPriority].border;
    icon = <Loader2 className={`animate-spin ${priorityColors[currentPriority].inProgressIcon}`} size={10} />;
  } else {
    // Default state
    bgColor = priorityColors[currentPriority].background;
    borderColor = priorityColors[currentPriority].border;
    icon = null;
  }

  return (
    <button
      onClick={handleClick}
      className={`w-5 h-5 border-2 rounded-full flex items-center justify-center shrink-0 
        ${bgColor} ${borderColor}`}
    >
      {icon}
    </button>
  );
}

export default Checkbox;