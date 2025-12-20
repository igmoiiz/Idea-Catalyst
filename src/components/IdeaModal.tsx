import React from 'react';
import { Idea } from '../../types';

interface IdeaModalProps {
  idea: Idea;
  onClose: () => void;
}

const IdeaModal: React.FC<IdeaModalProps> = ({ idea, onClose }) => {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/20 bg-slate-950/95 backdrop-blur-xl p-6 md:p-8 shadow-2xl" style={{ borderColor: '#6D9773' }}>
        {/* Close button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-900/60 hover:bg-slate-800 flex items-center justify-center text-white/80 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FFBA00] ring-offset-slate-900"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Modal content */}
        <div className="flex flex-col gap-6">
          {/* Title */}
          <h2 className="text-2xl text-white font-bold pr-8">{idea.title}</h2>

          {/* Founder info */}
          <div className="flex items-center gap-3">
            <span className="text-2xl">{idea.avatar}</span>
            <div>
              <div className="text-base text-white font-medium">{idea.founder}</div>
              <div className="text-sm text-white/60">Founder</div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {idea.tags.map(tag => (
              <span key={tag} className="text-sm px-3 py-1 rounded-full bg-slate-900/60 border border-white/10 text-white/80">{tag}</span>
            ))}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <h3 className="text-base text-white font-semibold">Description</h3>
            <p className="text-base text-white/80 leading-relaxed">{idea.description}</p>
          </div>

          {/* Likes */}
          <div className="flex items-center gap-4 pt-4 border-t border-white/10">
            <span className="text-base text-white/80"> ❤️ {idea.likes} likes </span>
            <button className="text-sm text-sky-300 hover:text-sky-200 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FFBA00] ring-offset-slate-900 rounded">
              Like this idea
            </button>
          </div>

          {/* Comments section */}
          <div className="flex flex-col gap-3">
            <h3 className="text-base text-white font-semibold">Comments</h3>
            <div className="flex flex-col gap-3">
              {idea.comments.length > 0 ? (
                idea.comments.map((comment, idx) => (
                  <div key={idx} className="flex flex-col gap-1 p-3 rounded-lg bg-slate-900/40">
                    <span className="text-sm text-white font-medium">{comment.author}</span>
                    <p className="text-sm text-white/80">{comment.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-white/60 text-center py-4">No comments yet. Be the first to comment!</p>
              )}
            </div>

            {/* Add comment form */}
            <form className="flex flex-col gap-2 mt-2" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="new-comment" className="sr-only">Add a comment</label>
              <textarea 
                id="new-comment" 
                rows={3} 
                placeholder="Share your thoughts..." 
                className="rounded-xl bg-slate-950/60 border border-white/15 px-4 py-2.5 text-base text-white placeholder:text-white/40 focus:outline-none focus:border-[#FFBA00] focus:ring-1 focus:ring-[#FFBA00] resize-none"
              ></textarea>
              <button 
                type="submit" 
                className="self-end px-4 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-black/40 hover:scale-[1.01] active:scale-100 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FFBA00] ring-offset-slate-900"
                style={{ backgroundImage: `linear-gradient(135deg, #FFBA00, #BB8A52)`, color: '#0C3B2E' }}
              >
                Post Comment
              </button>
            </form>
          </div>

          {/* Join Team button */}
          <button 
            className="w-full mt-4 rounded-xl py-3 text-base font-semibold shadow-lg shadow-black/40 hover:scale-[1.01] active:scale-100 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FFBA00] ring-offset-slate-900"
            style={{ backgroundImage: `linear-gradient(135deg, #FFBA00, #BB8A52)`, color: '#0C3B2E' }}
          >
            Join Team →
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdeaModal;