import { useEffect, useMemo, useState } from 'react';
import { LayoutGrid, List, Plus, Search, X } from 'lucide-react';
import { AcademicTask, PriorityLevel, SourceType, SubjectCourse } from '../data/mockData';
import { CheckCircle, Dot, PageHeader, PriorityMark, Segmented, TaskRow, deadlineTone } from './ui';

interface TasksViewProps {
  tasks: AcademicTask[];
  subjects: SubjectCourse[];
  initialSubjectFilter?: string;
  onSelectTask: (taskId: string) => void;
  onToggleTaskComplete: (taskId: string) => void;
  onCreateTask: (task: AcademicTask) => void;
}

type StatusFilter = 'active' | 'changed' | 'done' | 'all';
type SortKey = 'deadline' | 'priority' | 'changed';

const rank: Record<PriorityLevel, number> = { high: 3, medium: 2, low: 1 };

export function TasksView({
  tasks,
  subjects,
  initialSubjectFilter = 'all',
  onSelectTask,
  onToggleTaskComplete,
  onCreateTask,
}: TasksViewProps) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('active');
  const [subject, setSubject] = useState(initialSubjectFilter);
  const [sort, setSort] = useState<SortKey>('deadline');
  const [view, setView] = useState<'list' | 'cards'>('list');
  const [creating, setCreating] = useState(false);

  useEffect(() => setSubject(initialSubjectFilter), [initialSubjectFilter]);

  const counts = {
    active: tasks.filter((t) => t.status !== 'completed').length,
    changed: tasks.filter((t) => t.hasUnreadChanges).length,
    done: tasks.filter((t) => t.status === 'completed').length,
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks
      .filter((t) => {
        if (status === 'active' && t.status === 'completed') return false;
        if (status === 'changed' && !t.hasUnreadChanges) return false;
        if (status === 'done' && t.status !== 'completed') return false;
        if (subject !== 'all' && t.subjectId !== subject) return false;
        if (
          q &&
          ![t.title, t.subjectName, t.instructor, t.source].some((v) => v.toLowerCase().includes(q))
        )
          return false;
        return true;
      })
      .sort((a, b) => {
        if (sort === 'priority') return rank[b.priority] - rank[a.priority];
        if (sort === 'changed') return Number(b.hasUnreadChanges) - Number(a.hasUnreadChanges);
        return a.deadlineIso.localeCompare(b.deadlineIso);
      });
  }, [tasks, query, status, subject, sort]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Задания"
        subtitle={`${counts.active} активных · ${counts.changed} с изменениями`}
        action={
          <button className="btn-primary" onClick={() => setCreating(true)}>
            <Plus className="size-4" /> Новое задание
          </button>
        }
      />

      <div className="space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative md:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-3" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по заданиям"
              className="field w-full pl-9"
            />
          </div>
          <div className="no-scrollbar -mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
            <Segmented
              value={status}
              onChange={setStatus}
              options={[
                { value: 'active', label: 'Активные' },
                { value: 'changed', label: `Изменённые${counts.changed ? ` ${counts.changed}` : ''}` },
                { value: 'done', label: 'Выполненные' },
                { value: 'all', label: 'Все' },
              ]}
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Дисциплина"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="field pr-8"
          >
            <option value="all">Все дисциплины</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.shortName}
              </option>
            ))}
          </select>
          <select
            aria-label="Сортировка"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="field pr-8"
          >
            <option value="deadline">По дедлайну</option>
            <option value="priority">По приоритету</option>
            <option value="changed">Сначала изменённые</option>
          </select>
          <Segmented
            className="ml-auto"
            value={view}
            onChange={setView}
            options={[
              { value: 'list', label: <List className="size-4" />, title: 'Список' },
              { value: 'cards', label: <LayoutGrid className="size-4" />, title: 'Карточки' },
            ]}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card px-6 py-16 text-center">
          <p className="text-[15px] font-medium">Ничего не найдено</p>
          <p className="mt-1 text-[13px] text-ink-2">Попробуйте изменить фильтры или запрос</p>
          <button
            className="btn-secondary mt-5"
            onClick={() => {
              setQuery('');
              setStatus('all');
              setSubject('all');
            }}
          >
            Сбросить фильтры
          </button>
        </div>
      ) : view === 'list' ? (
        <div className="card divide-y divide-line overflow-hidden">
          {filtered.map((t) => (
            <TaskRow
              key={t.id}
              task={t}
              onOpen={() => onSelectTask(t.id)}
              onToggle={() => onToggleTaskComplete(t.id)}
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((t) => {
            const done = t.checklist.filter((c) => c.done).length;
            const pct = t.checklist.length ? (done / t.checklist.length) * 100 : 0;
            return (
              <div
                key={t.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectTask(t.id)}
                onKeyDown={(e) => e.key === 'Enter' && onSelectTask(t.id)}
                className="card flex min-h-[200px] cursor-pointer flex-col p-5 transition-shadow duration-200 hover:shadow-[var(--shadow-float)]"
              >
                <div className="flex items-center gap-2 text-[12px] text-ink-2">
                  <Dot color={t.subjectColor} size={6} />
                  <span className="truncate">{t.subjectShort}</span>
                  <span className="ml-auto shrink-0">{t.source}</span>
                </div>
                <p
                  className={`mt-3 text-[15px] leading-snug ${
                    t.status === 'completed' ? 'text-ink-3 line-through' : 'font-medium'
                  }`}
                >
                  {t.title}
                </p>
                {t.hasUnreadChanges && t.changeSummaryBadge && (
                  <p className="mt-2 text-[13px] text-accent">{t.changeSummaryBadge}</p>
                )}
                <div className="mt-auto pt-6">
                  <div className="h-[3px] overflow-hidden rounded-full bg-fill">
                    <div className="h-full rounded-full bg-ink/40" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[13px] font-medium tabular-nums ${deadlineTone(t)}`}
                    >
                      <PriorityMark task={t} />
                      {t.daysLeftText}
                    </span>
                    <CheckCircle
                      size={20}
                      done={t.status === 'completed'}
                      onClick={() => onToggleTaskComplete(t.id)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {creating && (
        <CreateTaskDialog
          subjects={subjects}
          onClose={() => setCreating(false)}
          onCreate={(task) => {
            onCreateTask(task);
            setCreating(false);
          }}
        />
      )}
    </div>
  );
}

function CreateTaskDialog({
  subjects,
  onClose,
  onCreate,
}: {
  subjects: SubjectCourse[];
  onClose: () => void;
  onCreate: (task: AcademicTask) => void;
}) {
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState(subjects[0].id);
  const [deadline, setDeadline] = useState('2025-03-24');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [source, setSource] = useState<SourceType>('SmartLMS');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const s = subjects.find((x) => x.id === subjectId)!;
    const date = new Date(`${deadline}T12:00`);
    const label = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
    const days = Math.round((date.getTime() - new Date('2025-03-17T12:00').getTime()) / 86400000);
    const id = `task-${Date.now()}`;
    onCreate({
      id,
      title: title.trim(),
      subjectId: s.id,
      subjectName: s.name,
      subjectShort: s.shortName,
      subjectColor: s.color,
      instructor: s.instructor,
      deadline: `${label}, 23:59`,
      deadlineIso: deadline,
      deadlineTime: '23:59',
      daysLeftText: days <= 0 ? 'Сегодня' : days === 1 ? 'Завтра' : `Через ${days} дн.`,
      urgency: days <= 0 ? 'today' : days === 1 ? 'tomorrow' : 'soon',
      priority,
      status: 'todo',
      source,
      sourceChannel: `${source} · добавлено вручную`,
      sourceUrlLabel: '',
      sourceQuote: 'Задание добавлено вручную в UniFlow.',
      weight: '—',
      currentVersion: 'v1.0',
      hasUnreadChanges: false,
      description: 'Описание пока не добавлено.',
      attachments: [],
      checklist: [],
      history: [
        { version: 'v1.0', timestamp: 'Сегодня', source, author: 'Алексей Морозов', summary: 'Задание создано' },
      ],
    });
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="anim-fade absolute inset-0 bg-black/25" onClick={onClose} />
      <form onSubmit={submit} className="anim-pop card relative w-full max-w-md space-y-5 p-6 shadow-[var(--shadow-float)]">
        <div className="flex items-center justify-between">
          <h3 className="text-[17px] font-semibold tracking-[-0.01em]">Новое задание</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="grid size-8 place-items-center rounded-full bg-fill text-ink-2"
          >
            <X className="size-4" />
          </button>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-[13px] text-ink-2">Название</span>
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Например, ДЗ №5 по байесовским сетям"
            className="field w-full"
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1.5 block text-[13px] text-ink-2">Дисциплина</span>
            <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className="field w-full">
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.shortName}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13px] text-ink-2">Дедлайн</span>
            <input
              type="date"
              value={deadline}
              min="2025-03-17"
              onChange={(e) => setDeadline(e.target.value)}
              className="field w-full"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13px] text-ink-2">Приоритет</span>
            <select value={priority} onChange={(e) => setPriority(e.target.value as PriorityLevel)} className="field w-full">
              <option value="high">Высокий</option>
              <option value="medium">Средний</option>
              <option value="low">Низкий</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13px] text-ink-2">Источник</span>
            <select value={source} onChange={(e) => setSource(e.target.value as SourceType)} className="field w-full">
              {(['SmartLMS', 'Telegram', 'Zulip', 'Email'] as const).map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Отмена
          </button>
          <button type="submit" className="btn-primary" disabled={!title.trim()}>
            Создать
          </button>
        </div>
      </form>
    </div>
  );
}
