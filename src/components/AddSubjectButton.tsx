import { useState, useRef, useEffect } from 'react';
import { Plus, X } from 'lucide-react';

interface AddSubjectButtonProps {
  onAdd: (name: string) => void;
}

export const AddSubjectButton = ({ onAdd }: AddSubjectButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name);
      setName('');
      setIsOpen(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setName('');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform z-50"
        style={{ boxShadow: '0 4px 20px hsl(var(--primary) / 0.4)' }}
        aria-label="Add subject"
      >
        <Plus className="w-7 h-7 text-primary-foreground" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 fade-in">
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm scale-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Add Subject</h2>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter subject name..."
            className="w-full bg-secondary px-4 py-3 rounded-xl text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary mb-4"
          />
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 bg-secondary text-foreground rounded-xl font-medium hover:bg-secondary/80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
