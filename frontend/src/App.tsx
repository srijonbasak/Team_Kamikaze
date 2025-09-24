import { useState } from 'react'
import Chat from './pages/Chat'
import Trace from './pages/Trace'
import Dashboard from './pages/Dashboard'

export default function App() {
  const [tab, setTab] = useState<'chat'|'trace'|'dash'>('chat')
  return (
    <div className="max-w-5xl mx-auto p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Gateway Social Control</h1>
        <nav className="space-x-2">
          <button onClick={()=>setTab('chat')} className={`px-3 py-1 rounded ${tab==='chat'?'bg-black text-white':'bg-gray-200'}`}>Chat</button>
          <button onClick={()=>setTab('trace')} className={`px-3 py-1 rounded ${tab==='trace'?'bg-black text-white':'bg-gray-200'}`}>Trace</button>
          <button onClick={()=>setTab('dash')} className={`px-3 py-1 rounded ${tab==='dash'?'bg-black text-white':'bg-gray-200'}`}>Dashboard</button>
        </nav>
      </header>
      {tab==='chat' && <Chat />}
      {tab==='trace' && <Trace />}
      {tab==='dash' && <Dashboard />}
    </div>
  )
}
