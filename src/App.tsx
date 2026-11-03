import { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  BookOpen,
  Calendar,
  CheckSquare,
  Home,
  Moon,
  MoreHorizontal,
  Radio,
  Search,
  Settings,
  Sparkles,
  Sun,
} from 'lucide-react';
import {
  AcademicTask,
  ChangeFeedItem,
  INITIAL_CHANGES,
  INITIAL_SOURCES,
  INITIAL_TASKS,
  IntegrationSource,
  NavPage,
  SourceType,
  SUBJECTS,
  TaskStatus,
} from './data/mockData';
import { HomeView } from './components/HomeView';
import { TasksView } from './components/TasksView';
import { ChangesView } from './components/ChangesView';
import { CalendarView } from './components/CalendarView';
import { SubjectsView } from './components/SubjectsView';
import { SourcesView } from './components/SourcesView';
import { SettingsView, ThemeMode } from './components/SettingsView';
import { TaskDetailPanel } from './components/TaskDetailPanel';
import { Dot } from './components/ui';

const NAV: { id: NavPage; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Главная', icon: Home },
  { id: 'tasks', label: 'Задания', icon: CheckSquare },
  { id: 'changes', label: 'Изменения', icon: Sparkles },
  { id: 'calendar', label: 'Календарь', icon: Calendar },
  { id: 'subjects', label: 'Дисциплины', icon: BookOpen },
  { id: 'sources', label: 'Источники', icon: Radio },
  { id: 'settings', label: 'Настройки', icon: Settings },
];

function Logo() {
  return (
    <span className="grid size-7 place-items-center rounded-[9px] bg-ink text-canvas">
      <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden>
        <path
          d="M2.5 9.5c1.8-3.6 3.7-3.6 5.5 0s3.7 3.6 5.5 0"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export default function App() {
  const [page, setPage] = useState<NavPage>('home');
  const [tasks, setTasks] = useState<AcademicTask[]>(INITIAL_TASKS);
  const [changes, setChanges] = useState<ChangeFeedItem[]>(INITIAL_CHANGES);
  const [sources, setSources] = useState<IntegrationSource[]>(INITIAL_SOURCES);
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [glass, setGlass] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => root.classList.toggle('dark', theme === 'dark' || (theme === 'system' && mq.matches));
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [theme]);

  useEffect(() => {
    document.documentElement.classList.toggle('no-glass', !glass);
  }, [glass]);

  useEffect(() => {
    document.documentElement.lang = 'ru';
    document.title = 'UniFlow';
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((v) => !v);
      } else if (e.key === 'Escape') {
        setSearchOpen(false);
        setNotifOpen(false);
        setMoreOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const unread = changes.filter((c) => c.isUnread);
  const activeCount = tasks.filter((t) => t.status !== 'completed').length;
  const openTask = tasks.find((t) => t.id === openTaskId) ?? null;
  const badges: Partial<Record<NavPage, number>> = { tasks: activeCount, changes: unread.length };

  const navigate = (p: NavPage, subjectId?: string) => {
    setSubjectFilter(subjectId ?? 'all');
    setPage(p);
    setMoreOpen(false);
    window.scrollTo({ top: 0 });
  };

  const openTaskById = (id: string) => {
    setOpenTaskId(id);
    setSearchOpen(false);
    setNotifOpen(false);
  };

  const toggleComplete = (id: string) =>
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: t.status === 'completed' ? 'in_progress' : 'completed',
              daysLeftText:
                t.status === 'completed'
                  ? t.daysLeftText.replace('Сдано', 'В работе')
                  : 'Сдано',
            }
          : t
      )
    );

  const changeStatus = (id: string, status: TaskStatus) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));

  const toggleChecklist = (id: string, itemId: string) =>
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, checklist: t.checklist.map((c) => (c.id === itemId ? { ...c, done: !c.done } : c)) }
          : t
      )
    );

  const acknowledge = (taskId: string) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, hasUnreadChanges: false } : t)));
    setChanges((prev) => prev.map((c) => (c.taskId === taskId ? { ...c, isUnread: false } : c)));
  };

  const markChangeRead = (changeId: string) => {
    const c = changes.find((x) => x.id === changeId);
    if (c) acknowledge(c.taskId);
  };

  const markAllRead = () => {
    setChanges((prev) => prev.map((c) => ({ ...c, isUnread: false })));
    setTasks((prev) => prev.map((t) => ({ ...t, hasUnreadChanges: false })));
  };

  const updateSource = (id: SourceType, fn: (s: IntegrationSource) => IntegrationSource) =>
    setSources((prev) => prev.map((s) => (s.id === id ? fn(s) : s)));

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const match = (...v: string[]) => !q || v.some((x) => x.toLowerCase().includes(q));
    return {
      tasks: tasks.filter((t) => match(t.title, t.subjectName, t.instructor, t.source)).slice(0, 6),
      changes: changes.filter((c) => match(c.headline, c.subjectName, c.description)).slice(0, q ? 6 : 3),
    };
  }, [query, tasks, changes]);

  const content = (() => {
    switch (page) {
      case 'home':
        return (
          <HomeView
            tasks={tasks}
            changes={changes}
            subjects={SUBJECTS}
            onSelectTask={openTaskById}
            onToggleTaskComplete={toggleComplete}
            onNavigate={navigate}
          />
        );
      case 'tasks':
        return (
          <TasksView
            tasks={tasks}
            subjects={SUBJECTS}
            initialSubjectFilter={subjectFilter}
            onSelectTask={openTaskById}
            onToggleTaskComplete={toggleComplete}
            onCreateTask={(t) => {
              setTasks((p) => [t, ...p]);
              setOpenTaskId(t.id);
            }}
          />
        );
      case 'changes':
        return (
          <ChangesView
            changes={changes}
            onSelectTask={openTaskById}
            onMarkChangeRead={markChangeRead}
            onMarkAllRead={markAllRead}
          />
        );
      case 'calendar':
        return <CalendarView tasks={tasks} onSelectTask={openTaskById} />;
      case 'subjects':
        return <SubjectsView subjects={SUBJECTS} onNavigate={navigate} />;
      case 'sources':
        return (
          <SourcesView
            sources={sources}
            onToggleRule={(id, ruleId) =>
              updateSource(id, (s) => ({
                ...s,
                autoRules: s.autoRules.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r)),
              }))
            }
            onToggleChannel={(id, i) =>
              updateSource(id, (s) => ({
                ...s,
                channels: s.channels.map((c, j) => (j === i ? { ...c, active: !c.active } : c)),
              }))
            }
            onSyncSource={(id) =>
              setSources((prev) =>
                prev.map((s) => (!id || s.id === id ? { ...s, lastSync: 'Только что' } : s))
              )
            }
          />
        );
      case 'settings':
        return (
          <SettingsView themeMode={theme} onChangeTheme={setTheme} glass={glass} onChangeGlass={setGlass} />
        );
    }
  })();

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const iconBtn =
    'relative grid size-8 place-items-center rounded-[10px] text-ink-2 transition-colors hover:bg-fill hover:text-ink';

  return (
    <div className="min-h-screen">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[248px] flex-col px-4 py-6 lg:flex">
        <button onClick={() => navigate('home')} className="flex items-center gap-2.5 px-3">
          <Logo />
          <span className="text-[17px] font-semibold tracking-[-0.02em]">UniFlow</span>
        </button>
        <nav className="mt-9 space-y-0.5">
          {NAV.map(({ id, label, icon: Icon }) => {
            const active = page === id;
            const badge = badges[id];
            return (
              <button
                key={id}
                onClick={() => navigate(id)}
                aria-current={active ? 'page' : undefined}
                className={`flex h-9 w-full items-center gap-3 rounded-[10px] px-3 text-[14px] transition-colors ${
                  active
                    ? 'bg-surface font-medium text-ink shadow-[var(--shadow-card)]'
                    : 'text-ink-2 hover:bg-fill hover:text-ink'
                }`}
              >
                <Icon className="size-[17px]" strokeWidth={active ? 2 : 1.75} />
                {label}
                {!!badge && (
                  <span
                    className={`ml-auto text-[12px] tabular-nums ${
                      id === 'changes' ? 'font-medium text-accent' : 'text-ink-3'
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
        <button
          onClick={() => navigate('settings')}
          className="mt-auto flex items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-fill"
        >
          <span className="grid size-8 place-items-center rounded-full bg-fill text-[12px] font-medium">АМ</span>
          <span className="min-w-0">
            <span className="block truncate text-[13px] font-medium">Алексей Морозов</span>
            <span className="block truncate text-[12px] text-ink-3">БПМИ-224</span>
          </span>
        </button>
      </aside>

      <div className="lg:pl-[248px]">
        {/* Floating toolbar */}
        <header className="sticky top-0 z-30 px-4 pt-3 sm:px-8 lg:pt-5">
          <div className="glass relative mx-auto flex h-12 max-w-[1080px] items-center gap-2 rounded-2xl pl-3 pr-2">
            <button onClick={() => navigate('home')} className="flex items-center gap-2 lg:hidden">
              <Logo />
              <span className="text-[15px] font-semibold tracking-[-0.02em]">UniFlow</span>
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden h-8 w-full max-w-[340px] items-center gap-2 rounded-[10px] bg-fill px-3 text-[13px] text-ink-3 transition-colors hover:text-ink-2 sm:flex lg:ml-0 sm:ml-4"
            >
              <Search className="size-4" />
              Поиск
              <kbd className="ml-auto font-sans text-[11px]">⌘K</kbd>
            </button>
            <div className="ml-auto flex items-center gap-1">
              <button onClick={() => setSearchOpen(true)} aria-label="Поиск" className={`${iconBtn} sm:hidden`}>
                <Search className="size-[17px]" />
              </button>
              <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                aria-label="Сменить тему"
                className={iconBtn}
              >
                {isDark ? <Sun className="size-[17px]" /> : <Moon className="size-[17px]" />}
              </button>
              <button
                onClick={() => setNotifOpen((v) => !v)}
                aria-label="Уведомления"
                aria-expanded={notifOpen}
                className={iconBtn}
              >
                <Bell className="size-[17px]" />
                {unread.length > 0 && (
                  <span className="absolute right-[7px] top-[7px] size-1.5 rounded-full bg-accent" />
                )}
              </button>
            </div>

            {notifOpen && (
              <>
                <div className="fixed inset-0 z-0" onClick={() => setNotifOpen(false)} />
                <div className="glass anim-pop absolute right-0 top-14 z-10 w-[min(360px,calc(100vw-2rem))] rounded-2xl p-2">
                  <div className="flex items-center justify-between px-3 py-2">
                    <p className="text-[14px] font-semibold">Что изменилось</p>
                    {unread.length > 0 && (
                      <button onClick={markAllRead} className="text-[12px] text-ink-2 hover:text-ink">
                        Прочитать все
                      </button>
                    )}
                  </div>
                  {unread.length === 0 ? (
                    <p className="px-3 pb-4 pt-2 text-[13px] text-ink-2">Новых изменений нет</p>
                  ) : (
                    unread.slice(0, 4).map((c) => (
                      <button
                        key={c.id}
                        onClick={() => openTaskById(c.taskId)}
                        className="block w-full rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-fill"
                      >
                        <p className="flex items-center gap-1.5 text-[12px] text-ink-2">
                          <Dot color={c.subjectColor} size={6} />
                          {c.subjectName}
                          <span className="ml-auto text-ink-3">{c.relativeTime}</span>
                        </p>
                        <p className="mt-0.5 text-[13px] leading-snug">{c.headline}</p>
                      </button>
                    ))
                  )}
                  <button
                    onClick={() => {
                      setNotifOpen(false);
                      navigate('changes');
                    }}
                    className="mt-1 w-full rounded-xl px-3 py-2 text-[13px] font-medium text-accent hover:bg-fill"
                  >
                    Открыть все изменения
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        <main className="mx-auto max-w-[1080px] px-4 pb-32 pt-8 sm:px-8 lg:pb-20 lg:pt-12">{content}</main>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="glass fixed inset-x-4 bottom-4 z-40 mx-auto grid h-[62px] max-w-[440px] grid-cols-5 rounded-[22px] px-1 lg:hidden">
        {[...NAV.slice(0, 4), null].map((item) => {
          const isMore = item === null;
          const active = isMore ? ['subjects', 'sources', 'settings'].includes(page) : page === item.id;
          const Icon = isMore ? MoreHorizontal : item.icon;
          return (
            <button
              key={isMore ? 'more' : item.id}
              onClick={() => (isMore ? setMoreOpen((v) => !v) : navigate(item.id))}
              className={`relative flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors ${
                active ? 'text-ink' : 'text-ink-3'
              }`}
            >
              <Icon className="size-[21px]" strokeWidth={active ? 2.1 : 1.75} />
              {isMore ? 'Ещё' : item.label}
              {!isMore && item.id === 'changes' && unread.length > 0 && (
                <span className="absolute right-[calc(50%-14px)] top-2.5 size-1.5 rounded-full bg-accent" />
              )}
            </button>
          );
        })}
      </nav>

      {moreOpen && (
        <div className="fixed inset-0 z-30 lg:hidden" onClick={() => setMoreOpen(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass anim-pop absolute inset-x-4 bottom-[88px] mx-auto max-w-[440px] rounded-[22px] p-2"
          >
            {NAV.slice(4).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => navigate(id)}
                className={`flex h-12 w-full items-center gap-3 rounded-[14px] px-4 text-[15px] transition-colors hover:bg-fill ${
                  page === id ? 'font-medium' : 'text-ink-2'
                }`}
              >
                <Icon className="size-[18px]" strokeWidth={1.75} />
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {openTask && (
        <TaskDetailPanel
          key={openTask.id}
          task={openTask}
          onClose={() => setOpenTaskId(null)}
          onToggleComplete={toggleComplete}
          onChangeStatus={changeStatus}
          onToggleChecklist={toggleChecklist}
          onAcknowledgeChanges={acknowledge}
        />
      )}

      {searchOpen && (
        <div className="fixed inset-0 z-50 flex justify-center px-4 pt-[12vh]">
          <div className="anim-fade absolute inset-0 bg-black/25 dark:bg-black/50" onClick={() => setSearchOpen(false)} />
          <div className="anim-pop card relative h-fit max-h-[70vh] w-full max-w-lg overflow-hidden shadow-[var(--shadow-float)]">
            <div className="flex items-center gap-3 border-b border-line px-5">
              <Search className="size-[18px] text-ink-3" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Задания, дисциплины, преподаватели"
                className="h-14 flex-1 bg-transparent text-[16px] outline-none placeholder:text-ink-3"
              />
              <kbd className="text-[11px] text-ink-3">Esc</kbd>
            </div>
            <div className="max-h-[calc(70vh-56px)] overflow-y-auto p-2">
              {results.tasks.length === 0 && results.changes.length === 0 && (
                <p className="px-3 py-8 text-center text-[13px] text-ink-2">Ничего не найдено</p>
              )}
              {results.tasks.length > 0 && <p className="px-3 pb-1 pt-2 text-[12px] text-ink-3">Задания</p>}
              {results.tasks.map((t) => (
                <button
                  key={t.id}
                  onClick={() => openTaskById(t.id)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-fill"
                >
                  <Dot color={t.subjectColor} size={6} />
                  <span className="min-w-0 flex-1 truncate text-[14px]">{t.title}</span>
                  <span className="shrink-0 text-[12px] text-ink-3">{t.deadline.split(',')[0]}</span>
                </button>
              ))}
              {results.changes.length > 0 && <p className="px-3 pb-1 pt-3 text-[12px] text-ink-3">Изменения</p>}
              {results.changes.map((c) => (
                <button
                  key={c.id}
                  onClick={() => openTaskById(c.taskId)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-fill"
                >
                  <Dot color={c.subjectColor} size={6} />
                  <span className="min-w-0 flex-1 truncate text-[14px]">{c.headline}</span>
                  <span className="shrink-0 text-[12px] text-ink-3">{c.source}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
