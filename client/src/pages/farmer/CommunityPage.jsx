import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  MessageSquare,
  ThumbsUp,
  MessageCircle,
  Plus,
  Search,
  Filter,
  User,
  ShieldCheck,
  Send,
  Trash2,
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

const CATEGORIES = [
  'All',
  'Crop Management',
  'Soil Health',
  'Irrigation',
  'Pest Control',
  'Organic Farming',
  'Government Schemes',
  'General Discussions',
];

const CommunityPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeCommentsPostId, setActiveCommentsPostId] = useState(null);
  const [commentsMap, setCommentsMap] = useState({});
  const [commentInput, setCommentInput] = useState('');

  const [newPost, setNewPost] = useState({
    title: '',
    category: 'Crop Management',
    content: '',
  });

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (category !== 'All') params.append('category', category);
      if (search) params.append('search', search);

      const res = await api.get(`/community/posts?${params.toString()}`);
      setPosts(res.data.posts || []);
    } catch (err) {
      console.error('[Community] Error loading posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPosts();
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/community/posts', newPost);
      setIsModalOpen(false);
      setNewPost({ title: '', category: 'Crop Management', content: '' });
      fetchPosts();
    } catch (err) {
      console.error('[Community] Failed to create post:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await api.post(`/community/posts/${postId}/like`);
      setPosts((prev) =>
        prev.map((p) => {
          if (p._id === postId) {
            const isLiked = p.likes?.some((id) => id === user._id || id?._id === user._id);
            const nextLikes = isLiked
              ? p.likes.filter((id) => (id?._id || id) !== user._id)
              : [...(p.likes || []), user._id];
            return { ...p, likes: nextLikes };
          }
          return p;
        })
      );
    } catch (err) {
      console.error('[Community] Like error:', err);
    }
  };

  const toggleComments = async (postId) => {
    if (activeCommentsPostId === postId) {
      setActiveCommentsPostId(null);
      return;
    }

    setActiveCommentsPostId(postId);
    if (!commentsMap[postId]) {
      try {
        const res = await api.get(`/community/posts/${postId}`);
        setCommentsMap((prev) => ({ ...prev, [postId]: res.data.comments || [] }));
      } catch (err) {
        console.error('[Community] Error loading comments:', err);
      }
    }
  };

  const handleAddComment = async (postId, e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    try {
      const res = await api.post(`/community/posts/${postId}/comments`, { content: commentInput });
      setCommentsMap((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), res.data.comment],
      }));
      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? { ...p, commentsCount: (p.commentsCount || 0) + 1 } : p))
      );
      setCommentInput('');
    } catch (err) {
      console.error('[Community] Error posting comment:', err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase">
              Farmer Community Forum & Experience Sharing
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1">
              Kisan Discussion Forum
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Ask questions, exchange field practices, discuss government subsidies, and connect with peer farmers.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-sm shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 self-start sm:self-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            Start Discussion
          </button>
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-xl pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search discussions (e.g. Drip subsidy, Yellow Rust, Wheat seed)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-emerald-600"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-colors shrink-0"
          >
            Search
          </button>
        </form>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar text-xs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3.5 py-2 rounded-xl font-semibold transition-all shrink-0 ${
              category === cat
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Discussion Posts Feed */}
      {loading ? (
        <LoadingSpinner text="Loading community discussions..." />
      ) : posts.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No discussions found"
          description="Be the first to share an agricultural insight or ask a question in this category."
          actionText="Start Discussion"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            const isLiked = post.likes?.some((id) => id === user?._id || id?._id === user?._id);
            const comments = commentsMap[post._id] || [];
            const showComments = activeCommentsPostId === post._id;

            return (
              <div
                key={post._id}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4 hover:shadow-md transition-shadow"
              >
                {/* Author row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      {post.author?.fullName?.charAt(0) || 'F'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-gray-900">{post.author?.fullName}</h4>
                        {post.author?.role === 'admin' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-blue-600" /> Agronomist Admin
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400">
                        {post.author?.district ? `${post.author.district}, ${post.author.state} • ` : ''}
                        {new Date(post.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>

                {/* Title & Content */}
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-gray-900">{post.title}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{post.content}</p>
                </div>

                {/* Actions: Likes & Comments counter */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(post._id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors font-semibold ${
                        isLiked ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-emerald-600' : ''}`} />
                      <span>{post.likes?.length || 0} Upvotes</span>
                    </button>

                    <button
                      onClick={() => toggleComments(post._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-gray-100 text-gray-600 font-semibold transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.commentsCount || 0} Comments</span>
                    </button>
                  </div>
                </div>

                {/* Comments Accordion */}
                {showComments && (
                  <div className="pt-4 border-t border-gray-100 space-y-4 animate-in fade-in">
                    <h5 className="text-xs font-bold text-gray-700 uppercase">Discussion Comments</h5>

                    {/* Comments List */}
                    <div className="space-y-2.5">
                      {comments.length === 0 ? (
                        <p className="text-xs text-gray-400 italic">No comments yet. Start the conversation!</p>
                      ) : (
                        comments.map((comment) => (
                          <div key={comment._id} className="p-3 rounded-2xl bg-gray-50 space-y-1 text-xs">
                            <div className="flex items-center justify-between font-bold text-gray-800">
                              <span>{comment.author?.fullName}</span>
                              <span className="text-[10px] text-gray-400 font-normal">
                                {new Date(comment.createdAt).toLocaleDateString('en-IN')}
                              </span>
                            </div>
                            <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Add Comment Input */}
                    <form onSubmit={(e) => handleAddComment(post._id, e)} className="flex gap-2">
                      <input
                        type="text"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder="Write a constructive comment or reply..."
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors shrink-0 flex items-center gap-1"
                      >
                        <Send className="w-3.5 h-3.5" /> Reply
                      </button>
                    </form>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create Discussion Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Start New Community Discussion">
        <form onSubmit={handleCreatePost} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Topic Title</label>
            <input
              type="text"
              required
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              placeholder="e.g. Tips for increasing wheat tillering in sandy loam soil"
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
            <select
              value={newPost.category}
              onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 outline-none focus:border-emerald-600 bg-white"
            >
              {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Discussion Details & Questions</label>
            <textarea
              rows={4}
              required
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              placeholder="Share your practical farming experience, asking advice on fertilizer, water, pests..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold rounded-xl text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
            >
              {submitting ? 'Publishing...' : 'Publish Topic'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CommunityPage;
