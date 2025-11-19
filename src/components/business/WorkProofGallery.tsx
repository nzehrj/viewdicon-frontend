import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Image as ImageIcon,
  FileText,
  Video,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Upload,
  Trash2,
  Eye,
  Play
} from 'lucide-react';

// Types
type ProofType = 'before' | 'after' | 'progress' | 'final';
type MediaType = 'image' | 'video' | 'document';

interface WorkProof {
  id: string;
  type: ProofType;
  mediaType: MediaType;
  url: string;
  thumbnailUrl?: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  uploadedBy: 'payer' | 'beneficiary';
  caption?: string;
  timestamp?: string;
  order: number;
}

interface WorkProofGalleryProps {
  sessionId: string;
  proofs: WorkProof[];
  canUpload: boolean;
  userRole: 'payer' | 'beneficiary';
  sessionStatus: 'in_progress' | 'review' | 'completed';
  onUpload: (file: File, type: ProofType, caption?: string) => Promise<void>;
  onDelete: (proofId: string) => Promise<void>;
  onUpdateCaption: (proofId: string, caption: string) => Promise<void>;
}

const WorkProofGallery: React.FC<WorkProofGalleryProps> = ({
  proofs,
  canUpload,
  userRole,
  onUpload,
  onDelete,
  onUpdateCaption
}) => {
  const [selectedFilter, setSelectedFilter] = useState<ProofType | 'all'>('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState<ProofType>('progress');
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);
  const [editingCaption, setEditingCaption] = useState<string | null>(null);
  const [captionText, setCaptionText] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);

  // Filter proofs
  const filteredProofs = selectedFilter === 'all' 
    ? proofs 
    : proofs.filter(p => p.type === selectedFilter);

  // Sort by order and timestamp
  const sortedProofs = [...filteredProofs].sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
  });

  // Group proofs by type for stats
  const proofStats = {
    before: proofs.filter(p => p.type === 'before').length,
    progress: proofs.filter(p => p.type === 'progress').length,
    after: proofs.filter(p => p.type === 'after').length,
    final: proofs.filter(p => p.type === 'final').length,
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      await onUpload(file, uploadType, uploadCaption.trim() || undefined);
      setUploadModalOpen(false);
      setUploadCaption('');
      setUploadType('progress');
      e.target.value = '';
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleDelete = async (proofId: string) => {
    if (!window.confirm('Delete this proof? This action cannot be undone.')) return;
    
    try {
      await onDelete(proofId);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleUpdateCaption = async (proofId: string) => {
    if (!captionText.trim()) return;

    try {
      await onUpdateCaption(proofId, captionText);
      setEditingCaption(null);
      setCaptionText('');
    } catch (error) {
      console.error('Caption update failed:', error);
    }
  };

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    setZoomLevel(1);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % sortedProofs.length);
    setZoomLevel(1);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + sortedProofs.length) % sortedProofs.length);
    setZoomLevel(1);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  };

  const getTypeColor = (type: ProofType) => {
    const colors = {
      before: 'red',
      progress: 'blue',
      after: 'green',
      final: 'purple'
    };
    return colors[type];
  };

  const getTypeLabel = (type: ProofType) => {
    const labels = {
      before: 'Before',
      progress: 'In Progress',
      after: 'After',
      final: 'Final'
    };
    return labels[type];
  };

  const getMediaIcon = (mediaType: MediaType) => {
    switch (mediaType) {
      case 'image': return ImageIcon;
      case 'video': return Video;
      case 'document': return FileText;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Work Proof Gallery</h2>
            <p className="text-sm text-purple-100 mt-1">
              Document your work progress with photos and videos
            </p>
          </div>
          {canUpload && (
            <button
              onClick={() => setUploadModalOpen(true)}
              className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 font-semibold flex items-center gap-2 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mt-4">
          {(['before', 'progress', 'after', 'final'] as ProofType[]).map((type) => (
            <div key={type} className="bg-white/20 rounded-lg px-3 py-2 text-center">
              <p className="text-xs text-purple-100 mb-1 capitalize">{getTypeLabel(type)}</p>
              <p className="text-2xl font-bold">{proofStats[type]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          {(['all', 'before', 'progress', 'after', 'final'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                selectedFilter === filter
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {filter === 'all' ? 'All' : getTypeLabel(filter)}
              {filter !== 'all' && (
                <span className="ml-2 text-sm">
                  ({proofStats[filter as ProofType]})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="p-6">
        {sortedProofs.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium mb-2">No work proofs yet</p>
            <p className="text-sm text-gray-500 mb-4">
              {canUpload
                ? 'Upload photos or videos to document your work'
                : 'Work proofs will appear here once uploaded'}
            </p>
            {canUpload && (
              <button
                onClick={() => setUploadModalOpen(true)}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold inline-flex items-center gap-2 transition-colors"
              >
                <Upload className="w-5 h-5" />
                Upload First Proof
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedProofs.map((proof, index) => {
              const MediaIconComponent = getMediaIcon(proof.mediaType);
              const typeColor = getTypeColor(proof.type);
              const isOwnUpload = proof.uploadedBy === userRole;

              return (
                <motion.div
                  key={proof.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative bg-gray-100 rounded-lg overflow-hidden aspect-square cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => openLightbox(index)}
                >
                  {/* Media Preview */}
                  {proof.mediaType === 'image' ? (
                    <img
                      src={proof.thumbnailUrl || proof.url}
                      alt={proof.fileName}
                      className="w-full h-full object-cover"
                    />
                  ) : proof.mediaType === 'video' ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900">
                      <Play className="w-12 h-12 text-white opacity-80" />
                      {proof.thumbnailUrl && (
                        <img
                          src={proof.thumbnailUrl}
                          alt={proof.fileName}
                          className="absolute inset-0 w-full h-full object-cover opacity-50"
                        />
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200">
                      <FileText className="w-12 h-12 text-gray-500 mb-2" />
                      <p className="text-xs text-gray-600 text-center px-2 truncate w-full">
                        {proof.fileName}
                      </p>
                    </div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      {proof.caption && (
                        <p className="text-white text-xs mb-2 line-clamp-2">
                          {proof.caption}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-1 bg-${typeColor}-500 text-white rounded-full`}>
                          {getTypeLabel(proof.type)}
                        </span>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4 text-white" />
                          {isOwnUpload && canUpload && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(proof.id);
                              }}
                              className="p-1 bg-red-500 rounded hover:bg-red-600 transition-colors"
                            >
                              <Trash2 className="w-3 h-3 text-white" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Type Badge */}
                  <div className={`absolute top-2 left-2 px-2 py-1 bg-${typeColor}-500 text-white text-xs font-semibold rounded-full`}>
                    {getTypeLabel(proof.type)}
                  </div>

                  {/* Media Type Icon */}
                  <div className="absolute top-2 right-2 p-1 bg-black/50 rounded">
                    <MediaIconComponent className="w-4 h-4 text-white" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {uploadModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => !uploadingFile && setUploadModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Upload Work Proof</h3>
                <button
                  onClick={() => !uploadingFile && setUploadModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={uploadingFile}
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proof Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['before', 'progress', 'after', 'final'] as ProofType[]).map((type) => (
                      <button
                        key={type}
                        onClick={() => setUploadType(type)}
                        className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                          uploadType === type
                            ? `bg-${getTypeColor(type)}-600 text-white`
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {getTypeLabel(type)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Caption */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Caption (Optional)
                  </label>
                  <textarea
                    value={uploadCaption}
                    onChange={(e) => setUploadCaption(e.target.value)}
                    placeholder="Describe what's shown in this proof..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows={3}
                    maxLength={200}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {uploadCaption.length}/200 characters
                  </p>
                </div>

                {/* File Input */}
                <div>
                  <label className="block w-full cursor-pointer">
                    <div className="px-4 py-8 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-500 transition-colors text-center">
                      <Upload className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                      <span className="text-sm text-purple-600 font-medium block mb-1">
                        {uploadingFile ? 'Uploading...' : 'Click to select file'}
                      </span>
                      <p className="text-xs text-gray-500">
                        Images, videos, or documents (Max 50MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*,video/*,.pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      disabled={uploadingFile}
                      className="hidden"
                    />
                  </label>
                </div>

                {uploadingFile && (
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-2" />
                    <p className="text-sm text-purple-600 font-medium">Uploading...</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && sortedProofs[currentIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Controls */}
            <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
              {/* Zoom Controls */}
              {sortedProofs[currentIndex].mediaType === 'image' && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleZoomOut();
                    }}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <ZoomOut className="w-5 h-5 text-white" />
                  </button>
                  <span className="text-white text-sm font-medium px-2">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleZoomIn();
                    }}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <ZoomIn className="w-5 h-5 text-white" />
                  </button>
                </>
              )}
            </div>

            {/* Navigation */}
            {sortedProofs.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}

            {/* Media Display */}
            <div
              className="max-w-7xl max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {sortedProofs[currentIndex].mediaType === 'image' ? (
                <img
                  src={sortedProofs[currentIndex].url}
                  alt={sortedProofs[currentIndex].fileName}
                  className="max-w-full h-auto transition-transform"
                  style={{ transform: `scale(${zoomLevel})` }}
                />
              ) : sortedProofs[currentIndex].mediaType === 'video' ? (
                <video
                  src={sortedProofs[currentIndex].url}
                  controls
                  className="max-w-full h-auto"
                  autoPlay
                />
              ) : (
                <div className="bg-white rounded-lg p-8 max-w-2xl">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-center text-gray-700 font-medium mb-4">
                    {sortedProofs[currentIndex].fileName}
                  </p>
                  <a
                    href={sortedProofs[currentIndex].url}
                    download
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold inline-flex items-center gap-2 mx-auto"
                  >
                    <Download className="w-5 h-5" />
                    Download
                  </a>
                </div>
              )}
            </div>

            {/* Info Panel */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 bg-${getTypeColor(sortedProofs[currentIndex].type)}-500 text-white text-sm font-semibold rounded-full`}>
                        {getTypeLabel(sortedProofs[currentIndex].type)}
                      </span>
                      <span className="text-white/70 text-sm">
                        {sortedProofs[currentIndex].uploadedBy === 'payer' ? 'Client' : 'Professional'}
                      </span>
                      <span className="text-white/50 text-sm">•</span>
                      <span className="text-white/70 text-sm">
                        {new Date(sortedProofs[currentIndex].uploadedAt).toLocaleDateString('en-NG', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    {editingCaption === sortedProofs[currentIndex].id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={captionText}
                          onChange={(e) => setCaptionText(e.target.value)}
                          placeholder="Add a caption..."
                          className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                          autoFocus
                        />
                        <button
                          onClick={() => handleUpdateCaption(sortedProofs[currentIndex].id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingCaption(null);
                            setCaptionText('');
                          }}
                          className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-white text-sm">
                          {sortedProofs[currentIndex].caption || (
                            <span className="text-white/50 italic">No caption</span>
                          )}
                        </p>
                        {sortedProofs[currentIndex].uploadedBy === userRole && canUpload && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingCaption(sortedProofs[currentIndex].id);
                              setCaptionText(sortedProofs[currentIndex].caption || '');
                            }}
                            className="text-white/70 hover:text-white text-sm font-medium"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={sortedProofs[currentIndex].url}
                      download
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <Download className="w-5 h-5 text-white" />
                    </a>
                  </div>
                </div>

                {/* Counter */}
                <div className="text-center mt-4">
                  <span className="text-white/70 text-sm">
                    {currentIndex + 1} / {sortedProofs.length}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkProofGallery;