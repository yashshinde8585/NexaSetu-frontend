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

  /**
   * Establishing the real-time signal frequency for this specific mission.
   * On signal, we manually inject the incoming data to the strategic terminal's cache.
   */
  useEffect(() => {
    socketService.connect();
    socketService.joinMission(taskId);

    socketService.onSignal((signal) => {
      console.log(`[SIGNAL RECEIVED] New mission data docked at terminal`);
      queryClient.setQueryData(['comments', taskId], (oldData) => {
         if (!oldData) return oldData;
         // Prevent duplicate signals if the strategist is the sender
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
      setTimeout(scrollToBottom, 50); // Small delay to ensure DOM update
    },
  });

  useEffect(() => {
    scrollToBottom();
  }, [comments]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewComment(value);

    // Mention logic
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
      {/* Precision Header */}
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
        <div className="flex items-center gap-3">
          <MessageSquare size={16} className="text-primary/60" />
          <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em]">Mission Discussion</h3>
        </div>
        <span className="text-[9px] font-bold text-white/10 uppercase tracking-widest">{comments.length} Signals</span>
      </div>

      {/* Optimized Message Feed */}
      <div 
        className="flex-1 overflow-y-auto p-5 pb-10 space-y-6 custom-scrollbar-thin scroll-smooth"
      >
        {comments.map((comment, index) => {
          const isOwn = comment.user?._id === user?._id;
          return (
            <div key={comment._id || index} className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} group animate-in slide-in-from-bottom-2 duration-300`}>
              <div className={`flex items-center gap-2 mb-1.5 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[12px] shadow-sm ${isOwn ? 'bg-primary/20 border border-primary/20' : 'bg-white/5 border border-white/10'}`}>
                  {isOwn ? '👨‍🚀' : '👤'}
                </div>
                <div className={`flex items-center gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                  <span className="text-[10px] font-bold text-white/40 tracking-tight">{comment.user?.name}</span>
                  <span className="text-[8px] font-medium text-white/10 uppercase">{formatTime(comment.createdAt)}</span>
                </div>
              </div>
              
              <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed font-medium shadow-2xl transition-all ${
                isOwn 
                  ? 'bg-primary/10 text-white border border-primary/20 rounded-tr-none' 
                  : 'bg-white/[0.03] text-white/80 border border-white/10 rounded-tl-none'
              }`}>
                {comment.content}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} className="h-2" />
        {comments.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-20 py-12">
             <MessageSquare size={32} className="mb-3" />
             <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Awaiting secure transmission</p>
          </div>
        )}
      </div>

      {/* Intelligence Input Area */}
      <div className="p-4 bg-white/[0.01] border-t border-white/5 relative">
        {showMentions && filteredMembers.length > 0 && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-[#0C0D15] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-2 duration-200">
            {filteredMembers.map(member => (
              <button
                key={member._id}
                onClick={() => selectMention(member.name)}
                className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-primary/10 transition-colors group"
              >
                <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-bold text-white/40 group-hover:text-primary group-hover:border-primary/20 border border-transparent">
                  {member.name[0]}
                </div>
                <span className="text-[11px] font-bold text-white/60 group-hover:text-white uppercase tracking-tight">{member.name}</span>
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative group">
          <input
            type="text"
            value={newComment}
            onChange={handleInputChange}
            placeholder="Secure transmission..."
            className="w-full bg-[#050508] border border-white/5 rounded-2xl py-3.5 pl-5 pr-14 text-[12px] font-medium text-white placeholder:text-white/10 focus:outline-none focus:border-primary/30 focus:bg-[#07070C] transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={!newComment.trim() || addCommentMutation.isPending}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl transition-all disabled:opacity-20 disabled:grayscale"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
      
      {/* Enhanced Scrollbar Styling (CSS Injection) */}
      <style>{`
        .custom-scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
        }
        .custom-scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default TaskComments;
