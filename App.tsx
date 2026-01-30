
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
import TableView from './components/TableView';
import CharacterModal from './components/CharacterModal';
import ResetConfirmModal from './components/ResetConfirmModal';
import { INITIAL_SKILLS, INITIAL_CONNECTIONS } from './constants';
import { calculateInitialPosition } from './utils/layout';
import { SkillNodeData, PlayerStats, ViewMode, CharacterData } from './types';

const SAVE_KEY = 'ascension_path_save_v8';
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQj7DBJU6sY9yVCZGqijOvr3WTLxBQSjnbhls3FR4w0ILNxaH43rsO0_p8OQxSqlwF5INCs03HZGQaw/pub?gid=2078211696&single=true&output=csv';
const FORM_ACTION_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdOGeP5_rCHFu8_SLfZieVpSfJ7VVHE1Kf0Rc8BHzelyH0smA/formResponse';

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
            width: '12000px',
            height: '12000px',
            left: '0',
            top: '0',
            transform: 'translate(-50%, -50%)',
            background: `conic-gradient(
              from 330deg,
              rgba(255, 255, 255, 0.05) 0deg 60deg,
              rgba(239, 68, 68, 0.05) 60deg 120deg,
              rgba(59, 130, 246, 0.05) 120deg 180deg,
              rgba(234, 179, 8, 0.05) 180deg 240deg,
              rgba(34, 197, 94, 0.05) 240deg 300deg,
              rgba(249, 115, 22, 0.05) 300deg 360deg
            )`,
            filter: 'blur(80px)',
            opacity: 0.7
          }}
        />
        {[30, 90, 150, 210, 270, 330].map(deg => (
          <div 
            key={deg} 
            className="absolute origin-center" 
            style={{ 
              width: '1px',
              height: '10000px',
              left: '0',
              top: '0',
              transform: `translate(-50%, -50%) rotate(${deg}deg)`,
              background: 'linear-gradient(to top, transparent, rgba(255,255,255,0.04) 50%, transparent)',
            }} 
          />
        ))}
        {[160, 450, 750, 1050, 1350].map(r => (
          <div 
            key={r} 
            className="absolute border border-white/[0.07] rounded-full" 
            style={{ 
              width: `${r * 2}px`, 
              height: `${r * 2}px`,
              left: '0',
              top: '0',
              transform: 'translate(-50%, -50%)',
            }} 
          />
        ))}
        <div className="absolute w-10 h-[1px] bg-white/10 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute h-10 w-[1px] bg-white/10 -translate-x-1/2 -translate-y-1/2" />
      </div>
    </div>
  );
};

const SkillTreeSimulator = () => {
  const { fitView, setViewport } = useReactFlow();
  const [nodes, setNodes] = useState<Node<SkillNodeData>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [stats, setStats] = useState<PlayerStats>({ totalAscensionPoints: 100, totalEvolutionPoints: 100 });
  const [activeCharacterName, setActiveCharacterName] = useState<string | null>(null);
  const [history, setHistory] = useState<{ nodes: Node<SkillNodeData>[], stats: PlayerStats }[]>([]);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCharModalOpen, setIsCharModalOpen] = useState(false);
  const [charModalPurpose, setCharModalPurpose] = useState<'load' | 'save'>('load');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [characters, setCharacters] = useState<CharacterData[]>([]);
  const [isFetchingChars, setIsFetchingChars] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('radial');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const fetchCharacters = useCallback(async () => {
    setIsFetchingChars(true);
    try {
      const response = await fetch(CSV_URL);
      const text = await response.text();
      const lines = text.split('\n');
      const parsed: CharacterData[] = [];
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',');
        if (parts.length >= 4) {
          parsed.push({
            name: parts[0].trim().replace(/^"|"$/g, ''),
            pa: parseInt(parts[1].trim()) || 0,
            pe: parseInt(parts[2].trim()) || 0,
            build: parts[3].trim().replace(/^"|"$/g, '')
          });
        }
      }
      setCharacters(parsed);
    } catch (err) {} finally {
      setIsFetchingChars(false);
    }
  }, []);

  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);

  const spentPoints = useMemo(() => {
    return nodes.reduce((acc, node) => {
      if (node.data.isActive) {
        acc.pa += node.data.costAscension;
        acc.pe += node.data.costEvolution;
      }
      return acc;
    }, { pa: 0, pe: 0 });
  }, [nodes]);

  const remainingStats = useMemo(() => ({
    pa: stats.totalAscensionPoints - spentPoints.pa,
    pe: stats.totalEvolutionPoints - spentPoints.pe
  }), [stats, spentPoints]);

  const updateUnlockStatus = useCallback((currentNodes: Node<SkillNodeData>[], currentEdges: Edge[]) => {
    return currentNodes.map(node => {
      const parentEdges = currentEdges.filter(e => e.target === node.id);
      const isRoot = node.data.tier === 0;
      const isUnlocked = isRoot || parentEdges.some(e => {
        const parent = currentNodes.find(n => n.id === e.source);
        return parent?.data.isActive;
      });
      return { ...node, data: { ...node.data, isUnlocked } };
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
          targetUnlocked: !!targetNode?.data.isUnlocked,
          sourceTier: sourceNode?.data.tier,
          targetTier: targetNode?.data.tier
        } 
      };
    });
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedBuild = urlParams.get('build');
    let sharedActiveIds: string[] = [];
    if (sharedBuild) {
      try { sharedActiveIds = JSON.parse(atob(sharedBuild)); } catch (e) {}
    }

    let savedData: any = null;
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) savedData = JSON.parse(raw);
    } catch (e) {}

    const initialNodes = INITIAL_SKILLS.map((skill) => {
      const categorySkills = INITIAL_SKILLS.filter(s => s.category === skill.category);
      const branchNames = Array.from(new Set(categorySkills.map(s => s.name.split(" I")[0].split(" II")[0].split(" III")[0].split(" IV")[0].trim())));
      const skillBranchName = skill.name.split(" I")[0].split(" II")[0].split(" III")[0].split(" IV")[0].trim();
      const branchIndex = branchNames.indexOf(skillBranchName);
      const pos = calculateInitialPosition(skill, branchNames.length, branchIndex);
      const savedNode = savedData?.nodes?.find((n: any) => n.id === skill.id);
      const isInitiallyActive = sharedBuild ? sharedActiveIds.includes(skill.id) : (savedNode?.data?.isActive || false);
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
      selectable: false,
      data: { 
        category: INITIAL_SKILLS.find(s => s.id === conn.source)?.category,
        sourceActive: false,
        targetActive: false,
        targetUnlocked: false,
        sourceTier: INITIAL_SKILLS.find(s => s.id === conn.source)?.tier,
        targetTier: INITIAL_SKILLS.find(s => s.id === conn.target)?.tier
      }
    }));

    if (savedData?.stats && !sharedBuild) setStats(savedData.stats);
    if (savedData?.activeCharacterName && !sharedBuild) setActiveCharacterName(savedData.activeCharacterName);

    const nodesWithStatus = updateUnlockStatus(initialNodes, initialEdges);
    const edgesWithStatus = updateEdgeStatus(nodesWithStatus, initialEdges);
    setNodes(nodesWithStatus);
    setEdges(edgesWithStatus);
    
    if (savedData?.viewport && !sharedBuild) {
      setViewport(savedData.viewport);
    } else {
      setTimeout(() => {
        setViewport({ x: window.innerWidth / 2, y: window.innerHeight / 2, zoom: 0.6 });
        fitView({ padding: 0.2, duration: 800 });
      }, 100);
    }
    setIsInitialized(true);
  }, [fitView, setViewport, updateUnlockStatus, updateEdgeStatus]);

  useEffect(() => {
    if (!isInitialized) return;
    const save = { 
      nodes: nodes.map(n => ({ id: n.id, position: n.position, data: { isActive: n.data.isActive } })), 
      stats,
      activeCharacterName
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  }, [nodes, stats, activeCharacterName, isInitialized]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleExport = () => {
    const activeIds = nodes.filter(n => n.data.isActive).map(n => n.id);
    const exportData = { activeIds, stats, activeCharacterName, version: "2.5" };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeCharacterName || 'build'}_export.json`;
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
            if (data.activeCharacterName) setActiveCharacterName(data.activeCharacterName);
            setNodes(prev => {
              const newNodes = prev.map(n => ({ ...n, data: { ...n.data, isActive: data.activeIds.includes(n.id) } }));
              const updated = updateUnlockStatus(newNodes, edges);
              setEdges(updateEdgeStatus(updated, edges));
              return updated;
            });
            showNotification("Build importata!");
          }
        } catch (err) {}
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

  const handleExecuteReset = useCallback(() => {
    localStorage.removeItem(SAVE_KEY);
    setStats({ totalAscensionPoints: 100, totalEvolutionPoints: 100 });
    setActiveCharacterName(null);

    setNodes((prevNodes) => {
      const resetNodes = prevNodes.map(node => ({
        ...node,
        data: { ...node.data, isActive: false }
      }));
      const updatedNodes = updateUnlockStatus(resetNodes, edges);
      setTimeout(() => {
        setEdges(prevEdges => updateEdgeStatus(updatedNodes, prevEdges));
      }, 100);
      return updatedNodes;
    });

    setHistory([]);
    setSelectedSkillId(null);
    setIsResetModalOpen(false);
    setIsMenuOpen(false);
    showNotification("Reset Totale completato.");
  }, [edges, updateUnlockStatus, updateEdgeStatus]);

  const onNodesChange: OnNodesChange = useCallback((changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange: OnEdgesChange = useCallback((changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => setSelectedSkillId(node.id), []);

  const selectedSkill = useMemo(() => nodes.find(n => n.id === selectedSkillId)?.data || null, [nodes, selectedSkillId]);
  const canAfford = useMemo(() => {
    if (!selectedSkill) return false;
    return remainingStats.pa >= selectedSkill.costAscension && remainingStats.pe >= selectedSkill.costEvolution;
  }, [selectedSkill, remainingStats]);

  const saveToHistory = useCallback(() => {
    setHistory(prev => [...prev.slice(-19), { nodes: JSON.parse(JSON.stringify(nodes)), stats: { ...stats } }]);
  }, [nodes, stats]);

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const lastState = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setNodes(lastState.nodes);
    setStats(lastState.stats);
    setEdges(prevEdges => updateEdgeStatus(lastState.nodes, prevEdges));
    setSelectedSkillId(null);
    showNotification("Azione annullata");
  }, [history, updateEdgeStatus]);

  const handleLearn = useCallback((id: string) => {
    setNodes(prevNodes => {
      const nodeToLearn = prevNodes.find(n => n.id === id);
      if (!nodeToLearn || nodeToLearn.data.isActive) return prevNodes;
      if (remainingStats.pa < nodeToLearn.data.costAscension || remainingStats.pe < nodeToLearn.data.costEvolution) {
        showNotification("Punti insufficienti!");
        return prevNodes;
      }
      saveToHistory();
      const newNodes = prevNodes.map(n => n.id === id ? { ...n, data: { ...n.data, isActive: true } } : n);
      const updated = updateUnlockStatus(newNodes, edges);
      setEdges(prevEdges => updateEdgeStatus(updated, prevEdges));
      setSelectedSkillId(null);
      return updated;
    });
  }, [edges, updateUnlockStatus, updateEdgeStatus, remainingStats, saveToHistory]);

  const handleForget = useCallback((id: string) => {
    setNodes(prevNodes => {
      saveToHistory();
      const toDeactivate = new Set<string>();
      const traverse = (nodeId: string) => {
        toDeactivate.add(nodeId);
        getOutgoers({ id: nodeId } as Node, prevNodes, edges).forEach(child => traverse(child.id));
      };
      traverse(id);
      const newNodes = prevNodes.map(n => toDeactivate.has(n.id) && n.data.isActive ? { ...n, data: { ...n.data, isActive: false } } : n);
      const updated = updateUnlockStatus(newNodes, edges);
      setEdges(prevEdges => updateEdgeStatus(updated, prevEdges));
      setSelectedSkillId(null);
      return updated;
    });
  }, [edges, updateUnlockStatus, updateEdgeStatus, saveToHistory]);

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode);
    setIsMenuOpen(false);
  };

  const handleSaveBuild = async (char: CharacterData) => {
    setIsSubmitting(true);
    try {
      const activeSkillNames = nodes
        .filter(n => n.data.isActive)
        .map(n => n.data.name)
        .join(';');

      const params = new URLSearchParams();
      params.append('entry.1479084945', char.name);
      params.append('entry.1797587019', remainingStats.pa.toString());
      params.append('entry.5389224', remainingStats.pe.toString());
      params.append('entry.1652555228', activeSkillNames);

      await fetch(FORM_ACTION_URL, {
        method: 'POST',
        body: params,
        mode: 'no-cors',
        cache: 'no-cache'
      });

      setActiveCharacterName(char.name);
      showNotification(`Build salvata per ${char.name}!`);
      setIsCharModalOpen(false);
      setIsMenuOpen(false);
    } catch (err) {
      showNotification("Errore nel salvataggio della build.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveClick = () => {
    if (activeCharacterName) {
      setCharModalPurpose('save');
      setIsCharModalOpen(true);
    } else {
      showNotification("Carica un personaggio prima di salvare.");
    }
  };

  const handleCharacterModalSelect = (char: CharacterData) => {
    if (charModalPurpose === 'load') {
      const buildSkills = char.build ? char.build.split(';').map(s => s.trim().replace(/"/g, '')) : [];
      let spentPA = 0;
      let spentPE = 0;
      
      const newNodes = nodes.map(node => {
        const isActive = buildSkills.includes(node.data.name);
        if (isActive) {
          spentPA += node.data.costAscension;
          spentPE += node.data.costEvolution;
        }
        return { ...node, data: { ...node.data, isActive } };
      });

      setStats({
        totalAscensionPoints: char.pa + spentPA,
        totalEvolutionPoints: char.pe + spentPE
      });
      setActiveCharacterName(char.name);

      const updated = updateUnlockStatus(newNodes, edges);
      setNodes(updated);
      setEdges(updateEdgeStatus(updated, edges));

      showNotification(`Build sincronizzata per ${char.name}!`);
      setIsCharModalOpen(false);
    } else {
      handleSaveBuild(char);
    }
  };

  return (
    <div className="w-full h-screen bg-[#060608] relative overflow-hidden font-inter text-gray-200">
      {notification && <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 bg-[#111] border border-[#444] text-white rounded-full font-cinzel text-xs shadow-2xl animate-bounce">{notification}</div>}
      
      <SideMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        onExport={handleExport} 
        onImport={handleImport} 
        onShare={handleShare} 
        onReset={() => setIsResetModalOpen(true)}
        onLoadCharacters={() => { setIsMenuOpen(false); setCharModalPurpose('load'); setIsCharModalOpen(true); }}
        onSaveClick={handleSaveClick}
        viewMode={viewMode}
        onViewChange={handleViewChange}
        stats={stats}
        remainingPA={remainingStats.pa}
        remainingPE={remainingStats.pe}
        activeCharacterName={activeCharacterName}
      />

      <CharacterModal 
        isOpen={isCharModalOpen} 
        onClose={() => !isSubmitting && setIsCharModalOpen(false)} 
        characters={characters} 
        onSelect={handleCharacterModalSelect}
        isLoading={isFetchingChars}
        isSubmitting={isSubmitting}
        purpose={charModalPurpose}
        activeCharacterName={activeCharacterName}
      />

      <ResetConfirmModal 
        isOpen={isResetModalOpen} 
        onClose={() => setIsResetModalOpen(false)} 
        onConfirm={handleExecuteReset} 
      />

      <ControlPanel 
        stats={stats} 
        remainingPA={remainingStats.pa} 
        remainingPE={remainingStats.pe} 
        onStatsChange={(k, v) => setStats(p => ({ ...p, [k]: v }))} 
        onMenuToggle={() => setIsMenuOpen(true)}
        onUndo={handleUndo}
        canUndo={history.length > 0}
        viewMode={viewMode}
        onViewChange={handleViewChange}
      />

      {viewMode === 'radial' ? (
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
            edgesFocusable={false}
            edgesUpdatable={false}
          >
            <Background color="#ffffff" variant={BackgroundVariant.Lines} gap={80} size={0.5} style={{ opacity: 0.02 }} />
            <RadialBackground />
            <Controls className="!bg-[#111] !border-[#333] !shadow-2xl" showInteractive={false} />
            <MiniMap nodeColor={(n) => (n.data as SkillNodeData).isActive ? '#fff' : '#222'} maskColor="rgba(0,0,0,0.8)" style={{ height: 120, width: 160 }} className="md:block hidden" />
          </ReactFlow>
          <DetailsPanel skill={selectedSkill} onClose={() => setSelectedSkillId(null)} onLearn={handleLearn} onForget={handleForget} canAfford={canAfford} />
        </div>
      ) : (
        <TableView 
          nodes={nodes} 
          onLearn={handleLearn} 
          onForget={handleForget} 
          remainingPA={remainingStats.pa} 
          remainingPE={remainingStats.pe} 
        />
      )}
    </div>
  );
};

const App = () => (
  <ReactFlowProvider>
    <SkillTreeSimulator />
  </ReactFlowProvider>
);

export default App;
