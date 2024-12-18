'use client';
import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../../components/config/config';
import TodoCreator from '../../components/TodoCreator/index';
import LeftContainer from '../../components/LeftContainer';
import MidContainer from '../../components/MidContainer';
import RightContainer from '../../components/RightContainer';
import { nanoid } from 'nanoid';

const initTodo = {
  name: '',
  priority: 'low',
  dateStart: '',
  dateEnd: '',
  tags: [],
  checked: false
};

function App() {
  const [creatorState, setCreatorState] = useState('hidden');
  const [todoLists, setTodoLists] = useState([]);
  const [activeListId, setActiveListId] = useState(null);
  const [displayedTodo, setDisplayedTodo] = useState(initTodo);
  const [taskCache, setTaskCache] = useState({});

  // Load lists and tasks in one efficient query
  useEffect(() => {
    const loadListsAndTasks = async () => {
      try {
        const tasksCollection = collection(db, 'tasks');
        const querySnapshot = await getDocs(tasksCollection);

        // Group tasks by list ID
        const tasksByList = {};
        querySnapshot.docs.forEach(doc => {
          const taskData = { id: doc.id, ...doc.data() };
          
          // Generate a list ID if not present
          const listId = taskData.listId || nanoid();
          const listName = taskData.listName || 'New List';

          if (!tasksByList[listId]) {
            tasksByList[listId] = [];
          }
          tasksByList[listId].push(taskData);
        });

        // Create lists with their tasks
        const lists = Object.entries(tasksByList).map(([listId, tasks]) => ({
          id: listId,
          name: tasks[0]?.listName || 'New List',
          data: tasks,
        }));

        // If no lists, create a default
        if (lists.length === 0) {
          const newListId = nanoid();
          lists.push({
            id: newListId,
            name: 'New List',
            data: [],
          });
        }

        setTodoLists(lists);
        
        // Set initial active list
        const initialList = lists[0];
        setActiveListId(initialList.id);

        // Cache tasks for faster access
        const cache = {};
        lists.forEach(list => {
          cache[list.id] = list.data;
        });
        setTaskCache(cache);
      } catch (error) {
        console.error('Error loading lists and tasks:', error);
      }
    };

    loadListsAndTasks();

    // Set up real-time listener for tasks
    const tasksCollection = collection(db, 'tasks');
    const unsubscribe = onSnapshot(tasksCollection, (snapshot) => {
      // Group tasks by list ID
      const tasksByList = {};
      snapshot.docs.forEach(doc => {
        const taskData = { id: doc.id, ...doc.data() };
        
        // Generate a list ID if not present
        const listId = taskData.listId || nanoid();
        const listName = taskData.listName || 'New List';

        if (!tasksByList[listId]) {
          tasksByList[listId] = [];
        }
        tasksByList[listId].push(taskData);
      });

      // Create lists with their tasks
      const lists = Object.entries(tasksByList).map(([listId, tasks]) => ({
        id: listId,
        name: tasks[0]?.listName || 'New List',
        data: tasks,
      }));

      // If no lists, create a default
      if (lists.length === 0) {
        const newListId = nanoid();
        lists.push({
          id: newListId,
          name: 'New List',
          data: [],
        });
      }

      // Preserve the current active list if it exists
      const currentActiveList = lists.find(list => list.id === activeListId);

      // Update lists
      setTodoLists(lists);

      // If the current active list doesn't exist, default to first list
      if (!currentActiveList && lists.length > 0) {
        setActiveListId(lists[0].id);
      }

      // Update task cache
      const cache = {};
      lists.forEach(list => {
        cache[list.id] = list.data;
      });
      setTaskCache(cache);
      
    });

    // Cleanup listener
    return () => unsubscribe();
  }, []);

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      setCreatorState('hidden');
      setDisplayedTodo(initTodo);
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => { window.removeEventListener('keydown', handleKeyDown); };
  }, []);

  const todoCreatorProps = {
    todoLists,
    activeListId,
    creatorState,
    setCreatorState,
    displayedTodo,
    setDisplayedTodo,
  };

  const leftContainerProps = {
    todoLists,
    setTodoLists,
    activeListId,
    setActiveListId,
  };

  const midContainerProps = {
    todoLists,
    setTodoLists,
    creatorState,
    setCreatorState,
    setDisplayedTodo,
    activeListId,
    taskCache,
  };

  const rightContainerProps = {
    todoLists,
    setTodoLists,
    activeListId,
  };

  return (
    <div className="font-sans w-screen min-h-screen h-full bg-neutral-900">
      {creatorState !== 'hidden' && <TodoCreator {...todoCreatorProps} />}
      <LeftContainer {...leftContainerProps} />
      <MidContainer {...midContainerProps} />
      <RightContainer {...rightContainerProps} />
    </div>
  );
}

export default App;