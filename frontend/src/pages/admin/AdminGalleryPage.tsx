import React, { useEffect, useState } from 'react';
import {
  Upload,
  Plus,
  Trash2,
  ExternalLink,
  Edit2,
  X
} from 'lucide-react';
import { apiService, getAssetUrl } from '../../services/api';
import type { GalleryImageItem, EventItem } from '../../types';
import { useToast } from '../../context/ToastContext';

interface QueuedFile {
  file: File;
  preview: string;
  title: string;
}

export const AdminGalleryPage: React.FC = () => {
  const { addToast } = useToast();
  const [images, setImages] = useState<GalleryImageItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Multi-file Drag & Drop Upload Queue
  const [queuedFiles, setQueuedFiles] = useState<QueuedFile[]>([]);
  const [category, setCategory] = useState('WORKSHOPS');
  const [description, setDescription] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<string>('');

  // Edit Modal State
  const [editingImage, setEditingImage] = useState<GalleryImageItem | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: 'WORKSHOPS',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [galleryData, eventsData] = await Promise.all([
        apiService.getGallery(),
        apiService.getEvents(undefined, true).catch(() => []),
      ]);
      setImages(galleryData);
      setEvents(eventsData);
    } catch {
      addToast('Failed to load gallery images', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addFilesToQueue = (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (fileArray.length === 0) {
      addToast('Please select valid image files (PNG, JPG, WEBP)', 'error');
      return;
    }

    const mapped: QueuedFile[] = fileArray.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' '),
    }));

    setQueuedFiles((prev) => [...prev, ...mapped]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFilesToQueue(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      addFilesToQueue(e.dataTransfer.files);
    }
  };

  const removeQueuedFile = (index: number) => {
    setQueuedFiles((prev) => {
      const target = prev[index];
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((_, idx) => idx !== index);
    });
  };

  const updateQueuedTitle = (index: number, newTitle: string) => {
    setQueuedFiles((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, title: newTitle } : item))
    );
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (queuedFiles.length === 0) {
      addToast('Please drag and drop or browse at least one image file', 'error');
      return;
    }

    try {
      setUploading(true);
      let uploadedCount = 0;
      for (const item of queuedFiles) {
        const fd = new FormData();
        fd.append('file', item.file);
        fd.append('title', item.title.trim() || 'GDG RIT Event Capture');
        fd.append('category', category);
        if (description.trim()) {
          fd.append('description', description.trim());
        }
        if (selectedEventId) {
          fd.append('event_id', selectedEventId);
        }
        await apiService.uploadGalleryImage(fd);
        uploadedCount += 1;
      }

      addToast(`Uploaded ${uploadedCount} image${uploadedCount > 1 ? 's' : ''} to gallery`, 'success');
      queuedFiles.forEach((q) => URL.revokeObjectURL(q.preview));
      setQueuedFiles([]);
      setDescription('');
      setSelectedEventId('');
      setModalOpen(false);
      fetchData();
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Failed to upload photos';
      addToast(msg, 'error');
    } finally {
      setUploading(false);
    }
  };

  const openEditModal = (img: GalleryImageItem) => {
    setEditingImage(img);
    setEditForm({
      title: img.title,
      description: img.description || '',
      category: img.category,
    });
  };

  const handleUpdateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingImage) return;
    try {
      const updated = await apiService.updateGalleryItem(editingImage.id, editForm);
      setImages((prev) => prev.map((img) => (img.id === editingImage.id ? updated : img)));
      addToast('Image details updated', 'success');
      setEditingImage(null);
    } catch {
      addToast('Failed to update image details', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this photo from the gallery?')) {
      return;
    }
    try {
      await apiService.deleteGalleryItem(id);
      setImages((prev) => prev.filter((img) => img.id !== id));
      addToast('Image removed from gallery', 'success');
    } catch {
      addToast('Failed to delete image', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Media Gallery Manager</h1>
          <p className="text-xs text-slate-400 mt-1">
            Drag-and-drop multiple event photographs, edit captions, link related events, and curate the public gallery
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="btn-3d-primary inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Photos (Multi / Drag &amp; Drop)</span>
        </button>
      </div>

      {/* Grid of Images */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">Loading gallery media...</div>
      ) : images.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-500">
          No images uploaded yet. Click "Upload Photos" to add event captures.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img) => (
            <div
              key={img.id}
              className="rounded-2xl surface-3d card-3d overflow-hidden group flex flex-col justify-between"
            >
              <div className="relative aspect-video bg-black/50 overflow-hidden">
                <img
                  src={getAssetUrl(img.image_url)}
                  alt={img.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/20">
                    {img.category}
                  </span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm truncate">{img.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                    {img.description || 'GDG on Campus RIT Hassan Event Capture'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">
                    {img.upload_date ? new Date(img.upload_date).toLocaleDateString() : 'Active'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(img)}
                      className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors"
                      title="Edit details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={getAssetUrl(img.image_url)}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                      title="Open full size"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => handleDelete(img.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                      title="Delete image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Multi-File Drag & Drop Upload Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl surface-3d rounded-3xl p-6 sm:p-8 my-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-1">Upload Gallery Photographs</h2>
            <p className="text-xs text-slate-400 mb-6">
              Drag and drop one or multiple images below. Files are stored in backend media storage and appear immediately in the public gallery.
            </p>

            <form onSubmit={handleUpload} className="space-y-4">
              {/* Drag & Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-all ${
                  isDragging
                    ? 'border-blue-400 bg-blue-500/10'
                    : 'border-white/20 hover:border-blue-500 bg-white/[0.01]'
                }`}
              >
                <Upload className={`w-8 h-8 mb-2 ${isDragging ? 'text-blue-400' : 'text-slate-400'}`} />
                <p className="text-xs font-bold text-slate-200">
                  Drag &amp; drop photos here, or click to browse multiple files
                </p>
                <p className="text-[10px] text-slate-500 mt-1 mb-3">
                  Supports PNG, JPG, JPEG, WEBP (Max 10MB per image)
                </p>
                <label className="cursor-pointer px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-semibold transition-colors">
                  <span>Browse Image Files</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Preview Queue */}
              {queuedFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-300">
                    Selected Images ({queuedFiles.length})
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
                    {queuedFiles.map((q, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                        <img
                          src={q.preview}
                          alt={q.title}
                          className="w-14 h-12 rounded-lg object-cover shrink-0 border border-white/10"
                        />
                        <input
                          type="text"
                          value={q.title}
                          onChange={(e) => updateQueuedTitle(idx, e.target.value)}
                          placeholder="Photo caption"
                          className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeQueuedFile(idx)}
                          className="p-1 text-slate-400 hover:text-rose-400"
                          title="Remove"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0B101D] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="WORKSHOPS">WORKSHOPS</option>
                    <option value="HACKATHONS">HACKATHONS</option>
                    <option value="TECHNICAL">TECHNICAL EVENTS</option>
                    <option value="SEMINARS">SEMINARS</option>
                    <option value="COMPETITIONS">COMPETITIONS</option>
                    <option value="ACTIVITIES">CLUB ACTIVITIES</option>
                    <option value="INAUGURATION">INAUGURATION</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Related Event (Optional)
                  </label>
                  <select
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0B101D] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="">General Club Gallery</option>
                    {events.map((ev) => (
                      <option key={ev.id} value={ev.id.toString()}>
                        {ev.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Shared Description / Event Context
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the session, highlights, or venue..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || queuedFiles.length === 0}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow-lg shadow-blue-600/30 disabled:opacity-50 flex items-center gap-2"
                >
                  {uploading ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>Upload {queuedFiles.length > 0 ? `(${queuedFiles.length})` : ''} to Gallery</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Image Details Modal */}
      {editingImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md surface-3d rounded-3xl p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-4">Edit Photograph Details</h2>
            <form onSubmit={handleUpdateImage} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Caption / Title
                </label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B101D] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="WORKSHOPS">WORKSHOPS</option>
                  <option value="HACKATHONS">HACKATHONS</option>
                  <option value="TECHNICAL">TECHNICAL EVENTS</option>
                  <option value="SEMINARS">SEMINARS</option>
                  <option value="COMPETITIONS">COMPETITIONS</option>
                  <option value="ACTIVITIES">CLUB ACTIVITIES</option>
                  <option value="INAUGURATION">INAUGURATION</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingImage(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                >
                  Save Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
