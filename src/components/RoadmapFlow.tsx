import '@xyflow/react/dist/style.css';

import {
  Background,
  Controls,
  Handle,
  MiniMap,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps
} from '@xyflow/react';
import { BookOpen, BriefcaseBusiness, CheckCircle2, ExternalLink, Layers3 } from 'lucide-react';
import { useMemo, useState } from 'react';
import roadmap from '../data/roadmap.json';

type Branch = (typeof roadmap.branches)[number];
type SourceNode = Branch['nodes'][number];
type ViewMode = 'learning' | 'work';

type RoadmapNode = {
  id: string;
  title: string;
  level: SourceNode['l'];
  branchId: string;
  branchTitle: string;
  summary: string;
  path?: string;
  index: number;
};

const levelStyles: Record<string, string> = {
  green: 'border-moss bg-[#eef6ed]',
  yellow: 'border-citron bg-[#faf9db]',
  red: 'border-coral bg-[#fff0eb]',
  white: 'border-ink bg-white'
};

const levelLabels: Record<string, string> = {
  green: 'RD 剛轉 TPM 必修',
  yellow: '能獨立帶案',
  red: 'Senior TPM',
  white: '特殊領域'
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

function TopicNode({ data }: NodeProps<Node<RoadmapNode>>) {
  return (
    <div className={`w-[214px] rounded-lg border-2 p-3 shadow-sm ${levelStyles[data.level] ?? levelStyles.white}`}>
      <Handle type="target" position={Position.Left} className="!bg-ink" />
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink/55">
            {data.branchTitle.slice(0, 2)} · {data.level}
          </p>
          <h3 className="text-[15px] font-bold leading-tight text-ink">{data.title}</h3>
        </div>
        <CheckCircle2 className="h-4 w-4 shrink-0 text-moss" aria-hidden />
      </div>
      <p className="line-clamp-3 text-xs leading-relaxed text-ink/70">{data.summary}</p>
      <Handle type="source" position={Position.Right} className="!bg-ink" />
    </div>
  );
}

const nodeTypes = { topic: TopicNode };

export default function RoadmapFlow() {
  const [selectedId, setSelectedId] = useState('b03-requirement-scope:0');
  const [mode, setMode] = useState<ViewMode>('learning');

  const selected = allNodes.find((node) => node.id === selectedId) ?? allNodes[0];
  const selectedBranch = roadmap.branches.find((branch) => branch.id === selected.branchId);

  const { nodes, edges } = useMemo(() => {
    const branchRows = new Map(roadmap.branches.map((branch, row) => [branch.id, row]));

    const flowNodes: Node<RoadmapNode>[] = allNodes.map((node) => ({
      id: node.id,
      type: 'topic',
      data: node,
      position: {
        x: 40 + node.index * 260,
        y: (branchRows.get(node.branchId) ?? 0) * 190
      }
    }));

    const flowEdges: Edge[] = roadmap.branches.flatMap((branch) =>
      branch.nodes.slice(1).map((_, index) => {
        const source = `${branch.id}:${index}`;
        const target = `${branch.id}:${index + 1}`;
        return {
          id: `${source}-${target}`,
          source,
          target,
          animated: source === selectedId || target === selectedId,
          style: {
            stroke: source === selectedId || target === selectedId ? '#2f6f5e' : '#b7b29e',
            strokeWidth: 2
          }
        };
      })
    );

    return { nodes: flowNodes, edges: flowEdges };
  }, [selectedId]);

  const getNode = (ref: string) => allNodes.find((node) => node.id === ref);

  return (
    <section className="grid min-h-[820px] gap-4 lg:grid-cols-[1fr_370px]">
      <div className="overflow-hidden rounded-lg border border-ink/15 bg-white shadow-panel">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 px-4 py-3">
          <div className="flex rounded-lg border border-ink/15 bg-paper p-1">
            <button
              className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold ${mode === 'learning' ? 'bg-ink text-white' : 'text-ink/70'}`}
              onClick={() => setMode('learning')}
              type="button"
            >
              <BookOpen className="h-4 w-4" aria-hidden />
              學習模式
            </button>
            <button
              className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold ${mode === 'work' ? 'bg-ink text-white' : 'text-ink/70'}`}
              onClick={() => setMode('work')}
              type="button"
            >
              <BriefcaseBusiness className="h-4 w-4" aria-hidden />
              工作模式
            </button>
          </div>
          <p className="text-sm text-ink/60">
            {roadmap.branches.length} 大主幹 · {allNodes.length} 個節點 · 點節點查看重點
          </p>
        </div>

        {mode === 'learning' ? (
          <div className="h-[760px]">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              fitView
              minZoom={0.16}
              maxZoom={1.35}
              onNodeClick={(_, node) => setSelectedId(node.id)}
            >
              <Background color="#d8d1bf" gap={22} />
              <MiniMap pannable zoomable nodeStrokeWidth={3} />
              <Controls />
            </ReactFlow>
          </div>
        ) : (
          <div className="grid gap-3 p-4 md:grid-cols-2">
            {roadmap.workModes.map((item) => (
              <button
                key={item.title}
                type="button"
                className="rounded-lg border border-ink/12 bg-paper p-4 text-left transition hover:border-moss hover:bg-white"
                onClick={() => setSelectedId(item.refs[0])}
              >
                <h3 className="font-bold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{item.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.refs.map((ref) => {
                    const node = getNode(ref);
                    return node ? (
                      <span key={ref} className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-moss">
                        {node.title}
                      </span>
                    ) : null;
                  })}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <aside className="rounded-lg border border-ink/15 bg-white p-5 shadow-panel">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-moss">Selected topic</p>
        <h2 className="mt-2 text-2xl font-bold text-ink">{selected.title}</h2>
        <p className="mt-2 text-sm font-semibold text-ink/55">{selected.branchTitle}</p>
        <p className="mt-3 leading-relaxed text-ink/72">{selected.summary}</p>
        <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-paper p-3">
            <dt className="font-semibold text-ink/55">難度</dt>
            <dd className="mt-1 font-bold text-ink">{levelLabels[selected.level] ?? selected.level}</dd>
          </div>
          <div className="rounded-lg bg-paper p-3">
            <dt className="font-semibold text-ink/55">主幹</dt>
            <dd className="mt-1 font-bold text-ink">{selectedBranch?.group ?? 'Roadmap'}</dd>
          </div>
        </dl>

        <div className="mt-5">
          <h3 className="text-sm font-bold text-ink">同主幹相鄰節點</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {[selected.index - 1, selected.index + 1].map((index) => {
              const ref = `${selected.branchId}:${index}`;
              const node = getNode(ref);
              return node ? (
                <button
                  key={ref}
                  className="rounded-full bg-[#eef6ed] px-3 py-1.5 text-sm font-semibold text-moss"
                  type="button"
                  onClick={() => setSelectedId(ref)}
                >
                  {node.title}
                </button>
              ) : null;
            })}
          </div>
        </div>

        <div className="mt-5 rounded-lg bg-paper p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-ink">
            <Layers3 className="h-4 w-4" aria-hidden />
            AI for TPM
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {roadmap.aiWorkflows.slice(0, 6).map((workflow) => (
              <span key={workflow} className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-ink/70">
                {workflow}
              </span>
            ))}
          </div>
        </div>

        <a
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-moss px-4 py-3 text-sm font-bold text-white transition hover:bg-ink"
          href={selected.path}
        >
          深入學習
          <ExternalLink className="h-4 w-4" aria-hidden />
        </a>
      </aside>
    </section>
  );
}
