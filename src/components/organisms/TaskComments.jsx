import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import CommentService from '../../api/commentService';
import TeamService from '../../api/teamService';
import { useAuth } from '../../context/AuthContext';
import socketService from '../../services/socketService';
import { Send, User, MessageSquare } from 'lucide-react';
import { formatTime } from '../../utils/formatTime';

const TaskComments = ({ taskId }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const messagesEndRef = useRef(null);

  const { data: commentsResponse, isLoading } = useQuery({
    queryKey: ['comments', taskId],
    queryFn: () => CommentService.getTaskComments(taskId),
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    socketService.connect();
    socketService.joinMission(taskId);

    socketService.onSignal((signal) => {
      queryClient.setQueryData(['comments', taskId], (oldData) => {
         if (!oldData) return oldData;
         if (oldData.data.comments.some(c => c._id === signal._id)) return oldData;
         return {
            ...oldData,
            data: {
               ...oldData.data,
               comments: [...oldData.data.comments, signal]
            }
         };
      });
      setTimeout(scrollToBottom, 100);
    });

    return () => {
      socketService.offSignal();
    };
  }, [taskId, queryClient]);

  const { data: membersResponse } = useQuery({
    queryKey: ['team-members'],
    queryFn: () => TeamService.getMembers(),
  });

  const comments = commentsResponse?.data?.comments || [];
  const members = membersResponse?.data?.members || [];

  const addCommentMutation = useMutation({
    mutationFn: ({ taskId, content }) => CommentService.addComment(taskId, content),
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', taskId]);
      setNewComment('');
      setTimeout(scrollToBottom, 50);
    },
  });

  useEffect(() => {
    scrollToBottom();
  }, [comments]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewComment(value);
    const lastAtPos = value.lastIndexOf('@');
    if (lastAtPos !== -1 && lastAtPos >= value.length - 15) {
      const query = value.substring(lastAtPos + 1).split(' ')[0];
      setMentionQuery(query);
      setShowMentions(true);
    } else {
      setShowMentions(false);
    }
  };

  const selectMention = (memberName) => {
    const lastAtPos = newComment.lastIndexOf('@');
    const beforeAt = newComment.substring(0, lastAtPos);
    setNewComment(`${beforeAt}@${memberName} `);
    setShowMentions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addCommentMutation.mutate({ taskId, content: newComment });
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#0A0A0F]/20">
      {/* Discussion Header */}
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <MessageSquare size={16} className="text-primary" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-[11px] font-black text-white/90 uppercase tracking-[0.2em]">Mission Discussion</h3>
            <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">{comments.length} Messages in thread</span>
          </div>
        </div>
      </div>

      {/* Message Feed */}
      <div 
        className="flex-1 overflow-y-auto p-6 pb-12 space-y-8 custom-scrollbar-thin scroll-smooth"
      >
        {comments.map((comment, index) => {
          const isOwn = comment.user?._id === user?._id;
          
          return (
            <div key={comment._id || index} className={`flex items-start gap-4 group animate-in slide-in-from-bottom-2 duration-500 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
              {/* Avatar */}
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black shadow-lg border shrink-0 transition-transform group-hover:scale-105 ${
                isOwn ? 'bg-primary/20 border-primary/30' : 'bg-white/5 border-white/10'
              }`}>
                {comment.user?.name ? comment.user.name[0].toUpperCase() : 'U'}
              </div>

              <div className={`flex flex-col flex-1 min-w-0 ${isOwn ? 'items-end' : 'items-start'}`}>
                {/* Message Header */}
                <div className={`flex items-baseline gap-3 mb-1 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!isOwn && (
                    <span className="text-[12px] font-black tracking-tight text-white/90">
                      {comment.user?.name}
                    </span>
                  )}
                  <span className="text-[9px] font-bold text-white/20 uppercase tracking-tighter">
                    {formatTime(comment.createdAt)}
                  </span>
                </div>
                
                {/* Message Content */}
                <div className="text-[13px] leading-relaxed font-medium text-white/70 max-w-[95%] text-left">
                   {comment.content}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} className="h-4" />
        
        {comments.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-10 py-12">
             <MessageSquare size={48} className="mb-4 text-white" />
             <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Initializing Discussion Channel</p>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-5 bg-[#0D0D15]/40 border-t border-white/5 relative backdrop-blur-md">
        {showMentions && filteredMembers.length > 0 && (
          <div className="absolute bottom-full left-5 right-5 mb-3 bg-[#0C0D15] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in slide-in-from-bottom-2 duration-300 z-50">
            {filteredMembers.map(member => (
              <button
                key={member._id}
                onClick={() => selectMention(member.name)}
                className="w-full px-5 py-3 text-left flex items-center gap-4 hover:bg-primary/10 transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-[11px] font-black text-white/30 group-hover:text-primary transition-all border border-transparent group-hover:border-primary/20">
                  {member.name[0]}
                </div>
                <span className="text-[11px] font-bold text-white/60 group-hover:text-white uppercase tracking-tight">{member.name}</span>
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative group/input">
          <input
            type="text"
            value={newComment}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="w-full bg-[#050508]/60 border border-white/5 rounded-xl py-4 pl-6 pr-14 text-[13px] font-medium text-white placeholder:text-white/10 focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={!newComment.trim() || addCommentMutation.isPending}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white/20 hover:text-primary transition-colors disabled:opacity-5 w-auto pr-4"
          >
            <Send size={18} className="transition-transform group-hover/input:scale-110" />
          </button>
        </form>
      </div>
      
      {/* Scrollbar Styling */}
      <style>{`
        .custom-scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
        }
        .custom-scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
};

export default TaskComments;
