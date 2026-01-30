import { Subject } from '@/types';
import { SubjectItem } from './SubjectItem';

interface SubjectListProps {
  subjects: Subject[];
  onToggle: (id: string) => void;
  onEdit: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
  onReset: (id: string) => void;
}

export const SubjectList = ({ 
  subjects, 
  onToggle, 
  onEdit, 
  onDelete,
  onReset 
}: SubjectListProps) => {
  if (subjects.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-muted-foreground text-lg mb-2">No subjects yet</p>
          <p className="text-muted-foreground/70 text-sm">
            Tap the + button to add your first subject
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {subjects.map((subject, index) => (
        <div 
          key={subject.id} 
          className="slide-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <SubjectItem
            subject={subject}
            onToggle={() => onToggle(subject.id)}
            onEdit={(newName) => onEdit(subject.id, newName)}
            onDelete={() => onDelete(subject.id)}
            onReset={() => onReset(subject.id)}
          />
        </div>
      ))}
    </div>
  );
};
