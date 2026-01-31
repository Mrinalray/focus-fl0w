import { useState } from 'react';
import { Plus, Check, Trash2, Edit2, X, ListTodo } from 'lucide-react';
import { TodoItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface PlannerTabProps {
  todos: TodoItem[];
  onAdd: (text: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onClearCompleted: () => void;
}

export const PlannerTab = ({ 
  todos, 
  onAdd, 
  onToggle, 
  onDelete, 
  onEdit,
  onClearCompleted 
}: PlannerTabProps) => {
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleAdd = () => {
    if (newTodo.trim()) {
      onAdd(newTodo);
      setNewTodo('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  const startEdit = (todo: TodoItem) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = () => {
    if (editingId && editText.trim()) {
      onEdit(editingId, editText);
    }
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const pendingTodos = todos.filter(t => !t.completed);
  const completedTodos = todos.filter(t => t.completed);

  return (
    <div className="flex-1 overflow-auto p-4">
      {/* Add Todo Input */}
      <div className="flex gap-2 mb-6">
        <Input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new task..."
          className="flex-1 bg-card border-border"
        />
        <Button 
          onClick={handleAdd}
          size="icon"
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      {todos.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ListTodo className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm">No tasks yet.</p>
          <p className="text-muted-foreground/60 text-xs mt-1">Add your study goals above!</p>
        </div>
      ) : (
        <>
          {/* Pending Tasks */}
          {pendingTodos.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <ListTodo className="w-4 h-4" />
                To Do ({pendingTodos.length})
              </h3>
              <div className="space-y-2">
                {pendingTodos.map(todo => (
                  <div 
                    key={todo.id}
                    className="bg-card rounded-lg p-3 border border-border fade-in flex items-center gap-3"
                  >
                    <button
                      onClick={() => onToggle(todo.id)}
                      className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center hover:bg-primary/20 transition-colors flex-shrink-0"
                    >
                    </button>
                    
                    {editingId === todo.id ? (
                      <div className="flex-1 flex gap-2">
                        <Input
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                          className="flex-1 h-8 bg-secondary"
                          autoFocus
                        />
                        <Button size="icon" variant="ghost" onClick={saveEdit} className="h-8 w-8">
                          <Check className="w-4 h-4 text-primary" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={cancelEdit} className="h-8 w-8">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span className="flex-1 text-foreground text-sm">{todo.text}</span>
                        <button 
                          onClick={() => startEdit(todo)}
                          className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button 
                          onClick={() => onDelete(todo.id)}
                          className="p-1.5 hover:bg-destructive/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Tasks */}
          {completedTodos.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Completed ({completedTodos.length})
                </h3>
                <button
                  onClick={onClearCompleted}
                  className="text-xs text-primary hover:underline"
                >
                  Clear all
                </button>
              </div>
              <div className="space-y-2">
                {completedTodos.map(todo => (
                  <div 
                    key={todo.id}
                    className="bg-card/50 rounded-lg p-3 border border-border/50 fade-in flex items-center gap-3"
                  >
                    <button
                      onClick={() => onToggle(todo.id)}
                      className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0"
                    >
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </button>
                    <span className="flex-1 text-muted-foreground text-sm line-through">{todo.text}</span>
                    <button 
                      onClick={() => onDelete(todo.id)}
                      className="p-1.5 hover:bg-destructive/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-destructive/70" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
