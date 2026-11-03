import { useState } from 'react';
import { ChevronDown, GraduationCap, Mail, MessagesSquare, RefreshCw, Send } from 'lucide-react';
import { IntegrationSource, SourceType } from '../data/mockData';
import { PageHeader, Toggle } from './ui';

interface SourcesViewProps {
  sources: IntegrationSource[];
  onToggleRule: (sourceId: SourceType, ruleId: string) => void;
  onToggleChannel: (sourceId: SourceType, index: number) => void;
  onSyncSource: (sourceId?: SourceType) => void;
}

const icons: Record<SourceType, typeof Send> = {
  SmartLMS: GraduationCap,
  Telegram: Send,
  Zulip: MessagesSquare,
  Email: Mail,
};

export function SourcesView({ sources, onToggleRule, onToggleChannel, onSyncSource }: SourcesViewProps) {
  const [open, setOpen] = useState<SourceType | null>('SmartLMS');
  const [syncing, setSyncing] = useState<SourceType | 'all' | null>(null);

  const sync = (id?: SourceType) => {
    setSyncing(id ?? 'all');
    setTimeout(() => {
      onSyncSource(id);
      setSyncing(null);
    }, 900);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Источники"
        subtitle="Откуда UniFlow собирает задания и изменения"
        action={
          <button className="btn-secondary" onClick={() => sync()} disabled={syncing !== null}>
            <RefreshCw className={`size-4 ${syncing === 'all' ? 'animate-spin' : ''}`} />
            {syncing === 'all' ? 'Синхронизация…' : 'Синхронизировать'}
          </button>
        }
      />

      <div className="card divide-y divide-line overflow-hidden">
        {sources.map((s) => {
          const Icon = icons[s.id];
          const isOpen = open === s.id;
          const spinning = syncing === s.id || syncing === 'all';
          return (
            <div key={s.id}>
              <button
                onClick={() => setOpen(isOpen ? null : s.id)}
                aria-expanded={isOpen}
                className="row-hover flex w-full items-center gap-4 px-5 py-4 text-left"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-fill text-ink-2">
                  <Icon className="size-[18px]" strokeWidth={1.75} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-medium">{s.name}</p>
                  <p className="mt-0.5 truncate text-[13px] text-ink-2">{s.subtitle}</p>
                </div>
                <div className="hidden shrink-0 text-right sm:block">
                  <p className="inline-flex items-center gap-1.5 text-[13px]">
                    <span className="size-1.5 rounded-full bg-success" />
                    Подключено
                  </p>
                  <p className="mt-0.5 text-[12px] text-ink-3">{spinning ? 'Синхронизация…' : s.lastSync}</p>
                </div>
                <ChevronDown
                  className={`size-4 shrink-0 text-ink-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isOpen && (
                <div className="anim-fade space-y-6 px-5 pb-6 sm:pl-[76px]">
                  <div className="flex flex-wrap items-center justify-between gap-3 text-[13px]">
                    <span className="text-ink-2">{s.accountLabel}</span>
                    <button
                      onClick={() => sync(s.id)}
                      className="inline-flex items-center gap-1.5 font-medium text-accent"
                    >
                      <RefreshCw className={`size-3.5 ${spinning ? 'animate-spin' : ''}`} />
                      Обновить
                    </button>
                  </div>

                  <div>
                    <p className="mb-2 text-[13px] text-ink-3">Каналы</p>
                    <div className="divide-y divide-line rounded-2xl bg-fill/60">
                      {s.channels.map((c, i) => (
                        <div key={c.name} className="flex items-center gap-4 px-4 py-3">
                          <div className="min-w-0 flex-1">
                            <p className={`truncate text-[14px] ${c.active ? '' : 'text-ink-3'}`}>{c.name}</p>
                            <p className="mt-0.5 truncate text-[12px] text-ink-3">{c.lastEvent}</p>
                          </div>
                          <Toggle checked={c.active} onChange={() => onToggleChannel(s.id, i)} label={c.name} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-[13px] text-ink-3">Отслеживание изменений</p>
                    <div className="divide-y divide-line rounded-2xl bg-fill/60">
                      {s.autoRules.map((r) => (
                        <div key={r.id} className="flex items-center gap-4 px-4 py-3">
                          <p className="flex-1 text-[14px] leading-snug">{r.label}</p>
                          <Toggle checked={r.enabled} onChange={() => onToggleRule(s.id, r.id)} label={r.label} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
