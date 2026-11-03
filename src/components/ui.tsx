import type { ReactNode } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import type { AcademicTask, DiffField } from '../data/mockData';

export function plural(n: number, forms: [string, string, string]) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return forms[0];
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return forms[1];
  return forms[2];
}

export function Dot({ color, size = 8 }: { color: string; size?: number }) {
  return (
    <span
      className="inline-block shrink-0 rounded-full"
      style={{ backgroundColor: color, width: size, height: size }}
    />
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-[26px] w-[44px] shrink-0 rounded-full transition-colors duration-200 ${
        checked ? 'bg-success' : 'bg-ink/15'
      }`}
    >
      <span
        className={`absolute left-[3px] top-[3px] size-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.22)] transition-transform duration-200 ${
          checked ? 'translate-x-[18px]' : ''
        }`}
      />
    </button>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className = '',
}: {
  options: { value: T; label: ReactNode; title?: string }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div className={`inline-flex shrink-0 rounded-[11px] bg-fill p-[3px] ${className}`}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          title={o.title}
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={`flex h-[30px] items-center justify-center gap-1.5 whitespace-nowrap rounded-[8px] px-3 text-[13px] font-medium transition-all duration-200 ${
            value === o.value
              ? 'bg-surface text-ink shadow-[0_1px_2px_rgba(0,0,0,0.08)]'
              : 'text-ink-2 hover:text-ink'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function CheckCircle({
  done,
  onClick,
  size = 22,
}: {
  done: boolean;
  onClick: () => void;
  size?: number;
}) {
  return (
    <button
      type="button"
      aria-label={done ? 'Вернуть в работу' : 'Отметить выполненным'}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      style={{ width: size, height: size }}
      className={`grid shrink-0 place-items-center rounded-full border-[1.5px] transition-all duration-200 ${
        done
          ? 'border-success bg-success text-white'
          : 'border-ink-3 hover:border-ink-2'
      }`}
    >
      {done && <Check className="size-3" strokeWidth={3} />}
    </button>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.025em] sm:text-[32px]">
          {title}
        </h1>
        {subtitle && <p className="mt-1.5 text-[15px] text-ink-2">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}

export function SectionHeader({
  title,
  meta,
  action,
}: {
  title: string;
  meta?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-4 px-1">
      <h2 className="text-[15px] font-semibold tracking-[-0.01em]">
        {title}
        {meta && <span className="ml-2 font-normal text-ink-3">{meta}</span>}
      </h2>
      {action}
    </div>
  );
}

export function TextButton({
  children,
  onClick,
  tone = 'muted',
}: {
  children: ReactNode;
  onClick: () => void;
  tone?: 'muted' | 'accent';
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 text-[13px] font-medium transition-colors ${
        tone === 'accent' ? 'text-accent hover:opacity-80' : 'text-ink-2 hover:text-ink'
      }`}
    >
      {children}
    </button>
  );
}

export function DiffInline({ diff }: { diff: DiffField }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-[13px] leading-relaxed">
      <span className="text-ink-2">{diff.fieldLabel}</span>
      <span className="text-ink-3 line-through decoration-ink-3/60">{diff.previousValue}</span>
      <ArrowRight className="size-3 self-center text-ink-3" />
      <span className={`font-medium ${diff.impact === 'danger' ? 'text-danger' : 'text-ink'}`}>
        {diff.currentValue}
      </span>
    </div>
  );
}

export function deadlineTone(task: AcademicTask) {
  if (task.status === 'completed') return 'text-ink-3';
  if (task.urgency === 'today' || task.urgency === 'overdue') return 'text-danger';
  return 'text-ink';
}

export function PriorityMark({ task }: { task: AcademicTask }) {
  if (task.status === 'completed' || task.priority === 'low') return null;
  return (
    <span
      title={task.priority === 'high' ? 'Высокий приоритет' : 'Средний приоритет'}
      className={`inline-block size-1.5 rounded-full ${
        task.priority === 'high' ? 'bg-danger' : 'bg-warning'
      }`}
    />
  );
}

export function TaskRow({
  task,
  onOpen,
  onToggle,
}: {
  task: AcademicTask;
  onOpen: () => void;
  onToggle: () => void;
}) {
  const done = task.status === 'completed';
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => e.key === 'Enter' && onOpen()}
      className="row-hover flex cursor-pointer items-start gap-3.5 px-5 py-4 outline-none focus-visible:bg-fill"
    >
      <div className="pt-px">
        <CheckCircle done={done} onClick={onToggle} />
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={`text-[15px] leading-snug ${
            done ? 'text-ink-3 line-through decoration-ink-3/50' : 'font-medium text-ink'
          }`}
        >
          {task.title}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-ink-2">
          <Dot color={task.subjectColor} size={6} />
          <span>{task.subjectShort}</span>
          <span className="text-ink-3">·</span>
          <span>{task.source}</span>
          {task.hasUnreadChanges && (
            <>
              <span className="text-ink-3">·</span>
              <span className="text-accent">Изменено</span>
            </>
          )}
        </div>
      </div>
      <div className="shrink-0 text-right">
        <p
          className={`inline-flex items-center gap-1.5 text-[13px] font-medium tabular-nums ${deadlineTone(
            task
          )}`}
        >
          <PriorityMark task={task} />
          {task.daysLeftText}
        </p>
        <p className="mt-0.5 hidden text-[12px] text-ink-3 tabular-nums sm:block">
          {task.deadline}
        </p>
      </div>
    </div>
  );
}
