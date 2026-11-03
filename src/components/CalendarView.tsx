import { useMemo, useState } from 'react';
import { AcademicTask, CALENDAR_ITEMS, CalendarScheduleItem } from '../data/mockData';
import { Dot, PageHeader, SectionHeader, Segmented } from './ui';

interface CalendarViewProps {
  tasks: AcademicTask[];
  onSelectTask: (taskId: string) => void;
}

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const TODAY = '2025-03-17';
const typeLabel: Record<CalendarScheduleItem['type'], string> = {
  deadline: 'Дедлайн',
  lecture: 'Лекция',
  seminar: 'Семинар',
  checkpoint: 'Контрольная',
};

const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// March 2025 starts on Saturday; grid starts on Monday Feb 24.
const MONTH_DAYS = Array.from({ length: 42 }, (_, i) => {
  const d = new Date(2025, 1, 24 + i);
  return { iso: iso(d), day: d.getDate(), inMonth: d.getMonth() === 2 };
});
const WEEK_DAYS = MONTH_DAYS.filter((d) => d.iso >= '2025-03-17' && d.iso <= '2025-03-23');

function formatDay(value: string) {
  const s = new Date(`${value}T12:00`).toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function CalendarView({ tasks, onSelectTask }: CalendarViewProps) {
  const [mode, setMode] = useState<'month' | 'week'>('month');
  const [selected, setSelected] = useState(TODAY);

  const byDay = useMemo(() => {
    const map = new Map<string, CalendarScheduleItem[]>();
    CALENDAR_ITEMS.forEach((e) => map.set(e.iso, [...(map.get(e.iso) ?? []), e]));
    return map;
  }, []);

  const selectedItems = byDay.get(selected) ?? [];
  const upcoming = tasks
    .filter((t) => t.status !== 'completed' && t.deadlineIso >= TODAY)
    .sort((a, b) => a.deadlineIso.localeCompare(b.deadlineIso))
    .slice(0, 4);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Календарь"
        subtitle="Март 2025"
        action={
          <Segmented
            value={mode}
            onChange={setMode}
            options={[
              { value: 'month', label: 'Месяц' },
              { value: 'week', label: 'Неделя' },
            ]}
          />
        }
      />

      <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_320px] xl:gap-8">
        <div className="card p-2 sm:p-4">
          {mode === 'month' ? (
            <>
              <div className="grid grid-cols-7 pb-2 pt-1">
                {WEEKDAYS.map((w) => (
                  <div key={w} className="text-center text-[12px] text-ink-3">
                    {w}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
                {MONTH_DAYS.map((d) => {
                  const items = byDay.get(d.iso) ?? [];
                  const isSel = d.iso === selected;
                  const isToday = d.iso === TODAY;
                  return (
                    <button
                      key={d.iso}
                      onClick={() => setSelected(d.iso)}
                      className={`flex h-14 flex-col items-center gap-1 rounded-xl p-1 transition-colors sm:h-[92px] sm:items-start sm:p-2 ${
                        isSel ? 'bg-fill' : 'hover:bg-fill/60'
                      } ${d.inMonth ? '' : 'opacity-35'}`}
                    >
                      <span
                        className={`grid size-7 place-items-center rounded-full text-[13px] tabular-nums ${
                          isToday
                            ? 'bg-ink font-medium text-canvas'
                            : isSel
                              ? 'font-medium text-ink'
                              : 'text-ink-2'
                        }`}
                      >
                        {d.day}
                      </span>
                      <div className="flex gap-[3px] sm:hidden">
                        {items.slice(0, 3).map((e) => (
                          <Dot key={e.id} color={e.subjectColor} size={4} />
                        ))}
                      </div>
                      <div className="hidden w-full space-y-0.5 sm:block">
                        {items.slice(0, 2).map((e) => (
                          <div
                            key={e.id}
                            className={`flex items-center gap-1.5 truncate text-left text-[11px] ${
                              e.type === 'deadline' ? 'font-medium text-ink' : 'text-ink-2'
                            }`}
                          >
                            <Dot color={e.subjectColor} size={5} />
                            <span className="truncate">
                              {e.type === 'deadline' ? 'Сдача' : typeLabel[e.type]}
                            </span>
                          </div>
                        ))}
                        {items.length > 2 && (
                          <div className="pl-3 text-left text-[11px] text-ink-3">+{items.length - 2}</div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="grid gap-1 sm:grid-cols-7">
              {WEEK_DAYS.map((d, i) => {
                const items = byDay.get(d.iso) ?? [];
                const isSel = d.iso === selected;
                return (
                  <div
                    key={d.iso}
                    onClick={() => setSelected(d.iso)}
                    className={`min-h-0 cursor-pointer rounded-xl p-2 transition-colors sm:min-h-[420px] ${
                      isSel ? 'bg-fill' : 'hover:bg-fill/50'
                    }`}
                  >
                    <div className="flex items-baseline gap-2 px-1 pb-3 sm:block">
                      <p className="text-[12px] text-ink-3">{WEEKDAYS[i]}</p>
                      <p
                        className={`text-[20px] font-semibold tabular-nums tracking-[-0.02em] ${
                          d.iso === TODAY ? 'text-accent' : ''
                        }`}
                      >
                        {d.day}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      {items.map((e) => (
                        <button
                          key={e.id}
                          onClick={(ev) => {
                            ev.stopPropagation();
                            if (e.taskId) onSelectTask(e.taskId);
                            else setSelected(d.iso);
                          }}
                          className="block w-full rounded-lg bg-surface px-2.5 py-2 text-left shadow-[0_0_0_1px_var(--line)]"
                          style={{ borderLeft: `2px solid ${e.subjectColor}` }}
                        >
                          <p className="text-[11px] text-ink-3 tabular-nums">{e.time}</p>
                          <p className="mt-0.5 line-clamp-3 text-[12px] leading-snug">{e.title}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <aside className="space-y-10">
          <section>
            <SectionHeader title={formatDay(selected)} meta={selected === TODAY ? 'сегодня' : undefined} />
            <div className="card divide-y divide-line overflow-hidden">
              {selectedItems.length === 0 ? (
                <p className="px-5 py-8 text-center text-[13px] text-ink-2">Нет событий</p>
              ) : (
                selectedItems.map((e) => (
                  <button
                    key={e.id}
                    disabled={!e.taskId}
                    onClick={() => e.taskId && onSelectTask(e.taskId)}
                    className={`flex w-full gap-4 px-5 py-3.5 text-left ${e.taskId ? 'row-hover' : 'cursor-default'}`}
                  >
                    <span className="w-12 shrink-0 pt-px text-[12px] text-ink-2 tabular-nums">
                      {e.time.split(' ')[0]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={`text-[14px] leading-snug ${e.type === 'deadline' ? 'font-medium' : ''}`}>
                        {e.title.replace(/^(Лекция|Семинар|Практикум|Дедлайн[^:]*): /, '')}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-[12px] text-ink-2">
                        <Dot color={e.subjectColor} size={6} />
                        {typeLabel[e.type]} · {e.subjectShort}
                        {e.isUpdated && <span className="text-accent">· изменено</span>}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </section>

          <section>
            <SectionHeader title="Ближайшие сдачи" />
            <div className="card divide-y divide-line overflow-hidden">
              {upcoming.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onSelectTask(t.id)}
                  className="row-hover flex w-full items-center gap-3 px-5 py-3 text-left"
                >
                  <Dot color={t.subjectColor} size={6} />
                  <span className="min-w-0 flex-1 truncate text-[14px]">{t.title.split(':')[0]}</span>
                  <span className="shrink-0 text-[12px] text-ink-2 tabular-nums">{t.deadline.split(',')[0]}</span>
                </button>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
