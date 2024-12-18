import Checkbox from '../Checkbox';
import Date from './Date';
import Tags from './Tags';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/config';

function Todo(props) {
  const {
    todo,
    todoLists,
    setTodoLists,
    activeListId,
    setCreatorState,
    setDisplayedTodo
  } = props;

  const handleTaskClick = (e) => {
    // Check if the click target is not the checkbox or delete button
    if (!e.target.closest('button')) {
      setCreatorState('edit');
      setDisplayedTodo(todo);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      // Delete the task from Firestore
      const taskDocRef = doc(db, 'tasks', todo.id);
      await deleteDoc(taskDocRef);
  
      // Update local state to remove the task from the current list
      setTodoLists((prevLists) => 
        prevLists.map(list => {
          if (list.id === activeListId) {
            return {
              ...list,
              data: list.data.filter(t => t.id !== todo.id)
            };
          }
          return list;
        })
      );
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div
      className="w-[35rem] h-20 px-3 rounded-lg bg-neutral-800 text-white relative
      flex items-center gap-3 cursor-pointer group"
      onClick={handleTaskClick}
    >
      <button
        className="absolute right-3 top-2
        text-neutral-800 group-hover:text-neutral-300 transition"
        onClick={handleDelete}
      >
        ✕
      </button>
      <Checkbox
        todo={todo}
        todoLists={todoLists}
        setTodoLists={setTodoLists}
        activeListId={activeListId}
        checked={todo.checked}
        inProgress={todo.inProgress}
      />
      <div className="flex flex-col h-full w-full justify-center">
        <div className={`text-sm 
          ${todo.checked ? 'line-through text-neutral-500' : ''} 
          ${todo.inProgress ? 'italic text-yellow-300' : ''}
        `}>
          {todo.name}
        </div>
        <div className="flex flex-row w-full justify-between">
          <Date
            dateStart={todo.dateStart}
            dateEnd={todo.dateEnd}
          />
          <Tags tags={todo.tags} />
        </div>
      </div>
    </div>
  );
}

export default Todo;