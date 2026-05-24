import React, { useState } from 'react'
import { COMMUNITY_STORIES, CommunityStory } from '../../config/freeRoamContent'
import { ArrowLeft, MessageSquare, ThumbsUp, PlusCircle, Search } from 'lucide-react'

export function CommunityStories() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [stories, setStories] = useState<CommunityStory[]>(COMMUNITY_STORIES)
  const [newComment, setNewComment] = useState<string>('')

  const handleUpvote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setStories(prev =>
      prev.map(story =>
        story.id === id ? { ...story, upvotes: story.upvotes + 1 } : story
      )
    )
  }

  const handleAddComment = (storyId: string) => {
    if (!newComment.trim()) return
    setStories(prev =>
      prev.map(story => {
        if (story.id === storyId) {
          return {
            ...story,
            replies: [
              ...story.replies,
              { author: 'You (Tester)', text: newComment, date: 'Just now' }
            ]
          }
        }
        return story
      })
    )
    setNewComment('')
  }

  const filtered = stories.filter(story => {
    const matchesFilter = activeFilter === 'All' || story.tag === activeFilter
    const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          story.content.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const activeStory = stories.find(s => s.id === selectedId)

  if (activeStory) {
    return (
      <div className="space-y-5 text-left animate-fade-in p-1">
        <button
          onClick={() => setSelectedId(null)}
          className="flex items-center space-x-1 text-xs font-inter font-medium text-primary hover:underline mb-2 focus:outline-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Q&A Board</span>
        </button>

        <div className="bg-white border border-border-divider rounded-card p-5 space-y-4 shadow-sm">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${
                activeStory.tag === '#NeedHelp' ? 'bg-error-container text-on-error-container' :
                activeStory.tag === '#PositiveStory' ? 'bg-primary-container text-on-primary-container' :
                'bg-secondary-container text-on-secondary-container'
              }`}>
                {activeStory.tag}
              </span>
              <h2 className="text-base font-semibold font-newsreader text-on-surface mt-2 leading-snug">
                {activeStory.title}
              </h2>
              <p className="text-[10px] font-mono text-text-muted mt-1">
                Posted by u/{activeStory.author}
              </p>
            </div>
          </div>

          {/* Body */}
          <p className="text-xs font-inter text-text-secondary leading-relaxed whitespace-pre-line">
            {activeStory.content}
          </p>

          {/* Action Row */}
          <div className="flex items-center space-x-4 border-t border-border-divider pt-4 text-text-muted font-mono text-[10px]">
            <button
              onClick={(e) => handleUpvote(activeStory.id, e)}
              className="flex items-center space-x-1 hover:text-primary transition-colors focus:outline-none"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{activeStory.upvotes} Upvotes</span>
            </button>
            <div className="flex items-center space-x-1">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{activeStory.replies.length} Comments</span>
            </div>
          </div>
        </div>

        {/* Comment Section */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Discussion
          </h4>

          {/* Replies */}
          <div className="space-y-3">
            {activeStory.replies.map((reply, index) => (
              <div key={index} className="bg-white border border-border-divider rounded-card p-4 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[10px] font-mono text-text-muted">
                  <span>u/{reply.author}</span>
                  <span>{reply.date}</span>
                </div>
                <p className="font-inter text-text-secondary leading-relaxed">
                  {reply.text}
                </p>
              </div>
            ))}
          </div>

          {/* Comment Form */}
          <div className="bg-neutral-50 border border-border-divider rounded-card p-3 flex flex-col space-y-2">
            <textarea
              rows={2}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Post a supportive comment or reply..."
              className="w-full text-xs font-inter p-2.5 border border-border-divider rounded-input focus:outline-none focus:border-primary bg-white resize-none"
            />
            <button
              onClick={() => handleAddComment(activeStory.id)}
              className="self-end flex items-center space-x-1 px-3 py-1.5 bg-on-surface text-white text-[10px] font-semibold rounded-input hover:bg-opacity-95 transition-all focus:outline-none"
            >
              <PlusCircle className="w-3 h-3" />
              <span>Comment</span>
            </button>
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
            placeholder="Search stories..."
            className="w-full pl-9 pr-4 py-2 border border-border-divider rounded-input text-xs font-inter bg-white focus:outline-none focus:border-primary shadow-sm"
          />
        </div>

        {/* Filter tags */}
        <div className="flex flex-wrap gap-1.5 pb-1">
          {['All', '#NeedHelp', '#PositiveStory', '#Article'].map((tag) => (
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

      {/* Stories list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 border border-dashed border-border-divider rounded-card text-center">
            <p className="text-xs font-inter text-text-muted">No Q&A stories matched your search.</p>
          </div>
        ) : (
          filtered.map((story) => (
            <div
              key={story.id}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') setSelectedId(story.id) }}
              onClick={() => setSelectedId(story.id)}
              className="bg-white border border-border-divider rounded-card p-5 hover:border-primary hover:shadow-md active:border-primary active:shadow-md cursor-pointer transition-all shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${
                    story.tag === '#NeedHelp' ? 'bg-error-container text-on-error-container' :
                    story.tag === '#PositiveStory' ? 'bg-primary-container text-on-primary-container' :
                    'bg-secondary-container text-on-secondary-container'
                  }`}>
                    {story.tag}
                  </span>
                  <span className="text-[9px] font-mono text-text-muted">u/{story.author}</span>
                </div>
                <h4 className="text-sm font-semibold font-newsreader text-on-surface leading-snug">
                  {story.title}
                </h4>
                <p className="text-xs font-inter text-text-secondary leading-relaxed line-clamp-2">
                  {story.excerpt}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-border-divider mt-4 pt-3 text-[9px] font-mono text-text-muted">
                <div className="flex items-center space-x-3">
                  <span className="p-3 -m-3 hover:text-primary active:text-primary transition-colors flex items-center space-x-1" onClick={(e) => handleUpvote(story.id, e)}>
                    <ThumbsUp className="w-3 h-3" />
                    <span>{story.upvotes}</span>
                  </span>
                  <span className="flex items-center space-x-1 p-3 -m-3">
                    <MessageSquare className="w-3 h-3" />
                    <span>{story.replies.length}</span>
                  </span>
                </div>
                <span className="text-primary font-semibold font-inter flex items-center space-x-0.5">
                  <span>Read story</span>
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
