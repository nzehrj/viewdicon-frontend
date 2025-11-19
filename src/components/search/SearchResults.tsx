import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search,
  Users,
  Briefcase,
  FileText,
  Video,
  BookOpen,
  //TrendingUp,
  MapPin,
  Award,
  X,
  Filter,
  SlidersHorizontal,
  ArrowRight,
  Clock,
  Star,
  CheckCircle
} from 'lucide-react';

// Types
type SearchCategory = 'all' | 'people' | 'services' | 'posts' | 'courses' | 'articles' | 'villages';

interface SearchFilters {
  category: SearchCategory;
  village?: string;
  crestLevel?: number;
  verified?: boolean;
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
}

interface SearchResultPerson {
  type: 'person';
  id: string;
  name: string;
  afroId: string;
  avatar?: string;
  village: string;
  crestLevel: number;
  verified: boolean;
  bio: string;
  location: string;
  skills?: string[];
}

interface SearchResultService {
  type: 'service';
  id: string;
  title: string;
  providerId: string;
  providerName: string;
  providerAvatar?: string;
  village: string;
  price: number;
  rating: number;
  reviewCount: number;
  description: string;
  verified: boolean;
}

interface SearchResultPost {
  type: 'post';
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  village: string;
  content: string;
  timestamp: Date;
  likes: number;
  comments: number;
}

interface SearchResultCourse {
  type: 'course';
  id: string;
  title: string;
  instructorName: string;
  thumbnail?: string;
  duration: string;
  enrolled: number;
  rating: number;
  price: number;
  tierRequired: number;
}

interface SearchResultArticle {
  type: 'article';
  id: string;
  title: string;
  authorName: string;
  excerpt: string;
  thumbnail?: string;
  readTime: string;
  publishedAt: Date;
  village: string;
}

type SearchResult = 
  | SearchResultPerson 
  | SearchResultService 
  | SearchResultPost 
  | SearchResultCourse 
  | SearchResultArticle;

interface SearchResultsProps {
  query: string;
  results: SearchResult[];
  isLoading?: boolean;
  onResultClick?: (result: SearchResult) => void;
  onClearSearch?: () => void;
  villages?: string[];
}

const SearchResults: React.FC<SearchResultsProps> = ({
  query,
  results,
  isLoading = false,
  onResultClick,
  onClearSearch,
  villages = []
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    category: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);

  const getCategoryIcon = (category: SearchCategory) => {
    const iconMap = {
      all: Search,
      people: Users,
      services: Briefcase,
      posts: FileText,
      courses: Video,
      articles: BookOpen,
      villages: MapPin
    };
    return iconMap[category];
  };

  const formatCurrency = (amount: number): string => {
    return `₦${amount.toLocaleString('en-NG')}`;
  };

  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  // Filter results based on active filters
  const filteredResults = results.filter(result => {
    // Category filter
    if (filters.category !== 'all' && result.type !== filters.category.slice(0, -1)) {
      return false;
    }

    // Village filter
    if (filters.village && 'village' in result && result.village !== filters.village) {
      return false;
    }

    // Crest level filter
    if (filters.crestLevel && result.type === 'person' && result.crestLevel < filters.crestLevel) {
      return false;
    }

    // Verified filter
    if (filters.verified && 'verified' in result && !result.verified) {
      return false;
    }

    // Price range filter
    if (filters.priceRange && 'price' in result) {
      const { min, max } = filters.priceRange;
      if (result.price < min || result.price > max) {
        return false;
      }
    }

    // Rating filter
    if (filters.rating && 'rating' in result && result.rating < filters.rating) {
      return false;
    }

    return true;
  });

  const categories: { key: SearchCategory; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'people', label: 'People' },
    { key: 'services', label: 'Services' },
    { key: 'posts', label: 'Posts' },
    { key: 'courses', label: 'Courses' },
    { key: 'articles', label: 'Articles' }
  ];

  const getCategoryCount = (category: SearchCategory): number => {
    if (category === 'all') return results.length;
    const typeMap: Record<string, string> = {
      people: 'person',
      services: 'service',
      posts: 'post',
      courses: 'course',
      articles: 'article'
    };
    return results.filter(r => r.type === typeMap[category]).length;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 min-w-0 mr-4">
            <h1 className="text-xl font-bold mb-1 truncate">Search Results</h1>
            <p className="text-blue-100 text-sm truncate">
              {query ? `"${query}"` : 'Browse all content'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 rounded-lg transition-colors ${
                showFilters ? 'bg-white text-blue-600' : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
            {onClearSearch && (
              <button
                onClick={onClearSearch}
                className="p-2.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="bg-white/10 rounded-lg px-4 py-2 backdrop-blur-sm">
          <p className="text-sm">
            {isLoading 
              ? 'Searching...' 
              : `${filteredResults.length} result${filteredResults.length !== 1 ? 's' : ''} found`}
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 overflow-x-auto">
        <div className="flex gap-2">
          {categories.map((category) => {
            const Icon = getCategoryIcon(category.key);
            const count = getCategoryCount(category.key);
            const isActive = filters.category === category.key;

            return (
              <button
                key={category.key}
                onClick={() => setFilters({ ...filters, category: category.key })}
                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors flex items-center gap-2 ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.label}
                {count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    isActive ? 'bg-white/20' : 'bg-gray-300 text-gray-700'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white border-b border-gray-200 overflow-hidden"
          >
            <div className="p-4 space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Advanced Filters
              </h3>

              {/* Village Filter */}
              {villages.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Village
                  </label>
                  <select
                    value={filters.village || ''}
                    onChange={(e) => setFilters({ ...filters, village: e.target.value || undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Villages</option>
                    {villages.map((village) => (
                      <option key={village} value={village}>{village}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Verified Only */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.verified || false}
                  onChange={(e) => setFilters({ ...filters, verified: e.target.checked || undefined })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Verified Only</span>
              </label>

              {/* Minimum Rating */}
              {(filters.category === 'services' || filters.category === 'courses' || filters.category === 'all') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    value={filters.rating || ''}
                    onChange={(e) => setFilters({ ...filters, rating: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Any Rating</option>
                    <option value="4">4+ Stars</option>
                    <option value="4.5">4.5+ Stars</option>
                  </select>
                </div>
              )}

              {/* Clear Filters */}
              <button
                onClick={() => setFilters({ category: filters.category })}
                className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results List */}
      <div className="p-4 space-y-3">
        {isLoading ? (
          // Loading State
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredResults.length === 0 ? (
          // Empty State
          <div className="bg-white rounded-xl p-12 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No results found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or search with different keywords
            </p>
          </div>
        ) : (
          // Results
          <AnimatePresence>
            {filteredResults.map((result) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                onClick={() => onResultClick?.(result)}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
              >
                {/* Person Result */}
                {result.type === 'person' && (
                  <div className="flex items-start gap-3">
                    {result.avatar ? (
                      <img
                        src={result.avatar}
                        alt={result.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{result.name}</h3>
                        {result.verified && (
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{result.afroId}</p>
                      <p className="text-sm text-gray-700 line-clamp-2 mb-2">{result.bio}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {result.village}
                        </span>
                        <span className="flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          Crest {result.crestLevel}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                )}

                {/* Service Result */}
                {result.type === 'service' && (
                  <div className="flex items-start gap-3">
                    <div className="p-3 bg-purple-100 rounded-xl">
                      <Briefcase className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{result.title}</h3>
                        {result.verified && (
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">by {result.providerName}</p>
                      <p className="text-sm text-gray-700 line-clamp-2 mb-2">{result.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current text-amber-500" />
                            {result.rating} ({result.reviewCount})
                          </span>
                          <span>{result.village}</span>
                        </div>
                        <span className="font-semibold text-purple-600">{formatCurrency(result.price)}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                )}

                {/* Post Result */}
                {result.type === 'post' && (
                  <div className="flex items-start gap-3">
                    {result.authorAvatar ? (
                      <img
                        src={result.authorAvatar}
                        alt={result.authorName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Users className="w-5 h-5 text-green-600" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">{result.authorName}</h3>
                      <p className="text-sm text-gray-700 line-clamp-3 mb-2">{result.content}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(result.timestamp)}
                        </span>
                        <span>{result.likes} likes</span>
                        <span>{result.comments} comments</span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                )}

                {/* Course Result */}
                {result.type === 'course' && (
                  <div className="flex items-start gap-3">
                    {result.thumbnail ? (
                      <img
                        src={result.thumbnail}
                        alt={result.title}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-lg bg-amber-100 flex items-center justify-center">
                        <Video className="w-8 h-8 text-amber-600" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">{result.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">by {result.instructorName}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current text-amber-500" />
                            {result.rating}
                          </span>
                          <span>{result.enrolled} enrolled</span>
                          <span>{result.duration}</span>
                        </div>
                        <span className="font-semibold text-amber-600">{formatCurrency(result.price)}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                )}

                {/* Article Result */}
                {result.type === 'article' && (
                  <div className="flex items-start gap-3">
                    {result.thumbnail ? (
                      <img
                        src={result.thumbnail}
                        alt={result.title}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-lg bg-cyan-100 flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-cyan-600" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">{result.title}</h3>
                      <p className="text-sm text-gray-700 line-clamp-2 mb-2">{result.excerpt}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>by {result.authorName}</span>
                        <span>{result.readTime}</span>
                        <span>{formatTimestamp(result.publishedAt)}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default SearchResults;