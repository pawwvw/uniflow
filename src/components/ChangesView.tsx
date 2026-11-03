import { useMemo, useState } from 'react';
import { ChangeCategory, ChangeFeedItem, SourceType } from '../data/mockData';
import { DiffInline, Dot, PageHeader, Segmented, TextButton } from './ui';

interface ChangesViewProps {
  changes: ChangeFeedItem[];
  onSelectTask: (taskId: string) => void;
  onMarkChangeRead: (changeId: string) => void;
  onMarkAllRead: () => void;
}

const priorityDot = { high: 'bg-danger', medium: 'bg-warning', low: 'bg-ink-3' } as const;
const priorityLabel = { high: 'Важно', medium: 'Средний приоритет', low: 'Информационно' } as const;

function dayGroup(ts: string) {
  if (ts.startsWith('Сегодня')) return 'Сегодня';
  if (ts.startsWith('Вчера')) return 'Вчера';
  return 'Ранее';
}

export function ChangesView({ changes, onSelectTask, onMarkChangeRead, onMarkAllRead }: ChangesViewProps) {
  const [readFilter, setReadFilter] = useState<'all' | 'unread'>('all');
  const [category, setCategory] = useState<'all' | ChangeCategory>('all');
  const [source, setSource] = useState<'all' | SourceType>('all');

  const unreadCount = changes.filter((c) => c.isUnread).length;

  const groups = useMemo(() => {
    const list = changes.filter(
      (c) =>
        (readFilter === 'all' || c.isUnread) &&
        (category === 'all' || c.category === category) &&
        (source === 'all' || c.source === source)
    );
    const order = ['Сегодня', 'Вчера', 'Ранее'];
    return order
      .map((g) => ({ title: g, items: list.filter((c) => dayGroup(c.timestamp) === g) }))
      .filter((g) => g.items.length > 0);
  }, [changes, readFilter, category, source]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Изменения"
        subtitle={unreadCount ? `${unreadCount} непрочитанных` : 'Всё прочитано'}
        action={
          unreadCount > 0 ? (
            <button className="btn-secondary" onClick={onMarkAllRead}>
              Прочитать все
            </button>
          ) : undefined
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <Segmented
          value={readFilter}
          onChange={setReadFilter}
          options={[
            { value: 'all', label: 'Все' },
            { value: 'unread', label: 'Непрочитанные' },
          ]}
        />
        <select
          aria-label="Категория"
          value={category}
          onChange={(e) => setCategory(e.target.value as 'all' | ChangeCategory)}
          className="field pr-8"
        >
          <option value="all">Все категории</option>
          <option value="deadline_shift">Перенос дедлайна</option>
          <option value="criteria_update">Условия сдачи</option>
          <option value="new_attachment">Новые файлы</option>
          <option value="schedule_change">Регламент</option>
        </select>
        <select
          aria-label="Источник"
          value={source}
          onChange={(e) => setSource(e.target.value as 'all' | SourceType)}
          className="field pr-8"
        >
          <option value="all">Все источники</option>
          {(['SmartLMS', 'Telegram', 'Zulip', 'Email'] as const).map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {groups.length === 0 ? (
        <div className="card px-6 py-16 text-center">
          <p className="text-[15px] font-medium">Здесь пусто</p>
          <p className="mt-1 text-[13px] text-ink-2">Нет изменений по выбранным фильтрам</p>
        </div>
      ) : (
        groups.map((g) => (
          <section key={g.title}>
            <h2 className="mb-3 px-1 text-[13px] font-medium text-ink-2">{g.title}</h2>
            <div className="card divide-y divide-line overflow-hidden">
              {g.items.map((c) => (
                <article key={c.id} className="flex gap-3 px-5 py-5">
                  <span
                    className={`mt-[9px] size-1.5 shrink-0 rounded-full ${
                      c.isUnread ? 'bg-accent' : 'bg-transparent'
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-ink-2">
                      <Dot color={c.subjectColor} size={6} />
                      <span>{c.subjectName}</span>
                      <span className="text-ink-3">·</span>
                      <span>{c.categoryLabel}</span>
                      <span className="text-ink-3">·</span>
                      <span>{c.source}</span>
                      <span className="ml-auto inline-flex items-center gap-1.5 text-ink-3 tabular-nums">
                        <span
                          title={priorityLabel[c.priority]}
                          className={`size-1.5 rounded-full ${priorityDot[c.priority]}`}
                        />
                        {c.timestamp.replace(/^(Сегодня|Вчера), /, '')}
                      </span>
                    </div>
                    <h3
                      className={`mt-1.5 text-[16px] leading-snug tracking-[-0.01em] ${
                        c.isUnread ? 'font-semibold' : 'font-medium text-ink-2'
                      }`}
                    >
                      {c.headline}
                    </h3>
                    <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-ink-2">
                      {c.description}
                    </p>
                    <div className="mt-3 space-y-1">
                      {c.diffs.map((d, i) => (
                        <DiffInline key={i} diff={d} />
                      ))}
                    </div>
                    <div className="mt-4 flex items-center gap-5">
                      <TextButton tone="accent" onClick={() => onSelectTask(c.taskId)}>
                        Открыть задание
                      </TextButton>
                      {c.isUnread && (
                        <TextButton onClick={() => onMarkChangeRead(c.id)}>Отметить прочитанным</TextButton>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
