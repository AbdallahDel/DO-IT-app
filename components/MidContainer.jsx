import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import TodoList from './TodoList';
import Todo from './Todo';
import SortButton from './SortButton';
import SearchBar from './/TodoCreator/SearchBar';

function MidContainer(props) {
  const {
    todoLists, 
    setTodoLists, 
    creatorState, 
    setCreatorState, 
    setDisplayedTodo, 
    activeListId,
    taskCache, 
  } = props;

  const [showSort, setShowSort] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const ref = useRef(null);

  // Memoize active list to prevent unnecessary re-renders
  const activeList = useMemo(() => 
    todoLists.find(list => list.id === activeListId), 
    [todoLists, activeListId]
  );

  // Use list ID instead of name for caching
  const tasks = useMemo(() => 
    activeList ? (taskCache[activeListId] || []) : [], 
    [activeList, taskCache, activeListId]
  );

  // Filter tasks based on search term
  const filteredTasks = useMemo(() => {
    if (!searchTerm) return tasks;
    return tasks.filter(task => 
      task.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tasks, searchTerm]);

  // Memoize sorted tasks
  const [sortedTasks, setSortedTasks] = useState(filteredTasks);

  // Update sorted tasks when filtered tasks change
  useEffect(() => {
    setSortedTasks(filteredTasks);
  }, [filteredTasks]);

  // Handle sorting logic with useCallback for performance
  const handleSort = useCallback((key) => {
    let sortedArray = [...filteredTasks];

    switch (key) {
      case 'name':
        sortedArray.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'date':
        sortedArray.sort((a, b) => new Date(a.dateStart) - new Date(b.dateStart));
        break;
      case 'priority':
        const priorityOrder = { low: 1, medium: 2, high: 3 };
        sortedArray.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        break;
      default:
        sortedArray = [...filteredTasks];
    }

    setSortedTasks(sortedArray);
  }, [filteredTasks]);

  // Click outside logic
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setShowSort(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [ref]);

  // Memoize todo mapping function
  const mapTodo = useCallback((todo) => (
    <Todo
      todo={todo}
      todoLists={todoLists}
      setTodoLists={setTodoLists}
      activeListId={activeListId}
      key={todo.id}
      creatorState={creatorState}
      setCreatorState={setCreatorState}
      setDisplayedTodo={setDisplayedTodo}
    />
  ), [
    todoLists, 
    setTodoLists, 
    activeListId, 
    creatorState, 
    setCreatorState, 
    setDisplayedTodo
  ]);

  return (
    <div className="flex flex-col items-center pt-10 ml-52 mr-96 gap-2">
      <div className="w-[35rem] flex items-center gap-3">
        <button
          className="w-auto h-7 rounded-md px-1 py-0
          text-neutral-300 bg-neutral-900 hover:bg-neutral-800 transition-all"
          onClick={() => setCreatorState('add')}
        >
          + Add Todo
        </button>
        <div className="ml-auto flex items-center gap-3">
          <SearchBar onSearch={setSearchTerm} />
          <div
            className="w-auto h-7 rounded-md px-1 py-0 relative cursor-pointer
            text-neutral-300 bg-neutral-900 hover:bg-neutral-800 transition-all"
            onClick={() => setShowSort(true)}
          >
            Sort
            {showSort &&
              <div
                ref={ref}
                className="absolute w-24 p-2 flex flex-col gap-1 items-start rounded-sm bg-neutral-700 top-9 right-0 z-10"
              >
                <SortButton name="None" value={null} onSort={handleSort} />
                <SortButton name="Name" value="name" onSort={handleSort} />
                <SortButton name="Date" value="date" onSort={handleSort} />
                <SortButton name="Priority" value="priority" onSort={handleSort} />
              </div>
            }
          </div>
        </div>
      </div>
      <TodoList
        todoLists={[{ id: '1', data: sortedTasks }]}
        activeListId={activeListId}
        mapTodo={mapTodo}
      />
    </div>
  );
}

export default MidContainer;