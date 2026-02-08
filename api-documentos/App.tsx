
import React, { useState, useEffect } from 'react';
import { 
  Documento, 
  TabNames, 
  FileData 
} from './types';
import { 
  APP_JS_CONTENT, 
  DOCKERFILE_CONTENT, 
  GITHUB_ACTIONS_CONTENT, 
  README_CONTENT,
  SLO_MD_CONTENT,
  POSTMORTEM_CONTENT
} from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabNames>(TabNames.DASHBOARD);
  const [docs, setDocs] = useState<Documento[]>([
    { id: 1, titulo: 'Plan de Proyecto v1', estado: 'Publicado', fecha_creacion: '2024-05-15' },
    { id: 2, titulo: 'Especificación API', estado: 'Revisión', fecha_creacion: '2024-05-18' },
  ]);
  const [newTitle, setNewTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const addDoc = () => {
    if (!newTitle) return;
    setIsLoading(true);
    setTimeout(() => {
      const newDoc: Documento = {
        id: docs.length + 1,
        titulo: newTitle,
        estado: 'Borrador',
        fecha_creacion: new Date().toISOString().split('T')[0]
      };
      setDocs([...docs, newDoc]);
      setNewTitle('');
      setIsLoading(false);
    }, 400);
  };

  const deleteDoc = (id: number) => {
    setDocs(docs.filter(d => d.id !== id));
  };

  const files: FileData[] = [
    { name: 'app.js', content: APP_JS_CONTENT, language: 'javascript' },
    { name: 'Dockerfile', content: DOCKERFILE_CONTENT, language: 'dockerfile' },
    { name: 'ci-cd.yml', content: GITHUB_ACTIONS_CONTENT, language: 'yaml' },
    { name: 'README.md', content: README_CONTENT, language: 'markdown' },
    { name: 'SLO.md', content: SLO_MD_CONTENT, language: 'markdown' },
    { name: 'postmortem.md', content: POSTMORTEM_CONTENT, language: 'markdown' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-indigo-700 text-white shadow-lg p-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">API de Documentos</h1>
            <p className="text-indigo-200 text-sm mt-1">Diseñado por Anastasia Mecheba Melango</p>
          </div>
          <nav className="flex gap-2 bg-indigo-800 p-1 rounded-lg">
            {Object.values(TabNames).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md transition-all text-sm font-medium ${
                  activeTab === tab ? 'bg-white text-indigo-700 shadow-md' : 'hover:bg-indigo-700'
                }`}
              >
                {tab === TabNames.DASHBOARD ? 'Dashboard' :
                 tab === TabNames.SERVER_CODE ? 'Código' :
                 tab === TabNames.DOCS ? 'Docs' : 'Pipeline'}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
        
        {/* Tab: Dashboard / Simulator */}
        {activeTab === TabNames.DASHBOARD && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Simulador de API REST</h2>
              <div className="flex gap-2 mb-6">
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Título del nuevo documento..."
                  className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button 
                  onClick={addDoc}
                  disabled={isLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Creando...' : 'Crear Documento'}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b text-gray-500 text-sm uppercase">
                      <th className="pb-3 pl-4">ID</th>
                      <th className="pb-3">Título</th>
                      <th className="pb-3">Estado</th>
                      <th className="pb-3">Fecha</th>
                      <th className="pb-3 text-right pr-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {docs.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 pl-4 text-gray-400">#{doc.id}</td>
                        <td className="py-4 font-medium text-gray-900">{doc.titulo}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            doc.estado === 'Publicado' ? 'bg-green-100 text-green-700' :
                            doc.estado === 'Revisión' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {doc.estado}
                          </span>
                        </td>
                        <td className="py-4 text-gray-500">{doc.fecha_creacion}</td>
                        <td className="py-4 text-right pr-4">
                          <button 
                            onClick={() => deleteDoc(doc.id)}
                            className="text-red-500 hover:text-red-700 font-medium text-sm"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-xl">
                <h3 className="text-indigo-900 font-bold text-lg mb-1">Métrica: Latencia</h3>
                <p className="text-indigo-700 text-3xl font-extrabold">242ms</p>
                <p className="text-indigo-500 text-xs mt-2">✓ Cumple SLO (&lt;300ms)</p>
              </div>
              <div className="bg-green-50 border border-green-100 p-5 rounded-xl">
                <h3 className="text-green-900 font-bold text-lg mb-1">Disponibilidad</h3>
                <p className="text-green-700 text-3xl font-extrabold">99.98%</p>
                <p className="text-green-500 text-xs mt-2">✓ Cumple SLO (&gt;99.5%)</p>
              </div>
              <div className="bg-gray-800 text-white p-5 rounded-xl shadow-inner overflow-hidden relative">
                <h3 className="text-gray-300 font-bold text-sm mb-2">Logs Recientes (JSON)</h3>
                <pre className="text-[10px] text-gray-400 font-mono">
                  {`{"ts":"2024-05-20T10:00:01","lvl":"INFO","msg":"Health Check OK","auth":"Anastasia"}\n{"ts":"2024-05-20T10:00:05","lvl":"INFO","msg":"Doc 123 creado","auth":"Anastasia"}`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Server Code */}
        {activeTab === TabNames.SERVER_CODE && (
          <div className="bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
            <div className="bg-gray-800 p-3 flex gap-2 border-b border-gray-700 overflow-x-auto">
              {files.map(f => (
                <button 
                  key={f.name}
                  className="px-3 py-1 text-xs font-mono text-gray-300 bg-gray-700 rounded hover:bg-gray-600"
                  onClick={() => {
                    const el = document.getElementById(`file-${f.name}`);
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {f.name}
                </button>
              ))}
            </div>
            <div className="p-6 h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 font-mono text-sm">
              {files.map(file => (
                <div key={file.name} id={`file-${file.name}`} className="mb-12">
                  <h3 className="text-indigo-400 mb-2 font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                    Archivo: {file.name}
                  </h3>
                  <pre className="bg-gray-800 p-4 rounded-lg text-gray-300 border border-gray-700 whitespace-pre-wrap">
                    {file.content}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Documentation */}
        {activeTab === TabNames.DOCS && (
          <div className="grid md:grid-cols-2 gap-8 animate-fadeIn">
            <div className="bg-white p-8 rounded-xl shadow-sm border prose max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">SLO.md</h2>
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {SLO_MD_CONTENT}
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border prose max-w-none border-red-100">
              <h2 className="text-2xl font-bold text-red-900 mb-4">Postmortem.md</h2>
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed italic">
                {POSTMORTEM_CONTENT}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Pipeline */}
        {activeTab === TabNames.PIPELINE && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Pipeline de GitHub Actions
              </h2>
              <div className="space-y-4">
                {[
                  { name: 'Build & Install', status: 'Success', time: '45s' },
                  { name: 'ESLint Check', status: 'Success', time: '12s' },
                  { name: 'Jest Unit Tests (84% Cobertura)', status: 'Success', time: '1m 20s' },
                  { name: 'CodeQL Security Analysis', status: 'Success', time: '2m 15s' },
                  { name: 'Docker Build & Multi-stage Opt', status: 'Success', time: '3m 10s' },
                  { name: 'Trivy Vuln Scan (0 Critical)', status: 'Success', time: '45s' },
                  { name: 'Push to GHCR', status: 'Success', time: '15s' },
                  { name: 'Smoke Test /health', status: 'Success', time: '5s' },
                ].map((job, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="font-medium text-gray-700">{job.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-400">{job.time}</span>
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">✓ {job.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-indigo-900 text-indigo-100 p-6 rounded-xl shadow-lg">
              <h3 className="font-bold text-lg mb-2">Comandos Rápidos CI/CD</h3>
              <p className="text-sm text-indigo-300 mb-4">Ejecutados automáticamente en cada push por Anastasia:</p>
              <code className="block bg-indigo-950 p-4 rounded text-xs font-mono text-indigo-200">
                # Generar reporte de cobertura<br/>
                npm test -- --coverage<br/><br/>
                # Escaneo de seguridad local<br/>
                trivy image api-documentos:latest
              </code>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t p-8 mt-12 text-center text-gray-500 text-sm">
        <p>&copy; 2024 Anastasia Mecheba Melango. Todos los derechos reservados.</p>
        <p className="mt-1 italic">"Calidad de software y observabilidad garantizada"</p>
      </footer>
    </div>
  );
};

export default App;
