import { Code2, Heart, Mail, Github } from 'lucide-react';

export const MoreTab = () => {
  return (
    <div className="flex-1 overflow-auto p-4">
      <h2 className="text-lg font-semibold text-foreground mb-4">More</h2>

      {/* Developer Details Section */}
      <div className="bg-card rounded-xl p-4 border border-border mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
            <Code2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Developer</h3>
            <p className="text-sm text-muted-foreground">About the creator</p>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Made with love</span>
          </div>
          
          <div className="border-t border-border my-3" />
          
          <p className="text-muted-foreground text-xs">
            Add your developer details here manually by editing the MoreTab component.
          </p>
          
          {/* Placeholder for developer to add their details */}
          <div className="bg-secondary/50 rounded-lg p-3 mt-3">
            <p className="text-xs text-muted-foreground mb-2">Developer Info:</p>
            <p className="text-foreground font-medium">Your Name Here</p>
            <div className="flex items-center gap-2 mt-2">
              <Mail className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">your@email.com</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Github className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">github.com/yourusername</span>
            </div>
          </div>
        </div>
      </div>

      {/* App Info */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <h3 className="font-semibold text-foreground mb-2">Focus-Flow</h3>
        <p className="text-sm text-muted-foreground mb-3">
          A study time tracker app to help you stay focused and productive.
        </p>
        <p className="text-xs text-muted-foreground">Version 1.0.0</p>
      </div>
    </div>
  );
};
