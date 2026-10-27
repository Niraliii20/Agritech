import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { MessageSquare, Trash2, ShieldAlert, CheckCircle2, User } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ContentModerationPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/community/posts?limit=50');
      setPosts(res.data.posts || []);
    } catch (err) {
      console.error('[AdminModeration] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDeletePost = async (id) => {
    if (!window.confirm('Are you sure you want to remove this forum discussion?')) return;
    try {
      await api.delete(`/community/posts/${id}`);
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error('[AdminModeration] Delete failed:', err);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading community forum topics for moderation..." />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs">
        <span className="text-xs font-bold text-rose-800 bg-rose-100 px-3 py-1 rounded-full uppercase">
          Forum Moderation
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1">
          Community Content & Discussion Moderation
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Review community topics, maintain constructive agricultural discourse, and remove spam or misleading advice.
        </p>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                  {post.category}
                </span>
                <span className="text-xs font-bold text-gray-900">{post.author?.fullName}</span>
                <span className="text-[11px] text-gray-400">
                  • {new Date(post.createdAt).toLocaleDateString('en-IN')}
                </span>
              </div>
              <h4 className="text-sm font-bold text-gray-900">{post.title}</h4>
              <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{post.content}</p>
            </div>

            <button
              onClick={() => handleDeletePost(post._id)}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
            >
              <Trash2 className="w-4 h-4" />
              Remove Post
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentModerationPage;
