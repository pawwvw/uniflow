import { ChevronRight } from 'lucide-react';
import {
  AcademicTask,
  ChangeFeedItem,
  NavPage,
  SubjectCourse,
  WEEKLY_WORKLOAD,
} from '../data/mockData';
import { DiffInline, Dot, SectionHeader, TaskRow, TextButton, plural } from './ui';

interface HomeViewProps {
  tasks: AcademicTask[];
  changes: ChangeFeedItem[];
  subjects: SubjectCourse[];
  onSelectTask: (taskId: string) => void;
  onToggleTaskComplete: (taskId: string) => void;
  onNavigate: (page: NavPage, filterSubjectId?: string) => void;
}

export function HomeView({
  tasks,
  changes,
  subjects,
  onSelectTask,
  onToggleTaskComplete,
  onNavigate,
}: HomeViewProps) {
  const unread = changes.filter((c) => c.isUnread);
  const recent = [...changes].sort((a, b) => Number(b.isUnread) - Number(a.isUnread)).slice(0, 4);
  const upcoming = tasks
    .filter((t) => t.status !== 'completed')
    .sort((a, b) => a.deadlineIso.localeCompare(b.deadlineIso))
    .slice(0, 5);
  const todayTask = tasks.find((t) => t.urgency === 'today' && t.status !== 'completed');
  const totalHours = WEEKLY_WORKLOAD.reduce((s, d) => s + d.hours, 0);
  const maxHours = Math.max(...WEEKLY_WORKLOAD.map((d) => d.hours));
  const weekDeadlines = WEEKLY_WORKLOAD.reduce((s, d) => s + d.deadlinesCount, 0);

  return (
    <div className="space-y-12">
      <header>
        <p className="text-[13px] text-ink-2">Понедельник, 17 марта · 11-я учебная неделя</p>
        <h1 className="mt-1.5 text-[30px] font-semibold leading-tight tracking-[-0.03em] sm:text-[36px]">
          Добрый день, Алексей
        </h1>
        <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink-2">
          {todayTask ? (
            <>
              Сегодня до <span className="text-ink">{todayTask.deadlineTime}</span> —{' '}
              {todayTask.title.split(':')[0]} по курсу «{todayTask.subjectShort}».{' '}
            </>
          ) : (
            'На сегодня сдач нет. '
          )}
          {unread.length > 0
            ? `${unread.length} ${plural(unread.length, [
                'новое изменение',
                'новых изменения',
                'новых изменений',
              ])} в заданиях.`
            : 'Новых изменений нет.'}
        </p>
      </header>

      <section>
        <SectionHeader
          title="Что изменилось"
          meta={unread.length > 0 ? `${unread.length} новых` : undefined}
          action={
            <TextButton onClick={() => onNavigate('changes')}>
              Все изменения <ChevronRight className="size-3.5" />
            </TextButton>
          }
        />
        <div className="card divide-y divide-line overflow-hidden">
          {recent.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelectTask(c.taskId)}
              className="row-hover flex w-full gap-3 px-5 py-4 text-left"
            >
              <span
                className={`mt-[9px] size-1.5 shrink-0 rounded-full ${
                  c.isUnread ? 'bg-accent' : 'bg-transparent'
                }`}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-[12px] text-ink-2">
                  <Dot color={c.subjectColor} size={6} />
                  <span className="truncate">{c.subjectName}</span>
                  <span className="text-ink-3">·</span>
                  <span>{c.source}</span>
                  <span className="ml-auto shrink-0 text-ink-3 tabular-nums">{c.relativeTime}</span>
                </div>
                <p
                  className={`mt-1 text-[15px] leading-snug ${
                    c.isUnread ? 'font-medium text-ink' : 'text-ink-2'
                  }`}
                >
                  {c.headline}
                </p>
                <div className="mt-2">
                  <DiffInline diff={c.diffs[0]} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-8">
        <section>
          <SectionHeader
            title="Ближайшие дедлайны"
            action={
              <TextButton onClick={() => onNavigate('tasks')}>
                Все задания <ChevronRight className="size-3.5" />
              </TextButton>
            }
          />
          <div className="card divide-y divide-line overflow-hidden">
            {upcoming.map((t) => (
              <TaskRow
                key={t.id}
                task={t}
                onOpen={() => onSelectTask(t.id)}
                onToggle={() => onToggleTaskComplete(t.id)}
              />
            ))}
          </div>
        </section>

        <div className="space-y-12">
          <section>
            <SectionHeader title="Нагрузка на неделю" />
            <div className="card p-5">
              <div className="flex items-baseline justify-between">
                <p className="text-[28px] font-semibold tracking-[-0.02em] tabular-nums">
                  {totalHours.toFixed(1).replace('.', ',')}
                  <span className="ml-1 text-[15px] font-normal text-ink-2">ч</span>
                </p>
                <p className="text-[13px] text-ink-2">
                  {weekDeadlines} {plural(weekDeadlines, ['сдача', 'сдачи', 'сдач'])}
                </p>
              </div>
              <div className="mt-6 grid h-28 grid-cols-7 items-end gap-2">
                {WEEKLY_WORKLOAD.map((d) => (
                  <button
                    key={d.iso}
                    onClick={() => onNavigate('calendar')}
                    title={`${d.dateLabel}: ${d.hours} ч`}
                    className="group flex h-full flex-col items-center justify-end gap-2"
                  >
                    <div
                      className={`w-full max-w-[22px] rounded-[6px] transition-colors ${
                        d.isToday ? 'bg-accent' : 'bg-ink/10 group-hover:bg-ink/20'
                      }`}
                      style={{ height: `${(d.hours / maxHours) * 80}%` }}
                    />
                    <span
                      className={`text-[11px] ${
                        d.isToday ? 'font-medium text-ink' : 'text-ink-3'
                      }`}
                    >
                      {d.dayShort}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section>
            <SectionHeader
              title="Дисциплины"
              action={
                <TextButton onClick={() => onNavigate('subjects')}>
                  Все <ChevronRight className="size-3.5" />
                </TextButton>
              }
            />
            <div className="card divide-y divide-line overflow-hidden">
              {subjects.slice(0, 4).map((s) => (
                <button
                  key={s.id}
                  onClick={() => onNavigate('tasks', s.id)}
                  className="row-hover block w-full px-5 py-3.5 text-left"
                >
                  <div className="flex items-center justify-between gap-3 text-[14px]">
                    <span className="truncate">{s.shortName}</span>
                    <span className="shrink-0 text-[13px] text-ink-3 tabular-nums">
                      {s.completedTasks}/{s.totalTasks}
                    </span>
                  </div>
                  <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-fill">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(s.completedTasks / s.totalTasks) * 100}%`,
                        backgroundColor: s.color,
                      }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
