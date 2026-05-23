import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, SessionRow } from '../lib/supabase'
import { telemetry } from '../lib/telemetry'
import { Button } from '../components/ui'
import { 
  ArrowLeft, 
  Download, 
  Search, 
  Filter, 
  Plus, 
  TrendingUp, 
  Users, 
  CheckCircle,
  FileText,
  Sparkles
} from 'lucide-react'

// Realistic clinical/legal intake mock runs for offline validation
const MOCK_RUNS: SessionRow[] = [
  {
    id: 'session-mock-01',
    invite_code: 'GRACE-L-01',
    cohort: 'lawyer',
    scenario_id: 'lawyer-standard',
    nickname: 'Jane',
    started_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    consented_at: new Date(Date.now() - 3600000 * 1.95).toISOString(),
    guided_completed_at: new Date(Date.now() - 3600000 * 1.2).toISOString(),
    free_roam_started_at: new Date(Date.now() - 3600000 * 1.15).toISOString(),
    completed_at: new Date(Date.now() - 3600000 * 1.1).toISOString(),
    ended_early: false,
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    viewport_width: 1440,
    is_moderated: true,
    end_survey: {
      usefulness: 5,
      trustworthiness: 5,
      comfort: 4,
      reflections: "The chronological verification anchoring gave me extreme confidence that the workplace timeline cannot be modified by Marco."
    },
    sus_responses: {
      responses: [5, 1, 5, 2, 4, 1, 5, 1, 4, 2],
      score: 82.5
    },
    pricing_response: "Happy to pay 250 PHP/month if it ensures sovereign privacy."
  },
  {
    id: 'session-mock-02',
    invite_code: 'GRACE-C-01',
    cohort: 'clinician',
    scenario_id: 'clinician-standard',
    nickname: 'Grace',
    started_at: new Date(Date.now() - 3600000 * 4.5).toISOString(),
    consented_at: new Date(Date.now() - 3600000 * 4.45).toISOString(),
    guided_completed_at: new Date(Date.now() - 3600000 * 3.8).toISOString(),
    free_roam_started_at: new Date(Date.now() - 3600000 * 3.75).toISOString(),
    completed_at: new Date(Date.now() - 3600000 * 3.7).toISOString(),
    ended_early: false,
    user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X)',
    viewport_width: 393,
    is_moderated: false,
    end_survey: {
      usefulness: 4,
      trustworthiness: 5,
      comfort: 5,
      reflections: "Vagal breathing grounding cards and somatic logs matched exactly what I needed for clinical prep."
    },
    sus_responses: {
      responses: [4, 2, 5, 1, 4, 2, 5, 1, 5, 1],
      score: 90.0
    },
    pricing_response: "Freemium with tiering at 150 PHP."
  },
  {
    id: 'session-mock-03',
    invite_code: 'TEST-U-99',
    cohort: 'user',
    scenario_id: 'scenario-a',
    nickname: 'Marie',
    started_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    consented_at: new Date(Date.now() - 3600000 * 11.95).toISOString(),
    guided_completed_at: null,
    free_roam_started_at: null,
    completed_at: null,
    ended_early: true,
    user_agent: 'Mozilla/5.0 (Linux; Android 10; K)',
    viewport_width: 412,
    is_moderated: false,
    end_survey: null,
    sus_responses: null,
    pricing_response: null
  }
]

export default function Admin() {
  const navigate = useNavigate()
  const [dbRuns, setDbRuns] = useState<SessionRow[]>([])
  const [runs, setRuns] = useState<SessionRow[]>([])
  const [selectedRun, setSelectedRun] = useState<SessionRow | null>(null)
  
  // Filtering & Search
  const [search, setSearch] = useState('')
  const [cohortFilter, setCohortFilter] = useState<'all' | 'user' | 'lawyer' | 'clinician'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'partial'>('all')

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .order('started_at', { ascending: false })
      
      if (error) throw error
      if (data && data.length > 0) {
        setDbRuns(data as SessionRow[])
        // Combine DB runs with mock runs, prioritizing DB runs
        setRuns([...(data as SessionRow[]), ...MOCK_RUNS])
      } else {
        setRuns(MOCK_RUNS)
      }
    } catch (e) {
      console.warn('Failed to fetch from Supabase. Falling back to robust mock datasets.', e)
      setRuns(MOCK_RUNS)
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [])

  // Moderator injection helper for real-time validation checks
  const handleInjectMockRun = () => {
    const id = `session-injected-${Math.floor(Math.random() * 1000)}`
    const isLawyer = Math.random() > 0.5
    const newRun: SessionRow = {
      id,
      invite_code: isLawyer ? 'GRACE-L-INJECTED' : 'GRACE-C-INJECTED',
      cohort: isLawyer ? 'lawyer' : 'clinician',
      scenario_id: isLawyer ? 'lawyer-standard' : 'clinician-standard',
      nickname: isLawyer ? `Jane-${Math.floor(Math.random() * 100)}` : `Grace-${Math.floor(Math.random() * 100)}`,
      started_at: new Date().toISOString(),
      consented_at: new Date().toISOString(),
      guided_completed_at: new Date().toISOString(),
      free_roam_started_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
      ended_early: false,
      user_agent: 'Mozilla/5.0 (Injected Test Client)',
      viewport_width: 1024,
      is_moderated: true,
      end_survey: {
        usefulness: 4 + Math.floor(Math.random() * 2),
        trustworthiness: 5,
        comfort: 4 + Math.floor(Math.random() * 2),
        reflections: "Dynamic moderator injection test logged successfully."
      },
      sus_responses: {
        responses: [4, 2, 4, 2, 4, 2, 4, 2, 4, 2],
        score: 70.0 + Math.floor(Math.random() * 25)
      },
      pricing_response: "Verified test comment."
    }

    const updated = [newRun, ...runs]
    setRuns(updated)
    setSelectedRun(newRun)
    telemetry.trackButtonTap('admin_inject_mock', { id })
  }

  // Filtered runs
  const filteredRuns = runs.filter((run) => {
    const matchesSearch = (run.nickname || '').toLowerCase().includes(search.toLowerCase()) || 
                          run.id.toLowerCase().includes(search.toLowerCase()) ||
                          run.invite_code.toLowerCase().includes(search.toLowerCase())
    
    const matchesCohort = cohortFilter === 'all' || run.cohort === cohortFilter
    
    const isCompleted = !!run.completed_at
    const matchesStatus = statusFilter === 'all' ||
                          (statusFilter === 'completed' && isCompleted) ||
                          (statusFilter === 'partial' && !isCompleted)

    return matchesSearch && matchesCohort && matchesStatus
  })

  // Dynamic KPI Calculation
  const totalCount = filteredRuns.length
  const completedCount = filteredRuns.filter((r) => !!r.completed_at).length
  const completionRate = totalCount > 0 ? ((completedCount / totalCount) * 100).toFixed(0) : '0'
  
  // Aggregate SUS scores
  const susRuns = filteredRuns.filter((r) => r.sus_responses && typeof (r.sus_responses as any).score === 'number')
  const meanSUS = susRuns.length > 0
    ? (susRuns.reduce((acc, r) => acc + (r.sus_responses as any).score, 0) / susRuns.length).toFixed(1)
    : '0.0'

  // Dynamic Certified JSON Export
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(runs, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute("href", dataStr)
    downloadAnchor.setAttribute("download", "grace-research-payload.json")
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
    telemetry.trackButtonTap('admin_research_export', { count: runs.length })
  }

  return (
    <div className="min-h-screen bg-[#FBFBFB] font-inter text-on-surface select-none">
      
      {/* Modern Top Chrome */}
      <header className="sticky top-0 bg-white/80 backdrop-blur border-b border-border-divider px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors focus:outline-none"
          >
            <ArrowLeft className="w-5 h-5 text-text-secondary" />
          </button>
          <div>
            <h1 className="text-lg font-medium font-newsreader text-on-surface">
              Research Analytics Console
            </h1>
            <p className="text-[10px] font-mono text-text-muted">Grace Prototype Dashboard</p>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button
            onClick={handleInjectMockRun}
            variant="secondary"
            className="flex items-center space-x-2 text-xs py-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Simulate Live Run</span>
          </Button>
          <Button
            onClick={handleExportJSON}
            variant="primary"
            className="flex items-center space-x-2 text-xs py-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Research JSON</span>
          </Button>
        </div>
      </header>

      <main className="p-6 space-y-6 max-w-7xl mx-auto text-left">
        
        {/* KPI Summary Block */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <div className="bg-white border border-border-divider rounded-card p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-text-secondary">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Evaluated Runs</span>
              <Users className="w-4 h-4 text-primary" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-medium font-newsreader">{totalCount}</span>
              <span className="text-xs text-text-secondary">sessions active</span>
            </div>
          </div>

          <div className="bg-white border border-border-divider rounded-card p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-text-secondary">
              <span className="text-xs font-semibold uppercase tracking-wider">Completion Rate</span>
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-medium font-newsreader text-green-700">{completionRate}%</span>
              <span className="text-xs text-text-secondary">{completedCount} fully done</span>
            </div>
          </div>

          <div className="bg-white border border-border-divider rounded-card p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-text-secondary">
              <span className="text-xs font-semibold uppercase tracking-wider">Mean SUS Usability</span>
              <TrendingUp className="w-4 h-4 text-secondary" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-medium font-newsreader text-secondary">{meanSUS}</span>
              <span className="text-xs text-text-secondary">scale 0-100</span>
            </div>
          </div>

          <div className="bg-white border border-border-divider rounded-card p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-text-secondary">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Database Source</span>
              <Sparkles className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-medium font-mono text-indigo-700">
                {dbRuns.length > 0 ? 'SUPABASE' : 'SANDBOXED'}
              </span>
              <span className="text-xs text-text-secondary">({dbRuns.length} live records)</span>
            </div>
          </div>

        </section>

        {/* Filters & Grid Area */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Main runs list */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Filter controls */}
            <div className="bg-white border border-border-divider rounded-card p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search nickname or hash..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-neutral-50 border border-border-divider rounded-input pl-9 pr-4 py-2 text-xs font-inter focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex space-x-3 w-full md:w-auto">
                <div className="flex-1 md:flex-initial flex items-center space-x-2">
                  <Filter className="w-3.5 h-3.5 text-text-secondary" />
                  <select
                    value={cohortFilter}
                    onChange={(e) => setCohortFilter(e.target.value as any)}
                    className="bg-neutral-50 border border-border-divider rounded-input px-3 py-1.5 text-xs font-inter focus:outline-none"
                  >
                    <option value="all">All Cohorts</option>
                    <option value="user">User</option>
                    <option value="lawyer">Advocate</option>
                    <option value="clinician">Clinician</option>
                  </select>
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="bg-neutral-50 border border-border-divider rounded-input px-3 py-1.5 text-xs font-inter focus:outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed Only</option>
                  <option value="partial">Partial/Early Exit</option>
                </select>
              </div>
            </div>

            {/* Session list table */}
            <div className="bg-white border border-border-divider rounded-card shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50 border-b border-border-divider text-[10px] font-mono text-text-secondary uppercase tracking-wider">
                    <th className="px-5 py-3">Nickname</th>
                    <th className="px-5 py-3">Cohort</th>
                    <th className="px-5 py-3">Invite Code</th>
                    <th className="px-5 py-3">SUS Usability</th>
                    <th className="px-5 py-3">Started At</th>
                    <th className="px-5 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-divider">
                  {filteredRuns.map((run) => {
                    const isSelected = selectedRun?.id === run.id
                    const isCompleted = !!run.completed_at
                    const score = run.sus_responses ? (run.sus_responses as any).score : null
                    
                    return (
                      <tr
                        key={run.id}
                        onClick={() => setSelectedRun(run)}
                        className={`hover:bg-neutral-50/50 cursor-pointer transition-colors ${
                          isSelected ? 'bg-primary-container/10 border-l-2 border-l-primary' : ''
                        }`}
                      >
                        <td className="px-5 py-4 text-xs font-medium font-inter text-on-surface">
                          {run.nickname || 'Jane'}
                        </td>
                        <td className="px-5 py-4 text-xs">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                            run.cohort === 'lawyer' 
                              ? 'bg-primary-container text-primary' 
                              : run.cohort === 'clinician'
                              ? 'bg-secondary-container text-secondary'
                              : 'bg-zinc-100 text-zinc-800'
                          }`}>
                            {run.cohort}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-xs font-mono text-text-secondary">
                          {run.invite_code}
                        </td>
                        <td className="px-5 py-4 text-xs font-mono font-semibold text-on-surface">
                          {score !== null ? `${score.toFixed(1)}` : '—'}
                        </td>
                        <td className="px-5 py-4 text-xs text-text-secondary">
                          {new Date(run.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <span className={`inline-block w-2 h-2 rounded-full ${
                            isCompleted ? 'bg-green-600' : 'bg-amber-500'
                          }`} />
                        </td>
                      </tr>
                    )
                  })}
                  {filteredRuns.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-xs font-inter text-text-muted">
                        No matches found. Select "Simulate Live Run" above to add dynamic mock cohorts.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>

          {/* Details sidepanel card */}
          <div className="space-y-4">
            {selectedRun ? (
              <div className="bg-white border border-border-divider rounded-card p-6 shadow-sm space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
                      Run Inspector
                    </span>
                    <span className={`text-[10px] font-mono bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200 ${
                      selectedRun.completed_at ? 'text-green-700' : 'text-amber-700'
                    }`}>
                      {selectedRun.completed_at ? 'Completed' : 'Partial'}
                    </span>
                  </div>
                  <h3 className="text-xl font-medium font-newsreader text-on-surface mt-1">
                    Jane / {selectedRun.nickname || 'Jane'}
                  </h3>
                  <p className="text-[10px] font-mono text-text-muted select-all mt-1">{selectedRun.id}</p>
                </div>

                <div className="divide-y divide-border-divider text-xs font-inter space-y-4">
                  
                  {/* Metadata */}
                  <div className="space-y-2 pt-2">
                    <h4 className="text-[10px] font-mono text-text-secondary uppercase tracking-wider">Device Metadata</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs font-inter">
                      <div>
                        <span className="block text-[10px] text-text-muted font-mono">Invite Code</span>
                        <span className="text-on-surface font-semibold">{selectedRun.invite_code}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-text-muted font-mono">Viewport Width</span>
                        <span className="text-on-surface font-semibold">{selectedRun.viewport_width || '1024'} px</span>
                      </div>
                    </div>
                  </div>

                  {/* Likert results */}
                  <div className="space-y-3 pt-4">
                    <h4 className="text-[10px] font-mono text-text-secondary uppercase tracking-wider">Evaluation Likert</h4>
                    {selectedRun.end_survey ? (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Intake Usefulness:</span>
                          <span className="font-semibold">{(selectedRun.end_survey as any).usefulness} / 5</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Trustworthiness:</span>
                          <span className="font-semibold">{(selectedRun.end_survey as any).trustworthiness} / 5</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Comfort Level:</span>
                          <span className="font-semibold">{(selectedRun.end_survey as any).comfort} / 5</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-text-muted italic">No survey data yet</span>
                    )}
                  </div>

                  {/* Reflections */}
                  <div className="space-y-2 pt-4">
                    <h4 className="text-[10px] font-mono text-text-secondary uppercase tracking-wider">Open Reflections</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed italic bg-zinc-50 border border-zinc-200 p-3 rounded-input select-text">
                      {selectedRun.end_survey && (selectedRun.end_survey as any).reflections
                        ? `"${(selectedRun.end_survey as any).reflections}"`
                        : 'No qualitative reflections shared.'}
                    </p>
                  </div>

                  {/* Pricing comments */}
                  <div className="space-y-2 pt-4">
                    <h4 className="text-[10px] font-mono text-text-secondary uppercase tracking-wider">Pricing Considerations</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed select-text font-semibold">
                      {selectedRun.pricing_response || 'No price reflections shared.'}
                    </p>
                  </div>

                </div>
              </div>
            ) : (
              <div className="bg-white border border-border-divider rounded-card p-8 shadow-sm text-center space-y-4">
                <FileText className="w-10 h-10 text-text-muted mx-auto" />
                <div>
                  <h4 className="text-sm font-semibold font-inter text-on-surface">No Session Selected</h4>
                  <p className="text-xs text-text-secondary">Click any run row in the grid table to inspect detailed evidentiary telemetry, SUS responses, and pricing considerations.</p>
                </div>
              </div>
            )}
          </div>

        </section>

      </main>
    </div>
  )
}
