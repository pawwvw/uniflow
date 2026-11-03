import { useEffect, useState } from 'react';
import { Check, Download, FileText, X } from 'lucide-react';
import { AcademicTask, TaskStatus } from '../data/mockData';
import { CheckCircle, Dot, Segmented, TextButton, deadlineTone } from './ui';

interface TaskDetailPanelProps {
  task: AcademicTask;
  onClose: () => void;
  onToggleComplete: (taskId: string) => void;
  onChangeStatus: (taskId: string, status: TaskStatus) => void;
  onToggleChecklist: (taskId: string, itemId: string) => void;
  onAcknowledgeChanges: (taskId: string) => void;
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-[12px] text-ink-3">{label}</dt>
      <dd className="mt-1 text-[14px] leading-snug">{children}</dd>
    </div>
  );
}

export function TaskDetailPanel({
  task,
  onClose,
  onToggleComplete,
  onChangeStatus,
  onToggleChecklist,
  onAcknowledgeChanges,
}: TaskDetailPanelProps) {
  const [tab, setTab] = useState<'compare' | 'history'>('compare');
  const [downloaded, setDownloaded] = useState<string | null>(null);

  useEffect(() => setTab(task.whatChanged ? 'compare' : 'history'), [task.id, task.whatChanged]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const done = task.status === 'completed';
  const stepsDone = task.checklist.filter((c) => c.done).length;
  const deadlineMoved = task.previousDeadline && task.previousDeadline !== task.deadline;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-stretch md:justify-end">
      <div className="anim-fade absolute inset-0 bg-black/25 dark:bg-black/50" onClick={onClose} />
      <div
        role="dialog"
        aria-label={task.title}
        className="anim-sheet relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[28px] bg-surface shadow-[var(--shadow-float)] md:m-3 md:max-h-none md:w-[460px] md:rounded-[24px]"
      >
        <div className="mx-auto mt-2.5 h-1 w-9 shrink-0 rounded-full bg-ink/15 md:hidden" />
        <div className="flex shrink-0 items-center justify-between px-6 pt-4 md:pt-5">
          <span className="flex items-center gap-2 text-[12px] text-ink-2">
            <Dot color={task.subjectColor} size={6} />
            {task.subjectShort}
            <span className="text-ink-3">· {task.currentVersion}</span>
          </span>
          <button
            onClick={onClose}
            aria-label="Закрыть"
            className="grid size-8 place-items-center rounded-full bg-fill text-ink-2 transition-colors hover:text-ink"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 space-y-9 overflow-y-auto px-6 pb-8 pt-3">
          <h2 className="text-[22px] font-semibold leading-[1.25] tracking-[-0.02em]">{task.title}</h2>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
            <Meta label="Дедлайн">
              <span className="tabular-nums">{task.deadline}</span>
              {deadlineMoved && (
                <span className="block text-[12px] text-ink-3 line-through tabular-nums">
                  {task.previousDeadline}
                </span>
              )}
            </Meta>
            <Meta label="Осталось">
              <span className={`font-medium ${deadlineTone(task)}`}>{task.daysLeftText}</span>
            </Meta>
            <Meta label="Преподаватель">{task.instructor}</Meta>
            <Meta label="Статус">
              <select
                aria-label="Статус"
                value={task.status}
                onChange={(e) => onChangeStatus(task.id, e.target.value as TaskStatus)}
                className="-ml-1 cursor-pointer rounded-md bg-transparent px-1 text-[14px] outline-none hover:bg-fill"
              >
                <option value="todo">К выполнению</option>
                <option value="in_progress">В работе</option>
                <option value="updated">Обновлено</option>
                <option value="completed">Выполнено</option>
              </select>
            </Meta>
            <Meta label="Источник">{task.source}</Meta>
            <Meta label="Вес">{task.weight.replace(' от итоговой оценки', ' итога')}</Meta>
          </dl>

          <section>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 text-[15px] font-semibold">
                Что изменилось
                {task.hasUnreadChanges && <span className="size-1.5 rounded-full bg-accent" />}
              </h3>
              {task.whatChanged && (
                <Segmented
                  value={tab}
                  onChange={setTab}
                  options={[
                    { value: 'compare', label: 'Сравнение' },
                    { value: 'history', label: 'История' },
                  ]}
                />
              )}
            </div>

            {tab === 'compare' && task.whatChanged ? (
              <>
                <p className="mb-3 text-[14px] leading-relaxed text-ink-2">{task.whatChanged.headline}</p>
                <div className="rounded-2xl bg-fill p-1">
                  <div className="grid grid-cols-2 gap-4 px-4 pb-1.5 pt-2 text-[12px] text-ink-3">
                    <span>Было · {task.previousVersion}</span>
                    <span>Стало · {task.currentVersion}</span>
                  </div>
                  <div className="space-y-1">
                    {task.whatChanged.diffs.map((d) => (
                      <div key={d.fieldLabel} className="rounded-xl bg-surface px-4 py-3">
                        <p className="text-[12px] text-ink-2">{d.fieldLabel}</p>
                        <div className="mt-1.5 grid grid-cols-2 gap-4 text-[13px] leading-snug">
                          <span className="text-ink-3">{d.previousValue}</span>
                          <span className={`font-medium ${d.impact === 'danger' ? 'text-danger' : ''}`}>
                            {d.currentValue}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3 text-[12px] text-ink-3">
                  <span>
                    {task.whatChanged.updatedAt} · {task.whatChanged.author}
                  </span>
                  {task.hasUnreadChanges && (
                    <TextButton tone="accent" onClick={() => onAcknowledgeChanges(task.id)}>
                      Прочитано
                    </TextButton>
                  )}
                </div>
              </>
            ) : (
              <>
                {!task.whatChanged && (
                  <p className="mb-4 text-[14px] text-ink-2">Условия не менялись с момента публикации.</p>
                )}
                <ol className="space-y-4">
                  {task.history.map((h, i) => (
                    <li key={h.version} className="flex gap-3">
                      <div className="flex flex-col items-center pt-1.5">
                        <span className={`size-2 rounded-full ${i === 0 ? 'bg-ink' : 'bg-ink-3/60'}`} />
                        {i < task.history.length - 1 && <span className="mt-1 w-px flex-1 bg-line" />}
                      </div>
                      <div className="min-w-0 pb-1">
                        <p className="text-[13px]">
                          <span className="font-medium">{h.version}</span>
                          <span className="ml-2 text-ink-3">{h.timestamp}</span>
                        </p>
                        <p className="mt-0.5 text-[14px] leading-snug text-ink-2">{h.summary}</p>
                        <p className="mt-0.5 text-[12px] text-ink-3">
                          {h.author} · {h.source}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </section>

          <section>
            <h3 className="mb-2 text-[15px] font-semibold">Описание</h3>
            <p className="text-[15px] leading-relaxed text-ink-2">{task.description}</p>
          </section>

          {task.checklist.length > 0 && (
            <section>
              <h3 className="mb-2 flex items-baseline justify-between text-[15px] font-semibold">
                Этапы
                <span className="text-[13px] font-normal text-ink-3 tabular-nums">
                  {stepsDone} из {task.checklist.length}
                </span>
              </h3>
              <ul>
                {task.checklist.map((c) => (
                  <li key={c.id} className="flex items-start gap-3 py-2">
                    <div className="pt-px">
                      <CheckCircle size={20} done={c.done} onClick={() => onToggleChecklist(task.id, c.id)} />
                    </div>
                    <span className={`text-[14px] leading-snug ${c.done ? 'text-ink-3 line-through' : ''}`}>
                      {c.title}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {task.attachments.length > 0 && (
            <section>
              <h3 className="mb-2 text-[15px] font-semibold">Материалы</h3>
              <div className="divide-y divide-line rounded-2xl border border-line">
                {task.attachments.map((a) => (
                  <div key={a.id} className="flex items-center gap-3 px-4 py-3">
                    <FileText className="size-4 shrink-0 text-ink-3" strokeWidth={1.75} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px]">{a.name}</p>
                      <p className="text-[12px] text-ink-3">
                        {a.size}
                        {a.isNew && <span className="text-accent"> · новый</span>}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setDownloaded(a.id);
                        setTimeout(() => setDownloaded((p) => (p === a.id ? null : p)), 1600);
                      }}
                      aria-label={`Скачать ${a.name}`}
                      className="grid size-8 place-items-center rounded-full text-ink-2 transition-colors hover:bg-fill hover:text-ink"
                    >
                      {downloaded === a.id ? (
                        <Check className="size-4 text-success" />
                      ) : (
                        <Download className="size-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <h3 className="mb-2 text-[15px] font-semibold">Источник</h3>
            <blockquote className="border-l-2 border-line pl-4 text-[14px] leading-relaxed text-ink-2">
              {task.sourceQuote.replace(/^«|»$/g, '')}
            </blockquote>
            <p className="mt-2 pl-4 text-[12px] text-ink-3">{task.sourceChannel}</p>
          </section>
        </div>

        <div className="shrink-0 border-t border-line p-4">
          <button
            onClick={() => onToggleComplete(task.id)}
            className={`h-11 w-full text-[15px] ${done ? 'btn-secondary' : 'btn-primary'}`}
          >
            {done ? 'Вернуть в работу' : 'Отметить выполненным'}
          </button>
        </div>
      </div>
    </div>
  );
}
