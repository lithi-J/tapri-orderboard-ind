import { Bell, Check, Info, AlertTriangle, Zap, Coffee, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { useNotifications, NotificationType, Notification } from '@/hooks/use-notifications';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

const TypeIcon = ({ type }: { type: NotificationType }) => {
  switch (type) {
    case 'new_order': return <Coffee className="w-4 h-4 text-saffron" />;
    case 'status_update': return <Zap className="w-4 h-4 text-neon" />;
    case 'delayed': return <AlertTriangle className="w-4 h-4 text-urgent" />;
    case 'pickup_reminder': return <Info className="w-4 h-4 text-chai" />;
    default: return <Bell className="w-4 h-4 text-muted-foreground" />;
  }
};

export const NotificationSystem = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, deleteAllNotifications } = useNotifications();
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleNotifClick = (n: Notification) => {
    setSelectedNotif(n);
    setIsDetailOpen(true);
    if (!n.isRead) {
      markAsRead(n.id);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative w-10 h-10 rounded-full border-2 border-cream/30 bg-cream/10 hover:bg-cream/20 text-cream flex items-center justify-center transition hover:scale-110"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-urgent text-cream text-[10px] font-bold h-4 min-w-[16px] px-1 flex items-center justify-center rounded-full border-2 border-chai-deep animate-in zoom-in">
                {unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 paper-card p-0 overflow-hidden">
          <div className="p-3 border-b border-chai/10 bg-cream/50 flex items-center justify-between">
            <h3 className="font-display font-bold text-chai-deep">Notifications</h3>
            <div className="flex items-center gap-1">
              {notifications.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    deleteAllNotifications();
                  }}
                  className="h-8 w-8 text-chai hover:text-urgent hover:bg-urgent/10"
                  title="Clear all"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={markAllAsRead}
                  className="h-7 text-[10px] uppercase font-bold text-chai hover:text-chai-deep"
                >
                  Mark all read
                </Button>
              )}
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto scrollbar-hide">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-8 h-8 text-chai/20 mx-auto mb-2" />
                <p className="text-muted-foreground font-handwritten text-lg">No alerts yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n.id} 
                  className={`p-3 flex items-start gap-3 border-b border-chai/5 transition cursor-pointer group relative ${!n.isRead ? 'bg-saffron/5' : 'hover:bg-chai/5'}`}
                  onClick={() => handleNotifClick(n)}
                >
                  <div className={`mt-0.5 p-1.5 rounded-full ${!n.isRead ? 'bg-cream shadow-sm' : 'bg-transparent'}`}>
                    <TypeIcon type={n.type} />
                  </div>
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-xs font-bold truncate ${!n.isRead ? 'text-chai-deep' : 'text-muted-foreground'}`}>
                        {n.title}
                      </p>
                      {!n.isRead && <div className="w-1.5 h-1.5 rounded-full bg-saffron mt-1 shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{n.message}</p>
                    <p className="text-[10px] text-chai/60 mt-1 uppercase tracking-wider font-semibold">
                      {formatDistanceToNow(n.createdAt, { addSuffix: true })}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:text-urgent"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(n.id);
                    }}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))
            )}
          </div>
          <div className="p-2 bg-cream/30 text-center border-t border-chai/10">
            <p className="text-muted-foreground font-handwritten text-base italic">Stay warm, stay updated ☕</p>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="paper-card sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-saffron/10 rounded-full">
                {selectedNotif && <TypeIcon type={selectedNotif.type} />}
              </div>
              <DialogTitle className="text-chai-deep font-display text-xl">
                {selectedNotif?.title}
              </DialogTitle>
            </div>
          </DialogHeader>
          <div className="py-4">
            <p className="text-chai-deep text-lg font-medium leading-relaxed bg-cream/50 p-4 rounded-xl border border-chai/10 shadow-inner">
              {selectedNotif?.message}
            </p>
            {selectedNotif?.createdAt && (
              <p className="text-xs text-muted-foreground mt-4 uppercase tracking-widest font-bold">
                Received {formatDistanceToNow(selectedNotif.createdAt, { addSuffix: true })}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button 
              className="w-full bg-gradient-chai text-cream font-bold"
              onClick={() => setIsDetailOpen(false)}
            >
              Got it!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
