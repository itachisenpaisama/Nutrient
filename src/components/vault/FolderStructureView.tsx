import React, { useState } from 'react';
import { StorageService, VirtualFileNode } from '../../services/storageService';
import { Language, TRANSLATIONS } from '../../i18n/translations';
import {
  Folder,
  FolderOpen,
  FileCode,
  Download,
  Upload,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  HardDrive,
  Copy,
  Check,
  FileText
} from 'lucide-react';

interface FolderStructureViewProps {
  lang: Language;
  onRefreshData: () => void;
}

export const FolderStructureView: React.FC<FolderStructureViewProps> = ({
  lang,
  onRefreshData
}) => {
  const t = TRANSLATIONS[lang];
  const [rootVault, setRootVault] = useState<VirtualFileNode>(() =>
    StorageService.getStructuredFileVault()
  );
  const [expandedFolders, setExpandedFolders] = useState<{ [path: string]: boolean }>({
    nutri_vault: true,
    'nutri_vault/profiles': true,
    'nutri_vault/plans': true,
    'nutri_vault/logs': true,
    'nutri_vault/logs/2026': true,
    'nutri_vault/logs/2026/09': true,
    'nutri_vault/toxicology': true,
    'nutri_vault/analytics': true
  });

  const [selectedFile, setSelectedFile] = useState<VirtualFileNode | null>(() => {
    // Default open profile file
    const profileNode = rootVault.children?.[0]?.children?.[0];
    return profileNode || null;
  });

  const [copied, setCopied] = useState<boolean>(false);

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const handleExportFull = () => {
    StorageService.exportFullVaultAsJson();
  };

  const handleResetDemo = () => {
    if (window.confirm('Möchtest du wirklich alle Daten auf die 30-Tage-Demo zurücksetzen?')) {
      StorageService.resetToDemo();
      setRootVault(StorageService.getStructuredFileVault());
      onRefreshData();
    }
  };

  const handleCopyContent = () => {
    if (selectedFile?.content) {
      navigator.clipboard.writeText(selectedFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadSelected = () => {
    if (selectedFile?.content) {
      StorageService.downloadJsonFile(selectedFile.name, selectedFile.content);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = StorageService.importVaultFromJson(content);
        if (ok) {
          alert('Backup erfolgreich importiert!');
          setRootVault(StorageService.getStructuredFileVault());
          onRefreshData();
        } else {
          alert('Fehler beim Importieren des Backups. Bitte JSON-Format prüfen.');
        }
      }
    };
    reader.readAsText(file);
  };

  // Recursive tree node renderer
  const renderTreeNode = (node: VirtualFileNode, depth: number = 0) => {
    const isFolder = node.type === 'folder';
    const isExpanded = expandedFolders[node.path];
    const isSelected = selectedFile?.path === node.path;

    return (
      <div key={node.path} className="select-none text-xs">
        <div
          onClick={() => {
            if (isFolder) {
              toggleFolder(node.path);
            } else {
              setSelectedFile(node);
            }
          }}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          className={`flex items-center space-x-2 py-1.5 pr-3 rounded-lg cursor-pointer transition ${
            isSelected
              ? 'bg-cyan-100 dark:bg-cyan-950/80 text-cyan-900 dark:text-cyan-200 font-bold'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {isFolder ? (
            <>
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
              {isExpanded ? (
                <FolderOpen className="w-4 h-4 text-amber-500 shrink-0" />
              ) : (
                <Folder className="w-4 h-4 text-amber-500 shrink-0" />
              )}
            </>
          ) : (
            <>
              <span className="w-3.5 shrink-0" />
              <FileCode className="w-4 h-4 text-cyan-500 shrink-0" />
            </>
          )}

          <span className="truncate">{node.name}</span>
          {!isFolder && node.sizeBytes && (
            <span className="text-[10px] text-slate-400 font-mono ml-auto">
              {(node.sizeBytes / 1024).toFixed(1)} KB
            </span>
          )}
        </div>

        {isFolder && isExpanded && node.children && (
          <div className="space-y-0.5">
            {node.children.map((child) => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Vault Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <HardDrive className="w-4 h-4" />
            <span>Lokaler Datenspeicher &amp; Dateisystem</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.vaultTitle}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.vaultSubtitle}
          </p>
        </div>

        {/* Global Vault Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>{t.importBackup}</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={handleExportFull}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-700 text-white transition shadow-sm shadow-cyan-600/20 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.exportBackup}</span>
          </button>

          <button
            onClick={handleResetDemo}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title={t.resetDemo}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Vault Split-Pane Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Interactive Directory Tree */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-col h-[580px]">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-3 mb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span>Ordner-Hierarchie</span>
            <span className="font-mono text-[10px] text-cyan-600">JSON Tree</span>
          </div>

          <div className="overflow-y-auto flex-1 pr-1 space-y-0.5">
            {renderTreeNode(rootVault, 0)}
          </div>
        </div>

        {/* Right: Selected File Inspector & JSON Viewer */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col h-[580px]">
          {selectedFile ? (
            <>
              {/* File details bar */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <div>
                    <h3 className="font-bold text-xs text-slate-900 dark:text-white font-mono">
                      {selectedFile.path}
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      {selectedFile.sizeBytes} Bytes · Modifiziert: {selectedFile.lastModified || 'Aktuell'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopyContent}
                    className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copied ? 'Kopiert' : 'Kopieren'}</span>
                  </button>

                  <button
                    onClick={handleDownloadSelected}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              {/* JSON code view */}
              <div className="flex-1 bg-slate-950 rounded-xl p-4 overflow-auto font-mono text-[11px] text-emerald-400 border border-slate-800">
                <pre>{selectedFile.content}</pre>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
              Wähle eine JSON-Datei im Ordnerbaum aus, um den Inhalt einzusehen.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
