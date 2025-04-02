import { useState, useEffect } from 'react';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { Checkbox } from './components/ui/checkbox';
import { Separator } from './components/ui/separator';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);


  const addTodo = () => {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
      setNewTodo('');
      localStorage.setItem('todos', JSON.stringify(todos));
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
    localStorage.setItem('todos', JSON.stringify(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    ));

  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
    localStorage.setItem('todos', JSON.stringify(todos.filter(todo => !todo.completed)));
  };

  const remaining = todos.filter(todo => !todo.completed).length;

  return (
    <div className="max-w-2xl mx-auto my-8 p-4 bg-slate-800 rounded-2xl text-white">
      <h1 className="text-2xl font-bold mb-4">Todo App</h1>
      
      <div className="flex gap-2 mb-6">
        <Input 
          className='bg-slate-600 placeholder:text-neutral-300'
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Добавить задачу..."
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <Button className='bg-fuchsia-500 hover:bg-fuchsia-700' onClick={addTodo}>Добавить</Button>
      </div>

      <div className="mb-4">Оставшиеся задачи: {remaining}</div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h2 className="font-semibold mb-2">Все ({todos.length})</h2>
          <Separator className="mb-2" />
          <div className="space-y-2">
            {todos.map(todo => (
              <div key={todo.id} className="flex items-center gap-2">
                <span className={todo.completed ? 'line-through' : ''}>
                  {todo.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-semibold mb-2">Активные ({remaining})</h2>
          <Separator className="mb-2" />
          <div className="space-y-2">
            {todos.filter(todo => !todo.completed).map(todo => (
              <div key={todo.id} className="flex items-center gap-2">
                <Checkbox 
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id)}
                />
                <span>{todo.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-semibold mb-2">Завершенные ({todos.length - remaining})</h2>
          <Separator className="mb-2" />
          <div className="space-y-2">
            {todos.filter(todo => todo.completed).map(todo => (
              <div key={todo.id} className="flex items-center gap-2">
                <Checkbox 
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id)}
                />
                <span className="line-through">{todo.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Button 
        variant="destructive" 
        className="mt-4"
        onClick={clearCompleted}
        disabled={todos.length === remaining}
      >
        Очистить завершённые задачи
      </Button>
    </div>
  );
}