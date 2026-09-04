import React, { useState } from 'react';
import { ForumTopic, ForumCategory, ForumReply, User } from '../types';
import { INITIAL_FORUM_TOPICS } from '../data/greenEcoData';

interface ForumViewProps {
  onOpenReportModal?: () => void;
  user: User | null;
}

export const ForumView: React.FC<ForumViewProps> = ({ onOpenReportModal, user }) => {
  const [topics, setTopics] = useState<ForumTopic[]>(() => {
    try {
      const saved = localStorage.getItem('laporkota_forum');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_FORUM_TOPICS;
  });

  const [selectedCategory, setSelectedCategory] = useState<ForumCategory>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTopicForModal, setActiveTopicForModal] = useState<ForumTopic | null>(null);
  const [isNewTopicModalOpen, setIsNewTopicModalOpen] = useState(false);

  // New Topic Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ForumCategory>('Energi Terbarukan');
  const [newContent, setNewContent] = useState('');
  const [newTagsInput, setNewTagsInput] = useState('');
  const [newSdgGoal, setNewSdgGoal] = useState('SDG 11: Kota Berkelanjutan');

  // Reply Form State
  const [replyInput, setReplyInput] = useState('');

  // Persist to localStorage
  const saveTopics = (updated: ForumTopic[]) => {
    setTopics(updated);
    try {
      localStorage.setItem('laporkota_forum', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Upvote Topic
  const handleToggleTopicUpvote = (topicId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      alert('Silakan Masuk atau Daftar untuk mendukung diskusi ini.');
      return;
    }
    const updated = topics.map((t) => {
      if (t.id === topicId) {
        const isUpvoted = !t.hasUpvoted;
        return {
          ...t,
          hasUpvoted: isUpvoted,
          upvotes: isUpvoted ? t.upvotes + 1 : Math.max(0, t.upvotes - 1),
        };
      }
      return t;
    });
    saveTopics(updated);

    if (activeTopicForModal && activeTopicForModal.id === topicId) {
      setActiveTopicForModal((prev) => {
        if (!prev) return null;
        const isUpvoted = !prev.hasUpvoted;
        return {
          ...prev,
          hasUpvoted: isUpvoted,
          upvotes: isUpvoted ? prev.upvotes + 1 : Math.max(0, prev.upvotes - 1),
        };
      });
    }
  };

  // Upvote Reply
  const handleToggleReplyUpvote = (topicId: string, replyId: string) => {
    if (!user) {
      alert('Silakan Masuk atau Daftar untuk mendukung tanggapan ini.');
      return;
    }
    const updated = topics.map((t) => {
      if (t.id === topicId) {
        const updatedReplies = t.replies.map((r) => {
          if (r.id === replyId) {
            const isUpvoted = !r.hasUpvoted;
            return {
              ...r,
              hasUpvoted: isUpvoted,
              upvotes: isUpvoted ? r.upvotes + 1 : Math.max(0, r.upvotes - 1),
            };
          }
          return r;
        });
        return { ...t, replies: updatedReplies };
      }
      return t;
    });
    saveTopics(updated);

    if (activeTopicForModal && activeTopicForModal.id === topicId) {
      setActiveTopicForModal((prev) => {
        if (!prev) return null;
        const updatedReplies = prev.replies.map((r) => {
          if (r.id === replyId) {
            const isUpvoted = !r.hasUpvoted;
            return {
              ...r,
              hasUpvoted: isUpvoted,
              upvotes: isUpvoted ? r.upvotes + 1 : Math.max(0, r.upvotes - 1),
            };
          }
          return r;
        });
        return { ...prev, replies: updatedReplies };
      });
    }
  };

  // Create New Topic
  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    if (!user) {
      alert('Silakan Masuk atau Daftar untuk membuat diskusi.');
      return;
    }

    const tags = newTagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    const getInitials = (name: string) => {
      const parts = name.trim().split(' ');
      if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
      return name.slice(0, 2).toUpperCase();
    };

    const newTopic: ForumTopic = {
      id: `forum-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      author: user.name,
      authorRole: user.role === 'admin' ? 'Admin' : 'Inovator Komunitas',
      isChampion: user.role === 'admin',
      avatarInitials: getInitials(user.name),
      content: newContent.trim(),
      tags: tags.length > 0 ? tags : ['EcoConnect', 'SDG11'],
      createdAt: 'Baru saja',
      upvotes: 1,
      hasUpvoted: true,
      repliesCount: 0,
      replies: [],
      sdgGoal: newSdgGoal,
    };

    const updated = [newTopic, ...topics];
    saveTopics(updated);
    setIsNewTopicModalOpen(false);
    setNewTitle('');
    setNewContent('');
    setNewTagsInput('');
  };

  // Add Reply
  const handleAddReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim() || !activeTopicForModal) return;

    if (!user) {
      alert('Silakan Masuk atau Daftar untuk membalas.');
      return;
    }

    const getInitials = (name: string) => {
      const parts = name.trim().split(' ');
      if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
      return name.slice(0, 2).toUpperCase();
    };

    const newReply: ForumReply = {
      id: `rep-f-${Date.now()}`,
      author: user.name,
      role: user.role === 'admin' ? 'Admin' : 'Warga / Inisiator',
      isChampion: user.role === 'admin',
      avatarInitials: getInitials(user.name),
      timestamp: 'Baru saja',
      content: replyInput.trim(),
      upvotes: 0,
      hasUpvoted: false,
    };

    const updated = topics.map((t) => {
      if (t.id === activeTopicForModal.id) {
        return {
          ...t,
          repliesCount: t.repliesCount + 1,
          replies: [...t.replies, newReply],
        };
      }
      return t;
    });

    saveTopics(updated);
    setActiveTopicForModal((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        repliesCount: prev.repliesCount + 1,
        replies: [...prev.replies, newReply],
      };
    });
    setReplyInput('');
  };

  // Filtered Topics
  const filteredTopics = topics.filter((t) => {
    if (selectedCategory !== 'Semua' && t.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchContent = t.content.toLowerCase().includes(q);
      const matchTag = t.tags.some((tag) => tag.toLowerCase().includes(q));
      if (!matchTitle && !matchContent && !matchTag) return false;
    }
    return true;
  });

  const categories: ForumCategory[] = [
    'Semua',
    'Energi Terbarukan',
    'Zero Waste & IoT',
    'Urban Farming & Hijau',
    'Mobilitas Bersih',
    'Advokasi & Kebijakan',
  ];

  const getCategoryColor = (category: string) => {
    const map: Record<string, string> = {
      'Energi Terbarukan': 'bg-amber-100 text-amber-900',
      'Zero Waste & IoT': 'bg-primary-100 text-primary-900',
      'Urban Farming & Hijau': 'bg-green-100 text-green-900',
      'Mobilitas Bersih': 'bg-sky-100 text-sky-900',
      'Advokasi & Kebijakan': 'bg-slate-200 text-slate-900',
    };
    return map[category] || 'bg-slate-100 text-slate-900';
  };

  return (
    <div className="flex-grow w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
      {/* Header */}
      <section className="flex flex-col gap-3 border-b border-slate-200 pb-6">
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary-600 text-white border border-slate-200 rounded-lg px-3 py-1 font-label text-xs font-medium shadow-sm mb-2">
              <span className="material-symbols-outlined text-[16px]">forum</span>
              KOMUNITAS INOVASI ECO-CONNECT
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-slate-900 font-bold uppercase tracking-tight">
              FORUM DISKUSI &amp; IDE KOTA BERKELANJUTAN
            </h1>
            <p className="font-body text-base sm:text-lg text-slate-500 max-w-3xl mt-1">
              Ruang kolaborasi warga, pengurus RW, teknisi IoT, dan pembuat kebijakan untuk berbagi ide konkret mewujudkan *smart &amp; sustainable communities*.
            </p>
          </div>

          <button
            onClick={() => setIsNewTopicModalOpen(true)}
            className="bg-primary-600 text-white border border-slate-200 rounded-xl px-5 py-2.5 font-label text-sm font-medium shadow-md hover:bg-primary-700 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            Mulai Diskusi Baru
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <div className="relative flex-grow">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
              search
            </span>
            <input
              type="text"
              placeholder="Cari ide, kata kunci (misal: solar, sensor sampah, IoT, taman)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg font-body text-xs sm:text-sm outline-none shadow-sm"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 border border-slate-200 rounded-lg font-label text-xs font-medium cursor-pointer transition-all ${
                selectedCategory === cat
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-slate-800 hover:bg-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Discussion List */}
      <section className="flex flex-col gap-5">
        <div className="flex justify-between items-center text-xs font-label text-slate-500 border-b border-slate-200 pb-2">
          <span>Menampilkan {filteredTopics.length} Diskusi Komunitas</span>
          <span>Diurutkan Berdasarkan: Terbaru &amp; Populer</span>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {filteredTopics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => setActiveTopicForModal(topic)}
              className={`bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-md hover:shadow-lg hover:translate-y-[-2px] hover:shadow-lg transition-all cursor-pointer flex flex-col gap-4 ${
                topic.isPinned ? 'border-t-8 border-t-amber-500' : ''
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-primary-600 border border-slate-200 rounded-lg flex items-center justify-center font-headline text-sm font-bold shrink-0">
                    {topic.avatarInitials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-headline text-sm font-bold text-slate-900">
                        {topic.author}
                      </span>
                      {topic.isChampion && (
                        <span className="bg-green-600 text-white text-[9px] px-1.5 py-0.2 font-label font-bold uppercase border border-slate-200">
                          Eco Champion
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-body text-slate-500">
                      {topic.authorRole} • {topic.createdAt}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`${getCategoryColor(topic.category)} border border-slate-200 px-2 py-0.5 text-[10px] font-label font-bold uppercase`}>
                    {topic.category}
                  </span>
                  <span className="bg-slate-100 text-slate-900 border border-slate-200 px-2 py-0.5 text-[10px] font-label font-bold uppercase">
                    {topic.sdgGoal}
                  </span>
                </div>
              </div>

              {/* Title & Preview */}
              <div>
                <h3 className="font-headline text-lg sm:text-xl font-bold uppercase tracking-tight text-slate-900 hover:text-primary-600 transition-colors">
                  {topic.title}
                </h3>
                <p className="font-body text-xs sm:text-sm text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                  {topic.content}
                </p>
              </div>

              {/* Tags & Action Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t-2 border-slate-200">
                <div className="flex flex-wrap gap-1.5">
                  {topic.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-900"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => handleToggleTopicUpvote(topic.id, e)}
                    className={`px-3 py-1 border border-slate-200 rounded-lg font-label text-xs font-medium flex items-center gap-1.5 transition-all ${
                      topic.hasUpvoted
                        ? 'bg-primary-600 shadow-sm'
                        : 'bg-white hover:bg-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">thumb_up</span>
                    <span>{topic.upvotes}</span>
                  </button>

                  <div className="px-3 py-1 bg-primary-100 border border-slate-200 rounded-lg font-label text-xs font-medium flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">chat</span>
                    <span>{topic.repliesCount} Tanggapan</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal: Topic Detail & Reply Thread */}
      {activeTopicForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-primary-600 border-b border-slate-200 p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[22px]">lightbulb</span>
                <span className="font-label text-xs font-medium text-slate-900">
                  DISKUSI: {activeTopicForModal.category}
                </span>
              </div>
              <button
                onClick={() => setActiveTopicForModal(null)}
                className="w-7 h-7 bg-white border border-slate-200 rounded-lg font-bold text-sm flex items-center justify-center hover:bg-rose-500 hover:text-white shadow-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto flex flex-col gap-6">
              {/* Main Topic Content */}
              <div className="flex flex-col gap-3 border-b border-slate-200 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 bg-primary-600 border border-slate-200 rounded-lg flex items-center justify-center font-headline text-base font-bold">
                    {activeTopicForModal.avatarInitials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-headline text-base font-bold">
                        {activeTopicForModal.author}
                      </span>
                      {activeTopicForModal.isChampion && (
                        <span className="bg-green-600 text-white text-[9px] px-1.5 py-0.2 font-label font-bold uppercase border border-slate-200">
                          Eco Champion
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-body text-slate-500">
                      {activeTopicForModal.authorRole} • {activeTopicForModal.createdAt}
                    </span>
                  </div>
                </div>

                <h2 className="font-headline text-xl sm:text-2xl font-bold uppercase tracking-tight">
                  {activeTopicForModal.title}
                </h2>

                <p className="font-body text-xs sm:text-sm text-slate-900 leading-relaxed whitespace-pre-line bg-white p-4 border border-slate-200 rounded-lg">
                  {activeTopicForModal.content}
                </p>

                <div className="flex flex-wrap justify-between items-center gap-2 pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {activeTopicForModal.tags.map((t) => (
                      <span
                        key={t}
                        className="bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-mono font-bold"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={(e) => handleToggleTopicUpvote(activeTopicForModal.id, e)}
                    className={`px-3 py-1.5 border border-slate-200 rounded-lg font-label text-xs font-medium flex items-center gap-1.5 cursor-pointer ${
                      activeTopicForModal.hasUpvoted
                        ? 'bg-primary-600 shadow-sm'
                        : 'bg-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">thumb_up</span>
                    <span>Dukung Ide Ini ({activeTopicForModal.upvotes})</span>
                  </button>
                </div>
              </div>

              {/* Replies Section */}
              <div className="flex flex-col gap-4">
                <h4 className="font-headline text-base font-semibold tracking-tight flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">forum</span>
                  TANGGAPAN &amp; USULAN WARGA ({activeTopicForModal.replies.length})
                </h4>

                <div className="flex flex-col gap-3">
                  {activeTopicForModal.replies.length === 0 ? (
                    <p className="text-xs font-body text-slate-500 italic">
                      Belum ada tanggapan. Jadilah warga pertama yang membagikan masukan!
                    </p>
                  ) : (
                    activeTopicForModal.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className="bg-white border border-slate-200 rounded-lg p-3.5 flex flex-col gap-2"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-white border border-slate-200 flex items-center justify-center font-headline text-[10px] font-bold">
                              {reply.avatarInitials}
                            </div>
                            <span className="font-label text-xs font-bold text-slate-900">
                              {reply.author}
                            </span>
                            <span className="text-[10px] text-slate-500">({reply.role})</span>
                          </div>
                          <span className="text-[10px] text-slate-500">{reply.timestamp}</span>
                        </div>

                        <p className="font-body text-xs text-slate-900 leading-relaxed">
                          {reply.content}
                        </p>

                        <div className="flex justify-end">
                          <button
                            onClick={() =>
                              handleToggleReplyUpvote(activeTopicForModal.id, reply.id)
                            }
                            className={`px-2 py-0.5 border border-slate-200 text-[10px] font-label font-bold uppercase flex items-center gap-1 cursor-pointer ${
                              reply.hasUpvoted ? 'bg-primary-600' : 'bg-white hover:bg-rose-50'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[12px]">thumb_up</span>
                            <span>{reply.upvotes}</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Reply Form */}
                <form onSubmit={handleAddReply} className="flex flex-col gap-2 border-t-2 border-slate-200 pt-3">
                  <span className="font-label text-xs font-medium text-slate-900">
                    Tuliskan Tanggapan atau Solusi Teknis Anda:
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Bagikan pengalaman, usulan komponen, atau rencana implementasi..."
                      value={replyInput}
                      onChange={(e) => setReplyInput(e.target.value)}
                      className="flex-grow border border-slate-200 rounded-lg p-2 bg-white text-xs font-body outline-none"
                    />
                    <button
                      type="submit"
                      className="bg-primary-600 text-white border border-slate-200 rounded-lg px-4 py-2 font-label text-xs font-medium hover:bg-primary-700 shadow-sm active:scale-95 cursor-pointer"
                    >
                      Kirim
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create New Topic */}
      {isNewTopicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xl w-full max-w-xl max-h-[85vh] overflow-hidden flex flex-col">
            <div className="bg-primary-600 text-white border-b border-slate-200 p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[22px]">add_circle</span>
                <h3 className="font-headline text-lg font-semibold tracking-tight">
                  BUAT TOPIK DISKUSI &amp; AKSI HIJAU
                </h3>
              </div>
              <button
                onClick={() => setIsNewTopicModalOpen(false)}
                className="w-7 h-7 bg-white text-slate-800 border border-slate-200 rounded-lg font-bold text-sm flex items-center justify-center hover:bg-rose-500 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTopic} className="p-6 overflow-y-auto flex flex-col gap-4 font-body text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-label font-bold uppercase text-slate-900">
                  Judul Inisiatif / Ide Diskusi:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Judul Inisiatif / Ide Diskusi"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="border border-slate-200 rounded-lg p-2 bg-white font-body text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-label font-bold uppercase text-slate-900">
                    Kategori Utama:
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ForumCategory)}
                    className="border border-slate-200 rounded-lg p-2 bg-white font-label text-xs font-bold"
                  >
                    <option value="Energi Terbarukan">Energi Terbarukan</option>
                    <option value="Zero Waste & IoT">Zero Waste & IoT</option>
                    <option value="Urban Farming & Hijau">Urban Farming & Hijau</option>
                    <option value="Mobilitas Bersih">Mobilitas Bersih</option>
                    <option value="Advokasi & Kebijakan">Advokasi & Kebijakan</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-label font-bold uppercase text-slate-900">
                    Fokus Target SDG:
                  </label>
                  <select
                    value={newSdgGoal}
                    onChange={(e) => setNewSdgGoal(e.target.value)}
                    className="border border-slate-200 rounded-lg p-2 bg-white font-label text-xs font-bold"
                  >
                    <option value="SDG 11: Kota Berkelanjutan">SDG 11: Kota Berkelanjutan</option>
                    <option value="SDG 7: Energi Bersih">SDG 7: Energi Bersih</option>
                    <option value="SDG 12: Konsumsi Bertanggung Jawab">SDG 12: Zero Waste</option>
                    <option value="SDG 13: Aksi Perubahan Iklim">SDG 13: Iklim</option>
                    <option value="SDG 6: Air Bersih & Sanitasi">SDG 6: Air Bersih</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label font-bold uppercase text-slate-900">
                  Uraian Ide &amp; Rencana Aksi Komunitas:
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Jelaskan latar belakang, perkiraan biaya/komponen teknologi, serta ajakan kolaborasi kepada warga..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="border border-slate-200 rounded-lg p-2.5 bg-white font-body text-xs resize-none outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label font-bold uppercase text-slate-900">
                  Tags / Tagar (pisahkan dengan koma):
                </label>
                <input
                  type="text"
                  placeholder="SolarPower, IoTSensor, ZeroWaste, RW05"
                  value={newTagsInput}
                  onChange={(e) => setNewTagsInput(e.target.value)}
                  className="border border-slate-200 rounded-lg p-2 bg-white font-body text-xs outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t-2 border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsNewTopicModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg font-label text-xs font-medium bg-white hover:bg-white cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary-600 border border-slate-200 rounded-lg font-label text-xs font-medium shadow-sm hover:bg-primary-700 cursor-pointer"
                >
                  Publikasikan Diskusi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
