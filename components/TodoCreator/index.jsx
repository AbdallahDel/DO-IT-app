import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { db } from '../config/config';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';

import Priority from './Priority';
import Title from './Title';
import DateInput from './Date';
import Tags from './Tags';
import Buttons from './Buttons';

const initTodo = {
  listId: '',
  listName: '',
  name: '',
  priority: 'low',
  dateStart: '',
  dateEnd: '',
  tags: [],
  checked: false,
};

function TodoCreator(props) {
  const {
    todoLists, 
    activeListId, 
    creatorState, 
    setCreatorState, 
    displayedTodo, 
    setDisplayedTodo,
  } = props;

  // Memoize active list to prevent unnecessary re-renders
  const activeList = useMemo(() => 
    todoLists.find(list => list.id === activeListId), 
    [todoLists, activeListId]
  );

  const [todo, setTodo] = useState(displayedTodo || {
    ...initTodo,
    listId: activeListId,
    listName: activeList ? activeList.name : 'New List'
  });

  const nameRef = useRef(null);
  const dateStartRef = useRef(null);
  const dateEndRef = useRef(null);
  const tagsRef = useRef(null);

  // Optimize focus and todo state update
  useEffect(() => {
    if (nameRef.current) nameRef.current.focus();
    setTodo(prevTodo => ({
      ...displayedTodo || {
        ...initTodo,
        listId: activeListId,
        listName: activeList ? activeList.name : 'New List'
      },
      listId: activeListId,
      listName: activeList ? activeList.name : 'New List'
    }));
  }, [displayedTodo, activeListId, activeList]);

  // Memoize handleSubmit to prevent unnecessary re-renders
  const handleSubmit = useCallback(async () => {
    if (!todo.name.trim()) return;

    try {
      const tasksCollection = collection(db, 'tasks');
      const taskData = {
        listId: activeListId,
        listName: activeList ? activeList.name : 'New List',
        name: todo.name,
        priority: todo.priority,
        dateStart: todo.dateStart,
        dateEnd: todo.dateEnd,
        tags: todo.tags,
        checked: todo.checked,
      };

      if (creatorState === 'edit' && todo.id) {
        // Update existing task
        const taskDocRef = doc(db, 'tasks', todo.id);
        await updateDoc(taskDocRef, taskData);
      } else {
        // Add new task
        await addDoc(tasksCollection, taskData);
      }

      // Reset state
      setTodo({
        ...initTodo,
        listId: activeListId,
        listName: activeList ? activeList.name : 'New List'
      });
      setCreatorState('hidden');
      setDisplayedTodo(initTodo);

      // Focus on name input
      if (nameRef.current) nameRef.current.focus();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  }, [
    todo, 
    activeListId, 
    activeList, 
    creatorState, 
    setCreatorState, 
    setDisplayedTodo
  ]);

  return (
    <>
      <div
        className="w-screen h-screen fixed top-0 left-0 bg-black z-10 opacity-50"
        onClick={() => {
          setCreatorState('hidden');
          setDisplayedTodo(initTodo);
        }}
      />
      <div
        className="w-[48%] h-max px-10 py-8 text-white bg-neutral-800
        rounded-lg fixed left-[26%] z-20 flex flex-col gap-5 outline-none top-16"
      >
        <Title
          todo={todo}
          setTodo={setTodo}
          nameRef={nameRef}
          handleSubmit={handleSubmit}
        />
        <div className="flex gap-10">
          <DateInput
            todo={todo}
            setTodo={setTodo}
            dateStartRef={dateStartRef}
            dateEndRef={dateEndRef}
          />
          <div className="flex flex-col w-1/2 gap-10">
            <Priority
              todo={todo}
              setTodo={setTodo}
              todoLists={todoLists}
            />
            <Tags
              todo={todo}
              setTodo={setTodo}
              tagsRef={tagsRef}
              handleSubmit={handleSubmit}
            />
            <Buttons
              creatorState={creatorState}
              setCreatorState={setCreatorState}
              setDisplayedTodo={setDisplayedTodo}
              handleSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default TodoCreator;