function Priority(props) {
  const priorityOptions = [
    { value: 'high', label: 'High', color: 'bg-amber-300' },
    { value: 'mid', label: 'Mid', color: 'bg-amber-100' },
    { value: 'low', label: 'Low', color: 'bg-neutral-400' }
  ];

  return (
    <div>
      <div className="font-semibold mb-3">Priorityyyy</div>
      <div className="flex items-center gap-2">
        {priorityOptions.map((option) => (
          <div 
            key={option.value} 
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => props.setTodo({...props.todo, priority: option.value})}
          >
            <div 
              className={`w-5 h-5 rounded-full border-2 ${
                props.todo.priority === option.value 
                  ? option.color 
                  : 'border-neutral-400'
              }`}
            />
            <label className="mr-3">{option.label}</label>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Priority;