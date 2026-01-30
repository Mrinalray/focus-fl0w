import { useState, useRef, useEffect } from 'react';
import { Play, Pause, MoreVertical, Pencil, Trash2, RotateCcw } from 'lucide-react';
import { Subject } from '@/types';
import { formatTime } from '@/utils/time';

interface SubjectItemProps {
  subject: Subject;
  onToggle: () => void;
  onEdit: (newName: string) => void;
  onDelete: () => void;
  onReset: () => void;
}

export const SubjectItem = ({ 
  subject, 
  onToggle, 
  onEdit, 
  onDelete,
  onReset 
}: SubjectItemProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(subject.name);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleEdit = () => {
    setShowMenu(false);
    setIsEditing(true);
    setEditName(subject.name);
  };

  const handleSaveEdit = () => {
    if (editName.trim()) {
      onEdit(editName);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditName(subject.name);
    }
  };

  const handleDelete = () => {
    setShowMenu(false);
    onDelete();
  };

  const handleReset = () => {
    setShowMenu(false);
    onReset();
  };

  return (
    <div className={`subject-item flex items-center gap-4 px-4 py-3 ${subject.isRunning ? 'bg-primary/5' : ''}`}>
      <button 
        onClick={onToggle}
        className="play-button flex-shrink-0"
        aria-label={subject.isRunning ? 'Pause' : 'Play'}
      >
        {subject.isRunning ? (
          <Pause className="w-5 h-5 text-primary-foreground" fill="currentColor" />
        ) : (
          <Play className="w-5 h-5 text-primary-foreground ml-0.5" fill="currentColor" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={handleKeyDown}
            className="w-full bg-secondary px-3 py-1 rounded-md text-foreground outline-none focus:ring-2 focus:ring-primary"
          />
        ) : (
          <span className={`text-foreground font-medium truncate block ${subject.isRunning ? 'text-primary' : ''}`}>
            {subject.name}
          </span>
        )}
      </div>

      <span className={`timer-font text-sm flex-shrink-0 ${subject.isRunning ? 'text-primary' : 'text-muted-foreground'}`}>
        {formatTime(subject.timeSpent)}
      </span>

      <div className="relative" ref={menuRef}>
        <button 
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
          aria-label="More options"
        >
          <MoreVertical className="w-5 h-5 text-muted-foreground" />
        </button>

        {showMenu && (
          <div className="absolute right-0 top-full mt-1 bg-popover border border-border rounded-lg shadow-xl z-50 min-w-[140px] scale-in overflow-hidden">
            <button
              onClick={handleEdit}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors text-left"
            >
              <Pencil className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Edit</span>
            </button>
            <button
              onClick={handleReset}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors text-left"
            >
              <RotateCcw className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Reset</span>
            </button>
            <button
              onClick={handleDelete}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-destructive/10 transition-colors text-left text-destructive"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm">Delete</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
