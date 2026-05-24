import { useState } from 'react'
import { INSTITUTIONS, Institution } from '../../config/freeRoamContent'
import { ArrowLeft, Search, ShieldCheck, MapPin, ClipboardList, Eye, Star } from 'lucide-react'

export function PathwaysDirectory() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [institutions] = useState<Institution[]>(INSTITUTIONS)

  const filtered = institutions.filter(inst => {
    const matchesFilter = activeFilter === 'All' || inst.tag === activeFilter
    const matchesSearch = inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inst.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inst.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const activeInst = institutions.find(i => i.id === selectedId)

  if (activeInst) {
    return (
      <div className="space-y-5 text-left animate-fade-in p-1">
        <button
          onClick={() => setSelectedId(null)}
          className="flex items-center space-x-1 text-xs font-inter font-medium text-primary hover:underline mb-2 focus:outline-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Directory</span>
        </button>

        <div className="bg-white border border-border-divider rounded-card p-5 space-y-4 shadow-sm">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 bg-primary-container text-primary text-xs font-mono rounded font-semibold uppercase tracking-wider">
                {activeInst.tag}
              </span>
              <div className="flex items-center space-x-1 text-xs text-amber-500 font-mono">
                <Star className="w-3.5 h-3.5 fill-amber-500" />
                <span>4.8</span>
              </div>
            </div>
            <h2 className="text-base font-semibold font-newsreader text-on-surface">
              {activeInst.name}
            </h2>
            <div className="flex items-center space-x-1 text-[11px] font-inter text-text-secondary">
              <MapPin className="w-3.5 h-3.5 text-text-muted" />
              <span>{activeInst.location}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs font-inter text-text-secondary leading-relaxed border-t border-border-divider pt-3">
            {activeInst.description}
          </p>
        </div>

        {/* What to prepare checklist */}
        <div className="bg-white border border-border-divider rounded-card p-5 space-y-3 shadow-sm">
          <div className="flex items-center space-x-2 text-on-surface font-inter font-semibold text-xs uppercase tracking-wider">
            <ClipboardList className="w-4 h-4 text-primary" />
            <span>What to prepare</span>
          </div>
          <ul className="text-xs font-inter text-text-secondary space-y-2 list-disc pl-4 leading-relaxed">
            {activeInst.prepare.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        {/* What to expect */}
        <div className="bg-white border border-border-divider rounded-card p-5 space-y-3 shadow-sm">
          <div className="flex items-center space-x-2 text-on-surface font-inter font-semibold text-xs uppercase tracking-wider">
            <Eye className="w-4 h-4 text-secondary" />
            <span>What to expect</span>
          </div>
          <ul className="text-xs font-inter text-text-secondary space-y-2 list-disc pl-4 leading-relaxed">
            {activeInst.expect.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Community Reviews */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Community Experiences
          </h4>
          <div className="space-y-3">
            {activeInst.reviews.map((rev, idx) => (
              <div key={idx} className="bg-white border border-border-divider rounded-card p-4 text-xs font-inter text-text-secondary leading-relaxed shadow-sm">
                <p>"{rev}"</p>
                <div className="flex items-center space-x-1.5 mt-2.5 text-[9px] font-mono text-secondary">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Safe Experience</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5 text-left animate-fade-in p-1">
      {/* Search & Filter Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search barangays, police desks..."
            className="w-full pl-9 pr-4 py-2 border border-border-divider rounded-input text-xs font-inter bg-white focus:outline-none focus:border-primary shadow-sm"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-1.5 pb-1">
          {['All', 'Near Me', 'Positive Experience', 'NGO', 'Government', 'Legal'].map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveFilter(tag)}
              className={`px-3 py-2 rounded-full text-[10px] font-inter font-semibold transition-all border focus:outline-none active:border-primary active:bg-primary/5 ${
                activeFilter === tag
                  ? 'bg-primary border-primary text-on-primary shadow-sm'
                  : 'bg-white border-border-divider text-text-secondary hover:border-text-muted'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Institution cards list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 border border-dashed border-border-divider rounded-card text-center">
            <p className="text-xs font-inter text-text-muted">No institutions matched your query.</p>
          </div>
        ) : (
          filtered.map((inst) => (
            <div
              key={inst.id}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') setSelectedId(inst.id) }}
              onClick={() => setSelectedId(inst.id)}
              className="bg-white border border-border-divider rounded-card p-5 hover:border-primary hover:shadow-md active:border-primary active:shadow-md cursor-pointer transition-all shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-primary-container text-primary text-xs font-mono rounded font-semibold uppercase">
                    {inst.tag}
                  </span>
                  <span className="text-[9px] font-mono text-text-muted">{inst.location}</span>
                </div>
                <h4 className="text-sm font-semibold font-newsreader text-on-surface leading-snug">
                  {inst.name}
                </h4>
                <p className="text-xs font-inter text-text-secondary leading-relaxed line-clamp-2">
                  {inst.description}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-border-divider mt-4 pt-3 text-[9px] font-mono text-text-muted">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{inst.location}</span>
                </div>
                <span className="text-primary font-semibold font-inter flex items-center space-x-0.5">
                  <span>View checklist</span>
                  <span>&rarr;</span>
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
