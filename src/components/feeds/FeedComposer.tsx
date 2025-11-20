import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X,
  Image as ImageIcon,
  Video,
  Mic,
  MapPin,
  Search,
  Users,
  Sparkles,
  Lock,
  Globe,
  DollarSign,
  Send,
  Calendar
} from 'lucide-react';
import { useAppSelector } from '@store/hooks';
import { IdentitySkinBadge } from '@components/identity/IdentitySkinSelector';

interface FeedComposerProps {
  isOpen: boolean;
  onClose: () => void;
  defaultFeedType?: FeedType;
  onPost?: (post: PostData) => void;
}

type FeedType = 'motion' | 'gallery' | 'voice' | 'family' | 'village' | 'discover' | 'spotlight';
type PrivacyLevel = 'public' | 'tribe_only' | 'family_only' | 'village_only' | 'friends_only';
type IdentitySkin = 'work' | 'public' | 'clan';

interface PostData {
  feedType: FeedType;
  identitySkin: IdentitySkin;
  privacy: PrivacyLevel;
  content: string;
  mediaFiles?: File[];
  voiceNote?: Blob;
  location?: string;
  tags?: string[];
  price?: number;
  eventDate?: Date;
  targetAmount?: number;
}

export const FeedComposer: React.FC<FeedComposerProps> = ({
  isOpen,
  onClose,
  defaultFeedType = 'village',
  onPost,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const user = useAppSelector((state) => state.user.user);
  const userVillage = useAppSelector((state) => state.user.village);
  
  const [feedType, setFeedType] = useState<FeedType>(defaultFeedType);
  const [identitySkin, setIdentitySkin] = useState<IdentitySkin>('public');
  const [privacy, setPrivacy] = useState<PrivacyLevel>('public');
  const [content, setContent] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<File[]>([]);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [price, setPrice] = useState<number | undefined>();
  const [eventDate, setEventDate] = useState<string>('');
  const [targetAmount, setTargetAmount] = useState<number | undefined>();
  
  const feedTypes: Array<{ id: FeedType; label: string; icon: React.ElementType; limit: number }> = [
    { id: 'village', label: 'Village Square', icon: Users, limit: 1000 },
    { id: 'discover', label: 'Discover', icon: Search, limit: 1000 },
    { id: 'motion', label: 'Motion', icon: Video, limit: 400 },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon, limit: 2000 },
    { id: 'voice', label: 'Voice', icon: Mic, limit: 400 },
    { id: 'family', label: 'Family Circle', icon: Users, limit: 2000 },
    { id: 'spotlight', label: 'Spotlight', icon: Sparkles, limit: 1000 },
  ];
  
  const privacyLevels: Array<{ id: PrivacyLevel; label: string; icon: React.ElementType; description: string }> = [
    { id: 'public', label: 'Public', icon: Globe, description: 'Everyone can see' },
    { id: 'village_only', label: 'Village Only', icon: Users, description: 'Only your village members' },
    { id: 'tribe_only', label: 'Tribe Only', icon: Users, description: 'Only your tribe members' },
    { id: 'family_only', label: 'Family Only', icon: Lock, description: 'Only verified family' },
    { id: 'friends_only', label: 'Friends Only', icon: Users, description: 'Only your connections' },
  ];
  
  const currentLimit = feedTypes.find(f => f.id === feedType)?.limit || 1000;
  const remainingChars = currentLimit - content.length;
  
  const handlePost = () => {
    if (!content.trim() && selectedMedia.length === 0) {
      return;
    }
    
    const postData: PostData = {
      feedType,
      identitySkin,
      privacy,
      content,
      mediaFiles: selectedMedia.length > 0 ? selectedMedia : undefined,
      location: location || undefined,
      tags: tags.length > 0 ? tags : undefined,
      price,
      eventDate: eventDate ? new Date(eventDate) : undefined,
      targetAmount,
    };
    
    onPost?.(postData);
    
    // Reset form
    setContent('');
    setSelectedMedia([]);
    setLocation('');
    setTags([]);
    setPrice(undefined);
    setEventDate('');
    setTargetAmount(undefined);
    
    onClose();
  };
  
  const handleMediaSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const maxFiles = feedType === 'gallery' ? 10 : 1;
    setSelectedMedia(files.slice(0, maxFiles));
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          
          {/* Modal - FIXED VERSION */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`fixed left-4 right-4 top-4 bottom-4  md:w-full md:max-w-2xl md:h-auto md:max-h-[90vh] z-50 rounded-2xl flex flex-col ${
              theme === 'dark' ? 'bg-gray-900' : 'bg-white'
            }`}
          >
            {/* Header - Fixed at top */}
            <div className={`p-4 border-b flex items-center justify-between flex-shrink-0 ${
              theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
            }`}>
              <div>
                <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Create Post
                </h2>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Share with your community
                </p>
              </div>
              
              <button
                onClick={onClose}
                className={`p-2 rounded-lg ${
                  theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                } transition-colors`}
              >
                <X className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
            </div>
            
            {/* Content - Scrollable middle section */}
            <div className="overflow-y-auto flex-1 p-4 space-y-4">
              {/* User Info */}
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white"
                  style={{ backgroundColor: (userVillage as any)?.primaryColor || '#8b5cf6' }}
                >
                  {user?.name?.charAt(0) || 'U'}
                </div>
                
                <div className="flex-1">
                  <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {user?.name || 'User'}
                  </p>
                  <div className="flex items-center gap-2">
                    <IdentitySkinBadge skin={identitySkin} size="sm" />
                  </div>
                </div>
              </div>
              
              {/* Feed Type Selector */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Post to
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {feedTypes.map((type) => {
                    const Icon = type.icon;
                    const isActive = feedType === type.id;
                    
                    return (
                      <button
                        key={type.id}
                        onClick={() => setFeedType(type.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center gap-2 transition-colors ${
                          isActive
                            ? 'bg-purple-600 text-white'
                            : theme === 'dark'
                            ? 'bg-gray-800 text-gray-300 hover:bg-gray-750'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {type.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Identity Skin Selector */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Post as
                </label>
                <div className="flex items-center gap-2">
                  {(['work', 'public', 'clan'] as IdentitySkin[]).map((skin) => (
                    <button
                      key={skin}
                      onClick={() => setIdentitySkin(skin)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                        identitySkin === skin
                          ? 'bg-purple-600 text-white'
                          : theme === 'dark'
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-750'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <IdentitySkinBadge skin={skin} size="sm" />
                      {skin.charAt(0).toUpperCase() + skin.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Content Textarea */}
              <div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={`What's on your mind? (${currentLimit} chars max)`}
                  maxLength={currentLimit}
                  rows={6}
                  className={`w-full px-4 py-3 rounded-lg border resize-none ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                />
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span className={remainingChars < 50 ? 'text-amber-500 font-medium' : theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}>
                    {remainingChars} characters remaining
                  </span>
                </div>
              </div>
              
              {/* Media Upload */}
              {(feedType === 'gallery' || feedType === 'motion' || feedType === 'family') && (
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {feedType === 'motion' ? 'Video' : 'Photos'} ({feedType === 'gallery' ? '1-10' : '1'})
                  </label>
                  <input
                    type="file"
                    accept={feedType === 'motion' ? 'video/*' : 'image/*'}
                    multiple={feedType === 'gallery'}
                    onChange={handleMediaSelect}
                    className="hidden"
                    id="media-upload"
                  />
                  <label
                    htmlFor="media-upload"
                    className={`block w-full p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      theme === 'dark'
                        ? 'border-gray-700 hover:border-gray-600 bg-gray-800'
                        : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      {feedType === 'motion' ? (
                        <Video className={`w-8 h-8 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                      ) : (
                        <ImageIcon className={`w-8 h-8 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                      )}
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Click to upload {feedType === 'motion' ? 'video' : 'photos'}
                      </p>
                      {selectedMedia.length > 0 && (
                        <p className="text-sm text-purple-600 font-medium">
                          {selectedMedia.length} file(s) selected
                        </p>
                      )}
                    </div>
                  </label>
                </div>
              )}
              
              {/* Voice Recording */}
              {feedType === 'voice' && (
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Voice Note (90s max)
                  </label>
                  <button
                    onClick={() => setIsRecordingVoice(!isRecordingVoice)}
                    className={`w-full p-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                      isRecordingVoice
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                  >
                    <Mic className="w-5 h-5" />
                    {isRecordingVoice ? 'Stop Recording' : 'Start Recording'}
                  </button>
                </div>
              )}
              
              {/* Additional Options */}
              <div className="space-y-3">
                {/* Location */}
                <div className="flex items-center gap-2">
                  <MapPin className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Add location"
                    className={`flex-1 px-3 py-2 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  />
                </div>
                
                {/* Price (for Gallery) */}
                {feedType === 'gallery' && (
                  <div className="flex items-center gap-2">
                    <DollarSign className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                    <input
                      type="number"
                      value={price || ''}
                      onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="Set price (optional)"
                      className={`flex-1 px-3 py-2 rounded-lg border ${
                        theme === 'dark'
                          ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    />
                  </div>
                )}
                
                {/* Event Date (for Family) */}
                {feedType === 'family' && (
                  <div className="flex items-center gap-2">
                    <Calendar className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className={`flex-1 px-3 py-2 rounded-lg border ${
                        theme === 'dark'
                          ? 'bg-gray-800 border-gray-700 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    />
                  </div>
                )}
              </div>
              
              {/* Privacy Selector */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Who can see this?
                </label>
                <select
                  value={privacy}
                  onChange={(e) => setPrivacy(e.target.value as PrivacyLevel)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                >
                  {privacyLevels.map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.label} - {level.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Footer - Fixed at bottom */}
            <div className={`p-4 border-t flex-shrink-0 ${
              theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-800 text-white hover:bg-gray-750'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Cancel
                </button>
                
                <button
                  onClick={handlePost}
                  disabled={!content.trim() && selectedMedia.length === 0}
                  className={`flex-1 px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
                    !content.trim() && selectedMedia.length === 0
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  <Send className="w-5 h-5" />
                  Post
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FeedComposer;