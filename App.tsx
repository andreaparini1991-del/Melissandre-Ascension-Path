
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import ReactFlow, { 
  ReactFlowProvider, 
  Background, 
  BackgroundVariant,
  Controls, 
  MiniMap, 
  Node, 
  Edge,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  OnNodesChange,
  OnEdgesChange,
  getOutgoers,
  useReactFlow,
  useViewport
} from 'reactflow';

import SkillNode from './components/SkillNode';
import CustomEdge from './components/CustomEdge';
import ControlPanel from './components/ControlPanel';
import DetailsPanel from './components/DetailsPanel';
import SideMenu from './components/SideMenu';
import { INITIAL_SKILLS, INITIAL_CONNECTIONS } from './constants';
import { calculateInitialPosition } from './utils/layout';
import { SkillNodeData, PlayerStats } from './types';

const SAVE_KEY = 'ascension_path_save';

const nodeTypes = {
  skill: SkillNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

const RadialBackground = () => {
  const { x, y, zoom } = useViewport();
  const viewportStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    transformOrigin: '0 0',
    transform: `translate(${x}px, ${y}px) scale(${zoom})`,
    pointerEvents: 'none',
    zIndex: -1,
  };

  return (
    <div style={viewportStyle}>
      <div className="absolute top-0 left-0">
        <div 
          className="absolute rounded-full"
          style={{
            width: '10000px',
            height: '10000px',
            left: '0',
            top: '0',
            transform: 'translate(-50%, -50%)',
            background: `conic-gradient(
              from 330deg,
              rgba(255, 255, 255, 0.08) 0deg 60deg,
              rgba(239, 68, 68, 0.08) 60deg 120deg,
              rgba(59, 130, 246, 0.08) 120deg 180deg,
              rgba(234, 179, 8, 0.08) 180deg 240deg,
              rgba(34, 197, 94, 0.08) 240deg 300deg,
              rgba(249, 115, 22, 0.08) 300deg 360deg
            )`,
            filter: 'blur(100px)',
            opacity: 0.7
          }}
        />
        {[30, 90, 150, 210, 270, 330].map(deg => (
          <div 
            key={deg} 
            className="absolute origin-center" 
            style={{ 
              width: '1px',
              height: '8000px',
              left: '0',
              top: '0',
              transform: `translate(-50%, -50%) rotate(${deg}deg)`,
              background: 'linear-gradient(to top, transparent, rgba(255,255,255,0.04) 50%, transparent)',
            }} 
          />
        ))}
        {[150, 390, 630, 870, 1110].map(r => (
          <div 
            key={r} 
            className="absolute border border-white/[0.06] rounded-full" 
            style={{ 
              width: `${r * 2}px`, 
              height: `${r * 2}px`,
              left: '0',
              top: '0',
              transform: 'translate(-50%, -50%)',
            }} 
          />
        ))}
      </div>
    </div>
  );
};

const SkillTreeSimulator = () => {
  const { getNodes, getEdges, fitView, setViewport } = useReactFlow();
  const [nodes, setNodes] = useState<Node<SkillNodeData>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [stats, setStats] = useState<PlayerStats>({ ascensionPoints: 100, evolutionPoints: 100 });
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const updateUnlockStatus = useCallback((currentNodes: Node<SkillNodeData>[], currentEdges: Edge[]) => {
    return currentNodes.map(node => {
      const parentEdges = currentEdges.filter(e => e.target === node.id);
      const isRoot = node.data.tier === 0;
      const isUnlocked = isRoot || parentEdges.some(e => {
        const parent = currentNodes.find(n => n.id === e.source);
        return parent?.data.isActive;
      });

      return {
        ...node,
        data: { ...node.data, isUnlocked }
      };
    });
  }, []);

  const updateEdgeStatus = useCallback((currentNodes: Node<SkillNodeData>[], currentEdges: Edge[]) => {
    return currentEdges.map(e => {
      const sourceNode = currentNodes.find(n => n.id === e.source);
      const targetNode = currentNodes.find(n => n.id === e.target);
      return { 
        ...e, 
        data: { 
          ...e.data, 
          sourceActive: !!sourceNode?.data.isActive,
          targetActive: !!targetNode?.data.isActive,
          targetUnlocked: !!targetNode?.data.isUnlocked
        } 
      };
    });
  }, []);

  // Initialization & URL Checking
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedBuild = urlParams.get('build');
    let sharedActiveIds: string[] = [];

    if (sharedBuild) {
      try {
        sharedActiveIds = JSON.parse(atob(sharedBuild));
      } catch (e) {
        console.error("Invalid shared build data");
      }
    }

    let savedData: any = null;
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) savedData = JSON.parse(raw);
    } catch (e) {}

    const initialNodes = INITIAL_SKILLS.map((skill) => {
      const skillsInTier = INITIAL_SKILLS.filter(s => s.category === skill.category && s.tier === skill.tier);
      const index = skillsInTier.indexOf(skill);
      const pos = calculateInitialPosition(skill, skillsInTier.length, index);
      
      const savedNode = savedData?.nodes?.find((n: any) => n.id === skill.id);
      const isInitiallyActive = sharedBuild 
        ? sharedActiveIds.includes(skill.id) 
        : (savedNode?.data?.isActive || false);
      
      return {
        id: skill.id,
        type: 'skill',
        position: savedNode?.position || pos,
        data: { ...skill, isActive: isInitiallyActive },
      };
    });

    const initialEdges = INITIAL_CONNECTIONS.map((conn, idx) => ({
      id: `e-${idx}`,
      source: conn.source,
      target: conn.target,
      type: 'custom',
      data: { 
        category: INITIAL_SKILLS.find(s => s.id === conn.source)?.category,
        sourceActive: false,
        targetActive: false,
        targetUnlocked: false
      }
    }));

    if (savedData?.stats && !sharedBuild) {
      setStats(savedData.stats);
    }

    const nodesWithStatus = updateUnlockStatus(initialNodes, initialEdges);
    const edgesWithStatus = updateEdgeStatus(nodesWithStatus, initialEdges);

    setNodes(nodesWithStatus);
    setEdges(edgesWithStatus);
    
    if (savedData?.viewport && !sharedBuild) {
      setViewport(savedData.viewport);
    } else {
      setTimeout(() => fitView({ padding: 0.3, duration: 800 }), 100);
    }

    setIsInitialized(true);
  }, [fitView, setViewport, updateUnlockStatus, updateEdgeStatus]);

  // Auto-save
  useEffect(() => {
    if (!isInitialized) return;
    const save = {
      nodes: nodes.map(n => ({ id: n.id, position: n.position, data: { isActive: n.data.isActive } })),
      stats,
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  }, [nodes, stats, isInitialized]);

  // Notification Handler
  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleExport = () => {
    const activeIds = nodes.filter(n => n.data.isActive).map(n => n.id);
    const exportData = {
      activeIds,
      stats,
      version: "1.4"
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my_ascension_build.json`;
    a.click();
    URL.revokeObjectURL(url);
    setIsMenuOpen(false);
    showNotification("Build esportata!");
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event: any) => {
        try {
          const data = JSON.parse(event.target.result);
          if (data.activeIds && data.stats) {
            setStats(data.stats);
            setNodes(prev => {
              const newNodes = prev.map(n => ({
                ...n,
                data: { ...n.data, isActive: data.activeIds.includes(n.id) }
              }));
              const updated = updateUnlockStatus(newNodes, edges);
              setEdges(updateEdgeStatus(updated, edges));
              return updated;
            });
            showNotification("Build importata con successo!");
          }
        } catch (err) {
          alert("File JSON non valido.");
        }
      };
      reader.readAsText(file);
    };
    input.click();
    setIsMenuOpen(false);
  };

  const handleShare = () => {
    const activeIds = nodes.filter(n => n.data.isActive).map(n => n.id);
    const encoded = btoa(JSON.stringify(activeIds));
    const url = `${window.location.origin}${window.location.pathname}?build=${encoded}`;
    navigator.clipboard.writeText(url);
    showNotification("Link copiato!");
    setIsMenuOpen(false);
  };

  const handleReset = useCallback(() => {
    if (!window.confirm("Sei sicuro di voler resettare tutti i progressi? Questa azione non può essere annullata.")) return;
    localStorage.removeItem(SAVE_KEY);
    const resetNodes = INITIAL_SKILLS.map((skill) => {
      const skillsInTier = INITIAL_SKILLS.filter(s => s.category === skill.category && s.tier === skill.tier);
      const index = skillsInTier.indexOf(skill);
      const pos = calculateInitialPosition(skill, skillsInTier.length, index);
      return {
        id: skill.id,
        type: 'skill',
        position: pos,
        data: { ...skill, isActive: false, isUnlocked: skill.tier === 0 },
      };
    });
    setStats({ ascensionPoints: 100, evolutionPoints: 100 });
    setNodes(resetNodes);
    setEdges(INITIAL_CONNECTIONS.map((conn, idx) => ({
      id: `e-${idx}`,
      source: conn.source,
      target: conn.target,
      type: 'custom',
      data: { category: INITIAL_SKILLS.find(s => s.id === conn.source)?.category, sourceActive: false, targetActive: false, targetUnlocked: false }
    })));
    setIsMenuOpen(false);
    showNotification("Progresso resettato.");
    setTimeout(() => fitView({ padding: 0.3, duration: 800 }), 100);
  }, [fitView]);

  const onNodesChange: OnNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedSkillId(node.id);
  }, []);

  const selectedSkill = useMemo(() => 
    nodes.find(n => n.id === selectedSkillId)?.data || null
  , [nodes, selectedSkillId]);

  const canAfford = useMemo(() => {
    if (!selectedSkill) return false;
    return stats.ascensionPoints >= selectedSkill.costAscension && 
           stats.evolutionPoints >= selectedSkill.costEvolution;
  }, [selectedSkill, stats]);

  const handleLearn = useCallback((id: string) => {
    setNodes(prevNodes => {
      const nodeToLearn = prevNodes.find(n => n.id === id);
      if (!nodeToLearn || nodeToLearn.data.isActive) return prevNodes;
      if (stats.ascensionPoints < nodeToLearn.data.costAscension || stats.evolutionPoints < nodeToLearn.data.costEvolution) return prevNodes;
      setStats(prev => ({
        ascensionPoints: prev.ascensionPoints - nodeToLearn.data.costAscension,
        evolutionPoints: prev.evolutionPoints - nodeToLearn.data.costEvolution,
      }));
      const newNodes = prevNodes.map(n => n.id === id ? { ...n, data: { ...n.data, isActive: true } } : n);
      const updatedNodesWithUnlocks = updateUnlockStatus(newNodes, edges);
      setEdges(prevEdges => updateEdgeStatus(updatedNodesWithUnlocks, prevEdges));
      setSelectedSkillId(null);
      return updatedNodesWithUnlocks;
    });
  }, [edges, updateUnlockStatus, updateEdgeStatus, stats.ascensionPoints, stats.evolutionPoints]);

  const handleForget = useCallback((id: string) => {
    setNodes(prevNodes => {
      const nodesToDeactivate = new Set<string>();
      const currentEdges = getEdges();
      const traverse = (nodeId: string) => {
        nodesToDeactivate.add(nodeId);
        const children = getOutgoers({ id: nodeId } as Node, prevNodes, currentEdges);
        children.forEach(child => traverse(child.id));
      };
      traverse(id);
      let totalAscensionRefund = 0;
      let totalEvolutionRefund = 0;
      const newNodes = prevNodes.map(n => {
        if (nodesToDeactivate.has(n.id) && n.data.isActive) {
          totalAscensionRefund += n.data.costAscension;
          totalEvolutionRefund += n.data.costEvolution;
          return { ...n, data: { ...n.data, isActive: false } };
        }
        return n;
      });
      setStats(prev => ({
        ascensionPoints: prev.ascensionPoints + totalAscensionRefund,
        evolutionPoints: prev.evolutionPoints + totalEvolutionRefund,
      }));
      const updatedNodesWithUnlocks = updateUnlockStatus(newNodes, currentEdges);
      setEdges(prevEdges => updateEdgeStatus(updatedNodesWithUnlocks, prevEdges));
      setSelectedSkillId(null);
      return updatedNodesWithUnlocks;
    });
  }, [getEdges, updateUnlockStatus, updateEdgeStatus]);

  return (
    <div className="w-full h-screen bg-[#060608] relative overflow-hidden font-inter">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 bg-[#111] border border-[#444] text-white rounded-full font-cinzel text-xs shadow-2xl animate-bounce">
          {notification}
        </div>
      )}

      <SideMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)}
        onExport={handleExport}
        onImport={handleImport}
        onShare={handleShare}
        onReset={handleReset}
      />

      <ControlPanel 
        stats={stats} 
        onStatsChange={(k, v) => setStats(p => ({ ...p, [k]: v }))} 
        onMenuToggle={() => setIsMenuOpen(true)}
      />

      <div className="w-full h-full relative z-10">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          snapToGrid
          snapGrid={[20, 20]}
          fitView
          minZoom={0.05}
          maxZoom={2}
          nodesConnectable={false}
          nodesDraggable={false}
        >
          <Background color="#ffffff" variant={BackgroundVariant.Lines} gap={80} size={0.5} style={{ opacity: 0.02 }} />
          <RadialBackground />
          <Controls className="!bg-[#111] !border-[#333] !shadow-2xl" />
          <MiniMap 
            nodeColor={(n) => (n.data as SkillNodeData).isActive ? '#fff' : '#222'}
            maskColor="rgba(0,0,0,0.8)"
            style={{ height: 120, width: 160 }}
            className="md:block hidden"
          />
        </ReactFlow>
      </div>

      <DetailsPanel 
        skill={selectedSkill}
        onClose={() => setSelectedSkillId(null)}
        onLearn={handleLearn}
        onForget={handleForget}
        canAfford={canAfford}
      />
    </div>
  );
};

const App = () => (
  <ReactFlowProvider>
    <SkillTreeSimulator />
  </ReactFlowProvider>
);

export default App;
