import { NavPage, SubjectCourse } from '../data/mockData';
import { Dot, PageHeader } from './ui';

interface SubjectsViewProps {
  subjects: SubjectCourse[];
  onNavigate: (page: NavPage, subjectId: string) => void;
}

export function SubjectsView({ subjects, onNavigate }: SubjectsViewProps) {
  const done = subjects.reduce((s, x) => s + x.completedTasks, 0);
  const total = subjects.reduce((s, x) => s + x.totalTasks, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Дисциплины"
        subtitle={`Весенний семестр · сдано ${done} из ${total} работ`}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {subjects.map((s) => {
          const pct = Math.round((s.completedTasks / s.totalTasks) * 100);
          return (
            <button
              key={s.id}
              onClick={() => onNavigate('tasks', s.id)}
              className="card flex flex-col p-5 text-left transition-shadow duration-200 hover:shadow-[var(--shadow-float)]"
            >
              <div className="flex items-center gap-2 text-[12px] text-ink-3">
                <Dot color={s.color} size={7} />
                <span>{s.code}</span>
                {s.unreadChanges > 0 && (
                  <span className="ml-auto text-accent">
                    {s.unreadChanges} {s.unreadChanges === 1 ? 'изменение' : 'изменения'}
                  </span>
                )}
              </div>
              <h3 className="mt-3 text-[17px] font-semibold leading-snug tracking-[-0.015em]">{s.name}</h3>
              <p className="mt-1 text-[13px] text-ink-2">{s.instructor}</p>

              <div className="mt-6">
                <div className="flex items-baseline justify-between text-[13px]">
                  <span className="text-ink-2">Прогресс</span>
                  <span className="tabular-nums">
                    {s.completedTasks} из {s.totalTasks}
                  </span>
                </div>
                <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-fill">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: s.color }} />
                </div>
              </div>

              <div className="mt-5 border-t border-line pt-4">
                <p className="text-[12px] text-ink-3">Следующая сдача · {s.nextDeadlineText}</p>
                <p className="mt-1 line-clamp-1 text-[14px]">{s.nextTaskTitle}</p>
              </div>
              <p className="mt-4 text-[12px] text-ink-3">{s.sources.join(' · ')}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
