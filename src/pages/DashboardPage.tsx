import { useState, useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../lib/AuthContext';
import { Link } from '@tanstack/react-router';
import { MODELS, PROVIDERS, FEATURE_FILTERS } from '../data/models';
import ShinyButton from '../components/ShinyButton';
import {
  LayoutDashboard,
  KeyRound,
  Braces,
  FileText,
  CreditCard,
  User,
  LogOut,
  ChevronDown,
  Maximize2,
  X,
  Search,
  Crown,
  Eye,
  Key,
  Copy,
  Plus,
  MoreVertical,
  ArrowRight,
  MessageCircle,
  Send,
  Paperclip,
  Command,
  CornerDownLeft,
  Sparkles,
  ArrowUp,
  Brain,
  Image,
  ArrowUpDown,
  Box,
} from 'lucide-react';

const mockCreditBalance = 5000;

const mockDataByPeriod = {
  today: { totalSpent: 42, totalRequests: 28, topSpending: [58.9, 37.2, 26.4], topRequests: [245, 186, 142] },
  '7days': { totalSpent: 327, totalRequests: 651, topSpending: [58.9, 37.2, 26.4], topRequests: [245, 186, 142] },
  '30days': { totalSpent: 1280, totalRequests: 2847, topSpending: [234.5, 156.8, 98.2], topRequests: [1024, 876, 654] },
  custom: { totalSpent: 890, totalRequests: 1523, topSpending: [156.3, 98.7, 67.4], topRequests: [678, 543, 432] },
};

function getDisplayName(modelId: string) {
  const model = MODELS.find(m => m.id === modelId);
  return model ? model.displayName : modelId;
}

function StatCard({
  title,
  value,
  models,
  showAddButton,
  onAddClick,
  isRequestCard,
  onExpand,
}: {
  title: string;
  value: string;
  models: { modelId: string; value: number; color: string }[];
  showAddButton?: boolean;
  onAddClick?: () => void;
  isRequestCard?: boolean;
  onExpand?: () => void;
}) {
  const max = Math.max(...models.map(m => m.value), 0.01);

  return (
    <div className="rounded-xl bg-[#1a1a1e] border border-white/10 p-5 h-[264px] flex flex-col relative">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-white/60">{title}</div>
        <div className="flex items-center gap-2">
          {onExpand && (
            <button
              onClick={onExpand}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between mb-6">
        <div className="text-xl font-semibold text-white">{value}</div>
        {showAddButton && (
          <button
            onClick={onAddClick}
            className="px-3 py-1 rounded-full bg-white text-black text-xs font-medium hover:bg-gray-100 transition-colors shrink-0"
          >
            增加 Credit
          </button>
        )}
      </div>

      <div className="flex items-end gap-4 flex-1 pb-4">
        {models.map((m, i) => {
          const barHeight = (m.value / max) * 100;
          const displayName = getDisplayName(m.modelId);
          return (
            <div key={m.modelId} className="flex flex-col items-center gap-2 flex-1 h-full justify-end group/bar">
              <div className="w-full relative flex-1 flex items-end justify-center">
                <div className="absolute bottom-full mb-2 hidden group-hover/bar:block z-10">
                  <div className="rounded-lg bg-[#1a1a1e] border border-white/10 px-3 py-2 shadow-xl whitespace-nowrap">
                    {isRequestCard ? (
                      <>
                        <p className="text-xs text-white/70">{displayName}</p>
                        <p className="text-sm text-white font-semibold">{m.value.toLocaleString()} 次</p>
                      </>
                    ) : (
                      <>
                        <p className="text-xs text-white/70">{displayName}</p>
                        <p className="text-sm text-white font-semibold">{m.value} Credit</p>
                      </>
                    )}
                  </div>
                </div>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${barHeight}%` }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="w-full max-w-[48px] rounded-t-md cursor-pointer"
                  style={{
                    background: `linear-gradient(to top, ${m.color}30, ${m.color})`,
                  }}
                />
              </div>
              <span className="text-xs text-white/50 text-center truncate w-full leading-tight">{displayName}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type TimeRange = '7days' | '30days';

type ModelTimeSeriesData = {
  modelId: string;
  modelName: string;
  color: string;
  data: { date: string; value: number }[];
  total: number;
  avg: number;
  max: number;
  min: number;
};

function SpendingRankingModal({ onClose }: { onClose: () => void }) {
  const [timeRange, setTimeRange] = useState<TimeRange>('7days');
  const [hoveredModel, setHoveredModel] = useState<string | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{ modelId: string; index: number } | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<{ modelId: string; index: number } | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; model: string; date: string; value: number; color: string } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Reset selection when switching tabs
  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
    setSelectedPoint(null);
    setHoveredPoint(null);
    setHoveredModel(null);
    setTooltip(null);
  };

  // Generate mock data for the last 30 days
  const generateDateLabels = (days: number): string[] => {
    const labels: string[] = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      labels.push(`${date.getMonth() + 1}/${date.getDate()}`);
    }
    return labels;
  };

  const dateLabels = generateDateLabels(30);

  // Mock time series data for each model
  const modelData: ModelTimeSeriesData[] = [
    {
      modelId: 'gemini-3-1-pro',
      modelName: 'Gemini 3.1 Pro',
      color: '#9d82f5',
      data: dateLabels.map((date, i) => ({
        date,
        value: [8.5, 12.3, 6.7, 15.2, 9.8, 11.5, 7.3, 13.1, 8.9, 10.4, 14.2, 6.8, 9.5, 11.7, 8.2, 12.9, 7.6, 10.1, 13.5, 9.3, 8.7, 11.2, 14.8, 6.9, 10.5, 9.1, 12.4, 7.8, 11.6, 8.3][i] || Math.random() * 10 + 5,
      })),
      total: 298.5,
      avg: 9.95,
      max: 15.2,
      min: 6.7,
    },
    {
      modelId: 'qwen3-6-plus',
      modelName: 'Qwen3.6 Plus',
      color: '#a855f7',
      data: dateLabels.map((date, i) => ({
        date,
        value: [5.2, 7.8, 4.1, 9.5, 6.3, 8.1, 5.7, 7.9, 6.2, 8.4, 9.1, 4.8, 6.7, 7.3, 5.9, 8.6, 5.1, 7.2, 8.8, 6.4, 5.6, 7.7, 9.3, 4.5, 6.8, 6.1, 8.2, 5.4, 7.5, 5.8][i] || Math.random() * 6 + 3,
      })),
      total: 196.8,
      avg: 6.56,
      max: 9.5,
      min: 4.1,
    },
    {
      modelId: 'claude-haiku-4-5',
      modelName: 'Claude Haiku 4.5',
      color: '#b36cf7',
      data: dateLabels.map((date, i) => ({
        date,
        value: [3.8, 5.5, 2.9, 6.8, 4.2, 5.9, 3.5, 5.1, 4.5, 6.2, 6.9, 3.2, 4.8, 5.4, 4.1, 6.3, 3.7, 5.0, 6.5, 4.6, 4.0, 5.6, 6.7, 3.1, 4.9, 4.3, 5.8, 3.9, 5.3, 4.2][i] || Math.random() * 4 + 2,
      })),
      total: 145.6,
      avg: 4.85,
      max: 6.9,
      min: 2.9,
    },
    {
      modelId: 'glm-5-1',
      modelName: 'GLM 5.1',
      color: '#be83f9',
      data: dateLabels.map((date, i) => ({
        date,
        value: [2.5, 4.1, 1.8, 5.2, 3.0, 4.3, 2.7, 3.9, 3.2, 4.5, 5.1, 2.1, 3.5, 4.0, 2.9, 4.6, 2.4, 3.7, 4.8, 3.3, 2.8, 4.0, 5.0, 2.0, 3.6, 3.1, 4.2, 2.6, 3.8, 2.9][i] || Math.random() * 3 + 1.5,
      })),
      total: 102.4,
      avg: 3.41,
      max: 5.2,
      min: 1.8,
    },
    {
      modelId: 'gpt-5-3-codex',
      modelName: 'GPT-5.3 Codex',
      color: '#c99afb',
      data: dateLabels.map((date, i) => ({
        date,
        value: [4.2, 6.8, 3.5, 8.1, 5.2, 6.5, 4.6, 6.9, 5.3, 7.1, 7.8, 3.9, 5.5, 6.3, 4.8, 7.2, 4.1, 5.9, 7.4, 5.1, 4.5, 6.4, 7.6, 3.7, 5.7, 5.0, 6.7, 4.3, 6.1, 4.7][i] || Math.random() * 5 + 2.5,
      })),
      total: 167.3,
      avg: 5.58,
      max: 8.1,
      min: 3.5,
    },
  ];

  const displayData = timeRange === '7days' 
    ? modelData.map(m => ({ ...m, data: m.data.slice(-7) }))
    : modelData;

  const filteredData = displayData;

  // Chart dimensions
  const chartWidth = 840;
  const chartHeight = 320;
  const padding = { top: 20, right: 30, bottom: 50, left: 60 };
  const graphWidth = chartWidth - padding.left - padding.right;
  const graphHeight = chartHeight - padding.top - padding.bottom;

  // Calculate scales
  const allValues = filteredData.flatMap(m => m.data.map(d => d.value));
  const maxValue = Math.max(...allValues) * 1.1;
  const minValue = 0;

  const xScale = (index: number) => padding.left + (index / (filteredData[0]?.data.length - 1 || 1)) * graphWidth;
  const yScale = (value: number) => padding.top + graphHeight - ((value - minValue) / (maxValue - minValue)) * graphHeight;

  // Generate path for each model
  const generatePath = (data: { date: string; value: number }[]) => {
    return data.map((d, i) => {
      const x = xScale(i);
      const y = yScale(d.value);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  // Generate area path
  const generateAreaPath = (data: { date: string; value: number }[]) => {
    const linePath = generatePath(data);
    const lastX = xScale(data.length - 1);
    const firstX = xScale(0);
    const bottomY = padding.top + graphHeight;
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  // Smart snap mechanism: prioritize clicked node, then same model horizontal, then cross-model
  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate all data point positions
    const allPoints: {
      modelId: string;
      modelName: string;
      modelColor: string;
      index: number;
      x: number;
      y: number;
      value: number;
      date: string;
    }[] = [];
    
    filteredData.forEach(model => {
      model.data.forEach((d, i) => {
        allPoints.push({
          modelId: model.modelId,
          modelName: model.modelName,
          modelColor: model.color,
          index: i,
          x: xScale(i),
          y: yScale(d.value),
          value: d.value,
          date: d.date,
        });
      });
    });
    
    // Priority 1: If a node is selected (clicked), prioritize horizontal snap within same model
    if (selectedPoint) {
      const selectedModelPoints = allPoints.filter(p => p.modelId === selectedPoint.modelId);
      const selectedModel = filteredData.find(m => m.modelId === selectedPoint.modelId);
      
      if (selectedModel && selectedModelPoints.length > 0) {
        // Calculate vertical range of selected model
        const modelMinY = Math.min(...selectedModelPoints.map(p => p.y)) - 40;
        const modelMaxY = Math.max(...selectedModelPoints.map(p => p.y)) + 40;
        
        // If mouse is within selected model's vertical range, only snap to same model points
        if (mouseY >= modelMinY && mouseY <= modelMaxY) {
          // Find nearest point in same model (strong horizontal bias)
          let nearestPoint = selectedModelPoints[0];
          let minDistance = Infinity;
          
          selectedModelPoints.forEach(point => {
            const dx = mouseX - point.x;
            const dy = mouseY - point.y;
            // Heavy horizontal bias: weight x-distance much more than y-distance
            const distance = Math.abs(dx) * 0.3 + Math.abs(dy) * 1.5;
            
            if (distance < minDistance) {
              minDistance = distance;
              nearestPoint = point;
            }
          });
          
          if (minDistance <= 60) {
            setHoveredModel(nearestPoint.modelId);
            setHoveredPoint({ modelId: nearestPoint.modelId, index: nearestPoint.index });
            setTooltip({
              x: nearestPoint.x,
              y: nearestPoint.y,
              model: nearestPoint.modelName,
              date: nearestPoint.date,
              value: nearestPoint.value,
              color: nearestPoint.modelColor,
            });
            return;
          }
        }
        // If outside vertical range, clear selection and allow cross-model
      }
    }
    
    // Priority 2: Check for direct node hover (click-level precision with smaller radius)
    let directHitPoint: typeof allPoints[0] | null = null;
    let directHitDistance = Infinity;
    
    allPoints.forEach(point => {
      const dx = mouseX - point.x;
      const dy = mouseY - point.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < directHitDistance && distance <= 20) { // 20px for direct hover
        directHitDistance = distance;
        directHitPoint = point;
      }
    });
    
    if (directHitPoint) {
      setHoveredModel(directHitPoint.modelId);
      setHoveredPoint({ modelId: directHitPoint.modelId, index: directHitPoint.index });
      setTooltip({
        x: directHitPoint.x,
        y: directHitPoint.y,
        model: directHitPoint.modelName,
        date: directHitPoint.date,
        value: directHitPoint.value,
        color: directHitPoint.modelColor,
      });
      return;
    }
    
    // Priority 3: General proximity snap (50px radius)
    let nearestPoint = allPoints[0];
    let minDistance = Infinity;
    
    allPoints.forEach(point => {
      const dx = mouseX - point.x;
      const dy = mouseY - point.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < minDistance) {
        minDistance = distance;
        nearestPoint = point;
      }
    });
    
    if (minDistance <= 50) {
      setHoveredModel(nearestPoint.modelId);
      setHoveredPoint({ modelId: nearestPoint.modelId, index: nearestPoint.index });
      setTooltip({
        x: nearestPoint.x,
        y: nearestPoint.y,
        model: nearestPoint.modelName,
        date: nearestPoint.date,
        value: nearestPoint.value,
        color: nearestPoint.modelColor,
      });
    } else {
      setHoveredPoint(null);
      setTooltip(null);
    }
  };
  
  const handlePointClick = (model: ModelTimeSeriesData, pointIndex: number) => {
    setSelectedPoint({ modelId: model.modelId, index: pointIndex });
    setHoveredModel(model.modelId);
    setHoveredPoint({ modelId: model.modelId, index: pointIndex });
    
    const dataPoint = model.data[pointIndex];
    if (dataPoint) {
      setTooltip({
        x: xScale(pointIndex),
        y: yScale(dataPoint.value),
        model: model.modelName,
        date: dataPoint.date,
        value: dataPoint.value,
        color: model.color,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-[960px] rounded-2xl bg-[#1a1a1e] border border-white/10 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h3 className="text-lg font-medium text-white">模型費用趨勢</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-white/5">
          <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
            <button
              onClick={() => handleTimeRangeChange('7days')}
              className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
                timeRange === '7days'
                  ? 'bg-[#9d82f5] text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              最近7天
            </button>
            <button
              onClick={() => handleTimeRangeChange('30days')}
              className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
                timeRange === '30days'
                  ? 'bg-[#9d82f5] text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              最近30天
            </button>
          </div>
        </div>

        {/* Line Chart */}
        <div className="px-5 py-4">
          <div className="relative" style={{ width: chartWidth, height: chartHeight }}>
            <svg
              ref={svgRef}
              width={chartWidth}
              height={chartHeight}
              className="overflow-visible cursor-crosshair"
              onMouseMove={handleSvgMouseMove}
              onMouseLeave={() => { setHoveredModel(null); setHoveredPoint(null); setTooltip(null); }}
            >
              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                const y = padding.top + graphHeight * ratio;
                const value = maxValue * (1 - ratio);
                return (
                  <g key={i}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={padding.left + graphWidth}
                      y2={y}
                      stroke="rgba(255,255,255,0.05)"
                      strokeDasharray="4,4"
                    />
                    <text
                      x={padding.left - 10}
                      y={y + 4}
                      textAnchor="end"
                      fill="rgba(255,255,255,0.3)"
                      fontSize="11"
                    >
                      {value.toFixed(0)}
                    </text>
                  </g>
                );
              })}

              {/* X-axis labels */}
              {filteredData[0]?.data.map((d, i) => {
                const showLabel = timeRange === '7days' 
                  ? true 
                  : i % 5 === 0 || i === filteredData[0].data.length - 1;
                if (!showLabel) return null;
                return (
                  <text
                    key={i}
                    x={xScale(i)}
                    y={chartHeight - 15}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.3)"
                    fontSize="11"
                  >
                    {d.date}
                  </text>
                );
              })}

              {/* Area fills */}
              {filteredData.map((model) => (
                <path
                  key={`area-${model.modelId}`}
                  d={generateAreaPath(model.data)}
                  fill={model.color}
                  opacity={hoveredModel === model.modelId ? 0.15 : hoveredModel ? 0.03 : 0.08}
                  className="transition-opacity duration-200"
                />
              ))}

              {/* Lines */}
              {filteredData.map((model) => (
                <path
                  key={`line-${model.modelId}`}
                  d={generatePath(model.data)}
                  fill="none"
                  stroke={model.color}
                  strokeWidth={hoveredModel === model.modelId ? 3 : 2}
                  opacity={hoveredModel === model.modelId ? 1 : hoveredModel ? 0.3 : 0.8}
                  className="transition-all duration-200"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}

              {/* Vertical guide line */}
              {hoveredPoint && (() => {
                const model = filteredData.find(m => m.modelId === hoveredPoint.modelId);
                if (!model) return null;
                const x = xScale(hoveredPoint.index);
                return (
                  <line
                    x1={x}
                    y1={padding.top}
                    x2={x}
                    y2={padding.top + graphHeight}
                    stroke="rgba(255,255,255,0.1)"
                    strokeDasharray="4,4"
                    className="pointer-events-none"
                  />
                );
              })()}

              {/* Data points with enhanced interaction */}
              {filteredData.map((model) =>
                model.data.map((d, i) => {
                  const isHovered = hoveredPoint?.modelId === model.modelId && hoveredPoint?.index === i;
                  const isModelHovered = hoveredModel === model.modelId;
                  const showPoint = isHovered || isModelHovered || !hoveredModel;
                  
                  const isSelected = selectedPoint?.modelId === model.modelId && selectedPoint?.index === i;
                  
                  return (
                    <g key={`point-group-${model.modelId}-${i}`}>
                      {/* Selected indicator ring */}
                      {isSelected && (
                        <circle
                          cx={xScale(i)}
                          cy={yScale(d.value)}
                          r={14}
                          fill="none"
                          stroke={model.color}
                          strokeWidth={2}
                          strokeDasharray="4,4"
                          opacity={0.6}
                          className="pointer-events-none"
                        />
                      )}
                      {/* Outer glow ring on hover */}
                      {isHovered && (
                        <circle
                          cx={xScale(i)}
                          cy={yScale(d.value)}
                          r={10}
                          fill={model.color}
                          opacity={0.2}
                          className="pointer-events-none"
                        />
                      )}
                      {/* Main data point */}
                      <circle
                        cx={xScale(i)}
                        cy={yScale(d.value)}
                        r={isHovered ? 6 : isModelHovered ? 4 : 3}
                        fill={isHovered ? '#fff' : model.color}
                        stroke={model.color}
                        strokeWidth={isHovered ? 3 : 2}
                        opacity={showPoint ? 1 : 0.4}
                        className="cursor-pointer"
                        onClick={() => handlePointClick(model, i)}
                      />
                    </g>
                  );
                })
              )}
            </svg>

            {/* Enhanced Tooltip - positioned above the data point */}
            {tooltip && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute pointer-events-none rounded-xl px-4 py-3 shadow-2xl z-10"
                style={{ 
                  left: tooltip.x,
                  top: tooltip.y,
                  transform: 'translate(-50%, -120%)',
                  background: 'linear-gradient(135deg, rgba(26,26,30,0.95) 0%, rgba(26,26,30,0.98) 100%)',
                  border: `1px solid ${tooltip.color}40`,
                  boxShadow: `0 8px 32px ${tooltip.color}20`,
                }}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: tooltip.color }}
                  />
                  <span className="text-xs text-white/60 font-medium">{tooltip.date}</span>
                </div>
                <div className="text-sm text-white font-semibold mb-0.5">{tooltip.model}</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold" style={{ color: tooltip.color }}>
                    {tooltip.value.toFixed(2)}
                  </span>
                  <span className="text-xs text-white/40">Credit</span>
                </div>
                {/* Arrow pointing down to the data point */}
                <div 
                  className="absolute left-1/2 -bottom-1 w-2 h-2 -translate-x-1/2 rotate-45"
                  style={{ 
                    backgroundColor: 'rgba(26,26,30,0.95)',
                    borderRight: `1px solid ${tooltip.color}40`,
                    borderBottom: `1px solid ${tooltip.color}40`,
                  }}
                />
              </motion.div>
            )}
          </div>
        </div>

        {/* Legend & Stats */}
        <div className="px-5 py-4 border-t border-white/5">
          <div className="grid grid-cols-5 gap-3">
            {filteredData.map((model) => (
              <div
                key={model.modelId}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  hoveredModel === model.modelId
                    ? 'bg-white/10 border-white/20'
                    : 'bg-white/5 border-white/5 hover:bg-white/8'
                }`}
                onMouseEnter={() => setHoveredModel(model.modelId)}
                onMouseLeave={() => setHoveredModel(null)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: model.color }}
                  />
                  <span className="text-xs text-white font-medium truncate">{model.modelName}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-white/40">總計</span>
                    <span className="text-white/70">{model.total.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-white/40">平均</span>
                    <span className="text-white/70">{model.avg.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-white/40">最高</span>
                    <span className="text-white/70">{model.max.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RequestRankingModal({ onClose }: { onClose: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [sortOpen, setSortOpen] = useState(false);

  const rankings = [
    { modelId: 'gemini-3-1-pro', count: 1024, color: '#9d82f5' },
    { modelId: 'qwen3-6-plus', count: 876, color: '#a855f7' },
    { modelId: 'claude-haiku-4-5', count: 654, color: '#b36cf7' },
    { modelId: 'glm-5-1', count: 543, color: '#be83f9' },
    { modelId: 'gpt-5-3-codex', count: 432, color: '#c99afb' },
  ];

  const filtered = rankings.filter(r =>
    getDisplayName(r.modelId).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) =>
    sortOrder === 'desc' ? b.count - a.count : a.count - b.count
  );

  const maxCount = Math.max(...rankings.map(r => r.count));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-[700px] rounded-2xl bg-[#1a1a1e] border border-white/10 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/0">
          <h3 className="text-lg font-medium text-white">總請求數排行</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3 px-5 py-3 border-b border-white/0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="搜尋模型..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/70 placeholder:text-white/30 focus:outline-none focus:border-[#9d82f5]/50 transition-colors"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/60 hover:text-white/80 transition-colors"
            >
              <span>{sortOrder === 'desc' ? '從高到低' : '從低到高'}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
            </button>
            {sortOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setSortOpen(false)} />
                <div className="absolute top-full right-0 mt-2 w-40 rounded-lg bg-[#1a1a1e] border border-white/10 shadow-xl z-50 overflow-hidden">
                  <button
                    onClick={() => { setSortOrder('desc'); setSortOpen(false); }}
                    className={`w-full px-4 py-2.5 text-sm text-left transition-colors ${sortOrder === 'desc' ? 'bg-[#9d82f5]/15 text-[#9d82f5]' : 'text-white/60 hover:bg-white/5'}`}
                  >
                    從高到低
                  </button>
                  <button
                    onClick={() => { setSortOrder('asc'); setSortOpen(false); }}
                    className={`w-full px-4 py-2.5 text-sm text-left transition-colors ${sortOrder === 'asc' ? 'bg-[#9d82f5]/15 text-[#9d82f5]' : 'text-white/60 hover:bg-white/5'}`}
                  >
                    從低到高
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-5 py-4 space-y-3">
          {sorted.map((r, i) => {
            const displayName = getDisplayName(r.modelId);
            const barWidth = (r.count / maxCount) * 100;
            return (
              <div key={r.modelId} className="flex items-center gap-3">
                <span className="text-xs text-white/30 w-4 text-right shrink-0">{i + 1}</span>
                <div className="flex-1 h-5 rounded-full overflow-hidden relative bg-white/[0.03]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidth}%` }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(to right, ${r.color}60, ${r.color})` }}
                  />
                </div>
                <span className="text-[16px] text-white/60 truncate w-[140px] shrink-0 text-right">{displayName}</span>
                <span className="text-[14px] text-white/40 w-[80px] text-right shrink-0">{r.count} 次</span>
              </div>
            );
          })}
          {sorted.length === 0 && (
            <div className="flex items-center justify-center h-32 text-white/30 text-sm">無符合條件的模型</div>
          )}
        </div>
      </div>
    </div>
  );
}

function ModelServerStatus({ onShowAll }: { onShowAll: () => void }) {
  const [showNormalOnly, setShowNormalOnly] = useState(false);

  const serverModels = MODELS.map(m => ({
    name: m.displayName,
    status: m.id === 'gemini-3-1-pro' || m.id === 'gpt-5-3-codex' || m.id === 'gemini-3-pro' ? 'busy' as const : 'normal' as const,
    usage: Math.floor(Math.random() * 30) + 1,
  }));

  const filtered = serverModels
    .filter(m => !showNormalOnly || m.status === 'normal')
    .sort((a, b) => b.usage - a.usage);

  return (
    <div className="rounded-xl bg-[#1a1a1e] border border-white/10 p-5 h-[264px] flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-white/60">模型伺服器狀態</h3>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-xs text-white/40">僅顯示正常</span>
            <div
              onClick={() => setShowNormalOnly(!showNormalOnly)}
              className={`relative w-9 h-5 rounded-full transition-colors ${
                showNormalOnly ? 'bg-[#9d82f5]' : 'bg-white/20'
              }`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                  showNormalOnly ? 'translate-x-4' : 'translate-x-0.5'
                }`}
              />
            </div>
          </label>
          <button
            onClick={onShowAll}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-1.5 flex-1 overflow-y-auto pr-1 custom-scrollbar">
        {filtered.map(m => (
          <div key={m.name} className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-2 h-2 rounded-full shrink-0 ${m.status === 'busy' ? 'bg-red-500' : 'bg-[#9d82f5]'}`} />
              <span className="text-xs text-white/60 truncate">{m.name}</span>
            </div>
            <span className={`text-xs font-medium shrink-0 ml-2 px-2 py-0.5 rounded-full ${
              m.status === 'busy' ? 'bg-red-500/15 text-red-400' : 'bg-[#9d82f5]/15 text-[#9d82f5]'
            }`}>
              {m.status === 'busy' ? '繁忙' : '正常'}
            </span>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="flex items-center justify-center h-20 text-white/30 text-xs">無符合條件的模型</div>
        )}
      </div>
    </div>
  );
}

function AllModelsModal({ onClose }: { onClose: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNormalOnly, setShowNormalOnly] = useState(false);

  const serverModels = MODELS.map(m => ({
    name: m.displayName,
    status: m.id === 'gemini-3-1-pro' || m.id === 'gpt-5-3-codex' || m.id === 'gemini-3-pro' ? 'busy' as const : 'normal' as const,
    usage: Math.floor(Math.random() * 30) + 1,
  }));

  const filtered = serverModels
    .filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(m => !showNormalOnly || m.status === 'normal');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-[500px] rounded-2xl bg-[#1a1a1e] border border-white/10 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/0">
          <h3 className="text-sm font-medium text-white/60">所有模型伺服器狀態</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-3 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="搜尋模型..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/70 placeholder:text-white/30 focus:outline-none focus:border-[#9d82f5]/50 transition-colors"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer shrink-0">
              <span className="text-xs text-white/40">僅顯示正常</span>
              <div
                onClick={() => setShowNormalOnly(!showNormalOnly)}
                className={`relative w-9 h-5 rounded-full transition-colors ${
                  showNormalOnly ? 'bg-[#9d82f5]' : 'bg-white/20'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    showNormalOnly ? 'translate-x-4' : 'translate-x-0.5'
                  }`}
                />
              </div>
            </label>
          </div>
        </div>

        <div className="max-h-[50vh] overflow-y-auto px-5 py-3 space-y-1.5">
          {filtered.sort((a, b) => b.usage - a.usage).map((m, i) => (
            <div key={m.name} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs text-white/20 w-5 shrink-0">{i + 1}</span>
                <div className={`w-2 h-2 rounded-full shrink-0 ${m.status === 'busy' ? 'bg-red-500' : 'bg-[#9d82f5]'}`} />
                <span className="text-xs text-white/60 truncate">{m.name}</span>
              </div>
              <span className={`text-xs font-medium shrink-0 ml-2 px-2 py-0.5 rounded-full ${
                m.status === 'busy' ? 'bg-red-500/15 text-red-400' : 'bg-[#9d82f5]/15 text-[#9d82f5]'
              }`}>
                {m.status === 'busy' ? '繁忙' : '正常'}
              </span>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="flex items-center justify-center h-20 text-white/30 text-xs">無符合條件的模型</div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-white/10 flex items-center justify-end">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#9d82f5]" />
              <span className="text-xs text-white/40">正常</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-xs text-white/40">繁忙</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BuyCreditModal({ onClose }: { onClose: () => void }) {
  const [selectedPrice, setSelectedPrice] = useState(5);

  const priceMap: Record<number, number> = {
    5: 500,
    10: 1030,
    20: 2050,
  };

  const selectedCredits = priceMap[selectedPrice] || 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-[640px] rounded-2xl bg-[#1a1a1e] border border-white/10 shadow-2xl overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/60 transition-colors">
          <X className="w-4 h-4" />
        </button>

        <div className="px-8 pt-8 pb-4">
          <h3 className="text-[18px] font-semibold text-white mb-1">购买更多的Credit</h3>
        </div>

        <div className="text-center py-6">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-6xl font-bold text-white/30">$</span>
            <span className="text-7xl font-bold tracking-tight text-white">{selectedPrice}</span>
          </div>
          <div className="mt-2 text-lg text-white/50">{selectedCredits} credits</div>
        </div>

        <div className="px-8 pb-6">
          <div className="grid grid-cols-3 gap-3">
            {[
              { price: 5, credits: 500 },
              { price: 10, credits: 1030 },
              { price: 20, credits: 2050 },
            ].map((option) => (
              <button
                key={option.price}
                onClick={() => setSelectedPrice(option.price)}
                className={`relative rounded-xl border-2 p-4 transition-all text-center ${
                  selectedPrice === option.price
                    ? 'border-[#9d82f5] bg-[#9d82f5]/10'
                    : 'border-white/10 bg-[#1a1a1e] hover:border-white/20'
                }`}
              >
                <div className="text-[18px] font-semibold text-white">${option.price}</div>
                <div className="mt-0.5 text-[14px] text-white/30">{option.credits}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="px-8 pb-8">
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-xl bg-[#9d82f5] text-white text-base font-medium hover:bg-[#8b6de8] transition-colors flex items-center justify-center gap-2"
          >
            立即充值
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ModelsCenterPage Component (based on ModelsPage)
const THEME = '#9d82f5';
const opus47Price = 1650;

const modelCreditPrices: Record<string, number> = {
  'claude-opus-4-6': 1650, 'claude-sonnet-4-6': 990, 'claude-haiku-4-6': 324, 'claude-haiku-4-5': 280,
  'gpt-5-4': 963, 'gpt-5-3-codex': 688, 'gpt-5-4-mini': 963, 'gemini-3-1-pro': 770,
  'gemini-3-flash': 193, 'gemini-3-1-flash-imagen': 144, 'gemini-3-pro': 850, 'qwen3-6-plus': 107,
  'qwen3-5-plus': 63, 'qwen3-coder-next': 45, 'qwen3-coder-plus': 1200, 'qwen3-max': 950,
  'glm-5-1': 242, 'glm-5': 226, 'glm-4-7': 212, 'glm-4-6': 202, 'glm-5-turbo': 180,
  'minimax-m2-7': 85, 'minimax-m2-5': 85, 'minimax-image-01': 42, 'minimax-m2-7-highspeed': 75,
  'minimax-m2-5-highspeed': 75, 'kimi-k2-5': 202, 'kimi-k2-6': 190, 'deepseek-chat-search': 120,
  'deepseek-expert-chat-search': 150, 'deepseek-expert-reasoner-search': 180, 'deepseek-reasoner-search': 140,
  'deepseek-vision-chat-search': 130, 'deepseek-vision-reasoner-search': 160, 'grok-4-20': 110,
  'grok-4-20-auto': 105, 'grok-4-20-expert': 130, 'grok-4-20-non-reasoning': 80, 'grok-4-20-reasoning': 140,
};

type SortOption = 'capability' | 'price' | 'speed';

function getFilterIcon(icon: string) {
  switch (icon) {
    case 'brain': return <Brain className="w-4 h-4" />;
    case 'image': return <Image className="w-4 h-4" />;
    default: return null;
  }
}

function ModelCardSimple({ model }: { model: typeof MODELS[0] }) {
  const creditPrice = modelCreditPrices[model.id] || 0;
  const priceScore = Math.round((creditPrice / opus47Price) * 100);

  return (
    <div className="group rounded-[20px] bg-[#1a1a1e] border border-white/10 p-6 flex flex-col h-full transition-all duration-300 hover:border-white/20 hover:shadow-lg hover:shadow-white/5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img src={model.providerLogo} alt={model.providerLabel} className="w-6 h-6 object-contain" />
          <span className="text-[11px] font-medium text-white/40 uppercase tracking-wider">{model.providerLabel}</span>
        </div>
        <div className="relative group/quota">
          <div className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-[12px] font-medium text-white/70 border border-white/10">
            <div className="w-4 h-4 rounded-full border-2 border-white/20" style={{ borderColor: THEME }} />
            <span>{Math.round(mockCreditBalance / (creditPrice || 100) * 10) / 10}</span>
          </div>
          {/* Hover Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-[#1a1a1e] border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover/quota:opacity-100 group-hover/quota:visible transition-all duration-200 z-20 whitespace-nowrap">
            <span className="text-[12px] text-white/70">当前Credit预估可使用该模型：<span className="font-medium" style={{ color: THEME }}>{Math.round(mockCreditBalance / (creditPrice || 100))}</span> 次</span>
          </div>
        </div>
      </div>

      <h3 className="text-[17px] font-semibold text-white leading-tight mb-3">{model.displayName}</h3>
      <p className="text-[13px] text-white/50 leading-relaxed mb-5 line-clamp-2">{model.description}</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {model.features.map((feature, index) => (
          <span key={index} className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium ${feature.includes('图片') ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'}`}>
            <Brain className="w-3 h-3" />
            {feature}
          </span>
        ))}
      </div>

      <div className="space-y-4">
        <div className="w-full">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] text-white/50">能力</span>
            <span className="text-[13px] font-medium text-white/70">{model.capabilityScore}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${model.capabilityScore}%`, backgroundColor: THEME }} />
          </div>
        </div>
        <div className="w-full">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] text-white/50">速度</span>
            <span className="text-[13px] font-medium text-white/70">{model.speedScore}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${model.speedScore}%`, backgroundColor: THEME }} />
          </div>
        </div>
        <div className="w-full">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] text-white/50">價格</span>
            <span className="text-[13px] font-medium text-white/70">{priceScore}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${priceScore}%`, backgroundColor: THEME }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ModelsCenterPage() {
  const [selectedProvider, setSelectedProvider] = useState('all');
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('capability');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showProviderDropdown, setShowProviderDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const providerRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (providerRef.current && !providerRef.current.contains(event.target as Node)) setShowProviderDropdown(false);
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) setShowSortDropdown(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredAndSortedModels = useMemo(() => {
    let filtered = [...MODELS];
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(m => m.displayName.toLowerCase().includes(query) || m.providerLabel.toLowerCase().includes(query) || m.description.toLowerCase().includes(query));
    }
    if (selectedProvider !== 'all') filtered = filtered.filter(m => m.provider === selectedProvider);
    if (selectedFeature !== null) {
      filtered = filtered.filter(m => m.features.some(f => {
        if (selectedFeature === 'reasoning') return f.includes('推理');
        if (selectedFeature === 'image') return f.includes('图片');
        return false;
      }));
    }
    filtered.sort((a, b) => {
      let aVal: number, bVal: number;
      switch (sortBy) {
        case 'capability': aVal = a.capabilityScore; bVal = b.capabilityScore; break;
        case 'speed': aVal = a.speedScore; bVal = b.speedScore; break;
        case 'price': aVal = modelCreditPrices[a.id] || 0; bVal = modelCreditPrices[b.id] || 0; break;
        default: return 0;
      }
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    });
    return filtered;
  }, [selectedProvider, selectedFeature, sortBy, sortOrder, searchQuery]);

  const handleSortChange = (option: SortOption) => {
    if (sortBy === option) setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    else { setSortBy(option); setSortOrder('desc'); }
    setShowSortDropdown(false);
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case 'capability': return '能力';
      case 'price': return '價格';
      case 'speed': return '速度';
      default: return '';
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar">
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative" ref={providerRef}>
          <button
            onClick={() => setShowProviderDropdown(!showProviderDropdown)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1a1a1e] border border-white/10 text-sm text-white/70 hover:border-white/20 transition-colors"
          >
            {selectedProvider !== 'all' && <img src={PROVIDERS.find(p => p.value === selectedProvider)?.logo} alt="" className="w-4 h-4 object-contain" />}
            <span>{PROVIDERS.find(p => p.value === selectedProvider)?.label}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          {showProviderDropdown && (
            <div className="absolute top-full left-0 mt-2 w-56 rounded-[16px] bg-[#1a1a1e] border border-white/10 shadow-xl overflow-hidden z-20">
              {PROVIDERS.map(provider => (
                <button
                  key={provider.value}
                  onClick={() => { setSelectedProvider(provider.value); setShowProviderDropdown(false); }}
                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-3 rounded-[16px] ${selectedProvider === provider.value ? 'text-white bg-[#212124]' : 'text-white/70 hover:bg-[#212124]'}`}
                >
                  {provider.logo && <img src={provider.logo} alt="" className="w-5 h-5 object-contain" />}
                  {!provider.logo && <span className="w-5 h-5" />}
                  {provider.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {FEATURE_FILTERS.map(feature => (
            <button
              key={feature.value}
              onClick={() => setSelectedFeature(selectedFeature === feature.value ? null : feature.value)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-colors ${selectedFeature === feature.value ? 'text-white' : 'border border-white/20 text-white/70 hover:bg-white/10'}`}
              style={selectedFeature === feature.value ? { backgroundColor: THEME } : {}}
            >
              {getFilterIcon(feature.icon)}
              {feature.label}
            </button>
          ))}
        </div>

        <div className="lg:ml-auto" />

        <div className="relative flex items-center" style={{ flexShrink: 0 }}>
          <div className="overflow-hidden rounded-full bg-[#1a1a1e] border border-white/10 transition-all duration-300 ease-out" style={{ width: showSearch ? '256px' : '40px', height: '40px' }}>
            {!showSearch ? (
              <button onClick={() => setShowSearch(true)} className="flex items-center justify-center w-10 h-10 text-white/70 hover:text-white transition-colors">
                <Search className="w-4 h-4" style={{ color: 'rgba(255, 255, 255, 0.7)' }} />
              </button>
            ) : (
              <div className="relative h-full flex items-center">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text" autoFocus placeholder="Search models..." value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={() => { if (!searchQuery) setShowSearch(false); }}
                  className="pl-9 pr-8 py-2 w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
                  style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="relative ml-2" ref={sortRef}>
          <button onClick={() => setShowSortDropdown(!showSortDropdown)} className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1a1a1e] border border-white/10 text-sm text-white/70 hover:border-white/20 transition-colors">
            <ArrowUpDown className="w-4 h-4" />
            <span>{getSortLabel()}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          {showSortDropdown && (
            <div className="absolute top-full right-0 mt-2 w-48 rounded-[16px] bg-[#1a1a1e] border border-white/10 shadow-xl overflow-hidden z-20">
              {[{ value: 'capability' as SortOption, label: '能力' }, { value: 'price' as SortOption, label: '價格' }, { value: 'speed' as SortOption, label: '速度' }].map(option => (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors rounded-[16px] ${sortBy === option.value ? 'text-white bg-[#212124]' : 'text-white/70 hover:bg-[#212124]'}`}
                >
                  {option.label} {sortBy === option.value && (sortOrder === 'desc' ? '↓' : '↑')}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <span className="text-[13px] text-white/40">顯示 {filteredAndSortedModels.length} 個模型</span>
      </div>

      {filteredAndSortedModels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 pb-8">
          {filteredAndSortedModels.map(model => <ModelCardSimple key={model.id} model={model} />)}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-white/40 text-[15px]">沒有符合條件的模型</p>
        </div>
      )}
    </div>
  );
}

function ActivityLogPage({ compact, onNavigate }: { compact?: boolean; onNavigate?: (page: Page) => void }) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [statusOpen, setStatusOpen] = useState(false);

  // Helper function to get model logo by display name
  const getModelLogo = (displayName: string): string => {
    const model = MODELS.find(m => m.displayName === displayName);
    return model?.providerLogo || '';
  };

  const mockLogs = [
    { time: '2026-04-24 15:39:05', api: 'honstin 測試', model: 'Claude Opus 4.6', duration: '16 s', firstToken: '8.3 s', status: '成功', credits: 8.2 },
    { time: '2026-04-24 15:38:49', api: '1776913908', model: 'Claude Opus 4.6', duration: '6 s', firstToken: '4.4 s', status: '成功', credits: 3.5 },
    { time: '2026-04-24 15:38:43', api: 'honstin 測試', model: 'Claude Opus 4.6', duration: '13 s', firstToken: '5.1 s', status: '成功', credits: 12.0 },
    { time: '2026-04-24 15:37:22', api: '1776911904', model: 'Gemini 3.1 Pro', duration: '8 s', firstToken: '3.2 s', status: '成功', credits: 6.7 },
    { time: '2026-04-24 15:36:15', api: '123', model: 'Qwen3.6 Plus', duration: '4 s', firstToken: '1.8 s', status: '成功', credits: 2.1 },
    { time: '2026-04-24 15:35:01', api: '1122', model: 'Gemini 3.1 Pro', duration: '11 s', firstToken: '6.7 s', status: '錯誤', credits: 0.0 },
    { time: '2026-04-24 15:34:30', api: 'qwe', model: 'GLM 5.1', duration: '5 s', firstToken: '2.1 s', status: '成功', credits: 4.3 },
    { time: '2026-04-24 15:33:18', api: '12312321', model: 'GPT-5.4', duration: '7 s', firstToken: '3.5 s', status: '成功', credits: 9.8 },
    { time: '2026-04-24 15:32:45', api: 'honstin 測試', model: 'Claude Opus 4.6', duration: '9 s', firstToken: '4.8 s', status: '成功', credits: 7.1 },
    { time: '2026-04-24 15:31:22', api: '1776913908', model: 'Gemini 3.1 Pro', duration: '12 s', firstToken: '5.9 s', status: '成功', credits: 5.6 },
    { time: '2026-04-24 15:30:10', api: '1776911904', model: 'Qwen3.6 Plus', duration: '3 s', firstToken: '1.2 s', status: '成功', credits: 1.8 },
    { time: '2026-04-24 15:29:55', api: '123', model: 'GPT-5.4', duration: '15 s', firstToken: '7.8 s', status: '成功', credits: 11.5 },
    { time: '2026-04-24 15:28:33', api: '1122', model: 'GLM 5.1', duration: '6 s', firstToken: '2.9 s', status: '成功', credits: 3.2 },
    { time: '2026-04-24 15:27:19', api: 'qwe', model: 'Claude Opus 4.6', duration: '10 s', firstToken: '5.3 s', status: '錯誤', credits: 0.0 },
    { time: '2026-04-24 15:26:08', api: '12312321', model: 'Gemini 3.1 Pro', duration: '8 s', firstToken: '4.1 s', status: '成功', credits: 6.4 },
    { time: '2026-04-24 15:25:42', api: 'honstin 測試', model: 'Qwen3.6 Plus', duration: '5 s', firstToken: '2.3 s', status: '成功', credits: 2.9 },
    { time: '2026-04-24 15:24:15', api: '1776913908', model: 'GPT-5.4', duration: '14 s', firstToken: '6.5 s', status: '成功', credits: 10.7 },
    { time: '2026-04-24 15:23:03', api: '1776911904', model: 'Claude Opus 4.6', duration: '7 s', firstToken: '3.7 s', status: '成功', credits: 5.2 },
    { time: '2026-04-24 15:22:48', api: '123', model: 'GLM 5.1', duration: '4 s', firstToken: '1.9 s', status: '成功', credits: 1.5 },
    { time: '2026-04-24 15:21:30', api: '1122', model: 'Gemini 3.1 Pro', duration: '11 s', firstToken: '5.6 s', status: '成功', credits: 8.9 },
  ];

  const filteredLogs = mockLogs.filter(log => statusFilter === 'all' || log.status === (statusFilter === 'success' ? '成功' : '錯誤'));

  const displayLogs = compact ? mockLogs.slice(0, 8) : mockLogs;
  const filteredDisplayLogs = displayLogs.filter(log => statusFilter === 'all' || log.status === (statusFilter === 'success' ? '成功' : '錯誤'));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        {compact && <h3 className="text-lg font-medium text-white">使用记录</h3>}
        {!compact && <div />}
        <div className="flex items-center gap-3 justify-end">
          {compact ? (
            <button
              onClick={() => onNavigate?.('logs')}
              className="text-sm text-[#9d82f5] hover:text-[#8b6de8] transition-colors"
            >
              查看更多
            </button>
          ) : (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  placeholder="搜尋模型..."
                  className="pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[14px] text-white/70 placeholder:text-white/30 focus:outline-none focus:border-[#9d82f5]/50 transition-colors w-44"
                />
              </div>
              <div className="relative">
                <button
                  onClick={() => setStatusOpen(!statusOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[14px] text-white/60 hover:text-white/80 transition-colors"
                >
                  <span>{statusFilter === 'all' ? '全部狀態' : statusFilter === 'success' ? '成功' : '錯誤'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${statusOpen ? 'rotate-180' : ''}`} />
                </button>
                {statusOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setStatusOpen(false)} />
                    <div className="absolute top-full right-0 mt-2 w-40 rounded-lg bg-[#1a1a1e] border border-white/10 shadow-xl z-50 overflow-hidden">
                      <button
                        onClick={() => { setStatusFilter('all'); setStatusOpen(false); }}
                        className={`w-full px-4 py-2.5 text-[14px] text-left transition-colors ${statusFilter === 'all' ? 'bg-[#9d82f5]/15 text-[#9d82f5]' : 'text-white/60 hover:bg-white/5'}`}
                      >
                        全部狀態
                      </button>
                      <button
                        onClick={() => { setStatusFilter('success'); setStatusOpen(false); }}
                        className={`w-full px-4 py-2.5 text-[14px] text-left transition-colors ${statusFilter === 'success' ? 'bg-[#9d82f5]/15 text-[#9d82f5]' : 'text-white/60 hover:bg-white/5'}`}
                      >
                        成功
                      </button>
                      <button
                        onClick={() => { setStatusFilter('error'); setStatusOpen(false); }}
                        className={`w-full px-4 py-2.5 text-[14px] text-left transition-colors ${statusFilter === 'error' ? 'bg-[#9d82f5]/15 text-[#9d82f5]' : 'text-white/60 hover:bg-white/5'}`}
                      >
                        錯誤
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="rounded-xl bg-[#1a1a1e] border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-5 py-3 text-[14px] text-white font-medium">時間</th>
                <th className="text-left px-5 py-3 text-[14px] text-white font-medium">API 名稱</th>
                <th className="text-left px-5 py-3 text-[14px] text-white font-medium">模型</th>
                <th className="text-right px-5 py-3 text-[14px] text-white font-medium">消耗 Credit</th>
                <th className="text-right px-5 py-3 text-[14px] text-white font-medium">用時/首字</th>
                <th className="text-center px-5 py-3 text-[14px] text-white font-medium">狀態</th>
              </tr>
            </thead>
            <tbody>
              {filteredDisplayLogs.map((log, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5 whitespace-nowrap" style={{ fontFamily: 'DM Sans', fontWeight: 500, fontSize: '14px', lineHeight: '21px', color: 'rgba(255,255,255,0.5)' }}>{log.time}</td>
                  <td className="px-5 py-3.5 whitespace-nowrap" style={{ fontFamily: 'DM Sans', fontWeight: 500, fontSize: '14px', lineHeight: '21px', color: 'rgba(255,255,255,0.5)' }}>{log.api}</td>
                  <td className="px-5 py-3.5 whitespace-nowrap font-medium">
                    <div className="flex items-center gap-2">
                      {getModelLogo(log.model) && (
                        <img
                          src={getModelLogo(log.model)}
                          alt=""
                          className="w-4 h-4 object-contain"
                        />
                      )}
                      <span style={{ fontFamily: 'DM Sans', fontWeight: 500, fontSize: '14px', lineHeight: '21px', color: 'rgba(255,255,255,0.6)' }}>{log.model}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right font-medium" style={{ fontFamily: 'DM Sans', fontWeight: 500, fontSize: '14px', lineHeight: '21px', color: 'rgba(255,255,255,0.6)' }}>{log.credits.toFixed(1)}</td>
                  <td className="px-5 py-3.5 text-right whitespace-nowrap" style={{ fontFamily: 'DM Sans', fontWeight: 500, fontSize: '14px', lineHeight: '21px', color: 'rgba(255,255,255,0.4)' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>{log.duration}</span>
                    <span className="mx-1">/</span>
                    <span>{log.firstToken}</span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded text-[14px] font-medium ${
                      log.status === '成功'
                        ? 'bg-[#9d82f5]/15 text-[#9d82f5]'
                        : 'bg-red-500/15 text-red-400'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!compact && (
          <div className="flex items-center justify-end px-5 py-3 border-t border-white/10">
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white/50 hover:bg-white/10 hover:text-white/80 transition-colors">‹</button>
              <button className="w-7 h-7 rounded-md bg-[#9d82f5]/15 border border-[#9d82f5]/30 flex items-center justify-center text-xs text-[#9d82f5] font-medium">1</button>
              <button className="w-7 h-7 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white/50 hover:bg-white/10 hover:text-white/80 transition-colors">2</button>
              <button className="w-7 h-7 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white/50 hover:bg-white/10 hover:text-white/80 transition-colors">3</button>
              <button className="w-7 h-7 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white/50 hover:bg-white/10 hover:text-white/80 transition-colors">›</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RechargeRecordPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [statusOpen, setStatusOpen] = useState(false);

  const mockRecords = [
    { orderNo: 'USR23NOk25aWk1776152003', plan: 'Pro', credits: 5500, paid: '$50', status: '成功', time: '2026-04-24 15:32:23' },
    { orderNo: 'USR23NOC4bT871776151941', plan: 'Plus', credits: 2100, paid: '$20', status: '成功', time: '2026-04-24 15:22:21' },
    { orderNo: 'USR23N0XnzXr1776151858', plan: '增值包', credits: 500, paid: '$5', status: '成功', time: '2026-04-24 15:10:58' },
    { orderNo: 'USR23N0CR3ULm1776151614', plan: '增值包', credits: 500, paid: '$5', status: '成功', time: '2026-04-24 14:26:54' },
    { orderNo: 'USR23N0iYj1GD1776151367', plan: 'Pro', credits: 5500, paid: '$50', status: '待支付', time: '2026-04-24 14:22:47' },
    { orderNo: 'USR23N0zSLCTg1776146474', plan: 'Go', credits: 800, paid: '$8', status: '已取消', time: '2026-04-24 14:01:14' },
  ];

  const filteredRecords = mockRecords.filter(r => statusFilter === 'all' || r.status === (statusFilter === 'success' ? '成功' : statusFilter === 'pending' ? '待支付' : '已取消'));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white">充值記錄</h3>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="搜尋訂單號..."
              className="pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/70 placeholder:text-white/30 focus:outline-none focus:border-[#9d82f5]/50 transition-colors w-44"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setStatusOpen(!statusOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/60 hover:text-white/80 transition-colors"
            >
              <span>{statusFilter === 'all' ? '全部狀態' : statusFilter === 'success' ? '成功' : statusFilter === 'pending' ? '待支付' : '已取消'}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${statusOpen ? 'rotate-180' : ''}`} />
            </button>
            {statusOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setStatusOpen(false)} />
                <div className="absolute top-full right-0 mt-2 w-40 rounded-lg bg-[#1a1a1e] border border-white/10 shadow-xl z-50 overflow-hidden">
                  <button
                    onClick={() => { setStatusFilter('all'); setStatusOpen(false); }}
                    className={`w-full px-4 py-2.5 text-sm text-left transition-colors ${statusFilter === 'all' ? 'bg-[#9d82f5]/15 text-[#9d82f5]' : 'text-white/60 hover:bg-white/5'}`}
                  >
                    全部狀態
                  </button>
                  <button
                    onClick={() => { setStatusFilter('success'); setStatusOpen(false); }}
                    className={`w-full px-4 py-2.5 text-sm text-left transition-colors ${statusFilter === 'success' ? 'bg-[#9d82f5]/15 text-[#9d82f5]' : 'text-white/60 hover:bg-white/5'}`}
                  >
                    成功
                  </button>
                  <button
                    onClick={() => { setStatusFilter('pending'); setStatusOpen(false); }}
                    className={`w-full px-4 py-2.5 text-sm text-left transition-colors ${statusFilter === 'pending' ? 'bg-[#9d82f5]/15 text-[#9d82f5]' : 'text-white/60 hover:bg-white/5'}`}
                  >
                    待支付
                  </button>
                  <button
                    onClick={() => { setStatusFilter('cancelled'); setStatusOpen(false); }}
                    className={`w-full px-4 py-2.5 text-sm text-left transition-colors ${statusFilter === 'cancelled' ? 'bg-[#9d82f5]/15 text-[#9d82f5]' : 'text-white/60 hover:bg-white/5'}`}
                  >
                    已取消
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-[#1a1a1e] border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-5 py-3 text-xs text-white font-medium uppercase tracking-wider">訂單號</th>
                <th className="text-left px-5 py-3 text-xs text-white font-medium uppercase tracking-wider">充值套餐</th>
                <th className="text-right px-5 py-3 text-xs text-white font-medium uppercase tracking-wider">到賬 Credit</th>
                <th className="text-right px-5 py-3 text-xs text-white font-medium uppercase tracking-wider">支付金額</th>
                <th className="text-center px-5 py-3 text-xs text-white font-medium uppercase tracking-wider">狀態</th>
                <th className="text-right px-5 py-3 text-xs text-white font-medium uppercase tracking-wider">時間</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5 text-white/60 whitespace-nowrap" style={{ fontFamily: 'DM Sans', fontWeight: 500, fontSize: '14px', lineHeight: '21px' }}>{record.orderNo}</td>
                  <td className="px-5 py-3.5 text-white/60 whitespace-nowrap font-medium" style={{ fontFamily: 'DM Sans', fontWeight: 500, fontSize: '14px', lineHeight: '21px' }}>{record.plan}</td>
                  <td className="px-5 py-3.5 text-white/60 text-right font-medium" style={{ fontFamily: 'DM Sans', fontWeight: 500, fontSize: '14px', lineHeight: '21px' }}>{record.credits.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-white/60 text-right" style={{ fontFamily: 'DM Sans', fontWeight: 500, fontSize: '14px', lineHeight: '21px' }}>{record.paid}</td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      record.status === '成功'
                        ? 'bg-[#9d82f5]/15 text-[#9d82f5]'
                        : record.status === '待支付'
                        ? 'bg-amber-500/15 text-amber-400'
                        : 'bg-red-500/15 text-red-400'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-white/40 text-right whitespace-nowrap" style={{ fontFamily: 'DM Sans', fontWeight: 500, fontSize: '14px', lineHeight: '21px' }}>{record.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end px-5 py-3 border-t border-white/10">
          <div className="flex items-center gap-1">
            <button className="w-7 h-7 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white/50 hover:bg-white/10 hover:text-white/80 transition-colors">‹</button>
            <button className="w-7 h-7 rounded-md bg-[#9d82f5]/15 border border-[#9d82f5]/30 flex items-center justify-center text-xs text-[#9d82f5] font-medium">1</button>
            <button className="w-7 h-7 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white/50 hover:bg-white/10 hover:text-white/80 transition-colors">2</button>
            <button className="w-7 h-7 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white/50 hover:bg-white/10 hover:text-white/80 transition-colors">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AccountOverviewPage({ onBuyCredit }: { onBuyCredit: () => void }) {
  const mockData = mockDataByPeriod['7days'];
  const creditUsed = mockData.totalSpent;
  const creditTotal = mockCreditBalance;
  const creditLeft = creditTotal - creditUsed;
  const creditPercent = (creditLeft / creditTotal) * 100;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-[#1a1a1e] border border-white/10 p-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-xs text-white/60 mb-4">
              當前套餐
            </div>
            <h2
              className="text-[32px] font-semibold"
              style={{
                background: 'linear-gradient(120deg, #b5b5b5 0%, #ffffff 50%, #b5b5b5 100%)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'shinyText 2s linear 0s infinite',
              }}
            >
              Pro
            </h2>
          </div>
          <button
            onClick={() => { window.location.href = '/Hubto/pricing'; }}
            className="px-5 py-2.5 rounded-full bg-white/10 text-sm text-white/70 hover:bg-white/15 transition-colors"
          >
            管理套餐
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[24px] font-semibold text-white">Credit</span>
            <div className="flex items-center gap-3">
              <span className="text-[24px] font-semibold text-white">{creditLeft} 剩余</span>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBuyCredit}
                className="w-7 h-7 rounded-full bg-[#9d82f5] flex items-center justify-center text-white hover:bg-[#8b6de8] transition-colors shadow-lg shadow-[#9d82f5]/25"
              >
                <Plus className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </div>
          <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden mb-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${creditPercent}%` }}
              transition={{ duration: 0.8 }}
              className="h-full rounded-full bg-gradient-to-r from-[#9d82f5] to-violet-400 shimmer-bar"
            />
          </div>
          <div className="flex items-center justify-end">
            <span className="text-[14px] text-white/30">Credit刷新时间：05 / 27</span>
          </div>
        </div>
      </div>

      <RechargeRecordPage />
    </div>
  );
}

const mockApiKeys = [
  { id: '1', name: '1776913908', status: '已啟用', used: '234.5', remaining: '不限額', key: 'sk-2FZg***********kS6H', models: '無限制', created: '2026-04-23 11:11:47', expires: '永不過期' },
  { id: '2', name: 'honstin 測試', status: '已啟用', used: '987.6', remaining: '不限額', key: 'sk-yR1n***********weoq', models: '無限制', created: '2026-04-23 10:44:49', expires: '永不過期' },
  { id: '3', name: '1776911904', status: '已啟用', used: '55.0', remaining: '不限額', key: 'sk-etVA***********si4L', models: '無限制', created: '2026-04-23 10:38:23', expires: '永不過期' },
  { id: '4', name: '123', status: '已啟用', used: '100.5', remaining: '不限額', key: 'sk-MjwP***********Y5K1', models: '無限制', created: '2026-04-23 10:36:54', expires: '永不過期' },
  { id: '5', name: '1122', status: '已啟用', used: '888.8', remaining: '不限額', key: 'sk-R18W***********oRxf', models: '無限制', created: '2026-04-22 10:07:15', expires: '永不過期' },
  { id: '6', name: 'qwe', status: '已啟用', used: '22.3', remaining: '不限額', key: 'sk-TLee***********8Hrv', models: 'minimax-m2.7 +2', created: '2026-04-16 17:46:05', expires: '永不過期' },
  { id: '7', name: '12312321', status: '已啟用', used: '77.7', remaining: '不限額', key: 'sk-90mL***********vW6', models: '無限制', created: '2026-04-15 10:45:34', expires: '永不過期' },
];

function DashboardApiPage() {
  const [filter, setFilter] = useState<string>('all');
  const [keywordSearch, setKeywordSearch] = useState('');
  const [keySearch, setKeySearch] = useState('');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [moreMenuId, setMoreMenuId] = useState<string | null>(null);

  const filterOptions = [
    { key: 'all', label: '全部', count: mockApiKeys.length, color: 'bg-white/10' },
    { key: 'enabled', label: '已啟用', count: mockApiKeys.filter(k => k.status === '已啟用').length, color: 'bg-emerald-500/20 text-emerald-400' },
    { key: 'disabled', label: '已禁用', count: 0, color: 'bg-white/10' },
    { key: 'expired', label: '已過期', count: 0, color: 'bg-amber-500/20 text-amber-400' },
    { key: 'exhausted', label: '額度耗盡', count: 0, color: 'bg-red-500/20 text-red-400' },
  ];

  const currentFilter = filterOptions.find(f => f.key === filter) || filterOptions[0];

  const filteredKeys = mockApiKeys.filter(k => {
    if (filter !== 'all') {
      if (filter === 'enabled' && k.status !== '已啟用') return false;
      if (filter === 'disabled' && k.status === '已啟用') return false;
      if (filter === 'expired' && k.expires !== '永不過期') return false;
      if (filter === 'exhausted' && k.remaining !== '不限額') return false;
    }
    if (keywordSearch && !k.name.toLowerCase().includes(keywordSearch.toLowerCase())) return false;
    if (keySearch && !k.key.toLowerCase().includes(keySearch.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="w-[1280px] mx-auto">
      <div className="flex items-center justify-end gap-3 mb-4">
        <div className="relative">
          <button
            onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
            className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 text-[12px] text-white/60 hover:text-white/80 transition-colors"
            style={{ width: '107px', height: '41px', padding: '8px 16px', margin: '0' }}
          >
            <span>{currentFilter.label}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${filterDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {filterDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setFilterDropdownOpen(false)} />
              <div className="absolute top-full right-0 mt-2 w-44 rounded-lg bg-[#1a1a1e] border border-white/10 shadow-xl z-50 overflow-hidden">
                {filterOptions.map(option => (
                  <button
                    key={option.key}
                    onClick={() => { setFilter(option.key); setFilterDropdownOpen(false); }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-[12px] text-left transition-colors ${
                      filter === option.key ? 'bg-[#9d82f5]/15 text-[#9d82f5]' : 'text-white/60 hover:bg-white/5'
                    }`}
                  >
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="relative w-[176px] h-[41px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="搜尋關鍵字"
            value={keywordSearch}
            onChange={e => setKeywordSearch(e.target.value)}
            className="w-full h-full pl-9 pr-3 py-[8px] rounded-lg bg-white/5 border border-white/10 text-[12px] text-white/70 placeholder:text-white/30 focus:outline-none focus:border-[#9d82f5]/50 transition-colors"
            style={{ padding: '8px 12px 8px 36px' }}
          />
        </div>
        <div className="relative w-[176px] h-[41px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="密鑰"
            value={keySearch}
            onChange={e => setKeySearch(e.target.value)}
            className="w-full h-full pl-9 pr-3 py-[8px] rounded-lg bg-white/5 border border-white/10 text-[12px] text-white/70 placeholder:text-white/30 focus:outline-none focus:border-[#9d82f5]/50 transition-colors"
            style={{ padding: '8px 12px 8px 36px' }}
          />
        </div>
        <button className="px-4 py-2 rounded-lg bg-[#9d82f5] text-white text-sm font-medium hover:bg-[#8b6de8] transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          創建 API 密鑰
        </button>
      </div>

      <div className="rounded-xl bg-[#1a1a1e] border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-5 py-3 text-[12px] text-white font-medium">名稱</th>
                <th className="text-left px-5 py-3 text-[12px] text-white font-medium">狀態</th>
                <th className="text-left px-5 py-3 text-[12px] text-white font-medium">消耗 / 餘額 (Credit)</th>
                <th className="text-left px-5 py-3 text-[12px] text-white font-medium">密鑰</th>
                <th className="text-left px-5 py-3 text-[12px] text-white font-medium">可用模型</th>
                <th className="text-left px-5 py-3 text-[12px] text-white font-medium">創建時間</th>
                <th className="text-left px-5 py-3 text-[12px] text-white font-medium">過期時間</th>
                <th className="text-right px-5 py-3 text-[12px] text-white font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredKeys.map((k) => (
                <tr key={k.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5 text-[12px] text-white/70">{k.name}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[12px] font-medium bg-[#9d82f5]/15 text-[#9d82f5]">
                      {k.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-[12px] text-white/50">{k.used} / {k.remaining}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] text-white/50 font-mono">{k.key}</span>
                      <button className="text-white/30 hover:text-white/60 transition-colors">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button className="text-white/30 hover:text-white/60 transition-colors">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[12px] text-white/50">{k.models}</td>
                  <td className="px-5 py-3.5 text-[12px] text-white/40 whitespace-nowrap">{k.created}</td>
                  <td className="px-5 py-3.5 text-[12px] text-white/40 whitespace-nowrap">{k.expires}</td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="px-3 py-1.5 rounded-lg bg-[#9d82f5]/15 border border-[#9d82f5]/20 text-[12px] font-medium text-[#9d82f5] hover:bg-[#9d82f5]/25 transition-colors">
                        使用密鑰
                      </button>
                      <button className="px-3 py-1 rounded-lg border border-white/10 text-[12px] text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors">
                        編輯
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setMoreMenuId(moreMenuId === k.id ? null : k.id)}
                          className="p-1 rounded hover:bg-white/10 text-white/30 hover:text-white/60 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {moreMenuId === k.id && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setMoreMenuId(null)} />
                            <div className="absolute top-full right-0 mt-1 w-24 rounded-lg bg-[#1a1a1e] border border-white/10 shadow-xl z-50 overflow-hidden">
                              <button className="w-full px-4 py-2.5 text-[12px] text-left text-white/60 hover:bg-white/5 transition-colors">
                                禁用
                              </button>
                              <button className="w-full px-4 py-2.5 text-[12px] text-left text-red-400 hover:bg-white/5 transition-colors">
                                删除
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end px-5 py-3 border-t border-white/10">
          <div className="flex items-center gap-1">
            <button className="w-7 h-7 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white/50 hover:bg-white/10 hover:text-white/80 transition-colors">‹</button>
            <button className="w-7 h-7 rounded-md bg-[#9d82f5]/15 border border-[#9d82f5]/30 flex items-center justify-center text-xs text-[#9d82f5] font-medium">1</button>
            <button className="w-7 h-7 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white/50 hover:bg-white/10 hover:text-white/80 transition-colors">2</button>
            <button className="w-7 h-7 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white/50 hover:bg-white/10 hover:text-white/80 transition-colors">3</button>
            <button className="w-7 h-7 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white/50 hover:bg-white/10 hover:text-white/80 transition-colors">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  model?: string;
  timestamp?: string;
  error?: boolean;
  title?: string;
}

const mockConversations = [
  { id: '1', title: '創造一個女性 黃頭... 發', active: true },
  { id: '2', title: 'New Chat', active: false },
  { id: '3', title: 'New Chat', active: false },
  { id: '4', title: '你是什麼模型', active: false },
];

const mockMessages: Message[] = [
  { id: '1', role: 'system', content: '2026/4/23 15:42:26  glm-4-turbo' },
  {
    id: '2', role: 'system',
    content: JSON.stringify({ message: 'fetch error, please check url', url: 'https://api.alltoken.co/v1/chat/completions', code: 'fetch_error' }, null, 2),
    model: '失敗原因!', timestamp: '加載代碼', error: true,
  },
  { id: '3', role: 'user', content: '你好', timestamp: '2026/4/23 15:42:48', model: 'gpt-4' },
  { id: '4', role: 'system', content: '2026/4/23 15:43:49  llama-2.7b' },
  {
    id: '5', role: 'system',
    content: JSON.stringify({ error: { code: 'model_not_found', message: 'The model llama-2.7b 並不可用 (distributor) (request id: 2026042315434900150120110412)', type: 'new_api_error' } }, null, 2),
    model: '失敗原因!', timestamp: '加載代碼', error: true,
  },
  { id: '6', role: 'user', content: '你是什麼模型', timestamp: '2026/4/23 11:50:24', model: 'glm-4-turbo' },
  { id: '7', role: 'system', content: '我是 GLM，當前運行的是 glm-4-turbo。', timestamp: '2026/4/23 11:50:27' },
];

function DashboardTestApiPage() {
  const [activeConversation, setActiveConversation] = useState('1');
  const [inputValue, setInputValue] = useState('');
  const [selectedModel, setSelectedModel] = useState('GPT-5.4');
  const [modelOpen, setModelOpen] = useState(false);
  const [apiKeyOpen, setApiKeyOpen] = useState(false);
  const [selectedApiKey, setSelectedApiKey] = useState('honstin 測試');
  const [isFocused, setIsFocused] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  const models = ['GPT-5.4', 'GPT-4', 'GPT-4-turbo', 'Claude Opus 4.6', 'Gemini 3.1 Pro'];
  const apiKeys = ['honstin 測試', '1776913908', '1776911904'];

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false }),
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsThinking(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-[calc(100vh-184px)] bg-[#171717] rounded-[16px] overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-[280px] shrink-0 flex flex-col bg-[#232425]">
        {/* macOS Window Controls */}
        <div className="px-4 pt-4 pb-2 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e]/30" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#d89e24]/30" />
          <div className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab2e]/30" />
        </div>

        {/* New Chat Button */}
        <div className="px-3 pt-4 pb-2">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-start gap-2 px-3 py-2.5 rounded-[16px] bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.12] transition-all group"
          >
            <Plus className="w-3.5 h-3.5 text-white/40 group-hover:text-white/60" />
            <span className="text-[12px] text-white/50 font-medium group-hover:text-white/70">新對話</span>
          </motion.button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-3 py-1">
          <div className="text-[11px] font-medium text-white/20 uppercase tracking-wider px-3 py-2">聊天</div>
          {mockConversations.map((conv) => (
            <motion.button
              key={conv.id}
              whileHover={{ x: 1 }}
              onClick={() => setActiveConversation(conv.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-[13px] mb-0.5 transition-all flex items-center gap-2.5 ${
                activeConversation === conv.id
                  ? 'bg-white/[0.08] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'
                  : 'text-white/35 hover:text-white/60 hover:bg-white/[0.04]'
              }`}
            >
              <MessageCircle className={`w-3.5 h-3.5 shrink-0 ${activeConversation === conv.id ? 'text-white/50' : 'text-white/20'}`} />
              <span className="truncate">{conv.title}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#171717]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-8">
            {messages.map((msg, idx) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className={`flex items-start gap-4 mb-10 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar - only for assistant messages */}
                {msg.role !== 'user' && (
                  <div className="w-7 h-7 rounded-full bg-[#9d82f5]/15 border border-[#9d82f5]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#9d82f5]" />
                  </div>
                )}

                {/* Content */}
                <div className={`flex-1 min-w-0 ${msg.role === 'user' ? 'flex flex-col items-end' : ''}`}>
                  {msg.role !== 'user' && msg.title && (
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-[13px] font-semibold text-white/90">{msg.title}</span>
                      <span className="text-[11px] text-white/25">{msg.timestamp}</span>
                    </div>
                  )}
                  {msg.role === 'user' && (
                    <div className="text-[11px] text-white/25 mb-1.5">{msg.timestamp}</div>
                  )}
                  <div 
                    className={`text-[14px] whitespace-pre-wrap leading-[1.7] ${
                      msg.role === 'user' 
                        ? 'bg-[#232425] text-white/90 rounded-[20px] rounded-tr-[4px] px-5 py-3.5 max-w-[80%]' 
                        : 'text-white/70'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Thinking Indicator */}
            {isThinking && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-start mb-10"
              >
                <div className="flex items-center gap-2 text-[14px] text-white/50">
                  <span>思考中</span>
                  <span className="flex gap-0.5">
                    <motion.span
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
                      className="text-white/70"
                    >
                      .
                    </motion.span>
                    <motion.span
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                      className="text-white/70"
                    >
                      .
                    </motion.span>
                    <motion.span
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                      className="text-white/70"
                    >
                      .
                    </motion.span>
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="px-6 pb-6">
          <div className="max-w-3xl mx-auto">
            <motion.div
              animate={{
                borderColor: isFocused ? 'rgba(157,130,245,0.25)' : 'rgba(255,255,255,0.08)',
                backgroundColor: isFocused ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
              }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border p-4"
            >
              <textarea
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder="輸入訊息..."
                className="w-full bg-transparent text-[14px] text-white/80 placeholder:text-white/25 focus:outline-none resize-none min-h-[24px] max-h-[200px] leading-relaxed"
                rows={1}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = target.scrollHeight + 'px';
                }}
              />

              <div className="flex items-center justify-between mt-3">
                {/* Left: Plus & API Key */}
                <div className="flex items-center gap-2">
                  <button className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/25 hover:text-white/50 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setApiKeyOpen(!apiKeyOpen)}
                      className="flex items-center gap-1.5 px-2 py-1 text-white/30 hover:text-white/50 text-[12px] transition-colors"
                    >
                      <span>{selectedApiKey}</span>
                      <ChevronDown className={`w-3 h-3 transition-transform ${apiKeyOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {apiKeyOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setApiKeyOpen(false)} />
                        <div className="absolute bottom-full left-0 mb-2 w-48 rounded-xl bg-[#232425] border border-white/[0.1] shadow-2xl z-50 overflow-hidden">
                          <div className="px-3 py-2 text-[11px] text-white/30 uppercase tracking-wider">選擇 API Key</div>
                          {apiKeys.map(key => (
                            <button
                              key={key}
                              onClick={() => { setSelectedApiKey(key); setApiKeyOpen(false); }}
                              className={`w-full px-4 py-2.5 text-[13px] text-left transition-colors flex items-center gap-2 ${
                                selectedApiKey === key ? 'bg-[#9d82f5]/10 text-[#9d82f5]' : 'text-white/50 hover:bg-white/[0.04]'
                              }`}
                            >
                              {selectedApiKey === key && <div className="w-1 h-1 rounded-full bg-[#9d82f5]" />}
                              {key}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Right: Model & Send */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <button
                      onClick={() => setModelOpen(!modelOpen)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 text-white/30 hover:text-white/50 text-[12px] transition-colors"
                    >
                      <span>{selectedModel}</span>
                      <ChevronDown className={`w-3 h-3 transition-transform ${modelOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {modelOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setModelOpen(false)} />
                        <div className="absolute bottom-full right-0 mb-2 w-52 rounded-xl bg-[#232425] border border-white/[0.1] shadow-2xl z-50 overflow-hidden">
                          <div className="px-3 py-2 text-[11px] text-white/30 uppercase tracking-wider">選擇模型</div>
                          {models.map(m => (
                            <button
                              key={m}
                              onClick={() => { setSelectedModel(m); setModelOpen(false); }}
                              className={`w-full px-4 py-2.5 text-[13px] text-left transition-colors flex items-center gap-2 ${
                                selectedModel === m ? 'bg-[#9d82f5]/10 text-[#9d82f5]' : 'text-white/50 hover:bg-white/[0.04]'
                              }`}
                            >
                              {selectedModel === m && <div className="w-1 h-1 rounded-full bg-[#9d82f5]" />}
                              {m}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: inputValue.trim() ? 1.05 : 1 }}
                    whileTap={{ scale: inputValue.trim() ? 0.95 : 1 }}
                    onClick={handleSendMessage}
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                      inputValue.trim()
                        ? 'bg-[#939393] text-white hover:bg-[#a8a8a8]'
                        : 'bg-[#939393]/30 text-white/30 cursor-not-allowed'
                    }`}
                    disabled={!inputValue.trim()}
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Footer hint */}
            <div className="flex items-center justify-center gap-1 mt-2">
              <span className="text-[11px] text-white/15">按</span>
              <kbd className="px-1 py-0.5 rounded bg-white/[0.06] text-[10px] text-white/25 border border-white/[0.06]">Enter</kbd>
              <span className="text-[11px] text-white/15">發送，</span>
              <kbd className="px-1 py-0.5 rounded bg-white/[0.06] text-[10px] text-white/25 border border-white/[0.06]">Shift</kbd>
              <span className="text-[11px] text-white/15">+</span>
              <kbd className="px-1 py-0.5 rounded bg-white/[0.06] text-[10px] text-white/25 border border-white/[0.06]">Enter</kbd>
              <span className="text-[11px] text-white/15">換行</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type Page = 'dashboard' | 'api' | 'app' | 'logs' | 'account' | 'models';

function Sidebar({ activePage, onNavigate }: { activePage: Page; onNavigate: (page: Page) => void }) {
  const mainItems: { key: Page; icon: React.ReactNode; label: string }[] = [
    { key: 'dashboard', icon: <LayoutDashboard className="w-4 h-4" />, label: '數據看板' },
    { key: 'api', icon: <KeyRound className="w-4 h-4" />, label: 'API 管理' },
    { key: 'app', icon: <Braces className="w-4 h-4" />, label: '測試 API' },
    { key: 'logs', icon: <FileText className="w-4 h-4" />, label: '使用記錄' },
  ];

  const personalItems: { key: Page; icon: React.ReactNode; label: string }[] = [
    { key: 'account', icon: <User className="w-4 h-4" />, label: '帳戶概覽' },
    { key: 'models', icon: <Box className="w-4 h-4" />, label: '模型中心' },
  ];

  const bottomItems: { key: Page; icon: React.ReactNode; label: string }[] = [];

  return (
    <aside className="fixed z-[100] flex flex-col" style={{ top: '20px', left: '24px', bottom: '48px', width: '285px' }}>
      <div className="flex-1 bg-[#1a1a1e] overflow-hidden flex flex-col" style={{ borderRadius: '30px' }}>
        {/* Header: vertically centered */}
        <div className="flex items-center justify-center" style={{ paddingTop: '24px', paddingBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity cursor-pointer px-4">
            <img src="https://i.postimg.cc/KYVjfVRw/logo-single-(1)-1.png" alt="HubTo" className="w-9 h-9 rounded-md" />
            <span
              className="text-[24px] font-semibold tracking-tight"
              style={{
                background: 'linear-gradient(120deg, #b5b5b5 0%, #ffffff 50%, #b5b5b5 100%)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'shinyText 2.3s linear 0s infinite',
              }}
            >
              HubTo
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-3 overflow-y-auto flex flex-col items-center" style={{ paddingLeft: '10px', paddingRight: '10px', paddingTop: '24px' }}>
        {mainItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            className={`w-full flex items-center justify-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors mb-2.5 ${
              activePage === item.key
                ? 'bg-white/10 text-white font-medium'
                : 'text-white/50 hover:bg-white/5 hover:text-white/70'
            }`}
          >
            {item.icon}
            <span className="w-20 text-left">{item.label}</span>
          </button>
        ))}

        {personalItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            className={`w-full flex items-center justify-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors mb-2.5 ${
              activePage === item.key
                ? 'bg-white/10 text-white font-medium'
                : 'text-white/50 hover:bg-white/5 hover:text-white/70'
            }`}
          >
            {item.icon}
            <span className="w-20 text-left">{item.label}</span>
          </button>
        ))}
      </nav>
      </div>
    </aside>
  );
}

function AccountMenu({ logout, onUpgrade }: { logout: () => void; onUpgrade: () => void }) {
  const [open, setOpen] = useState(false);

  const now = new Date();
  const refreshDate = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 border border-white/10 hover:bg-white/10 transition-colors"
      >
        <span className="text-sm text-white/80">honstinhui@gmail.com</span>
        <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-sm font-medium text-white">
          H
        </div>
        <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full right-0 mt-2 w-60 rounded-xl bg-[#1a1a1e] border border-white/10 shadow-xl z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-white/0">
              <div className="text-sm text-white font-medium">honstinhui@gmail.com</div>
              <div className="text-[14px] text-white/40 mt-0.5 py-1">餘額: {mockCreditBalance} Credit</div>
              <div className="text-[14px] text-white/30 mt-0.5 py-1">刷新時間: {refreshDate}</div>
            </div>
            <button
              onClick={() => { onUpgrade(); setOpen(false); }}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#9d82f5] text-white text-sm font-medium text-left hover:bg-[#8b6de8] transition-colors"
            >
              <Crown className="w-4 h-4" />
              升級套餐
            </button>
            <button
              onClick={() => { logout(); setOpen(false); }}
              className="w-full flex items-center gap-2 px-4 py-2.5 h-14 text-sm text-white/60 hover:text-red-400 hover:bg-white/5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              退出登錄
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function DashboardPage() {
  const { logout } = useAuth();
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [selectedDays, setSelectedDays] = useState<'today' | '7days' | '30days' | 'custom'>('7days');
  const [showAllModels, setShowAllModels] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [showSpendingModal, setShowSpendingModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const timeRanges = [
    { key: 'today' as const, label: '今天' },
    { key: '7days' as const, label: '最近7天' },
    { key: '30days' as const, label: '最近30天' },
    { key: 'custom' as const, label: '自定義' },
  ];

  const mockData = mockDataByPeriod[selectedDays];

  const topSpendingModels = [
    { modelId: 'gemini-3-1-pro', value: mockData.topSpending[0], color: '#9d82f5' },
    { modelId: 'qwen3-6-plus', value: mockData.topSpending[1], color: '#a855f7' },
    { modelId: 'claude-haiku-4-5', value: mockData.topSpending[2], color: '#c084fc' },
  ];

  const topRequestModels = [
    { modelId: 'gemini-3-1-pro', value: mockData.topRequests[0], color: '#9d82f5' },
    { modelId: 'qwen3-6-plus', value: mockData.topRequests[1], color: '#a855f7' },
    { modelId: 'glm-5-1', value: mockData.topRequests[2], color: '#c084fc' },
  ];

  const handleTopUp = () => {
    window.location.href = '/Hubto/pricing';
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <div className="fixed-navbar fixed top-0 right-0 z-50">
        <nav className="flex items-center px-6 py-4">
          <div className="flex items-center gap-3">
            <ShinyButton
              onClick={() => setShowBuyModal(true)}
              textColor="#000000"
              shineColor="rgba(157, 130, 245, 0.35)"
              speed="2.67s"
              delay="2s"
              spread={240}
              direction="left"
            >
              增加 Credit
            </ShinyButton>
            <AccountMenu logout={logout} onUpgrade={handleTopUp} />
          </div>
        </nav>
      </div>

      <div className="flex pt-0">
        <Sidebar activePage={activePage} onNavigate={setActivePage} />

        <main className="flex-1 pt-[80px] pb-12 px-8" style={{ marginLeft: '285px' }}>
          <div className="max-w-[1280px] mx-auto">
            {activePage === 'dashboard' && (
              <>
                <div className="flex items-center justify-start mb-6">
                  <h1 className="text-xl font-semibold text-white">數據看板</h1>
                </div>
                <div className="flex items-center justify-end mb-6">
                  <div className="relative">
                    <button
                      onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/60 hover:text-white/80 transition-colors"
                    >
                      <span>{timeRanges.find(tr => tr.key === selectedDays)?.label}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${dateDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {dateDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setDateDropdownOpen(false)} />
                        <div className="absolute top-full right-0 mt-2 w-40 rounded-lg bg-[#1a1a1e] border border-white/10 shadow-xl z-50 overflow-hidden">
                          {timeRanges.map(tr => (
                            <button
                              key={tr.key}
                              onClick={() => { setSelectedDays(tr.key); setDateDropdownOpen(false); }}
                              className={`w-full px-4 py-2.5 text-sm text-left transition-colors ${
                                selectedDays === tr.key
                                  ? 'bg-[#9d82f5]/15 text-[#9d82f5]'
                                  : 'text-white/60 hover:bg-white/5'
                              }`}
                            >
                              {tr.label}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <StatCard
                    title="總消耗"
                    value={`${mockData.totalSpent} / ${mockCreditBalance} Credit`}
                    models={topSpendingModels}
                    showAddButton={true}
                    onAddClick={() => setShowBuyModal(true)}
                    onExpand={() => setShowSpendingModal(true)}
                  />
                  <StatCard
                    title="總請求數"
                    value={`${mockData.totalRequests}`}
                    models={topRequestModels}
                    isRequestCard={true}
                    onExpand={() => setShowRequestModal(true)}
                  />
                  <ModelServerStatus onShowAll={() => setShowAllModels(true)} />
                </div>

                <div className="mt-8">
                  <ActivityLogPage compact onNavigate={setActivePage} />
                </div>
              </>
            )}

            {activePage === 'logs' && (
              <>
                <div className="flex items-center justify-start mb-6">
                  <h1 className="text-xl font-semibold text-white">使用記錄</h1>
                </div>
                <ActivityLogPage />
              </>
            )}

            {activePage === 'api' && (
              <>
                <div className="flex items-center justify-start mb-6">
                  <h1 className="text-xl font-semibold text-white">API 管理</h1>
                </div>
                <DashboardApiPage />
              </>
            )}

            {activePage === 'app' && (
              <>
                <div className="flex items-center justify-start mb-6">
                  <h1 className="text-xl font-semibold text-white">測試 API</h1>
                </div>
                <DashboardTestApiPage />
              </>
            )}

            {activePage === 'account' && (
              <>
                <div className="flex items-center justify-start mb-6">
                  <h1 className="text-xl font-semibold text-white">帳戶概覽</h1>
                </div>
                <AccountOverviewPage onBuyCredit={() => setShowBuyModal(true)} />
              </>
            )}

            {activePage === 'models' && (
              <>
                <div className="flex items-center justify-start mb-6">
                  <h1 className="text-xl font-semibold text-white">模型中心</h1>
                </div>
                <ModelsCenterPage />
              </>
            )}

            {activePage !== 'dashboard' && activePage !== 'logs' && activePage !== 'account' && activePage !== 'api' && activePage !== 'app' && activePage !== 'models' && (
              <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-white/30">
                <FileText className="w-16 h-16 mb-4 text-white/10" />
                <p className="text-sm text-white/40 font-medium">此功能即將上線</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {showAllModels && <AllModelsModal onClose={() => setShowAllModels(false)} />}
      {showBuyModal && <BuyCreditModal onClose={() => setShowBuyModal(false)} />}
      {showSpendingModal && <SpendingRankingModal onClose={() => setShowSpendingModal(false)} />}
      {showRequestModal && <RequestRankingModal onClose={() => setShowRequestModal(false)} />}
    </div>
  );
}
