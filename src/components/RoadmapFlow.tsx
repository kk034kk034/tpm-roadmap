import '@xyflow/react/dist/style.css';

import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
  Position,
  Handle
} from '@xyflow/react';
import { BookOpen, BriefcaseBusiness, CheckCircle2, ExternalLink } from 'lucide-react';
import { useMemo, useState } from 'react';
import roadmap from '../data/roadmap.json';

type RoadmapNode = (typeof roadmap.nodes)[number];
type ViewMode = 'learning' | 'work';

const categoryStyles: Record<string, string> = {
  transition: 'border-moss bg-[#eef6ed]',
  presales: 'border-sky bg-[#eef6f8]',
  requirement: 'border-coral bg-[#fff0eb]',
  planning: 'border-citron bg-[#faf9db]',
  execution: 'border-moss bg-[#edf7f1]',
  delivery: 'border-ink bg-white'
};

function TopicNode({ data }: NodeProps<Node<RoadmapNode>>) {
  return (
    <div className={`w-[210px] rounded-lg border-2 p-3 shadow-sm ${categoryStyles[data.category] ?? 'border-ink bg-white'}`}>
      <Handle type="target" position={Position.Top} className="!bg-ink" />
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink/55">{data.level}</p>
          <h3 className="text-base font-bold leading-tight text-ink">{data.title}</h3>
        </div>
        <CheckCircle2 className="h-4 w-4 shrink-0 text-moss" aria-hidden />
      </div>
      <p className="line-clamp-3 text-xs leading-relaxed text-ink/70">{data.summary}</p>
      <Handle type="source" position={Position.Bottom} className="!bg-ink" />
    </div>
  );
}

const nodeTypes = { topic: TopicNode };

const levelY: Record<RoadmapNode['category'], number> = {
  transition: 0,
  presales: 150,
  requirement: 310,
  planning: 470,
  execution: 640,
  delivery: 810
};

export default function RoadmapFlow() {
  const [selectedId, setSelectedId] = useState('requirement');
  const [mode, setMode] = useState<ViewMode>('learning');

  const selected = roadmap.nodes.find((node) => node.id === selectedId) ?? roadmap.nodes[0];

  const { nodes, edges } = useMemo(() => {
    const groupedCounts = new Map<string, number>();

    const flowNodes: Node<RoadmapNode>[] = roadmap.nodes.map((node) => {
      const categoryCount = groupedCounts.get(node.category) ?? 0;
      groupedCounts.set(node.category, categoryCount + 1);

      return {
        id: node.id,
        type: 'topic',
        data: node,
        position: {
          x: 40 + categoryCount * 260,
          y: levelY[node.category] ?? 0
        }
      };
    });

    const flowEdges: Edge[] = roadmap.nodes.flatMap((node) =>
      node.prerequisites.map((source) => ({
        id: `${source}-${node.id}`,
        source,
        target: node.id,
        animated: node.id === selectedId || source === selectedId,
        style: { stroke: node.id === selectedId || source === selectedId ? '#2f6f5e' : '#9b9a84', strokeWidth: 2 }
      }))
    );

    return { nodes: flowNodes, edges: flowEdges };
  }, [selectedId]);

  const workItems = roadmap.workModes;

  return (
    <section className="grid min-h-[760px] gap-4 lg:grid-cols-[1fr_360px]">
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
          <p className="text-sm text-ink/60">點節點查看重點，拖曳或縮放瀏覽技能樹。</p>
        </div>

        {mode === 'learning' ? (
          <div className="h-[690px]">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              fitView
              minZoom={0.35}
              maxZoom={1.4}
              onNodeClick={(_, node) => setSelectedId(node.id)}
            >
              <Background color="#d8d1bf" gap={22} />
              <MiniMap pannable zoomable nodeStrokeWidth={3} />
              <Controls />
            </ReactFlow>
          </div>
        ) : (
          <div className="grid gap-3 p-4 md:grid-cols-2">
            {workItems.map((item) => (
              <button
                key={item.title}
                type="button"
                className="rounded-lg border border-ink/12 bg-paper p-4 text-left transition hover:border-moss hover:bg-white"
                onClick={() => setSelectedId(item.nodes[0])}
              >
                <h3 className="font-bold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{item.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.nodes.map((id) => {
                    const node = roadmap.nodes.find((entry) => entry.id === id);
                    return node ? (
                      <span key={id} className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-moss">
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
        <p className="mt-3 leading-relaxed text-ink/72">{selected.summary}</p>
        <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-paper p-3">
            <dt className="font-semibold text-ink/55">Level</dt>
            <dd className="mt-1 font-bold text-ink">{selected.level}</dd>
          </div>
          <div className="rounded-lg bg-paper p-3">
            <dt className="font-semibold text-ink/55">Category</dt>
            <dd className="mt-1 font-bold text-ink">{selected.category}</dd>
          </div>
        </dl>
        <div className="mt-5">
          <h3 className="text-sm font-bold text-ink">Prerequisites</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {selected.prerequisites.length > 0 ? (
              selected.prerequisites.map((id) => {
                const node = roadmap.nodes.find((entry) => entry.id === id);
                return (
                  <button
                    key={id}
                    className="rounded-full bg-[#eef6ed] px-3 py-1.5 text-sm font-semibold text-moss"
                    type="button"
                    onClick={() => setSelectedId(id)}
                  >
                    {node?.title ?? id}
                  </button>
                );
              })
            ) : (
              <span className="text-sm text-ink/60">無，這是起點。</span>
            )}
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
