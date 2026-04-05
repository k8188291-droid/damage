import { useState } from 'react';
import Modal from './Modal';
import agentsContent from '../../AGENTS.md?raw';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function HelpModal({ open, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(agentsContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal open={open} onClose={onClose} title="傷害計算器 — 說明" width="max-w-2xl">
      <div className="space-y-5 text-sm text-gray-300">

        {/* What is this */}
        <section>
          <h4 className="text-indigo-400 font-semibold mb-2">這是什麼工具？</h4>
          <p className="text-gray-400 leading-relaxed">
            遊戲傷害計算與技能輪轉分析工具。輸入角色屬性、技能倍率與各種增益（Buff），
            即可計算並比較不同技能組合的總傷害輸出。
          </p>
        </section>

        {/* Quick start */}
        <section>
          <h4 className="text-indigo-400 font-semibold mb-2">快速上手</h4>
          <ol className="space-y-1.5 text-gray-400 list-decimal list-inside leading-relaxed">
            <li>點擊左側「匯入」按鈕 → 選擇「載入範例資料」查看完整示例</li>
            <li>或依序建立：<span className="text-gray-300">角色 → Buff → 技能 → 輪轉組</span></li>
            <li>在中央編輯器組合技能序列，右側面板自動顯示傷害比較</li>
          </ol>
        </section>

        {/* Damage formula */}
        <section>
          <h4 className="text-indigo-400 font-semibold mb-2">傷害計算公式</h4>
          <div className="bg-gray-800/60 rounded-lg p-3 font-mono text-xs text-gray-300 space-y-1">
            <div>攻擊力 = (基礎攻擊 + 武器攻擊) × (1 + 攻擊%加成 / 100)</div>
            <div className="text-gray-500 mt-1">傷害 = 攻擊力 × 技能倍率%</div>
            <div className="text-gray-500">　　　× (1 + 增傷合計%)</div>
            <div className="text-gray-500">　　　× (1 + 易傷合計%)</div>
            <div className="text-gray-500">　　　× (1 + 暴擊傷害合計%) × ...</div>
          </div>
          <p className="text-gray-500 text-xs mt-1.5">各區間（Zone）相互相乘；同一區間內的多個 Buff 數值先加總。</p>
        </section>

        {/* Buff rules */}
        <section>
          <h4 className="text-indigo-400 font-semibold mb-2">Buff 生效條件</h4>
          <p className="text-gray-400 leading-relaxed">
            Buff 需通過三層開關才會生效：
            ① Buff 列表全域啟用 →
            ② 技能有勾選此 Buff →
            ③ 輪轉組及技能條目沒有停用它。
          </p>
        </section>

        {/* Divider */}
        <hr className="border-gray-700" />

        {/* AI Prompt section */}
        <section>
          <h4 className="text-indigo-400 font-semibold mb-1">向 AI 詢問使用方法</h4>
          <p className="text-gray-400 leading-relaxed mb-3">
            複製下方 AI Prompt，貼到 ChatGPT、Claude 等 AI 對話框，
            再描述你的問題，AI 就能針對本工具提供精確的回答。
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                copied
                  ? 'bg-green-700/40 text-green-400 border border-green-700'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              {copied ? '✓ 已複製！' : '複製 AI Prompt'}
            </button>
            <button
              onClick={() => setShowPrompt(v => !v)}
              className="text-xs text-gray-500 hover:text-gray-400 underline cursor-pointer transition-colors"
            >
              {showPrompt ? '收起預覽' : '預覽內容'}
            </button>
          </div>

          {showPrompt && (
            <div className="mt-3 bg-gray-800/60 border border-gray-700 rounded-lg p-3 max-h-48 overflow-y-auto">
              <pre className="text-xs text-gray-400 whitespace-pre-wrap font-mono leading-relaxed">
                {agentsContent}
              </pre>
            </div>
          )}
        </section>

      </div>
    </Modal>
  );
}
