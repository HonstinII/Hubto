// Centralized mock data for the dashboard module

export const THEME = '#9d82f5';

export const mockCreditBalance = 5000;

export const mockDataByPeriod = {
  today: { totalSpent: 42, totalRequests: 28, topSpending: [58.9, 37.2, 26.4], topRequests: [245, 186, 142] },
  '7days': { totalSpent: 327, totalRequests: 651, topSpending: [58.9, 37.2, 26.4], topRequests: [245, 186, 142] },
  '30days': { totalSpent: 1280, totalRequests: 2847, topSpending: [234.5, 156.8, 98.2], topRequests: [1024, 876, 654] },
  custom: { totalSpent: 890, totalRequests: 1523, topSpending: [156.3, 98.7, 67.4], topRequests: [678, 543, 432] },
};

export const mockApiKeys = [
  { id: '1', name: '1776913908', status: '已啟用', used: '234.5', remaining: '不限額', key: 'sk-2FZg***********kS6H', models: '無限制', created: '2026-04-23 11:11:47', expires: '永不過期' },
  { id: '2', name: 'honstin 測試', status: '已啟用', used: '987.6', remaining: '不限額', key: 'sk-yR1n***********weoq', models: '無限制', created: '2026-04-23 10:44:49', expires: '永不過期' },
  { id: '3', name: '1776911904', status: '已啟用', used: '55.0', remaining: '不限額', key: 'sk-etVA***********si4L', models: '無限制', created: '2026-04-23 10:38:23', expires: '永不過期' },
  { id: '4', name: '123', status: '已啟用', used: '100.5', remaining: '不限額', key: 'sk-MjwP***********Y5K1', models: '無限制', created: '2026-04-23 10:36:54', expires: '永不過期' },
  { id: '5', name: '1122', status: '已啟用', used: '888.8', remaining: '不限額', key: 'sk-R18W***********oRxf', models: '無限制', created: '2026-04-22 10:07:15', expires: '永不過期' },
  { id: '6', name: 'qwe', status: '已啟用', used: '22.3', remaining: '不限額', key: 'sk-TLee***********8Hrv', models: 'minimax-m2.7 +2', created: '2026-04-16 17:46:05', expires: '永不過期' },
  { id: '7', name: '12312321', status: '已啟用', used: '77.7', remaining: '不限額', key: 'sk-90mL***********vW6', models: '無限制', created: '2026-04-15 10:45:34', expires: '永不過期' },
];

export const mockConversations = [
  { id: '1', title: '創造一個女性 黃頭... 發', active: true },
  { id: '2', title: 'New Chat', active: false },
  { id: '3', title: 'New Chat', active: false },
  { id: '4', title: '你是什麼模型', active: false },
];

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  model?: string;
  timestamp?: string;
  error?: boolean;
  title?: string;
}

export const mockActivityLogs = [
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

export const mockRechargeRecords = [
  { orderNo: 'USR23NOk25aWk1776152003', plan: 'Pro', credits: 5500, paid: '$50', status: '成功', time: '2026-04-24 15:32:23' },
  { orderNo: 'USR23NOC4bT871776151941', plan: 'Plus', credits: 2100, paid: '$20', status: '成功', time: '2026-04-24 15:22:21' },
  { orderNo: 'USR23N0XnzXr1776151858', plan: '增值包', credits: 500, paid: '$5', status: '成功', time: '2026-04-24 15:10:58' },
  { orderNo: 'USR23N0CR3ULm1776151614', plan: '增值包', credits: 500, paid: '$5', status: '成功', time: '2026-04-24 14:26:54' },
  { orderNo: 'USR23N0iYj1GD1776151367', plan: 'Pro', credits: 5500, paid: '$50', status: '待支付', time: '2026-04-24 14:22:47' },
  { orderNo: 'USR23N0zSLCTg1776146474', plan: 'Go', credits: 800, paid: '$8', status: '已取消', time: '2026-04-24 14:01:14' },
];

export type Page = 'dashboard' | 'api' | 'app' | 'logs' | 'account' | 'models';
