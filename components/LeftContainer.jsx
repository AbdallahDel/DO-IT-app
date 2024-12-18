import Link from 'next/link';
import { nanoid } from 'nanoid';
import { useRef, useMemo } from 'react';
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from './config/config';

function LeftContainer(props) {
  const todoListNameRef = useRef(null);

  // Memoize the active list to prevent unnecessary re-renders
  const activeList = useMemo(() => 
    props.todoLists.find(list => list.id === props.activeListId), 
    [props.todoLists, props.activeListId]
  );

  // New function to delete all tasks associated with a list ID
  const deleteTasksInList = async (listId) => {
    try {
      const tasksCollection = collection(db, 'tasks');
      const q = query(tasksCollection, where('listId', '==', listId));
      
      const querySnapshot = await getDocs(q);
      
      const deletePromises = querySnapshot.docs.map(async (taskDoc) => {
        const taskDocRef = doc(db, 'tasks', taskDoc.id);
        await deleteDoc(taskDocRef);
      });

      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error deleting tasks in list:', error);
    }
  };

  const handleAddList = () => {
    const newList = {
      id: nanoid(),
      name: 'New List',
      data: []
    };

    props.setTodoLists([...props.todoLists, newList]);
    props.setActiveListId(newList.id);
  };

  const handleListNameChange = (todoList) => {
    const newName = todoListNameRef.current.value;
    
    const newTodoLists = props.todoLists.map(list => 
      list.id === props.activeListId 
        ? {...list, name: newName} 
        : list
    );

    // Update local state
    props.setTodoLists(newTodoLists);

    // Update tasks with the new list name
    updateTaskListNames(todoList.id, newName);
  };

  const handleListDelete = async (listToDelete) => {
    // First, delete all tasks in the list
    await deleteTasksInList(listToDelete.id);

    // Filter out the deleted list
    const newTodoLists = props.todoLists.filter(list => list.id !== listToDelete.id);

    if (newTodoLists.length > 0) {
      // Set active list to the first list in the remaining lists
      props.setActiveListId(newTodoLists[0].id);
      props.setTodoLists(newTodoLists);
    } else {
      // If no lists remain, add a new list
      handleAddList();
    }
  };

  const updateTaskListNames = async (listId, newListName) => {
    try {
      const tasksCollection = collection(db, 'tasks');
      const q = query(tasksCollection, where('listId', '==', listId));
      
      const querySnapshot = await getDocs(q);
      
      const updatePromises = querySnapshot.docs.map(async (taskDoc) => {
        const taskDocRef = doc(db, 'tasks', taskDoc.id);
        await updateDoc(taskDocRef, { 
          listId: listId,
          listName: newListName 
        });
      });

      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error updating task list names:', error);
    }
  };

  return (
    <div className="fixed left-0 top-0 w-52 h-full bg-neutral-800">
      <div className="mt-2 mb-10 ml-4 flex items-center gap-1">
        <img className="w-6 h-6" src="logo.ico" alt="Logo"/>
        <h1 className="text-white text-2xl font-bold">
          <Link href="/">DO-IT</Link>
        </h1>
      </div>
      <div className="flex flex-col gap-1">
        {props.todoLists.map(todoList => (
          <div
            className={`w-44 mx-auto px-2 py-3 rounded-md flex justify-between 
            font-semibold transition cursor-pointer group bg-neutral-800 
            ${todoList.id === props.activeListId ? 'bg-yellow text-neutral-900' : 'text-white'}`}
            key={todoList.id}
            onClick={() => {
              props.setActiveListId(todoList.id);
            }}
          >
            <input
              ref={todoList.id === props.activeListId ? todoListNameRef : null}
              type="text"
              value={todoList.name}
              className={`w-36 bg-transparent outline-none cursor-pointer focus:cursor-text 
              ${todoList.id === props.activeListId ? 'pointer-events-auto' : 'pointer-events-none'}`}
              onChange={() => handleListNameChange(todoList)}
            />
            <button
              className={`text-neutral-900 invisible ${todoList.id === props.activeListId && 'group-hover:visible'}`}
              onClick={(e) => {
                e.stopPropagation();
                handleListDelete(todoList);
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button
        className="text-white w-44 px-2 py-3"
        onClick={handleAddList}
      >
        + Add Todo List
      </button>
    </div>
  );
}

export default LeftContainer;