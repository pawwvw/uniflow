export type NavPage =
  | 'home'
  | 'tasks'
  | 'changes'
  | 'calendar'
  | 'subjects'
  | 'sources'
  | 'settings';

export type SourceType = 'SmartLMS' | 'Telegram' | 'Zulip' | 'Email';

export type PriorityLevel = 'high' | 'medium' | 'low';

export type TaskStatus = 'in_progress' | 'updated' | 'todo' | 'completed' | 'overdue';

export type ChangeCategory =
  | 'deadline_shift'
  | 'criteria_update'
  | 'new_attachment'
  | 'new_task'
  | 'schedule_change';

export interface DiffField {
  fieldLabel: string;
  previousValue: string;
  currentValue: string;
  impact: 'warning' | 'danger' | 'info' | 'success';
}

export interface TaskVersionEntry {
  version: string;
  timestamp: string;
  source: SourceType;
  author: string;
  summary: string;
  diffs?: DiffField[];
}

export interface TaskAttachment {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'ipynb' | 'zip' | 'doc' | 'dataset';
  updatedAt: string;
  isNew?: boolean;
}

export interface TaskChecklistItem {
  id: string;
  title: string;
  done: boolean;
}

export interface AcademicTask {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  subjectShort: string;
  subjectColor: string;
  instructor: string;
  deadline: string;
  deadlineIso: string;
  deadlineTime: string;
  previousDeadline?: string;
  daysLeftText: string;
  urgency: 'today' | 'tomorrow' | 'soon' | 'overdue' | 'done';
  priority: PriorityLevel;
  status: TaskStatus;
  source: SourceType;
  sourceChannel: string;
  sourceUrlLabel: string;
  sourceQuote: string;
  weight: string;
  currentVersion: string;
  previousVersion?: string;
  hasUnreadChanges: boolean;
  changeSummaryBadge?: string;
  description: string;
  whatChanged?: {
    updatedAt: string;
    source: SourceType;
    author: string;
    headline: string;
    diffs: DiffField[];
  };
  attachments: TaskAttachment[];
  checklist: TaskChecklistItem[];
  history: TaskVersionEntry[];
}

export interface ChangeFeedItem {
  id: string;
  taskId: string;
  taskTitle: string;
  subjectId: string;
  subjectName: string;
  subjectColor: string;
  category: ChangeCategory;
  categoryLabel: string;
  priority: PriorityLevel;
  source: SourceType;
  sourceDetail: string;
  timestamp: string;
  relativeTime: string;
  isUnread: boolean;
  headline: string;
  description: string;
  diffs: DiffField[];
}

export interface SubjectCourse {
  id: string;
  name: string;
  shortName: string;
  code: string;
  color: string;
  instructor: string;
  assistant: string;
  credits: number;
  completedTasks: number;
  totalTasks: number;
  unreadChanges: number;
  nextDeadlineText: string;
  nextTaskTitle: string;
  sources: SourceType[];
  schedule: string;
  room: string;
  averageScore: string;
}

export interface IntegrationSource {
  id: SourceType;
  name: string;
  subtitle: string;
  status: 'connected' | 'syncing' | 'attention';
  lastSync: string;
  syncedItemsCount: number;
  unreadUpdatesCount: number;
  accountLabel: string;
  channels: {
    name: string;
    course: string;
    active: boolean;
    lastEvent: string;
  }[];
  autoRules: {
    id: string;
    label: string;
    enabled: boolean;
  }[];
}

export const SUBJECTS: SubjectCourse[] = [
  {
    id: 'ml',
    name: 'Машинное обучение и нейросети',
    shortName: 'Машинное обучение',
    code: 'CS-304',
    color: '#7487D9',
    instructor: 'проф. Соколов А. В.',
    assistant: 'асс. Лебедева М. И.',
    credits: 6,
    completedTasks: 5,
    totalTasks: 8,
    unreadChanges: 2,
    nextDeadlineText: 'Завтра, 23:59',
    nextTaskTitle: 'ЛР №4: Градиентный бустинг и калибровка вероятностей',
    sources: ['SmartLMS', 'Telegram', 'Zulip'],
    schedule: 'Вт 10:30, Чт 13:40',
    room: 'Покровский б-р, R402',
    averageScore: '9.2 / 10',
  },
  {
    id: 'dist',
    name: 'Распределённые системы и консенсус',
    shortName: 'Распределённые системы',
    code: 'SE-412',
    color: '#5AA48F',
    instructor: 'доц. Кравцов Д. Н.',
    assistant: 'асс. Громов П. С.',
    credits: 5,
    completedTasks: 3,
    totalTasks: 6,
    unreadChanges: 2,
    nextDeadlineText: 'Сегодня, 21:00',
    nextTaskTitle: 'ДЗ №3: Реализация алгоритма Raft (выбор лидера и репликация)',
    sources: ['Zulip', 'SmartLMS'],
    schedule: 'Пн 15:10, Ср 16:40',
    room: 'Ауд. D508 / Онлайн',
    averageScore: '8.7 / 10',
  },
  {
    id: 'algo',
    name: 'Продвинутые алгоритмы и структуры данных',
    shortName: 'Алгоритмы',
    code: 'CS-301',
    color: '#D9A25B',
    instructor: 'проф. Верещагин И. К.',
    assistant: 'асс. Орлов К. В.',
    credits: 6,
    completedTasks: 7,
    totalTasks: 9,
    unreadChanges: 1,
    nextDeadlineText: '20 мар, 23:59',
    nextTaskTitle: 'Контест №6: Потоки в сетях и паросочетания минимального веса',
    sources: ['Telegram', 'SmartLMS'],
    schedule: 'Ср 10:30, Пт 12:00',
    room: 'Ауд. R301',
    averageScore: '9.5 / 10',
  },
  {
    id: 'nlp',
    name: 'Компьютерная лингвистика и LLM',
    shortName: 'Комп. лингвистика',
    code: 'AI-318',
    color: '#A08CCB',
    instructor: 'доц. Романова Е. А.',
    assistant: 'асс. Ким А. Д.',
    credits: 4,
    completedTasks: 2,
    totalTasks: 5,
    unreadChanges: 1,
    nextDeadlineText: '22 мар, 18:00',
    nextTaskTitle: 'Мини-проект: LoRA-адаптация трансформера для русскоязычного корпуса',
    sources: ['SmartLMS', 'Telegram', 'Email'],
    schedule: 'Чт 16:40',
    room: 'Ауд. S214',
    averageScore: '8.9 / 10',
  },
  {
    id: 'stat',
    name: 'Прикладная математическая статистика',
    shortName: 'Мат. статистика',
    code: 'MA-209',
    color: '#CF7D88',
    instructor: 'проф. Чернышев В. П.',
    assistant: 'асс. Белова О. Ю.',
    credits: 5,
    completedTasks: 4,
    totalTasks: 6,
    unreadChanges: 1,
    nextDeadlineText: '19 мар, 23:59',
    nextTaskTitle: 'РГР №2: Байесовская проверка гипотез и A/B-тестирование',
    sources: ['Email', 'SmartLMS'],
    schedule: 'Вт 13:40, Пт 15:10',
    room: 'Ауд. R206',
    averageScore: '8.4 / 10',
  },
  {
    id: 'fp',
    name: 'Функциональное программирование и системы типов',
    shortName: 'Функц. программирование',
    code: 'CS-315',
    color: '#6AA7C4',
    instructor: 'доц. Мельников С. Г.',
    assistant: 'асс. Захаров И. А.',
    credits: 4,
    completedTasks: 4,
    totalTasks: 5,
    unreadChanges: 0,
    nextDeadlineText: '25 мар, 23:59',
    nextTaskTitle: 'ЛР №5: Монадные трансформеры и парсер-комбинаторы на Haskell',
    sources: ['Zulip', 'Email'],
    schedule: 'Пн 12:00',
    room: 'Ауд. D304',
    averageScore: '9.8 / 10',
  },
];

export const INITIAL_TASKS: AcademicTask[] = [
  {
    id: 'task-ml-4',
    title: 'ЛР №4: Градиентный бустинг и калибровка вероятностей',
    subjectId: 'ml',
    subjectName: 'Машинное обучение и нейросети',
    subjectShort: 'Машинное обучение',
    subjectColor: '#7487D9',
    instructor: 'проф. Соколов А. В.',
    deadline: '18 марта, 23:59',
    deadlineIso: '2025-03-18',
    deadlineTime: '23:59',
    previousDeadline: '16 марта, 23:59',
    daysLeftText: 'Завтра · 32 ч',
    urgency: 'tomorrow',
    priority: 'high',
    status: 'updated',
    source: 'SmartLMS',
    sourceChannel: 'SmartLMS · Курс CS-304 + Telegram @hse_ml_2025',
    sourceUrlLabel: 'lms.hse.ru/course/view.php?id=304#lab4',
    sourceQuote:
      '«Коллеги, в связи с обновлением тестового сплита transactions_v2.parquet дедлайн по ЛР №4 сдвинут на 18 марта 23:59. Также добавлен обязательный пункт с построением кривой надёжности (Reliability Diagram).»',
    weight: '12% от итоговой оценки',
    currentVersion: 'v2.4',
    previousVersion: 'v2.1',
    hasUnreadChanges: true,
    changeSummaryBadge: 'Дедлайн +48 ч · Новый датасет',
    description:
      'Реализовать собственный класс градиентного бустинга над решающими деревьями с поддержкой логарифмической функции потерь, сравнить качество с CatBoost и LightGBM на обновлённом наборе транзакций и провести калибровку вероятностей методами Платта и изотонической регрессии.',
    whatChanged: {
      updatedAt: 'Сегодня в 11:42',
      source: 'SmartLMS',
      author: 'проф. Соколов А. В.',
      headline: 'Перенесён срок сдачи, обновлён датасет и уточнены критерии бонусной части',
      diffs: [
        {
          fieldLabel: 'Срок сдачи (Дедлайн)',
          previousValue: '16 марта, 23:59',
          currentValue: '18 марта, 23:59 (+48 часов)',
          impact: 'warning',
        },
        {
          fieldLabel: 'Тестовый набор данных',
          previousValue: 'transactions_v1.csv (42 МБ)',
          currentValue: 'transactions_v2.parquet (68 МБ, очищены дубликаты)',
          impact: 'info',
        },
        {
          fieldLabel: 'Критерии оценивания',
          previousValue: 'ROC-AUC ≥ 0.84 на валидации (8 баллов)',
          currentValue: 'ROC-AUC ≥ 0.86 + кривая калибровки Brier Score ≤ 0.11 (10 баллов)',
          impact: 'danger',
        },
      ],
    },
    attachments: [
      {
        id: 'att-1',
        name: 'LR4_Gradient_Boosting_Spec_v2.4.pdf',
        size: '1.8 МБ',
        type: 'pdf',
        updatedAt: 'Обновлено сегодня, 11:42',
        isNew: true,
      },
      {
        id: 'att-2',
        name: 'transactions_v2.parquet',
        size: '68.4 МБ',
        type: 'dataset',
        updatedAt: 'Добавлено сегодня, 11:40',
        isNew: true,
      },
      {
        id: 'att-3',
        name: 'baseline_template.ipynb',
        size: '420 КБ',
        type: 'ipynb',
        updatedAt: '10 марта',
      },
    ],
    checklist: [
      { id: 'c1', title: 'Скачать обновлённый датасет transactions_v2.parquet', done: true },
      { id: 'c2', title: 'Реализовать fit/predict_proba для GBDT', done: true },
      { id: 'c3', title: 'Провести калибровку вероятностей (Platt + Isotonic)', done: false },
      { id: 'c4', title: 'Оформить отчёт и графики Brier Score в ноутбуке', done: false },
    ],
    history: [
      {
        version: 'v2.4',
        timestamp: 'Сегодня, 11:42',
        source: 'SmartLMS',
        author: 'проф. Соколов А. В.',
        summary: 'Перенос дедлайна на 18 марта и публикация очищенного датасета v2',
      },
      {
        version: 'v2.1',
        timestamp: '14 марта, 18:15',
        source: 'Telegram',
        author: 'асс. Лебедева М. И.',
        summary: 'Уточнение порога ROC-AUC и ответы на частые вопросы в закреплённом сообщении',
      },
      {
        version: 'v1.0',
        timestamp: '08 марта, 10:00',
        source: 'SmartLMS',
        author: 'проф. Соколов А. В.',
        summary: 'Публикация исходного условия лабораторной работы №4',
      },
    ],
  },
  {
    id: 'task-dist-3',
    title: 'ДЗ №3: Реализация алгоритма Raft (выбор лидера и репликация лога)',
    subjectId: 'dist',
    subjectName: 'Распределённые системы и консенсус',
    subjectShort: 'Распределённые системы',
    subjectColor: '#5AA48F',
    instructor: 'доц. Кравцов Д. Н.',
    deadline: '17 марта, 21:00',
    deadlineIso: '2025-03-17',
    deadlineTime: '21:00',
    previousDeadline: '17 марта, 23:59',
    daysLeftText: 'Сегодня · 6 ч',
    urgency: 'today',
    priority: 'high',
    status: 'in_progress',
    source: 'Zulip',
    sourceChannel: 'Zulip · #distributed-systems > ДЗ-3 Raft',
    sourceUrlLabel: 'zulip.cs.hse.ru/#narrow/stream/dist-sys/topic/hw3',
    sourceQuote:
      '«Внимание! Тестирующая система закрывает приём ровно в 21:00 МСК для запуска ночного стресс-теста при сетевых партициях (linearizability check). Убедитесь, что ваш код проходит тест TestFigure8Unreliable2C.»',
    weight: '15% от итоговой оценки',
    currentVersion: 'v1.3',
    previousVersion: 'v1.0',
    hasUnreadChanges: true,
    changeSummaryBadge: 'Время сдачи 21:00 · Новый тест 2C',
    description:
      'Реализовать отказоустойчивый модуль консенсуса Raft на языке Go. Необходимо поддержать процедуру выборов лидера (Part 2A), репликацию команд журнала (Part 2B) и сохранение персистентного состояния при перезапусках узлов и потере пакетов (Part 2C).',
    whatChanged: {
      updatedAt: 'Сегодня в 09:20',
      source: 'Zulip',
      author: 'доц. Кравцов Д. Н.',
      headline: 'Изменено время закрытия CI-пайплайна и обновлён таймаут RPC в тестах',
      diffs: [
        {
          fieldLabel: 'Время закрытия приёма',
          previousValue: '17 марта, 23:59 МСК',
          currentValue: '17 марта, 21:00 МСК (сдвиг на 3 часа раньше)',
          impact: 'danger',
        },
        {
          fieldLabel: 'Лимит времени на тест 2C',
          previousValue: '120 секунд',
          currentValue: '90 секунд при 5 узлах и 15% packet drop',
          impact: 'warning',
        },
      ],
    },
    attachments: [
      {
        id: 'att-dist-1',
        name: 'raft_test_harness_v1.3.zip',
        size: '3.1 МБ',
        type: 'zip',
        updatedAt: 'Сегодня, 09:20',
        isNew: true,
      },
      {
        id: 'att-dist-2',
        name: 'Ongaro_Ousterhout_Raft_Paper_Notes.pdf',
        size: '2.4 МБ',
        type: 'pdf',
        updatedAt: '05 марта',
      },
    ],
    checklist: [
      { id: 'd1', title: 'Прохождение тестов 2A (Leader Election)', done: true },
      { id: 'd2', title: 'Прохождение тестов 2B (Log Replication)', done: true },
      { id: 'd3', title: 'Оптимизация Accelerated Log Backtracking для 2C', done: true },
      { id: 'd4', title: 'Финальный прогон go test -race -run 2C (20 итераций)', done: false },
    ],
    history: [
      {
        version: 'v1.3',
        timestamp: 'Сегодня, 09:20',
        source: 'Zulip',
        author: 'доц. Кравцов Д. Н.',
        summary: 'Перенос времени дедлайна на 21:00 МСК и обновление тестового окружения',
      },
      {
        version: 'v1.0',
        timestamp: '03 марта, 14:00',
        source: 'SmartLMS',
        author: 'доц. Кравцов Д. Н.',
        summary: 'Выдача домашнего задания №3',
      },
    ],
  },
  {
    id: 'task-stat-2',
    title: 'РГР №2: Байесовская проверка гипотез и дизайн A/B-экспериментов',
    subjectId: 'stat',
    subjectName: 'Прикладная математическая статистика',
    subjectShort: 'Мат. статистика',
    subjectColor: '#CF7D88',
    instructor: 'проф. Чернышев В. П.',
    deadline: '19 марта, 23:59',
    deadlineIso: '2025-03-19',
    deadlineTime: '23:59',
    previousDeadline: '19 марта, 23:59',
    daysLeftText: 'Через 2 дня',
    urgency: 'soon',
    priority: 'high',
    status: 'updated',
    source: 'Email',
    sourceChannel: 'Email · Рассылка кафедры статистики (vchernyshev@edu.hse.ru)',
    sourceUrlLabel: 'Письмо от 16 марта, 19:05',
    sourceQuote:
      '«Уважаемые студенты 3 курса! Во втором варианте таблицы исходных параметров была обнаружена опечатка в дисперсии априорного распределения Beta(α, β). Пожалуйста, используйте прикреплённый файл variants_corrected.pdf.»',
    weight: '10% от итоговой оценки',
    currentVersion: 'v1.2',
    previousVersion: 'v1.0',
    hasUnreadChanges: true,
    changeSummaryBadge: 'Исправлена опечатка в вариантах',
    description:
      'Рассчитать минимальный объём выборки (MDE) для продуктового A/B-теста, построить апостериорное распределение конверсии при сопряжённом Beta-априори и оценить вероятность ошибки первого рода при последовательном тестировании (Sequential Testing).',
    whatChanged: {
      updatedAt: 'Вчера в 19:05',
      source: 'Email',
      author: 'проф. Чернышев В. П.',
      headline: 'Исправлены параметры априорного распределения для вариантов 11–20',
      diffs: [
        {
          fieldLabel: 'Параметры Beta(α₀, β₀) для вар. 14',
          previousValue: 'α₀ = 450, β₀ = 50 (инвертировано)',
          currentValue: 'α₀ = 50, β₀ = 450 (базовая конверсия 10%)',
          impact: 'warning',
        },
        {
          fieldLabel: 'Формат сдачи',
          previousValue: 'Только PDF-отчёт',
          currentValue: 'PDF-отчёт (LaTeX) + скрипт симуляции в .py / .ipynb',
          impact: 'info',
        },
      ],
    },
    attachments: [
      {
        id: 'att-stat-1',
        name: 'RGR2_variants_corrected_v1.2.pdf',
        size: '940 КБ',
        type: 'pdf',
        updatedAt: 'Вчера, 19:05',
        isNew: true,
      },
    ],
    checklist: [
      { id: 's1', title: 'Проверить параметры варианта №14 по новой таблице', done: true },
      { id: 's2', title: 'Провести симуляцию Монте-Карло (100 000 итераций)', done: false },
      { id: 's3', title: 'Сверстать аналитические выводы в LaTeX', done: false },
    ],
    history: [
      {
        version: 'v1.2',
        timestamp: 'Вчера, 19:05',
        source: 'Email',
        author: 'проф. Чернышев В. П.',
        summary: 'Исправление параметров в вариантах 11–20 и добавление требования приложить код',
      },
      {
        version: 'v1.0',
        timestamp: '06 марта, 12:00',
        source: 'SmartLMS',
        author: 'проф. Чернышев В. П.',
        summary: 'Публикация расчётно-графической работы №2',
      },
    ],
  },
  {
    id: 'task-algo-6',
    title: 'Контест №6: Потоки в сетях и паросочетания минимального веса',
    subjectId: 'algo',
    subjectName: 'Продвинутые алгоритмы и структуры данных',
    subjectShort: 'Алгоритмы',
    subjectColor: '#D9A25B',
    instructor: 'проф. Верещагин И. К.',
    deadline: '20 марта, 23:59',
    deadlineIso: '2025-03-20',
    deadlineTime: '23:59',
    previousDeadline: '19 марта, 23:59',
    daysLeftText: 'Через 3 дня',
    urgency: 'soon',
    priority: 'medium',
    status: 'in_progress',
    source: 'Telegram',
    sourceChannel: 'Telegram · Канал «Алгоритмы ПМИ 2025»',
    sourceUrlLabel: 't.me/algo_pmi_2025/418',
    sourceQuote:
      '«В задаче E (Min-Cost Max-Flow с потенциалами Джонсона) увеличен Time Limit на C++ до 2.0 с, а дедлайн всего контеста продлён на сутки — до 20 марта 23:59.»',
    weight: '8% от итоговой оценки',
    currentVersion: 'v1.1',
    previousVersion: 'v1.0',
    hasUnreadChanges: true,
    changeSummaryBadge: 'TL увеличен до 2.0 с · +24 ч',
    description:
      'Решить 6 алгоритмических задач в Яндекс.Контесте: алгоритм Диница с масштабированием, теорема Форда–Фалкерсона, задача о назначениях (венгерский алгоритм) и поток минимальной стоимости.',
    whatChanged: {
      updatedAt: 'Вчера в 16:30',
      source: 'Telegram',
      author: 'асс. Орлов К. В.',
      headline: 'Продлён дедлайн контеста и увеличен лимит времени в задаче E',
      diffs: [
        {
          fieldLabel: 'Дедлайн контеста',
          previousValue: '19 марта, 23:59',
          currentValue: '20 марта, 23:59 (+24 часа)',
          impact: 'success',
        },
        {
          fieldLabel: 'Time Limit в задаче E',
          previousValue: '1.0 сек (C++20)',
          currentValue: '2.0 сек (C++20) + перетестирование посылок',
          impact: 'info',
        },
      ],
    },
    attachments: [
      {
        id: 'att-algo-1',
        name: 'Contest6_Network_Flows_Tutorial.pdf',
        size: '1.2 МБ',
        type: 'pdf',
        updatedAt: '12 марта',
      },
    ],
    checklist: [
      { id: 'a1', title: 'Задачи A, B, C (Алгоритм Диница)', done: true },
      { id: 'a2', title: 'Задача D (Венгерский алгоритм)', done: true },
      { id: 'a3', title: 'Задача E (Min-Cost Max-Flow)', done: false },
      { id: 'a4', title: 'Оформить краткий разбор задачи F для ревью', done: false },
    ],
    history: [
      {
        version: 'v1.1',
        timestamp: 'Вчера, 16:30',
        source: 'Telegram',
        author: 'асс. Орлов К. В.',
        summary: 'Увеличение TL в задаче E и перенос мягкого дедлайна на 20 марта',
      },
      {
        version: 'v1.0',
        timestamp: '10 марта, 09:00',
        source: 'SmartLMS',
        author: 'проф. Верещагин И. К.',
        summary: 'Старт контеста №6',
      },
    ],
  },
  {
    id: 'task-nlp-2',
    title: 'Мини-проект: LoRA-адаптация трансформера для русскоязычного корпуса',
    subjectId: 'nlp',
    subjectName: 'Компьютерная лингвистика и LLM',
    subjectShort: 'Комп. лингвистика',
    subjectColor: '#A08CCB',
    instructor: 'доц. Романова Е. А.',
    deadline: '22 марта, 18:00',
    deadlineIso: '2025-03-22',
    deadlineTime: '18:00',
    daysLeftText: 'Через 5 дней',
    urgency: 'soon',
    priority: 'medium',
    status: 'todo',
    source: 'SmartLMS',
    sourceChannel: 'SmartLMS · Компьютерная лингвистика + Telegram-чат',
    sourceUrlLabel: 'lms.hse.ru/mod/assign/view.php?id=8821',
    sourceQuote:
      '«Добавлен чек-лист оценки качества генерации через chrF++ и пример скрипта квантизации 4-bit NF4 для запуска на одной GPU T4 в Google Colab.»',
    weight: '18% от итоговой оценки',
    currentVersion: 'v1.2',
    previousVersion: 'v1.1',
    hasUnreadChanges: true,
    changeSummaryBadge: 'Добавлен ноутбук для T4 GPU',
    description:
      'Дообучить открытую языковую модель (7B параметров) с использованием PEFT / QLoRA на задаче суммаризации академических аннотаций на русском языке и провести сравнение рангов r ∈ {8, 16, 32}.',
    whatChanged: {
      updatedAt: '15 марта в 14:10',
      source: 'SmartLMS',
      author: 'асс. Ким А. Д.',
      headline: 'Прикреплён стартовый ноутбук для запуска QLoRA на бесплатной GPU T4',
      diffs: [
        {
          fieldLabel: 'Прикреплённые материалы',
          previousValue: 'Только описание задания (PDF)',
          currentValue: '+ qlora_t4_starter.ipynb и валидационный корпус ru_abstracts_val.jsonl',
          impact: 'info',
        },
      ],
    },
    attachments: [
      {
        id: 'att-nlp-1',
        name: 'qlora_t4_starter.ipynb',
        size: '615 КБ',
        type: 'ipynb',
        updatedAt: '15 марта',
        isNew: true,
      },
      {
        id: 'att-nlp-2',
        name: 'ru_abstracts_val.jsonl',
        size: '14.2 МБ',
        type: 'dataset',
        updatedAt: '15 марта',
        isNew: true,
      },
    ],
    checklist: [
      { id: 'n1', title: 'Подготовить пайплайн токенизации и промпт-шаблон', done: true },
      { id: 'n2', title: 'Обучить адаптеры LoRA для r=8 и r=16', done: false },
      { id: 'n3', title: 'Посчитать метрики ROUGE-L и chrF++ на валидации', done: false },
      { id: 'n4', title: 'Опубликовать веса адаптера на HuggingFace Hub', done: false },
    ],
    history: [
      {
        version: 'v1.2',
        timestamp: '15 марта, 14:10',
        source: 'SmartLMS',
        author: 'асс. Ким А. Д.',
        summary: 'Добавлен стартовый ноутбук с поддержкой 4-bit квантизации',
      },
      {
        version: 'v1.0',
        timestamp: '09 марта, 11:00',
        source: 'SmartLMS',
        author: 'доц. Романова Е. А.',
        summary: 'Публикация задания на мини-проект',
      },
    ],
  },
  {
    id: 'task-fp-5',
    title: 'ЛР №5: Монадные трансформеры и парсер-комбинаторы на Haskell',
    subjectId: 'fp',
    subjectName: 'Функциональное программирование и системы типов',
    subjectShort: 'Функц. программирование',
    subjectColor: '#6AA7C4',
    instructor: 'доц. Мельников С. Г.',
    deadline: '25 марта, 23:59',
    deadlineIso: '2025-03-25',
    deadlineTime: '23:59',
    daysLeftText: 'Через 8 дней',
    urgency: 'soon',
    priority: 'low',
    status: 'todo',
    source: 'Zulip',
    sourceChannel: 'Zulip · #fp-haskell > ЛР-5 Парсеры',
    sourceUrlLabel: 'zulip.cs.hse.ru/#narrow/stream/fp/topic/lab5',
    sourceQuote:
      '«Шаблон репозитория с Property-Based тестами на QuickCheck доступен в GitLab факультета. Дополнительные баллы начисляются за информативную диагностику синтаксических ошибок.»',
    weight: '10% от итоговой оценки',
    currentVersion: 'v1.0',
    hasUnreadChanges: false,
    description:
      'Спроектировать стек монад ExceptT ParseError (StateT Pos Identity) и реализовать парсер типизированного функционального мини-языка с поддержкой леворекурсивных выражений и восстановления после ошибок.',
    attachments: [
      {
        id: 'att-fp-1',
        name: 'Lab5_Monad_Transformers_Spec.pdf',
        size: '890 КБ',
        type: 'pdf',
        updatedAt: '11 марта',
      },
    ],
    checklist: [
      { id: 'f1', title: 'Реализовать инстансы Functor, Applicative, Monad, Alternative', done: true },
      { id: 'f2', title: 'Написать парсер AST и типов выражений', done: false },
      { id: 'f3', title: 'Пройти все свойства QuickCheck в CI', done: false },
    ],
    history: [
      {
        version: 'v1.0',
        timestamp: '11 марта, 15:00',
        source: 'Zulip',
        author: 'доц. Мельников С. Г.',
        summary: 'Публикация спецификации лабораторной работы №5',
      },
    ],
  },
  {
    id: 'task-ml-quiz',
    title: 'Контрольный тест №3: Ансамбли, бустинг и отбор признаков',
    subjectId: 'ml',
    subjectName: 'Машинное обучение и нейросети',
    subjectShort: 'Машинное обучение',
    subjectColor: '#7487D9',
    instructor: 'проф. Соколов А. В.',
    deadline: '21 марта, 10:30',
    deadlineIso: '2025-03-21',
    deadlineTime: '10:30',
    daysLeftText: 'Через 4 дня',
    urgency: 'soon',
    priority: 'medium',
    status: 'todo',
    source: 'Telegram',
    sourceChannel: 'Telegram · @hse_ml_2025',
    sourceUrlLabel: 't.me/hse_ml_2025/291',
    sourceQuote:
      '«Пятничный летучий квиз пройдёт в первые 20 минут семинара через SmartLMS. Разрешён один лист А4 с рукописными формулами.»',
    weight: '5% от итоговой оценки',
    currentVersion: 'v1.1',
    previousVersion: 'v1.0',
    hasUnreadChanges: false,
    changeSummaryBadge: 'Разрешён 1 лист шпаргалки А4',
    description:
      'Короткий проверочный квиз из 10 вопросов (теория градиентного бустинга, вывод весов базовых алгоритмов в AdaBoost, SHAP-значения и пермутационная важность признаков).',
    attachments: [
      {
        id: 'att-ml-q1',
        name: 'Seminar_09_Ensemble_Formulas.pdf',
        size: '1.1 МБ',
        type: 'pdf',
        updatedAt: '14 марта',
      },
    ],
    checklist: [
      { id: 'mq1', title: 'Повторить вывод шага Ньютона–Рафсона для XGBoost', done: true },
      { id: 'mq2', title: 'Подготовить лист А4 с ключевыми формулами', done: false },
    ],
    history: [
      {
        version: 'v1.1',
        timestamp: '14 марта, 20:00',
        source: 'Telegram',
        author: 'асс. Лебедева М. И.',
        summary: 'Уточнение формата проведения теста и разрешение листа А4',
      },
    ],
  },
  {
    id: 'task-dist-2-done',
    title: 'ДЗ №2: Векторные часы и детектор причинно-следственных гонок',
    subjectId: 'dist',
    subjectName: 'Распределённые системы и консенсус',
    subjectShort: 'Распределённые системы',
    subjectColor: '#5AA48F',
    instructor: 'доц. Кравцов Д. Н.',
    deadline: '12 марта, 23:59',
    deadlineIso: '2025-03-12',
    deadlineTime: '23:59',
    daysLeftText: 'Сдано · 10 / 10',
    urgency: 'done',
    priority: 'medium',
    status: 'completed',
    source: 'SmartLMS',
    sourceChannel: 'SmartLMS · Оценка выставлена',
    sourceUrlLabel: 'lms.hse.ru/course/view.php?id=412#hw2',
    sourceQuote: '«Работа проверена автоматически и ассистентом. Итоговый балл: 10.0 из 10.0.»',
    weight: '10% от итоговой оценки',
    currentVersion: 'v1.0',
    hasUnreadChanges: false,
    description:
      'Реализация логических часов Лампорта и векторных часов для отслеживания отношения happens-before между событиями распределённой трассировки.',
    attachments: [
      {
        id: 'att-dist-done',
        name: 'Vector_Clocks_Submission_Report.pdf',
        size: '750 КБ',
        type: 'pdf',
        updatedAt: '12 марта',
      },
    ],
    checklist: [
      { id: 'dd1', title: 'Реализация VectorClock merge/compare', done: true },
      { id: 'dd2', title: 'Отправка решения в SmartLMS', done: true },
    ],
    history: [
      {
        version: 'v1.0',
        timestamp: '12 марта, 22:14',
        source: 'SmartLMS',
        author: 'Система проверки',
        summary: 'Задание успешно сдано и оценено на 10/10',
      },
    ],
  },
];

export const INITIAL_CHANGES: ChangeFeedItem[] = [
  {
    id: 'chg-1',
    taskId: 'task-ml-4',
    taskTitle: 'ЛР №4: Градиентный бустинг и калибровка вероятностей',
    subjectId: 'ml',
    subjectName: 'Машинное обучение',
    subjectColor: '#7487D9',
    category: 'deadline_shift',
    categoryLabel: 'Перенос дедлайна',
    priority: 'high',
    source: 'SmartLMS',
    sourceDetail: 'SmartLMS + дубль в Telegram @hse_ml_2025',
    timestamp: 'Сегодня, 11:42',
    relativeTime: '28 мин назад',
    isUnread: true,
    headline: 'Дедлайн перенесён на +48 часов и загружен очищенный датасет v2',
    description:
      'Преподаватель обновил спецификацию ЛР №4 (версия v2.4): срок сдачи сдвинут с 16 марта на 18 марта 23:59, а также повышен целевой порог ROC-AUC для максимального балла.',
    diffs: [
      {
        fieldLabel: 'Дедлайн',
        previousValue: '16 марта, 23:59',
        currentValue: '18 марта, 23:59',
        impact: 'warning',
      },
      {
        fieldLabel: 'Датасет',
        previousValue: 'transactions_v1.csv',
        currentValue: 'transactions_v2.parquet',
        impact: 'info',
      },
      {
        fieldLabel: 'Критерий на 10 баллов',
        previousValue: 'ROC-AUC ≥ 0.84',
        currentValue: 'ROC-AUC ≥ 0.86 + Brier ≤ 0.11',
        impact: 'danger',
      },
    ],
  },
  {
    id: 'chg-2',
    taskId: 'task-dist-3',
    taskTitle: 'ДЗ №3: Реализация алгоритма Raft (выбор лидера и репликация лога)',
    subjectId: 'dist',
    subjectName: 'Распределённые системы',
    subjectColor: '#5AA48F',
    category: 'criteria_update',
    categoryLabel: 'Условия сдачи',
    priority: 'high',
    source: 'Zulip',
    sourceDetail: 'Zulip · #distributed-systems > ДЗ-3 Raft',
    timestamp: 'Сегодня, 09:20',
    relativeTime: '3 ч назад',
    isUnread: true,
    headline: 'Приём работ закрывается сегодня в 21:00 МСК вместо 23:59',
    description:
      'Внимание: CI-сервер начнёт стресс-тестирование в 21:00. Также обновлён архив тестов raft_test_harness_v1.3.zip с проверкой линейризуемости при 15% потере пакетов.',
    diffs: [
      {
        fieldLabel: 'Время закрытия сдачи',
        previousValue: '17 марта, 23:59',
        currentValue: '17 марта, 21:00 (на 3 ч раньше)',
        impact: 'danger',
      },
      {
        fieldLabel: 'Таймаут теста 2C',
        previousValue: '120 сек',
        currentValue: '90 сек (5 узлов)',
        impact: 'warning',
      },
    ],
  },
  {
    id: 'chg-3',
    taskId: 'task-stat-2',
    taskTitle: 'РГР №2: Байесовская проверка гипотез и дизайн A/B-экспериментов',
    subjectId: 'stat',
    subjectName: 'Мат. статистика',
    subjectColor: '#CF7D88',
    category: 'criteria_update',
    categoryLabel: 'Исправление условия',
    priority: 'high',
    source: 'Email',
    sourceDetail: 'Email · vchernyshev@edu.hse.ru',
    timestamp: 'Вчера, 19:05',
    relativeTime: 'Вчера',
    isUnread: true,
    headline: 'Исправлена опечатка в параметрах априорного распределения Beta(α, β)',
    description:
      'Для вариантов 11–20 коэффициенты α₀ и β₀ были переставлены местами в первой редакции файла. Опубликован исправленный файл RGR2_variants_corrected_v1.2.pdf.',
    diffs: [
      {
        fieldLabel: 'Вариант №14 · Beta(α₀, β₀)',
        previousValue: 'α₀ = 450, β₀ = 50',
        currentValue: 'α₀ = 50, β₀ = 450',
        impact: 'warning',
      },
      {
        fieldLabel: 'Комплект сдачи',
        previousValue: 'PDF-отчёт',
        currentValue: 'PDF-отчёт + код симуляции (.ipynb)',
        impact: 'info',
      },
    ],
  },
  {
    id: 'chg-4',
    taskId: 'task-algo-6',
    taskTitle: 'Контест №6: Потоки в сетях и паросочетания минимального веса',
    subjectId: 'algo',
    subjectName: 'Алгоритмы',
    subjectColor: '#D9A25B',
    category: 'deadline_shift',
    categoryLabel: 'Перенос дедлайна',
    priority: 'medium',
    source: 'Telegram',
    sourceDetail: 'Telegram · Канал «Алгоритмы ПМИ 2025»',
    timestamp: 'Вчера, 16:30',
    relativeTime: 'Вчера',
    isUnread: true,
    headline: 'Мягкий дедлайн контеста продлён на 24 часа, увеличен TL в задаче E',
    description:
      'По просьбам студентов дедлайн сдвинут с 19 на 20 марта 23:59, а лимит времени для C++20 в задаче на Min-Cost Max-Flow увеличен с 1.0 до 2.0 секунд.',
    diffs: [
      {
        fieldLabel: 'Срок сдачи контеста',
        previousValue: '19 марта, 23:59',
        currentValue: '20 марта, 23:59',
        impact: 'success',
      },
      {
        fieldLabel: 'Задача E · Time Limit',
        previousValue: '1.0 сек',
        currentValue: '2.0 сек',
        impact: 'info',
      },
    ],
  },
  {
    id: 'chg-5',
    taskId: 'task-nlp-2',
    taskTitle: 'Мини-проект: LoRA-адаптация трансформера для русскоязычного корпуса',
    subjectId: 'nlp',
    subjectName: 'Комп. лингвистика',
    subjectColor: '#A08CCB',
    category: 'new_attachment',
    categoryLabel: 'Новые файлы',
    priority: 'medium',
    source: 'SmartLMS',
    sourceDetail: 'SmartLMS · Раздел материалов курса',
    timestamp: '15 марта, 14:10',
    relativeTime: '2 дня назад',
    isUnread: false,
    headline: 'Добавлен стартовый ноутбук QLoRA (4-bit NF4) и валидационный сплит',
    description:
      'Ассистент курса прикрепил готовый шаблон qlora_t4_starter.ipynb, оптимизированный под 15 ГБ видеопамяти Google Colab T4.',
    diffs: [
      {
        fieldLabel: 'Вложения в карточке',
        previousValue: '1 файл (спецификация)',
        currentValue: '3 файла (+ноутбук и валидационный корпус)',
        impact: 'info',
      },
    ],
  },
  {
    id: 'chg-6',
    taskId: 'task-ml-quiz',
    taskTitle: 'Контрольный тест №3: Ансамбли, бустинг и отбор признаков',
    subjectId: 'ml',
    subjectName: 'Машинное обучение',
    subjectColor: '#7487D9',
    category: 'schedule_change',
    categoryLabel: 'Регламент проведения',
    priority: 'low',
    source: 'Telegram',
    sourceDetail: 'Telegram · @hse_ml_2025',
    timestamp: '14 марта, 20:00',
    relativeTime: '3 дня назад',
    isUnread: false,
    headline: 'Разрешено использование одного рукописного листа А4 на тесте №3',
    description:
      'На пятничном тесте 21 марта можно пользоваться собственным рукописным конспектом формул (1 лист А4 с двух сторон).',
    diffs: [
      {
        fieldLabel: 'Справочные материалы',
        previousValue: 'Закрытая книга (без материалов)',
        currentValue: '1 рукописный лист А4',
        impact: 'success',
      },
    ],
  },
];

export const INITIAL_SOURCES: IntegrationSource[] = [
  {
    id: 'SmartLMS',
    name: 'SmartLMS',
    subtitle: 'Официальная система управления обучением университета (Moodle / SmartLMS API)',
    status: 'connected',
    lastSync: '2 мин назад',
    syncedItemsCount: 48,
    unreadUpdatesCount: 2,
    accountLabel: 'amorozov@edu.hse.ru · Токен OAuth активен',
    channels: [
      {
        name: 'CS-304 · Машинное обучение и нейросети',
        course: 'Машинное обучение',
        active: true,
        lastEvent: 'Обновлено задание ЛР №4 (сегодня, 11:42)',
      },
      {
        name: 'AI-318 · Компьютерная лингвистика и LLM',
        course: 'Комп. лингвистика',
        active: true,
        lastEvent: 'Загружен файл qlora_t4_starter.ipynb',
      },
      {
        name: 'SE-412 · Распределённые системы',
        course: 'Распределённые системы',
        active: true,
        lastEvent: 'Выставлена оценка 10/10 за ДЗ №2',
      },
    ],
    autoRules: [
      {
        id: 'lms-r1',
        label: 'Отслеживать сдвиги дедлайнов и переопределение весов оценок',
        enabled: true,
      },
      {
        id: 'lms-r2',
        label: 'Автоматически сравнивать версии прикреплённых PDF и ноутбуков',
        enabled: true,
      },
    ],
  },
  {
    id: 'Telegram',
    name: 'Telegram',
    subtitle: 'Парсер закреплённых сообщений и анонсов из каналов курсов и чатов групп',
    status: 'connected',
    lastSync: '5 мин назад',
    syncedItemsCount: 134,
    unreadUpdatesCount: 1,
    accountLabel: '@alex_morozov · Подключено 5 учебных каналов',
    channels: [
      {
        name: '@hse_ml_2025 · Канал курса МО',
        course: 'Машинное обучение',
        active: true,
        lastEvent: 'Анонс переноса дедлайна ЛР №4',
      },
      {
        name: '@algo_pmi_2025 · Алгоритмы ПМИ',
        course: 'Алгоритмы',
        active: true,
        lastEvent: 'Увеличен TL в задаче E контеста №6',
      },
    ],
    autoRules: [
      {
        id: 'tg-r1',
        label: 'Извлекать переносы сроков из закреплённых сообщений преподавателей',
        enabled: true,
      },
      {
        id: 'tg-r2',
        label: 'Связывать объявления из Telegram с карточками заданий SmartLMS',
        enabled: true,
      },
    ],
  },
  {
    id: 'Zulip',
    name: 'Zulip',
    subtitle: 'Факультетский сервер обсуждений технических курсов и CI-тестирования',
    status: 'connected',
    lastSync: 'Только что',
    syncedItemsCount: 89,
    unreadUpdatesCount: 1,
    accountLabel: 'zulip.cs.hse.ru · Бот синхронизации UniFlow',
    channels: [
      {
        name: '#distributed-systems > ДЗ-3 Raft',
        course: 'Распределённые системы',
        active: true,
        lastEvent: 'Сдвиг времени закрытия приёма на 21:00 МСК',
      },
      {
        name: '#fp-haskell > ЛР-5 Парсеры',
        course: 'Функц. программирование',
        active: true,
        lastEvent: 'Опубликован шаблон с QuickCheck',
      },
    ],
    autoRules: [
      {
        id: 'zl-r1',
        label: 'Мониторить топики с тегами [ВАЖНО], [DEADLINE] и обновления тестов',
        enabled: true,
      },
      {
        id: 'zl-r2',
        label: 'Создавать дифф «Что изменилось» при изменении условий сдачи',
        enabled: true,
      },
    ],
  },
  {
    id: 'Email',
    name: 'Email',
    subtitle: 'Университетская почта и рассылки учебных офисов и преподавателей',
    status: 'connected',
    lastSync: '14 мин назад',
    syncedItemsCount: 62,
    unreadUpdatesCount: 1,
    accountLabel: 'amorozov@edu.hse.ru · IMAP фильтр «Учебные курсы»',
    channels: [
      {
        name: 'Кафедра мат. статистики (проф. Чернышев В. П.)',
        course: 'Мат. статистика',
        active: true,
        lastEvent: 'Исправленный файл вариантов РГР №2',
      },
      {
        name: 'Учебный офис ПМИ · Расписание и ведомости',
        course: 'Общефакультетские уведомления',
        active: true,
        lastEvent: 'Расписание промежуточной сессии 3 модуля',
      },
    ],
    autoRules: [
      {
        id: 'em-r1',
        label: 'Распознавать вложения с префиксами v1.1 / corrected / updated',
        enabled: true,
      },
    ],
  },
];

export interface WorkloadDay {
  dayShort: string;
  dateLabel: string;
  iso: string;
  hours: number;
  deadlinesCount: number;
  isToday?: boolean;
}

export const WEEKLY_WORKLOAD: WorkloadDay[] = [
  { dayShort: 'Пн', dateLabel: '17 мар', iso: '2025-03-17', hours: 4.5, deadlinesCount: 1, isToday: true },
  { dayShort: 'Вт', dateLabel: '18 мар', iso: '2025-03-18', hours: 5.2, deadlinesCount: 1 },
  { dayShort: 'Ср', dateLabel: '19 мар', iso: '2025-03-19', hours: 3.8, deadlinesCount: 1 },
  { dayShort: 'Чт', dateLabel: '20 мар', iso: '2025-03-20', hours: 4.0, deadlinesCount: 1 },
  { dayShort: 'Пт', dateLabel: '21 мар', iso: '2025-03-21', hours: 2.5, deadlinesCount: 1 },
  { dayShort: 'Сб', dateLabel: '22 мар', iso: '2025-03-22', hours: 3.2, deadlinesCount: 1 },
  { dayShort: 'Вс', dateLabel: '23 мар', iso: '2025-03-23', hours: 1.5, deadlinesCount: 0 },
];

export interface CalendarScheduleItem {
  id: string;
  iso: string;
  time: string;
  title: string;
  subjectShort: string;
  subjectColor: string;
  type: 'deadline' | 'lecture' | 'seminar' | 'checkpoint';
  roomOrSource: string;
  taskId?: string;
  isUpdated?: boolean;
}

export const CALENDAR_ITEMS: CalendarScheduleItem[] = [
  {
    id: 'cal-1',
    iso: '2025-03-17',
    time: '12:00 – 13:20',
    title: 'Лекция: Монадные трансформеры и обработка эффектов',
    subjectShort: 'Функц. программирование',
    subjectColor: '#6AA7C4',
    type: 'lecture',
    roomOrSource: 'Ауд. D304',
  },
  {
    id: 'cal-2',
    iso: '2025-03-17',
    time: '15:10 – 16:30',
    title: 'Семинар: Разбор отказоустойчивости Raft при сетевых партициях',
    subjectShort: 'Распределённые системы',
    subjectColor: '#5AA48F',
    type: 'seminar',
    roomOrSource: 'Ауд. D508',
  },
  {
    id: 'cal-3',
    iso: '2025-03-17',
    time: '21:00',
    title: 'Дедлайн ДЗ №3: Реализация алгоритма Raft',
    subjectShort: 'Распределённые системы',
    subjectColor: '#5AA48F',
    type: 'deadline',
    roomOrSource: 'Zulip · Перенесено на 21:00',
    taskId: 'task-dist-3',
    isUpdated: true,
  },
  {
    id: 'cal-4',
    iso: '2025-03-18',
    time: '10:30 – 11:50',
    title: 'Лекция: Калибровка вероятностей и интерпретация ансамблей',
    subjectShort: 'Машинное обучение',
    subjectColor: '#7487D9',
    type: 'lecture',
    roomOrSource: 'Ауд. R402',
  },
  {
    id: 'cal-5',
    iso: '2025-03-18',
    time: '13:40 – 15:00',
    title: 'Семинар: Последовательные A/B-тесты и критерий Вальда',
    subjectShort: 'Мат. статистика',
    subjectColor: '#CF7D88',
    type: 'seminar',
    roomOrSource: 'Ауд. R206',
  },
  {
    id: 'cal-6',
    iso: '2025-03-18',
    time: '23:59',
    title: 'Дедлайн ЛР №4: Градиентный бустинг и калибровка вероятностей',
    subjectShort: 'Машинное обучение',
    subjectColor: '#7487D9',
    type: 'deadline',
    roomOrSource: 'SmartLMS · Версия v2.4 (+48 ч)',
    taskId: 'task-ml-4',
    isUpdated: true,
  },
  {
    id: 'cal-7',
    iso: '2025-03-19',
    time: '10:30 – 11:50',
    title: 'Семинар: Потоки минимальной стоимости и потенциалы Джонсона',
    subjectShort: 'Алгоритмы',
    subjectColor: '#D9A25B',
    type: 'seminar',
    roomOrSource: 'Ауд. R301',
  },
  {
    id: 'cal-8',
    iso: '2025-03-19',
    time: '23:59',
    title: 'Дедлайн РГР №2: Байесовская проверка гипотез',
    subjectShort: 'Мат. статистика',
    subjectColor: '#CF7D88',
    type: 'deadline',
    roomOrSource: 'Email / SmartLMS · Вар. 14 обновлён',
    taskId: 'task-stat-2',
    isUpdated: true,
  },
  {
    id: 'cal-9',
    iso: '2025-03-20',
    time: '16:40 – 18:00',
    title: 'Практикум: Эффективное дообучение LLM (PEFT / QLoRA)',
    subjectShort: 'Комп. лингвистика',
    subjectColor: '#A08CCB',
    type: 'seminar',
    roomOrSource: 'Ауд. S214',
  },
  {
    id: 'cal-10',
    iso: '2025-03-20',
    time: '23:59',
    title: 'Дедлайн Контеста №6: Потоки в сетях и паросочетания',
    subjectShort: 'Алгоритмы',
    subjectColor: '#D9A25B',
    type: 'deadline',
    roomOrSource: 'Telegram / Яндекс.Контест',
    taskId: 'task-algo-6',
    isUpdated: true,
  },
  {
    id: 'cal-11',
    iso: '2025-03-21',
    time: '10:30',
    title: 'Контрольный тест №3: Ансамбли, бустинг и отбор признаков',
    subjectShort: 'Машинное обучение',
    subjectColor: '#7487D9',
    type: 'checkpoint',
    roomOrSource: 'Ауд. R402 · 20 минут',
    taskId: 'task-ml-quiz',
  },
  {
    id: 'cal-12',
    iso: '2025-03-22',
    time: '18:00',
    title: 'Дедлайн мини-проекта: LoRA-адаптация трансформера',
    subjectShort: 'Комп. лингвистика',
    subjectColor: '#A08CCB',
    type: 'deadline',
    roomOrSource: 'SmartLMS · v1.2',
    taskId: 'task-nlp-2',
  },
  {
    id: 'cal-13',
    iso: '2025-03-25',
    time: '23:59',
    title: 'Дедлайн ЛР №5: Монадные трансформеры на Haskell',
    subjectShort: 'Функц. программирование',
    subjectColor: '#6AA7C4',
    type: 'deadline',
    roomOrSource: 'Zulip / GitLab CI',
    taskId: 'task-fp-5',
  },
];
