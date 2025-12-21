// src/components/cultural/StoryLineageTree.tsx
// Story Lineage Tree - Visual Story Evolution & Origins

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  GitBranch,
  MapPin,
  Calendar,
  Users,
  BookOpen,
  Sparkles,
  ChevronRight,
  Globe
} from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

interface StoryNode {
  id: string;
  title: string;
  region: string;
  country: string;
  period: string;
  storyteller?: string;
  variant: string;
  description: string;
  children: StoryNode[];
  isExpanded?: boolean;
}

interface StoryLineageTreeProps {
  storyId: string;
  onViewVersion?: (nodeId: string) => void;
}

export const StoryLineageTree: React.FC<StoryLineageTreeProps> = ({
  storyId: _storyId,
  onViewVersion,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']));

  // Mock lineage data - replace with API
  const lineageTree: StoryNode = {
    id: 'root',
    title: 'Anansi the Spider',
    region: 'West Africa',
    country: 'Ghana',
    period: 'Ancient (Pre-1500s)',
    variant: 'Original Akan Tale',
    description: 'The trickster spider deity in Akan mythology, known for wisdom and cunning',
    children: [
      {
        id: 'akan-variant',
        title: 'Anansi Brings Wisdom to the World',
        region: 'Ashanti Region',
        country: 'Ghana',
        period: '1600s-1800s',
        variant: 'Ashanti Version',
        description: 'How Anansi gathered all wisdom in a pot and accidentally scattered it',
        children: [],
      },
      {
        id: 'caribbean',
        title: 'Anansi in the Caribbean',
        region: 'Caribbean',
        country: 'Jamaica',
        period: '1700s-1900s',
        storyteller: 'Enslaved Akan People',
        variant: 'Diaspora Adaptation',
        description: 'Stories evolved during the Atlantic slave trade, maintaining cultural identity',
        children: [
          {
            id: 'jamaican',
            title: 'Brer Anansi Stories',
            region: 'Jamaica',
            country: 'Jamaica',
            period: '1800s-Present',
            variant: 'Jamaican Folklore',
            description: 'Local adaptations featuring Caribbean animals and settings',
            children: [],
          },
          {
            id: 'american',
            title: 'Aunt Nancy Tales',
            region: 'Southern United States',
            country: 'USA',
            period: '1700s-1900s',
            variant: 'African American Folklore',
            description: 'Transformed into "Aunt Nancy" stories in the American South',
            children: [],
          },
        ],
      },
      {
        id: 'contemporary',
        title: 'Modern Anansi',
        region: 'Global',
        country: 'Worldwide',
        period: '1900s-Present',
        variant: 'Contemporary Adaptations',
        description: 'Books, films, and digital media bringing Anansi to new generations',
        children: [
          {
            id: 'literature',
            title: 'Anansi Boys (Novel)',
            region: 'Global',
            country: 'UK/USA',
            period: '2005',
            storyteller: 'Neil Gaiman',
            variant: 'Fantasy Literature',
            description: 'Modern fantasy novel exploring Anansi\'s legacy',
            children: [],
          },
          {
            id: 'animation',
            title: 'Anansi in Animation',
            region: 'Global',
            country: 'Various',
            period: '2010s-Present',
            variant: 'Digital Media',
            description: 'Animated series and films for children',
            children: [],
          },
        ],
      },
    ],
  };

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const getRegionColor = (region: string) => {
    const colors: Record<string, string> = {
      'West Africa': 'from-amber-600 to-orange-600',
      'Ashanti Region': 'from-yellow-600 to-amber-600',
      'Caribbean': 'from-green-600 to-emerald-600',
      'Jamaica': 'from-emerald-600 to-teal-600',
      'Southern United States': 'from-blue-600 to-indigo-600',
      'Global': 'from-purple-600 to-pink-600',
    };
    return colors[region] || 'from-gray-600 to-gray-700';
  };

  const TreeNode: React.FC<{ node: StoryNode; depth: number }> = ({ node, depth }) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const regionGradient = getRegionColor(node.region);

    return (
      <div className={`${depth > 0 ? 'ml-8 sm:ml-12' : ''} mb-4`}>
        {/* Connector Line */}
        {depth > 0 && (
          <div className={`h-6 border-l-2 ${
            theme === 'dark' ? 'border-purple-600' : 'border-purple-400'
          } ml-4`} />
        )}

        {/* Node Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: depth * 0.1 }}
          className="relative"
        >
          {/* Branch Line */}
          {depth > 0 && (
            <div className={`absolute left-0 top-1/2 w-8 sm:w-12 border-t-2 ${
              theme === 'dark' ? 'border-purple-600' : 'border-purple-400'
            }`} />
          )}

          <div
            onClick={() => hasChildren && toggleNode(node.id)}
            className={`relative rounded-xl overflow-hidden cursor-pointer ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } border-2 ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            } hover:border-purple-600 transition-all shadow-lg hover:shadow-xl`}
          >
            {/* Header with Gradient */}
            <div className={`h-2 bg-gradient-to-r ${regionGradient}`} />

            <div className="p-4 sm:p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className={`text-base sm:text-lg font-bold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {node.title}
                  </h3>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <div className="flex items-center gap-1 px-2 py-1 bg-purple-600/20 rounded-lg">
                      <MapPin className="w-3 h-3 text-purple-500" />
                      <span className={`text-xs font-semibold ${
                        theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                      }`}>
                        {node.country}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 px-2 py-1 bg-amber-600/20 rounded-lg">
                      <Calendar className="w-3 h-3 text-amber-500" />
                      <span className={`text-xs font-semibold ${
                        theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
                      }`}>
                        {node.period}
                      </span>
                    </div>

                    {node.storyteller && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-green-600/20 rounded-lg">
                        <Users className="w-3 h-3 text-green-500" />
                        <span className={`text-xs font-semibold ${
                          theme === 'dark' ? 'text-green-400' : 'text-green-600'
                        }`}>
                          {node.storyteller}
                        </span>
                      </div>
                    )}
                  </div>

                  <p className={`text-xs sm:text-sm mb-2 font-semibold ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {node.variant}
                  </p>

                  <p className={`text-xs sm:text-sm leading-relaxed ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {node.description}
                  </p>
                </div>

                {hasChildren && (
                  <motion.button
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    className={`ml-3 p-2 rounded-lg ${
                      theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    } transition-colors flex-shrink-0`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                )}
              </div>

              {/* View Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewVersion?.(node.id);
                }}
                className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Read This Version
              </button>
            </div>
          </div>
        </motion.div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4"
          >
            {node.children.map((child) => (
              <TreeNode key={child.id} node={child} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    } pb-20`}>
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 opacity-90" />
        
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
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <GitBranch className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                <h1 className="text-2xl sm:text-4xl font-bold text-white">
                  Story Lineage Tree
                </h1>
              </div>
              <p className="text-base sm:text-lg text-white/90 mb-4">
                Trace the evolution and migration of stories across time and space
              </p>
              <div className="flex items-center gap-4 text-white/80">
                <span className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Multiple Regions
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Centuries of Evolution
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6 sm:p-8">
        {/* Info Card */}
        <div className={`p-6 rounded-2xl mb-8 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-lg`}>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className={`text-xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Understanding Story Lineage
              </h2>
              <p className={`text-sm leading-relaxed ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Stories are living traditions that evolve as they travel across regions, generations, and cultures. 
                This tree shows how a single story can branch into countless variants, each shaped by the unique 
                experiences and wisdom of its storytellers. Click on any version to explore how the tale transformed 
                while maintaining its essential spirit.
              </p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className={`p-4 rounded-xl mb-6 ${
          theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100'
        }`}>
          <h3 className={`text-sm font-bold mb-3 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Legend
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-2 bg-gradient-to-r from-amber-600 to-orange-600 rounded" />
              <span className={`text-xs ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                West Africa
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded" />
              <span className={`text-xs ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Caribbean
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded" />
              <span className={`text-xs ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Americas
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded" />
              <span className={`text-xs ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Global/Modern
              </span>
            </div>
          </div>
        </div>

        {/* Tree */}
        <div className={`p-6 rounded-2xl ${
          theme === 'dark' ? 'bg-gray-800/30' : 'bg-white/50'
        } backdrop-blur-sm`}>
          <TreeNode node={lineageTree} depth={0} />
        </div>
      </div>
    </div>
  );
};

export default StoryLineageTree;