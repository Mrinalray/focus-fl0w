import { Code2, Heart } from 'lucide-react';

export const MoreTab = () => {
  return (
    <div className="flex-1 overflow-auto p-4">
      <h2 className="text-lg font-semibold text-foreground mb-4">More</h2>

      {/* App Info */}
      <div className="bg-card rounded-xl p-4 border border-border mb-4">
        <h3 className="font-semibold text-foreground mb-2">TrackTimer</h3>
        <p className="text-sm text-muted-foreground mb-3">
          A study time tracker app to help you stay focused and productive.
        </p>
        <p className="text-xs text-muted-foreground">Version 1.0.0</p>
      </div>

      {/* Developer Details */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
            <Code2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Developed by</p>
            <h3 className="font-semibold text-foreground">Mrinal Roy</h3>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
          <Heart className="w-3 h-3 text-primary" />
          <span>Made with love</span>
        </div>
      </div>
    </div>
  );
};
