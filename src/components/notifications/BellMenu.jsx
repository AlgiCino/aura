import React from "react";
import { useTranslation } from 'react-i18next';
import { Bell, CheckCheck, Circle, ExternalLink } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User } from "@/compat/entities";
import { safeApiCall, isValidEntity } from "@/components/utils/types";
import { formatDistanceToNowStrict } from "date-fns";

export default function BellMenu() {
  const { t } = useTranslation();
  const [items, setItems] = React.useState([]);
  const [unread, setUnread] = React.useState(0);
  const [canFetch, setCanFetch] = React.useState(false);
  const [isAvailable, setIsAvailable] = React.useState(true);
  const [lastError, setLastError] = React.useState("");

  const load = React.useCallback(async () => {
    if (!canFetch || !isAvailable) return;
    
    const result = await safeApiCall(async () => {
      // Try to dynamically import AppAlert to avoid breaking if entity doesn't exist
      const { AppAlert } = await import("@/components/utils/entities").catch(() => ({ AppAlert: null }));
      
      if (!isValidEntity(AppAlert)) {
        setIsAvailable(false);
        return null;
      }

      const list = await AppAlert.list({orderBy: ['created_date', 'desc']}, 20);
      const arr = Array.isArray(list) ? list : [];
      setItems(arr);
      setUnread(arr.filter(n => !n.read_at).length);
      setLastError("");
      setIsAvailable(true);
      return arr;
    }, []);

    if (result === null) {
      setLastError("Notifications temporarily unavailable");
      setIsAvailable(false);
      setItems([]);
      setUnread(0);
    }
  }, [canFetch, isAvailable]);

  const [pollMs, setPollMs] = React.useState(15000);
  const timerRef = React.useRef(null);

  React.useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      if (!isAvailable) {
        return;
      }
      
      try {
        await load();
        if (!cancelled) setPollMs(15000);
      } catch {
        if (!cancelled) {
          setPollMs(ms => Math.min(60000, Math.round(ms * 1.8)));
        }
      } finally {
        if (!cancelled && isAvailable) {
          timerRef.current = setTimeout(poll, pollMs);
        }
      }
    };

    (async () => {
      try {
        const me = await User.me().catch(() => null);
        setCanFetch(!!me);
        if (!cancelled && me) {
          poll();
        }
      } catch (err) {
        console.warn("User authentication check failed:", err);
        setCanFetch(false);
      }
    })();

    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [load, pollMs, isAvailable]);

  const markAll = async () => {
    if (!canFetch || !isAvailable) return;
    
    await safeApiCall(async () => {
      const { AppAlert } = await import("@/components/utils/entities").catch(() => ({ AppAlert: null }));
      if (!isValidEntity(AppAlert)) return;
      
      const pending = items.filter(n => !n.read_at);
      await Promise.all(pending.map(n => AppAlert.update(n.id, { read_at: new Date().toISOString() })));
      load();
    });
  };

  const markOne = async (id) => {
    if (!canFetch || !isAvailable) return;
    
    await safeApiCall(async () => {
      const { AppAlert } = await import("@/components/utils/entities").catch(() => ({ AppAlert: null }));
      if (!isValidEntity(AppAlert)) return;
      
      await AppAlert.update(id, { read_at: new Date().toISOString() });
      load();
    });
  };

  const dotColor = (t) => {
    if (t === "error" || t === "request") return "text-rose-600";
    if (t === "success" || t === "publish") return "text-emerald-600";
    if (t === "warning" || t === "job") return "text-amber-600";
    return "text-slate-500";
  };

  // If API is not available, still show the bell but disabled
  const bellDisabled = !canFetch || !isAvailable;
  const tooltipText = !canFetch 
    ? "Sign in to view notifications" 
    : !isAvailable 
    ? "Notifications temporarily unavailable"
    : undefined;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/60 border border-white/70 hover:bg-white/80 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${bellDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label={t('app.actions.open', 'Open')}
          disabled={bellDisabled}
          title={tooltipText}
        >
          <Bell className="w-4 h-4 text-gray-600" />
          {unread > 0 && !bellDisabled && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full min-w-[18px] h-[18px]">
              {unread > 99 ? '99+' : unread}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto dropdown-portal">
        <DropdownMenuLabel className="flex items-center justify-between py-2">
          <span className="font-semibold">{t('app.notifications.title', 'Notifications')}</span>
          {unread > 0 && (
            <button
              onClick={markAll}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <CheckCheck className="w-3 h-3" />
              {t('app.notifications.mark_all', 'Mark all read')}
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {bellDisabled ? (
          <div className="p-4 text-center">
            <div className="text-gray-400 mb-2">
              <Bell className="w-8 h-8 mx-auto" />
            </div>
            <p className="text-sm text-gray-500">{lastError || t('app.notifications.unavailable', 'Notifications not available')}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="p-4 text-center">
            <div className="text-gray-400 mb-2">
              <Bell className="w-8 h-8 mx-auto" />
            </div>
            <p className="text-sm text-gray-500">{t('app.notifications.empty', 'No notifications')}</p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className={`px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer ${
                !item.read_at ? 'bg-blue-50' : ''
              }`}
              onClick={() => markOne(item.id)}
            >
              <div className="flex items-start gap-3">
                <Circle className={`w-2 h-2 mt-2 ${dotColor(item.type)} ${!item.read_at ? 'fill-current' : ''}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!item.read_at ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                    {item.title}
                  </p>
                  {item.message && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {item.message}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-400">
                      {formatDistanceToNowStrict(new Date(item.created_date))} ago
                    </p>
                    {item.link && (
                      <ExternalLink className="w-3 h-3 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
