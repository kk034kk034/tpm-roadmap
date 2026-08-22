import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  FileText,
  Flag,
  HelpCircle,
  ListChecks,
  MessageCircle,
  Milestone,
  PackageCheck,
  SearchCheck,
  Send,
  Sparkles,
  Target,
  X
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import roadmap from '../data/roadmap.json';

type Branch = (typeof roadmap.branches)[number];
type SourceNode = Branch['nodes'][number];
type RoadmapNode = {
  id: string;
  title: string;
  level: SourceNode['l'];
  branchId: string;
  branchTitle: string;
  summary: string;
  path: string;
  index: number;
};

type Stage = {
  id: string;
  phase: '前期' | '中期' | '後期';
  title: string;
  subtitle: string;
  branchIds: string[];
  icon: typeof SearchCheck;
  goal: string;
  situations: string[];
  outputs: string[];
  quickAnswers: Array<{ q: string; a: string; refs: string[] }>;
  supportRefs: string[];
};

const levelLabels: Record<string, string> = {
  green: '入門必修',
  yellow: '獨立帶案',
  red: 'Senior / Program',
  white: '特殊領域'
};

const levelStyles: Record<string, string> = {
  green: 'border-moss/35 bg-[#eef6ed] text-moss',
  yellow: 'border-citron bg-[#fbfadf] text-ink',
  red: 'border-coral/45 bg-[#fff0eb] text-coral',
  white: 'border-ink/15 bg-white text-ink/70'
};

const phaseStyles: Record<Stage['phase'], string> = {
  前期: 'bg-[#eef6ed] text-moss',
  中期: 'bg-[#fbfadf] text-ink',
  後期: 'bg-[#fff0eb] text-coral'
};

const allNodes: RoadmapNode[] = roadmap.branches.flatMap((branch) =>
  branch.nodes.map((node, index) => ({
    id: `${branch.id}:${index}`,
    title: node.t,
    level: node.l,
    branchId: branch.id,
    branchTitle: branch.title,
    summary: node.s,
    path: node.p ?? `/roadmap/${branch.id}/${index}`,
    index
  }))
);

const nodesById = new Map(allNodes.map((node) => [node.id, node]));
const branchesById = new Map(roadmap.branches.map((branch) => [branch.id, branch]));

const stages: Stage[] = [
  {
    id: 'presales',
    phase: '前期',
    title: '售前 / 備標',
    subtitle: '商機還不穩時，先把可行性、承諾與風險講清楚。',
    branchIds: ['b01-presales'],
    icon: SearchCheck,
    goal: '把客戶想要的東西轉成可討論的範疇、假設、風險與初步方案。',
    situations: ['第一次拜訪客戶', 'RFP / RFQ 進來', 'Sales 要你先估時程與成本', '客戶問這個能不能做'],
    outputs: ['Discovery notes', 'Compliance matrix', 'Scope 初估', 'Proposal / SOW input', 'Bid risk list'],
    quickAnswers: [
      {
        q: '客戶問「這個能不能做？」當下怎麼回？',
        a: '先拆成目標、限制、現況流程、驗收方式與未知條件。可以先回答可行方向，但不要直接承諾時程與範疇。',
        refs: ['b01-presales:1', 'b01-presales:2', 'b01-presales:9']
      },
      {
        q: 'RFP 很厚，第一輪先看什麼？',
        a: '先抓強制需求、評選權重、交付物、時程、罰則、驗收與排除項，再把不確定處標成問題清單。',
        refs: ['b01-presales:5', 'b01-presales:6', 'b01-presales:7']
      }
    ],
    supportRefs: ['b00-transition:11', 'b07-stakeholder-communication:6', 'b08-technical-delivery:7']
  },
  {
    id: 'kickoff',
    phase: '前期',
    title: '接案 / Kickoff',
    subtitle: '從售前交接進入正式專案，先建立共同理解與治理節奏。',
    branchIds: ['b02-initiation'],
    icon: Flag,
    goal: '讓目標、範疇、角色、決策權、文件來源與溝通節奏被明確確認。',
    situations: ['突然被叫去接一個案子', '售前交接資料不完整', '客戶急著開工', '內外部角色不清楚'],
    outputs: ['Project charter', 'Stakeholder register', 'RACI', 'Decision authority', 'Kickoff deck', 'Project repository'],
    quickAnswers: [
      {
        q: '接案第一天要先拿哪些資料？',
        a: '先拿合約/SOW、proposal、承諾清單、時程假設、風險、客戶窗口、決策人與驗收條件。',
        refs: ['b02-initiation:0', 'b02-initiation:1', 'b02-initiation:10']
      },
      {
        q: 'Kickoff 不是形式會議，真正要對齊什麼？',
        a: '對齊目標、成功標準、範疇邊界、角色責任、例會節奏、變更方式與下一步 owner。',
        refs: ['b02-initiation:4', 'b02-initiation:9', 'b02-initiation:13']
      }
    ],
    supportRefs: ['b00-transition:10', 'b07-stakeholder-communication:0', 'b07-stakeholder-communication:16']
  },
  {
    id: 'requirements',
    phase: '前期',
    title: '需求 / 範疇',
    subtitle: '把模糊期待變成可開發、可驗收、可控變更的範圍。',
    branchIds: ['b03-requirement-scope'],
    icon: Target,
    goal: '確認 Why、Who、流程、規則、例外、NFR、驗收條件與範疇邊界。',
    situations: ['客戶說我要一個功能', 'RD 說需求不清楚', '需求一直冒出來', '不知道有沒有漏問'],
    outputs: ['Requirement notes', 'User story / use case', 'Acceptance criteria', 'Out of scope', 'Requirement baseline'],
    quickAnswers: [
      {
        q: '怎麼知道需求有沒有漏問？',
        a: '用角色、流程、資料、例外、權限、NFR、驗收與限制逐項掃過，缺任何一類都先不要 baseline。',
        refs: ['b03-requirement-scope:1', 'b03-requirement-scope:2', 'b03-requirement-scope:10']
      },
      {
        q: '客戶說只是小功能，要怎麼判斷是不是變更？',
        a: '回到 baseline，比對 scope、time、cost、resource、risk、test 與 acceptance 的影響，有影響就走 CR。',
        refs: ['b03-requirement-scope:18', 'b06-risk-issue-change:10', 'b06-risk-issue-change:11']
      }
    ],
    supportRefs: ['b07-stakeholder-communication:12', 'b08-technical-delivery:1', 'b09-qa-release:2']
  },
  {
    id: 'planning',
    phase: '中期',
    title: '規劃 / 排程',
    subtitle: '把範疇拆成可估、可排、可追、可取捨的計畫。',
    branchIds: ['b04-planning'],
    icon: Milestone,
    goal: '建立 WBS、估算、依賴、里程碑、資源配置與 baseline。',
    situations: ['RD 說做不完', '老闆問何時交付', '多個 team 互相卡', '時程看起來太樂觀'],
    outputs: ['WBS', 'Work package', 'Schedule', 'Dependency map', 'Milestones', 'Schedule baseline'],
    quickAnswers: [
      {
        q: '估不出來時要怎麼估？',
        a: '先拆 WBS，再把已知、未知、假設與 confidence 分開。不要只給單一日期，給區間、風險與需要決策的條件。',
        refs: ['b04-planning:1', 'b04-planning:5', 'b04-planning:6']
      },
      {
        q: 'RD 說做不完，TPM 要追什麼？',
        a: '追 scope 是否可切、dependency 是否可解、資源是否衝突、critical path 是否被影響，以及誰能決策取捨。',
        refs: ['b04-planning:10', 'b04-planning:12', 'b06-risk-issue-change:11']
      }
    ],
    supportRefs: ['b00-transition:4', 'b08-technical-delivery:2', 'b07-stakeholder-communication:14']
  },
  {
    id: 'execution',
    phase: '中期',
    title: '執行 / 追蹤',
    subtitle: '讓進度、問題、承諾與決策持續被看見。',
    branchIds: ['b05-execution-control'],
    icon: ListChecks,
    goal: '用 evidence 管理進度，不只收集口頭回報。',
    situations: ['進度看起來正常但不放心', '有人 delay', 'action item 沒人追', '主管問專案是不是 green'],
    outputs: ['Action item tracker', 'Weekly report', 'Status report', 'Forecast', 'Milestone review'],
    quickAnswers: [
      {
        q: '專案是不是 green，要看哪些證據？',
        a: '看交付物完成證據、未解 dependency、風險趨勢、缺陷趨勢、決策延遲與 milestone 是否仍可信。',
        refs: ['b05-execution-control:5', 'b05-execution-control:6', 'b05-execution-control:13']
      },
      {
        q: '催人時怎麼避免只是在追殺？',
        a: '催的對象要明確到 owner、承諾內容、期限、阻礙與下一個決策點。必要時協助移除 blocker。',
        refs: ['b05-execution-control:1', 'b05-execution-control:4', 'b07-stakeholder-communication:12']
      }
    ],
    supportRefs: ['b07-stakeholder-communication:22', 'b07-stakeholder-communication:23', 'b08-technical-delivery:17']
  },
  {
    id: 'risk-change',
    phase: '中期',
    title: '風險 / 議題 / 變更',
    subtitle: '把不確定、已發生問題與新增需求變成可決策事項。',
    branchIds: ['b06-risk-issue-change'],
    icon: AlertTriangle,
    goal: '讓 risk、issue、assumption、dependency、change 都有 owner、影響與下一步。',
    situations: ['客戶突然加需求', '風險變成問題', '需要 escalation', '專案偏離 baseline'],
    outputs: ['Risk register', 'RAID log', 'Impact analysis', 'Change request', 'Recovery plan'],
    quickAnswers: [
      {
        q: '什麼時候該 escalation？',
        a: '當問題超出團隊權限、影響 baseline、需要跨部門取捨，或 owner 無法在期限內解除阻礙時就該升級。',
        refs: ['b06-risk-issue-change:8', 'b00-transition:12', 'b07-stakeholder-communication:2']
      },
      {
        q: 'CR 要怎麼講才不會像在擋需求？',
        a: '先承認需求價值，再把 impact 攤開：範疇、時間、成本、資源、風險、測試與驗收，請決策人選擇取捨。',
        refs: ['b06-risk-issue-change:9', 'b06-risk-issue-change:10', 'b06-risk-issue-change:11']
      }
    ],
    supportRefs: ['b03-requirement-scope:14', 'b04-planning:16', 'b07-stakeholder-communication:9']
  },
  {
    id: 'release',
    phase: '後期',
    title: '測試 / UAT / 上線',
    subtitle: '把完成開發推進到可驗收、可上線、可回復的狀態。',
    branchIds: ['b09-qa-release'],
    icon: PackageCheck,
    goal: '確認測試策略、缺陷分級、UAT、release readiness、rollback 與 Go/No-Go。',
    situations: ['準備 UAT', 'Bug 爆量', 'Go/No-Go 會議', '上線失敗要 rollback'],
    outputs: ['Test strategy', 'UAT plan', 'Defect triage', 'Release plan', 'Rollback plan', 'Production verification'],
    quickAnswers: [
      {
        q: 'UAT 沒過，是誰的責任？',
        a: '先分清是需求理解、功能缺陷、測試資料、環境、操作訓練還是驗收標準問題，再決定 owner 與修正路徑。',
        refs: ['b09-qa-release:6', 'b09-qa-release:7', 'b09-qa-release:8']
      },
      {
        q: 'Go/No-Go 前最少要確認什麼？',
        a: '確認 blocker defect、rollback、維護窗口、溝通名單、監控、驗證步驟與決策人都到位。',
        refs: ['b09-qa-release:10', 'b09-qa-release:16', 'b09-qa-release:17']
      }
    ],
    supportRefs: ['b08-technical-delivery:15', 'b08-technical-delivery:18', 'b07-stakeholder-communication:18']
  },
  {
    id: 'closure',
    phase: '後期',
    title: '驗收 / 結案 / 維運',
    subtitle: '把交付轉成正式驗收、文件交接與後續責任邊界。',
    branchIds: ['b10-acceptance-closure'],
    icon: ClipboardList,
    goal: '完成正式驗收、文件、punch list、handover、lesson learned 與維護期責任。',
    situations: ['客戶不簽驗收', '文件不完整', '維護責任不清', '結案後還有尾巴'],
    outputs: ['Acceptance record', 'Punch list', 'Operation manual', 'Handover docs', 'Lessons learned', 'Closure checklist'],
    quickAnswers: [
      {
        q: '客戶說還有問題所以不驗收，怎麼處理？',
        a: '把問題分成驗收阻擋、punch list、保固/維護與新增需求，再對照 acceptance criteria 決定是否影響正式驗收。',
        refs: ['b10-acceptance-closure:5', 'b10-acceptance-closure:6', 'b10-acceptance-closure:7']
      },
      {
        q: '維運交接最容易漏什麼？',
        a: '常漏監控、備份、帳號權限、例行操作、升級方式、SLA、未結風險與 vendor 聯絡窗口。',
        refs: ['b10-acceptance-closure:8', 'b10-acceptance-closure:9', 'b10-acceptance-closure:13']
      }
    ],
    supportRefs: ['b09-qa-release:19', 'b08-technical-delivery:6', 'b11-senior-program:10']
  }
];

function getNode(ref: string) {
  return nodesById.get(ref);
}

function getBranchNodes(branchId: string) {
  return allNodes.filter((node) => node.branchId === branchId);
}

function compactTitle(title: string) {
  return title.replace(/^\d+\s*/, '');
}

export default function RoadmapFlow() {
  const [selectedStageId, setSelectedStageId] = useState(stages[0].id);
  const [selectedNodeId, setSelectedNodeId] = useState(stages[0].quickAnswers[0].refs[0]);
  const [nodeDetailOpen, setNodeDetailOpen] = useState(false);
  const [coachOpen, setCoachOpen] = useState(false);
  const [coachDraft, setCoachDraft] = useState('');
  const [coachMessages, setCoachMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([]);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [progressReady, setProgressReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem('rd-tpm-roadmap-progress');
    if (saved) {
      setCompleted(new Set(JSON.parse(saved) as string[]));
    }
    setProgressReady(true);
  }, []);

  useEffect(() => {
    if (progressReady) {
      window.localStorage.setItem('rd-tpm-roadmap-progress', JSON.stringify([...completed]));
    }
  }, [completed, progressReady]);

  const selectedStage = stages.find((stage) => stage.id === selectedStageId) ?? stages[0];
  const selectedNode = getNode(selectedNodeId) ?? getNode(selectedStage.quickAnswers[0].refs[0]) ?? allNodes[0];
  const stageNodes = useMemo(
    () => selectedStage.branchIds.flatMap((branchId) => getBranchNodes(branchId)),
    [selectedStage]
  );
  const completedInStage = stageNodes.filter((node) => completed.has(node.id)).length;
  const progressPercent = Math.round((completed.size / allNodes.length) * 100);

  const toggleNode = (id: string) => {
    setCompleted((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const chooseStage = (stage: Stage) => {
    setSelectedStageId(stage.id);
    setSelectedNodeId(stage.quickAnswers[0]?.refs[0] ?? stage.supportRefs[0] ?? selectedNodeId);
    setCoachMessages([]);
  };

  const openNodeDetail = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    setNodeDetailOpen(true);
  };

  const submitCoachMessage = () => {
    const text = coachDraft.trim();
    if (!text) {
      return;
    }

    const reference = selectedStage.quickAnswers[0];
    setCoachMessages((messages) => [
      ...messages,
      { role: 'user', text },
      {
        role: 'assistant',
        text: `先用「${selectedStage.title}」階段判斷：${reference.a} 下一步可以對照「${reference.q}」這類問題，把目標、owner、限制、風險與下一個決策點寫清楚。`
      }
    ]);
    setCoachDraft('');
  };

  return (
    <section className="grid gap-5 lg:grid-cols-[290px_1fr]">
      <aside className="space-y-4">
        <div className="rounded-lg border border-ink/15 bg-white p-4 shadow-panel">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-moss">TPM lifecycle</p>
          <h2 className="mt-2 text-xl font-black leading-tight text-ink">從備標到結案的主幹</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink/68">
            先看專案在哪個階段，再看該階段會遇到什麼情境、該產出什麼、要補哪些能力。
          </p>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm font-bold text-ink/70">
              <span>總進度</span>
              <span>
                {completed.size}/{allNodes.length} · {progressPercent}%
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink/10">
              <div className="h-full rounded-full bg-moss transition-all" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>

        <nav className="rounded-lg border border-ink/15 bg-white p-2 shadow-panel" aria-label="專案階段">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const active = stage.id === selectedStage.id;
            const count = stage.branchIds.flatMap((branchId) => getBranchNodes(branchId)).length;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => chooseStage(stage)}
                className={`flex w-full items-start gap-3 rounded-md p-3 text-left transition ${
                  active ? 'bg-ink text-white' : 'text-ink hover:bg-paper'
                }`}
              >
                <span
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                    active ? 'bg-white/14 text-white' : phaseStyles[stage.phase]
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`text-[11px] font-black ${active ? 'text-white/65' : 'text-ink/45'}`}>
                    {String(index + 1).padStart(2, '0')} · {stage.phase} · {count} 節點
                  </span>
                  <span className="block text-sm font-black leading-tight">{stage.title}</span>
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="space-y-5">
        <section className="rounded-lg border border-ink/15 bg-white p-5 shadow-panel">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${phaseStyles[selectedStage.phase]}`}>
                {selectedStage.phase}
              </span>
              <h2 className="mt-3 text-3xl font-black leading-tight text-ink">{selectedStage.title}</h2>
              <p className="mt-2 text-base leading-relaxed text-ink/72">{selectedStage.subtitle}</p>
            </div>
            <div className="min-w-[190px] rounded-lg bg-paper p-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink/45">Stage progress</p>
              <p className="mt-1 text-2xl font-black text-ink">
                {completedInStage}/{stageNodes.length}
              </p>
              <p className="text-sm font-semibold text-ink/55">此階段節點完成</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-lg bg-paper p-4">
              <div className="flex items-center gap-2 text-sm font-black text-ink">
                <Target className="h-4 w-4 text-moss" aria-hidden />
                這階段目標
              </div>
              <p className="mt-2 leading-relaxed text-ink/75">{selectedStage.goal}</p>
            </div>
            <div className="rounded-lg bg-paper p-4">
              <div className="flex items-center gap-2 text-sm font-black text-ink">
                <FileText className="h-4 w-4 text-moss" aria-hidden />
                要留下的產出
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedStage.outputs.map((output) => (
                  <span key={output} className="rounded-full bg-white px-3 py-1 text-xs font-bold text-ink/72">
                    {output}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-center gap-2 text-sm font-black text-ink">
              <Sparkles className="h-4 w-4 text-moss" aria-hidden />
              常發生的情境
            </div>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {selectedStage.situations.map((situation) => (
                <div key={situation} className="flex items-center gap-2 rounded-md border border-ink/10 bg-white px-3 py-2 text-sm font-semibold text-ink/75">
                  <ArrowRight className="h-4 w-4 shrink-0 text-moss" aria-hidden />
                  {situation}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-ink/15 bg-white p-5 shadow-panel">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-moss">Main branch</p>
              <h3 className="mt-1 text-xl font-black text-ink">
                {selectedStage.branchIds.map((branchId) => compactTitle(branchesById.get(branchId)?.title ?? branchId)).join(' / ')}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(levelLabels).map(([level, label]) => (
                <span key={level} className={`rounded-full border px-2.5 py-1 text-xs font-bold ${levelStyles[level]}`}>
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {stageNodes.map((node) => {
              const done = completed.has(node.id);
              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => openNodeDetail(node.id)}
                  className={`group min-h-[124px] rounded-lg border p-3 text-left transition ${
                    selectedNode.id === node.id
                      ? 'border-moss bg-[#eef6ed]'
                      : done
                        ? 'border-moss/25 bg-white'
                        : 'border-ink/10 bg-white hover:border-moss/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className={`rounded-full border px-2 py-0.5 text-[11px] font-black ${levelStyles[node.level]}`}>
                      {levelLabels[node.level] ?? node.level}
                    </span>
                    <CheckCircle2 className={`h-4 w-4 shrink-0 ${done ? 'text-moss' : 'text-ink/20 group-hover:text-moss'}`} aria-hidden />
                  </div>
                  <h4 className="mt-3 text-[15px] font-black leading-tight text-ink">{node.title}</h4>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-ink/62">{node.summary}</p>
                </button>
              );
            })}
          </div>
        </section>
      </main>

      {nodeDetailOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink/40 px-4 py-6" role="dialog" aria-modal="true">
          <section className="max-h-[88vh] w-full max-w-xl overflow-auto rounded-lg border border-ink/15 bg-white p-5 shadow-panel">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-moss">Topic detail</p>
                <h3 className="mt-2 text-2xl font-black leading-tight text-ink">{selectedNode.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setNodeDetailOpen(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-ink/15 text-ink/65 hover:border-moss hover:text-moss"
                aria-label="關閉"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>
            <p className="mt-2 text-sm font-bold text-ink/52">{selectedNode.branchTitle}</p>
            <p className="mt-4 leading-relaxed text-ink/72">{selectedNode.summary}</p>
            <div className="mt-5 rounded-lg bg-paper p-4">
              <p className="text-sm font-black text-ink">所在階段</p>
              <p className="mt-1 text-sm leading-relaxed text-ink/68">{selectedStage.title} · {selectedStage.goal}</p>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => toggleNode(selectedNode.id)}
                className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-black transition ${
                  completed.has(selectedNode.id) ? 'bg-ink text-white hover:bg-moss' : 'bg-citron text-ink hover:bg-moss hover:text-white'
                }`}
              >
                <CheckCircle2 className="h-4 w-4" aria-hidden />
                {completed.has(selectedNode.id) ? '已完成，點擊取消' : '標記完成'}
              </button>
              <a
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-ink/15 px-4 py-3 text-sm font-black text-ink transition hover:border-moss hover:text-moss"
                href={selectedNode.path}
              >
                深入學習
                <BookOpen className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </section>
        </div>
      ) : null}

      <div className="fixed bottom-5 right-5 z-30">
        {coachOpen ? (
          <section className="flex max-h-[78vh] w-[min(390px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-lg border border-ink/15 bg-white shadow-panel">
            <div className="flex items-center justify-between gap-3 border-b border-ink/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-moss text-white">
                  <HelpCircle className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-black text-ink">即時案例問答</p>
                  <p className="text-xs font-bold text-ink/45">{selectedStage.title}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCoachOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-md text-ink/55 hover:bg-paper hover:text-ink"
                aria-label="關閉案例問答"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-auto bg-paper p-4">
              {selectedStage.quickAnswers.map((item) => (
                <div key={item.q} className="rounded-lg bg-white p-3">
                  <h4 className="text-sm font-black leading-snug text-ink">{item.q}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-ink/72">{item.a}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.refs.map(getNode).filter(Boolean).map((node) => (
                      <button
                        key={node.id}
                        type="button"
                        onClick={() => openNodeDetail(node.id)}
                        className="rounded-full bg-[#eef6ed] px-2.5 py-1 text-xs font-bold text-moss hover:bg-moss hover:text-white"
                      >
                        {node.title}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {coachMessages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`rounded-lg p-3 text-sm leading-relaxed ${
                    message.role === 'user' ? 'ml-8 bg-ink text-white' : 'mr-8 bg-white text-ink/75'
                  }`}
                >
                  {message.text}
                </div>
              ))}
            </div>

            <div className="border-t border-ink/10 bg-white p-3">
              <label className="sr-only" htmlFor="coach-draft">描述你遇到的專案情境</label>
              <textarea
                id="coach-draft"
                value={coachDraft}
                onChange={(event) => setCoachDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
                    submitCoachMessage();
                  }
                }}
                className="min-h-[76px] w-full resize-none rounded-md border border-ink/15 px-3 py-2 text-sm leading-relaxed text-ink outline-none focus:border-moss"
                placeholder="描述你現在卡住的情境，例如：客戶臨時加需求但 RD 說會 delay..."
              />
              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="text-xs font-semibold text-ink/45">Ctrl/⌘ + Enter 送出</p>
                <button
                  type="button"
                  onClick={submitCoachMessage}
                  className="inline-flex items-center gap-2 rounded-md bg-moss px-3 py-2 text-sm font-black text-white hover:bg-ink"
                >
                  <Send className="h-4 w-4" aria-hidden />
                  送出
                </button>
              </div>
            </div>
          </section>
        ) : (
          <button
            type="button"
            onClick={() => setCoachOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-3 text-sm font-black text-white shadow-panel hover:bg-moss"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            案例問答
          </button>
        )}
      </div>
    </section>
  );
}
