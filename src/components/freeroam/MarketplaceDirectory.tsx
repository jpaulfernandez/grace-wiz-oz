import { useState } from 'react'
import { MARKETPLACE_ENTITIES, MarketplaceEntity } from '../../config/freeRoamContent'
import { ArrowLeft, Search, CheckCircle, MapPin, Eye, Star, HeartHandshake, Phone, CalendarCheck } from 'lucide-react'

export function MarketplaceDirectory() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [entities] = useState<MarketplaceEntity[]>(MARKETPLACE_ENTITIES)
  const [sessionScheduled, setSessionScheduled] = useState(false)

  const filtered = entities.filter(ent => {
    // Treat Free Service as matching tag "Free Service" or specific pro-bono names
    const matchesFilter = activeFilter === 'All' ||
                          ent.tag === activeFilter ||
                          (activeFilter === 'Free Service' && (ent.name.includes('PAO') || ent.name.includes('Gabriela')))
    const matchesSearch = ent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ent.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ent.specialty.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const activeEnt = entities.find(e => e.id === selectedId)

  const handleScheduleSession = () => {
    setSessionScheduled(true)
    setTimeout(() => setSessionScheduled(false), 4000)
  }

  if (activeEnt) {
    const isClinicsOrLegal = activeEnt.tag === 'Clinics' || activeEnt.tag === 'Legal'

    return (
      <div className="space-y-5 text-left animate-fade-in p-1">
        <button
          onClick={() => {
            setSelectedId(null)
            setSessionScheduled(false)
          }}
          className="flex items-center space-x-1 text-xs font-inter font-medium text-primary hover:underline mb-2 focus:outline-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Referrals</span>
        </button>

        {sessionScheduled && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-card text-xs font-inter text-emerald-800 leading-relaxed animate-fade-in flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">Request Submitted</strong>
              <span>Session request submitted securely via client credentials. A coordinator will verify and respond within 24 hours.</span>
            </div>
          </div>
        )}

        <div className="bg-white border border-border-divider rounded-card p-5 space-y-4 shadow-sm">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 bg-secondary-container text-secondary text-[9px] font-mono rounded font-semibold uppercase tracking-wider">
                {activeEnt.tag}
              </span>
              <div className="flex items-center space-x-1 text-xs text-amber-500 font-mono">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>4.9</span>
              </div>
            </div>
            <h2 className="text-base font-semibold font-newsreader text-on-surface">
              {activeEnt.name}
            </h2>
            <div className="flex items-center space-x-1 text-[11px] font-inter text-text-secondary">
              <MapPin className="w-3.5 h-3.5 text-text-muted" />
              <span>{activeEnt.location}</span>
            </div>
          </div>

          {/* Specialty */}
          <div className="border-t border-border-divider pt-3 space-y-1">
            <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider block">Specialization</span>
            <p className="text-xs font-inter font-medium text-on-surface">
              {activeEnt.specialty}
            </p>
          </div>

          {/* Clinics / Legal Schedule Button */}
          {isClinicsOrLegal && (
            <button
              onClick={handleScheduleSession}
              className="w-full mt-4 flex items-center justify-center space-x-2 py-2.5 bg-primary text-white rounded-input text-xs font-inter font-semibold hover:bg-opacity-95 active:scale-95 transition-all shadow-sm focus:outline-none"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Schedule a Session</span>
            </button>
          )}

          {/* Free Service / NGO Details */}
          {!isClinicsOrLegal && (activeEnt.contact || activeEnt.mapsLink) && (
            <div className="border-t border-border-divider pt-3 space-y-3">
              {activeEnt.contact && (
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider block">Contact Hotline</span>
                  <div className="flex items-center space-x-1.5 text-xs font-inter text-on-surface">
                    <Phone className="w-3.5 h-3.5 text-text-muted" />
                    <span className="font-medium select-all">{activeEnt.contact}</span>
                  </div>
                </div>
              )}
              {activeEnt.mapsLink && (
                <div className="pt-1">
                  <a
                    href={activeEnt.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-border-divider text-xs text-primary hover:bg-primary-container/20 transition-all font-inter font-semibold"
                  >
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span>How to get there &rarr;</span>
                  </a>
                </div>
              )}
            </div>
          )}

          {/* External Referral Disclaimer Notice */}
          {!isClinicsOrLegal && (
            <div className="p-3.5 mt-4 bg-neutral-50 border border-border-divider rounded-card text-[11px] font-inter text-text-secondary leading-relaxed shadow-sm select-none">
              <span className="font-semibold text-on-surface block mb-0.5">ℹ️ Referral Notice</span>
              Note: These services are external and not officially partnered with Grace. The assistance we provide here is limited to contact details and routing information.
            </div>
          )}
        </div>

        {/* What to expect */}
        <div className="bg-white border border-border-divider rounded-card p-5 space-y-3 shadow-sm">
          <div className="flex items-center space-x-2 text-on-surface font-inter font-semibold text-xs uppercase tracking-wider">
            <Eye className="w-4 h-4 text-primary" />
            <span>What to expect</span>
          </div>
          <ul className="text-xs font-inter text-text-secondary space-y-2 list-disc pl-4 leading-relaxed">
            {activeEnt.expect.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Community Reviews */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Client Reviews
          </h4>
          <div className="space-y-3">
            {activeEnt.reviews.map((rev, idx) => (
              <div key={idx} className="bg-white border border-border-divider rounded-card p-4 text-xs font-inter text-text-secondary leading-relaxed shadow-sm">
                <p>"{rev}"</p>
                <div className="flex items-center space-x-1.5 mt-2.5 text-[9px] font-mono text-primary">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Trauma-Informed Practice Certified</span>
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
            placeholder="Search specialties, clinics..."
            className="w-full pl-9 pr-4 py-2 border border-border-divider rounded-input text-xs font-inter bg-white focus:outline-none focus:border-primary shadow-sm"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-1.5 pb-1">
          {['All', 'Clinics', 'Legal', 'Free Service', 'NGO'].map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveFilter(tag)}
              className={`px-3 py-1 rounded-full text-[10px] font-inter font-semibold transition-all border focus:outline-none ${
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

      {/* Directory list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 border border-dashed border-border-divider rounded-card text-center">
            <p className="text-xs font-inter text-text-muted">No services matched your query.</p>
          </div>
        ) : (
          filtered.map((ent) => (
            <div
              key={ent.id}
              onClick={() => setSelectedId(ent.id)}
              className="bg-white border border-border-divider rounded-card p-5 hover:border-primary hover:shadow-md cursor-pointer transition-all shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-secondary-container text-secondary text-[8px] font-mono rounded font-semibold uppercase">
                    {ent.tag}
                  </span>
                  <span className="text-[9px] font-mono text-text-muted">{ent.location}</span>
                </div>
                <h4 className="text-sm font-semibold font-newsreader text-on-surface leading-snug">
                  {ent.name}
                </h4>
                <p className="text-xs font-inter text-text-secondary leading-relaxed line-clamp-2">
                  {ent.specialty}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-border-divider mt-4 pt-3 text-[9px] font-mono text-text-muted">
                <div className="flex items-center space-x-1">
                  <HeartHandshake className="w-3 h-3 text-secondary" />
                  <span>Trauma-informed care</span>
                </div>
                <span className="text-primary font-semibold font-inter flex items-center space-x-0.5">
                  <span>View profile</span>
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
