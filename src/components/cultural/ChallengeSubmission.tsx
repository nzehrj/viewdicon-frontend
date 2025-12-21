// src/components/cultural/ChallengeSubmission.tsx
// Challenge Submission Form

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Image as ImageIcon, 
  Video, 
  FileText,
  X,
  AlertCircle,
  Sparkles,
  Send
} from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

interface ChallengeSubmissionProps {
  challengeId: string;
  challengeTitle: string;
  onSubmit?: (submission: SubmissionData) => void;
  onCancel?: () => void;
}

interface SubmissionData {
  title: string;
  description: string;
  mediaType: 'image' | 'video' | 'text';
  mediaUrl?: string;
  tags: string[];
}

export const ChallengeSubmission: React.FC<ChallengeSubmissionProps> = ({
  challengeId: _challengeId, // Keep for future API integration
  challengeTitle,
  onSubmit,
  onCancel,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'text'>('image');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl('');
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters';
    }

    if (mediaType !== 'text' && !selectedFile) {
      newErrors.media = 'Please upload a file';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      onSubmit?.({
        title,
        description,
        mediaType,
        mediaUrl: previewUrl,
        tags,
      });
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    } pb-20`}>
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 opacity-90" />
        
        <div className="absolute inset-0 opacity-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 right-0 w-32 h-32 border-4 border-white rounded-full"
          />
          <Sparkles className="absolute bottom-0 left-0 w-24 h-24 text-white" />
        </div>

        <div className="relative z-10 p-6 sm:p-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Submit Your Entry
              </h1>
              <p className="text-lg text-white/90">
                {challengeTitle}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto p-6 sm:p-8">
        <div className={`p-6 sm:p-8 rounded-2xl ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-xl`}>
          
          <div className="space-y-6">
            {/* Media Type Selection */}
            <div>
              <label className={`block text-sm font-semibold mb-3 ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
              }`}>
                Submission Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setMediaType('image')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    mediaType === 'image'
                      ? 'border-amber-600 bg-amber-600/10'
                      : theme === 'dark'
                      ? 'border-gray-700 hover:border-gray-600'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <ImageIcon className={`w-6 h-6 mx-auto mb-2 ${
                    mediaType === 'image' ? 'text-amber-600' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`} />
                  <span className={`text-sm font-semibold ${
                    mediaType === 'image' 
                      ? 'text-amber-600' 
                      : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Image
                  </span>
                </button>

                <button
                  onClick={() => setMediaType('video')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    mediaType === 'video'
                      ? 'border-amber-600 bg-amber-600/10'
                      : theme === 'dark'
                      ? 'border-gray-700 hover:border-gray-600'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Video className={`w-6 h-6 mx-auto mb-2 ${
                    mediaType === 'video' ? 'text-amber-600' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`} />
                  <span className={`text-sm font-semibold ${
                    mediaType === 'video' 
                      ? 'text-amber-600' 
                      : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Video
                  </span>
                </button>

                <button
                  onClick={() => setMediaType('text')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    mediaType === 'text'
                      ? 'border-amber-600 bg-amber-600/10'
                      : theme === 'dark'
                      ? 'border-gray-700 hover:border-gray-600'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FileText className={`w-6 h-6 mx-auto mb-2 ${
                    mediaType === 'text' ? 'text-amber-600' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`} />
                  <span className={`text-sm font-semibold ${
                    mediaType === 'text' 
                      ? 'text-amber-600' 
                      : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Text
                  </span>
                </button>
              </div>
            </div>

            {/* File Upload */}
            {mediaType !== 'text' && (
              <div>
                <label className={`block text-sm font-semibold mb-3 ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                }`}>
                  Upload {mediaType === 'image' ? 'Image' : 'Video'}
                </label>

                {!selectedFile ? (
                  <label className={`block p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                    errors.media 
                      ? 'border-red-500 bg-red-500/10'
                      : theme === 'dark'
                      ? 'border-gray-700 hover:border-amber-600 hover:bg-amber-600/5'
                      : 'border-gray-300 hover:border-amber-600 hover:bg-amber-50'
                  }`}>
                    <input
                      type="file"
                      accept={mediaType === 'image' ? 'image/*' : 'video/*'}
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <div className="text-center">
                      <Upload className={`w-12 h-12 mx-auto mb-3 ${
                        errors.media ? 'text-red-500' : 'text-gray-400'
                      }`} />
                      <p className={`text-sm font-semibold mb-1 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Click to upload or drag and drop
                      </p>
                      <p className={`text-xs ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        {mediaType === 'image' ? 'PNG, JPG up to 10MB' : 'MP4, MOV up to 100MB'}
                      </p>
                    </div>
                  </label>
                ) : (
                  <div className={`relative p-4 rounded-xl border-2 ${
                    theme === 'dark' ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'
                  }`}>
                    {mediaType === 'image' && previewUrl && (
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="w-full h-64 object-cover rounded-lg mb-3"
                      />
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-600 flex items-center justify-center">
                          {mediaType === 'image' ? (
                            <ImageIcon className="w-6 h-6 text-white" />
                          ) : (
                            <Video className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div>
                          <p className={`font-semibold text-sm ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {selectedFile.name}
                          </p>
                          <p className={`text-xs ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={removeFile}
                        className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}

                {errors.media && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.media}
                  </p>
                )}
              </div>
            )}

            {/* Title */}
            <div>
              <label className={`block text-sm font-semibold mb-3 ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
              }`}>
                Entry Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your submission a catchy title"
                className={`w-full px-4 py-3 rounded-xl border-2 ${
                  errors.title
                    ? 'border-red-500'
                    : theme === 'dark'
                    ? 'border-gray-700 bg-gray-700 text-white'
                    : 'border-gray-200 bg-white'
                } focus:outline-none focus:border-amber-600 transition-colors`}
              />
              <div className="flex justify-between mt-2">
                {errors.title && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.title}
                  </p>
                )}
                <p className={`text-xs ml-auto ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  {title.length}/100
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className={`block text-sm font-semibold mb-3 ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
              }`}>
                Description * <span className="text-xs font-normal text-gray-500">(Explain your creative process)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your inspiration, techniques used, and cultural significance..."
                rows={6}
                className={`w-full px-4 py-3 rounded-xl border-2 ${
                  errors.description
                    ? 'border-red-500'
                    : theme === 'dark'
                    ? 'border-gray-700 bg-gray-700 text-white'
                    : 'border-gray-200 bg-white'
                } focus:outline-none focus:border-amber-600 transition-colors`}
              />
              <div className="flex justify-between mt-2">
                {errors.description && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.description}
                  </p>
                )}
                <p className={`text-xs ml-auto ${
                  description.length < 50 ? 'text-red-500' : theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  {description.length}/500
                </p>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className={`block text-sm font-semibold mb-3 ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
              }`}>
                Tags <span className="text-xs font-normal text-gray-500">(Help others find your work)</span>
              </label>
              
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="e.g., traditional, modern, colorful"
                  className={`flex-1 px-4 py-3 rounded-xl border-2 ${
                    theme === 'dark'
                      ? 'border-gray-700 bg-gray-700 text-white'
                      : 'border-gray-200 bg-white'
                  } focus:outline-none focus:border-amber-600 transition-colors`}
                />
                <button
                  onClick={addTag}
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold transition-colors"
                >
                  Add
                </button>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 ${
                        theme === 'dark' ? 'bg-amber-600/20 text-amber-400' : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <button
                onClick={onCancel}
                disabled={isSubmitting}
                className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
                  theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                } disabled:opacity-50`}
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl font-bold text-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-6 h-6" />
                    </motion.div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-6 h-6" />
                    Submit Entry
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeSubmission;