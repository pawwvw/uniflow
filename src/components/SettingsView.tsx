import { ReactNode, useEffect, useState } from 'react';
import { PageHeader, Segmented, Toggle } from './ui';

export type ThemeMode = 'light' | 'dark' | 'system';

interface SettingsViewProps {
  themeMode: ThemeMode;
  onChangeTheme: (mode: ThemeMode) => void;
  glass: boolean;
  onChangeGlass: (v: boolean) => void;
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 px-1 text-[13px] font-medium text-ink-2">{title}</h2>
      <div className="card divide-y divide-line overflow-hidden">{children}</div>
    </section>
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="flex min-h-[56px] items-center gap-4 px-5 py-3">
      <div className="min-w-0 flex-1">
        <p className="text-[14px]">{label}</p>
        {hint && <p className="mt-0.5 text-[12px] text-ink-3">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

function InlineInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-1/2 min-w-0 bg-transparent text-right text-[14px] text-ink-2 outline-none focus:text-ink"
    />
  );
}

export function SettingsView({ themeMode, onChangeTheme, glass, onChangeGlass }: SettingsViewProps) {
  const [name, setName] = useState('Алексей Морозов');
  const [group, setGroup] = useState('БПМИ-224, 3 курс');
  const [email, setEmail] = useState('amorozov@edu.hse.ru');
  const [notify, setNotify] = useState({ deadline: true, criteria: true, files: false, digest: true, quiet: true });
  const [lead, setLead] = useState('24');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 1800);
    return () => clearTimeout(t);
  }, [saved]);

  const n = (k: keyof typeof notify) => (v: boolean) => setNotify((p) => ({ ...p, [k]: v }));

  return (
    <div className="max-w-2xl space-y-10">
      <PageHeader
        title="Настройки"
        action={
          <button className="btn-primary" onClick={() => setSaved(true)}>
            {saved ? 'Сохранено' : 'Сохранить'}
          </button>
        }
      />

      <Group title="Профиль">
        <div className="flex items-center gap-4 px-5 py-4">
          <span className="grid size-12 place-items-center rounded-full bg-fill text-[15px] font-medium">
            {name
              .split(' ')
              .map((p) => p[0])
              .join('')
              .slice(0, 2)}
          </span>
          <div>
            <p className="text-[15px] font-medium">{name}</p>
            <p className="text-[13px] text-ink-2">НИУ ВШЭ · Факультет компьютерных наук</p>
          </div>
        </div>
        <Row label="Имя">
          <InlineInput value={name} onChange={(e) => setName(e.target.value)} />
        </Row>
        <Row label="Группа">
          <InlineInput value={group} onChange={(e) => setGroup(e.target.value)} />
        </Row>
        <Row label="Почта">
          <InlineInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Row>
      </Group>

      <Group title="Оформление">
        <Row label="Тема">
          <Segmented
            value={themeMode}
            onChange={onChangeTheme}
            options={[
              { value: 'light', label: 'Светлая' },
              { value: 'dark', label: 'Тёмная' },
              { value: 'system', label: 'Авто' },
            ]}
          />
        </Row>
        <Row label="Эффект стекла" hint="Полупрозрачная навигация и панели">
          <Toggle checked={glass} onChange={onChangeGlass} label="Эффект стекла" />
        </Row>
      </Group>

      <Group title="Уведомления">
        <Row label="Перенос дедлайна" hint="Сразу, из любого источника">
          <Toggle checked={notify.deadline} onChange={n('deadline')} label="Перенос дедлайна" />
        </Row>
        <Row label="Изменение условий и критериев">
          <Toggle checked={notify.criteria} onChange={n('criteria')} label="Изменение условий" />
        </Row>
        <Row label="Новые файлы и материалы">
          <Toggle checked={notify.files} onChange={n('files')} label="Новые файлы" />
        </Row>
        <Row label="Утренняя сводка" hint="Каждый день в 08:30">
          <Toggle checked={notify.digest} onChange={n('digest')} label="Утренняя сводка" />
        </Row>
        <Row label="Не беспокоить ночью" hint="С 23:00 до 08:00">
          <Toggle checked={notify.quiet} onChange={n('quiet')} label="Не беспокоить ночью" />
        </Row>
      </Group>

      <Group title="Учёба">
        <Row label="Учебный период">
          <select className="field pr-8">
            <option>Весна 2025 · 3 модуль</option>
            <option>Весна 2025 · 4 модуль</option>
          </select>
        </Row>
        <Row label="Шкала оценок">
          <select className="field pr-8">
            <option>10-балльная</option>
            <option>5-балльная</option>
            <option>100-балльная</option>
          </select>
        </Row>
        <Row label="Срочный дедлайн" hint="Когда подсвечивать задание">
          <select className="field pr-8" value={lead} onChange={(e) => setLead(e.target.value)}>
            <option value="12">За 12 часов</option>
            <option value="24">За 24 часа</option>
            <option value="48">За 48 часов</option>
          </select>
        </Row>
      </Group>
    </div>
  );
}
