import React, { useState } from 'react';
import { X, Download, GitBranch, Github, CheckCircle2, AlertCircle, Copy, ExternalLink, Terminal } from 'lucide-react';

interface GitExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitExportModal: React.FC<GitExportModalProps> = ({ isOpen, onClose }) => {
  const [repoUrl, setRepoUrl] = useState('https://github.com/Sethos21/VastgoedPulse.git');
  const [githubToken, setGithubToken] = useState('');
  const [isPushing, setIsPushing] = useState(false);
  const [pushStatus, setPushStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedCmd, setCopiedCmd] = useState(false);

  if (!isOpen) return null;

  const handleDownloadZip = () => {
    window.location.href = '/api/git/download-zip';
  };

  const handleDirectPush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;

    setIsPushing(true);
    setPushStatus(null);

    try {
      const res = await fetch('/api/git/push-github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoUrl: repoUrl.trim(),
          token: githubToken.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPushStatus({
          success: true,
          message: data.message || 'Succesvol gepusht naar je GitHub repository!',
        });
      } else {
        setPushStatus({
          success: false,
          message: data.error || 'Pushen mislukt. Controleer token permissies (repo write) en URL.',
        });
      }
    } catch (err: any) {
      setPushStatus({
        success: false,
        message: err.message || 'Netwerkfout bij pushen naar GitHub',
      });
    } finally {
      setIsPushing(false);
    }
  };

  const terminalScript = `# Stap 1: Pak de ZIP uit en open je terminal in de map
cd vastgoedpulse-nl

# Stap 2: Initialiseer Git en voeg alle bestanden toe
git init
git branch -M main
git add .
git commit -m "feat: VastgoedPulse NL complete platform"

# Stap 3: Koppel aan je GitHub repo en push
git remote add origin https://github.com/Sethos21/VastgoedPulse.git
git push -u origin main --force`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(terminalScript);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800 rounded-lg text-white border border-slate-700">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Project & GitHub Export</h2>
              <p className="text-xs text-slate-400">Download broncode of push direct naar je eigen GitHub-account</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Method 1: Instant ZIP download */}
          <div className="p-5 bg-gradient-to-br from-cyan-950/30 to-slate-800/40 border border-cyan-800/40 rounded-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Aanbevolen & Direct</span>
                <h3 className="text-base font-bold text-white mt-0.5">Download volledige Git Repository (.ZIP)</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Bevat alle 36 bronbestanden, Firebase `vastgoedpulse` configuratie, PDOK proxy en git commit geschiedenis.
                </p>
              </div>
              <button
                onClick={handleDownloadZip}
                className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-sm rounded-lg transition-all shadow-lg shadow-cyan-950/50 cursor-pointer shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Download .ZIP</span>
              </button>
            </div>
          </div>

          {/* Method 2: Direct push via Web UI */}
          <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-4">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Direct pushen naar een GitHub Repository</h3>
            </div>
            <p className="text-xs text-slate-400">
              Heb je al een lege repo op GitHub? Vul de repository-URL en optioneel een Personal Access Token in om de code direct vanaf hier naar GitHub te pushen.
            </p>

            <form onSubmit={handleDirectPush} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  GitHub Repository URL (HTTPS)
                </label>
                <input
                  type="text"
                  placeholder="https://github.com/jouw-gebruikersnaam/vastgoedpulse-nl.git"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-slate-300">
                    GitHub Personal Access Token (Optioneel / bij privé repo)
                  </label>
                  <a
                    href="https://github.com/settings/tokens"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <span>Token aanmaken</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <input
                  type="password"
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Vereist 'repo' permissie om commits te mogen pushen naar GitHub.
                </p>
              </div>

              {pushStatus && (
                <div
                  className={`p-3 rounded-lg border text-xs flex items-start gap-2 ${
                    pushStatus.success
                      ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-800 text-rose-300'
                  }`}
                >
                  {pushStatus.success ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  )}
                  <span>{pushStatus.message}</span>
                </div>
              )}

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={isPushing || !repoUrl.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>{isPushing ? 'Bezig met pushen...' : 'Push naar GitHub'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Method 3: Terminal commands */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Handmatig via Terminal (na downloaden van ZIP)</span>
              </div>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded transition-colors cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedCmd ? 'Gekopieerd!' : 'Kopieer'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-900 rounded-lg text-xs font-mono text-cyan-300/90 overflow-x-auto border border-slate-800">
              {terminalScript}
            </pre>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Sluiten
          </button>
        </div>
      </div>
    </div>
  );
};
