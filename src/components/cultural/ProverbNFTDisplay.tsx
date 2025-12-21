// src/components/cultural/ProverbNFTDisplay.tsx
// Proverb NFT Display - Showcase Collected Wisdom NFTs

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award,
  Sparkles,
  Share2,
  Download,
  Eye,
  Heart,
  Flame,
  Crown,
  Grid3x3,
  List,
  TrendingUp
} from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

interface ProverbNFT {
  id: string;
  proverb: string;
  language: string;
  translation: string;
  origin: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  mintDate: string;
  tokenId: number;
  creator: string;
  heat: number;
  likes: number;
  views: number;
  artworkUrl?: string;
}

interface ProverbNFTDisplayProps {
  onViewDetails?: (nftId: string) => void;
  onShare?: (nftId: string) => void;
}

export const ProverbNFTDisplay: React.FC<ProverbNFTDisplayProps> = ({
  onViewDetails,
  onShare,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'>('all');
  const [selectedNFT, setSelectedNFT] = useState<ProverbNFT | null>(null);

  // Mock NFT collection
  const nfts: ProverbNFT[] = [
    {
      id: '1',
      proverb: 'Akoko nan tooro nkyene',
      language: 'Akan (Twi)',
      translation: 'The hen treads upon the eggs but does not break them',
      origin: 'Ghana',
      rarity: 'legendary',
      mintDate: '2025-01-01',
      tokenId: 1001,
      creator: 'Kwame Mensah',
      heat: 2500,
      likes: 892,
      views: 3421,
    },
    {
      id: '2',
      proverb: 'Haraka haraka haina baraka',
      language: 'Swahili',
      translation: 'Hurry hurry has no blessing',
      origin: 'East Africa',
      rarity: 'epic',
      mintDate: '2025-01-05',
      tokenId: 1002,
      creator: 'Amina Said',
      heat: 1800,
      likes: 654,
      views: 2156,
    },
    {
      id: '3',
      proverb: 'Ọmọ tí kò gbọ́n kò lè ṣe àṣeyẹ',
      language: 'Yoruba',
      translation: 'A child who is not wise cannot run an errand',
      origin: 'Nigeria',
      rarity: 'rare',
      mintDate: '2025-01-10',
      tokenId: 1003,
      creator: 'Adebayo Ogunlesi',
      heat: 1200,
      likes: 423,
      views: 1687,
    },
    {
      id: '4',
      proverb: 'Onye wetara oji wetara ndu',
      language: 'Igbo',
      translation: 'He who brings kola nut brings life',
      origin: 'Nigeria',
      rarity: 'uncommon',
      mintDate: '2025-01-12',
      tokenId: 1004,
      creator: 'Chioma Eze',
      heat: 850,
      likes: 298,
      views: 1123,
    },
  ];

  const filteredNFTs = filter === 'all' ? nfts : nfts.filter(nft => nft.rarity === filter);

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'from-gray-600 to-gray-700',
      uncommon: 'from-green-600 to-emerald-600',
      rare: 'from-blue-600 to-indigo-600',
      epic: 'from-purple-600 to-pink-600',
      legendary: 'from-amber-600 to-orange-600',
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  const getRarityLabel = (rarity: string) => {
    return rarity.charAt(0).toUpperCase() + rarity.slice(1);
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
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-0 left-0 w-24 h-24 border-4 border-white rounded-full"
          />
          <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 text-white" />
        </div>

        <div className="relative z-10 p-6 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Award className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                <h1 className="text-2xl sm:text-4xl font-bold text-white">
                  Wisdom Collection
                </h1>
              </div>
              <p className="text-base sm:text-lg text-white/90 mb-6">
                Your collection of immortalized African proverbs
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="w-5 h-5 text-white" />
                    <span className="text-xs text-white/80">Total NFTs</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{nfts.length}</p>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Flame className="w-5 h-5 text-white" />
                    <span className="text-xs text-white/80">Total Heat</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {nfts.reduce((sum, nft) => sum + nft.heat, 0).toLocaleString()}
                  </p>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Crown className="w-5 h-5 text-white" />
                    <span className="text-xs text-white/80">Legendary</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {nfts.filter(n => n.rarity === 'legendary').length}
                  </p>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-5 h-5 text-white" />
                    <span className="text-xs text-white/80">Total Value</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {(nfts.reduce((sum, nft) => sum + nft.heat, 0) * 0.1).toFixed(1)}K ₵
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 sm:p-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          {/* Rarity Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full sm:w-auto">
            {(['all', 'legendary', 'epic', 'rare', 'uncommon', 'common'] as const).map((rarity) => (
              <button
                key={rarity}
                onClick={() => setFilter(rarity)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                  filter === rarity
                    ? rarity === 'all'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : `bg-gradient-to-r ${getRarityColor(rarity)} text-white`
                    : theme === 'dark'
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {rarity === 'all' ? 'All' : getRarityLabel(rarity)}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* NFT Grid/List */}
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
        }>
          {filteredNFTs.map((nft, index) => {
            const rarityGradient = getRarityColor(nft.rarity);

            return (
              <motion.div
                key={nft.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedNFT(nft)}
                className={`rounded-2xl overflow-hidden cursor-pointer ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                } border-2 border-transparent hover:border-gradient transition-all shadow-lg hover:shadow-2xl`}
                style={{
                  borderImage: `linear-gradient(135deg, var(--tw-gradient-stops)) 1`,
                }}
              >
                {/* NFT Card Header */}
                <div className={`h-48 bg-gradient-to-br ${rarityGradient} relative overflow-hidden p-6 flex flex-col justify-between`}>
                  <div className="absolute inset-0 opacity-20">
                    <Sparkles className="w-full h-full" />
                  </div>

                  <div className="relative z-10 flex justify-between">
                    <span className="px-3 py-1 bg-black/30 backdrop-blur-sm rounded-full text-white text-xs font-bold">
                      #{nft.tokenId}
                    </span>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-bold">
                      {getRarityLabel(nft.rarity)}
                    </span>
                  </div>

                  <div className="relative z-10">
                    <p className="text-white text-2xl font-bold italic line-clamp-2">
                      "{nft.proverb}"
                    </p>
                  </div>
                </div>

                {/* NFT Card Content */}
                <div className="p-5">
                  {/* Translation */}
                  <p className={`text-sm mb-3 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {nft.translation}
                  </p>

                  {/* Language & Origin */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      theme === 'dark' ? 'bg-purple-600/20 text-purple-400' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {nft.language}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      theme === 'dark' ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {nft.origin}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                    <div className="flex items-center gap-1">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        {nft.heat}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        {nft.likes}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4 text-blue-500" />
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        {nft.views}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails?.(nft.id);
                      }}
                      className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold text-sm transition-all"
                    >
                      View Details
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onShare?.(nft.id);
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        theme === 'dark'
                          ? 'bg-gray-700 hover:bg-gray-600 text-white'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                      }`}
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* NFT Detail Modal */}
      <AnimatePresence>
        {selectedNFT && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 pb-20">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNFT(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } shadow-2xl`}
            >
              {/* Header */}
              <div className={`p-6 border-b ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-2xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Proverb NFT #{selectedNFT.tokenId}
                  </h2>
                  <button
                    onClick={() => setSelectedNFT(null)}
                    className={`p-2 rounded-lg ${
                      theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    ✕
                  </button>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold bg-gradient-to-r ${getRarityColor(selectedNFT.rarity)} text-white`}>
                  {getRarityLabel(selectedNFT.rarity)}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className={`text-2xl font-bold italic mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  "{selectedNFT.proverb}"
                </p>

                <p className={`text-lg mb-6 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {selectedNFT.translation}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className={`text-sm mb-1 ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      Language
                    </p>
                    <p className={`font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {selectedNFT.language}
                    </p>
                  </div>

                  <div>
                    <p className={`text-sm mb-1 ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      Origin
                    </p>
                    <p className={`font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {selectedNFT.origin}
                    </p>
                  </div>

                  <div>
                    <p className={`text-sm mb-1 ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      Creator
                    </p>
                    <p className={`font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {selectedNFT.creator}
                    </p>
                  </div>

                  <div>
                    <p className={`text-sm mb-1 ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      Mint Date
                    </p>
                    <p className={`font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {new Date(selectedNFT.mintDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2">
                    <Download className="w-5 h-5" />
                    Download
                  </button>
                  <button className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Share
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProverbNFTDisplay;