import React from 'react';
import { Heart, DollarSign, Users, AlertCircle } from 'lucide-react';
import { useAppSelector } from '@store/hooks';

interface BlessingCardProps {
  // Optional props to override default values
  pendingOpportunities?: number;
  cowrieInEscrow?: number;
  customMessage?: string;
  urgentAlerts?: number;
}

/**
 * BLESSING CARD COMPONENT
 * 
 * Warm, personalized greeting that shows:
 * - Cultural blessing message
 * - Pending opportunities count
 * - Cowrie balance in motion (escrow)
 * - Urgent alerts
 * 
 * Used in: Dashboard Home (below Identity Strip)
 */
export const BlessingCard: React.FC<BlessingCardProps> = ({
  pendingOpportunities = 0,
  cowrieInEscrow = 0,
  customMessage,
  urgentAlerts = 0,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const user = useAppSelector((state) => state.user.user);
  const userRole = useAppSelector((state) => state.user.role);
  const userVillage = useAppSelector((state) => state.user.village);
  
  // Get user's name
  const userName = user?.full_name?.split(' ')[0] || user?.name || 'Friend';
  const roleName = userRole?.roleName || 'Worker';
  
  // Generate personalized blessing based on village and role
  const generateBlessing = (): string => {
    if (customMessage) return customMessage;
    
    const villageId = userVillage?.villageId;
    
    // Village-specific blessings
    const blessings: Record<string, string[]> = {
      healthcare: [
        `Blessings, Healer ${userName}. ${pendingOpportunities > 0 ? `${pendingOpportunities} people wait for your care.` : 'May your hands bring comfort today.'}`,
        `Peace to you, ${roleName}. ${pendingOpportunities > 0 ? `${pendingOpportunities} souls need your healing touch.` : 'Ready to serve with compassion.'}`,
      ],
      construction: [
        `Greetings, Builder ${userName}. ${pendingOpportunities > 0 ? `${pendingOpportunities} projects await your skilled hands.` : 'May your work stand strong.'}`,
        `Master of craft, ${pendingOpportunities > 0 ? `${pendingOpportunities} clients seek your expertise.` : 'Ready to build dreams into reality.'}`,
      ],
      business: [
        `Welcome, Merchant ${userName}. ${pendingOpportunities > 0 ? `${pendingOpportunities} buyers are waiting.` : 'May your goods find good homes.'}`,
        `Trader of value, ${pendingOpportunities > 0 ? `${pendingOpportunities} orders need your attention.` : 'The market awaits your offerings.'}`,
      ],
      agriculture: [
        `Blessings, Farmer ${userName}. ${pendingOpportunities > 0 ? `${pendingOpportunities} buyers seek your harvest.` : 'May the land yield plenty.'}`,
        `Keeper of the soil, ${pendingOpportunities > 0 ? `${pendingOpportunities} orders are ready.` : 'Your harvest feeds the people.'}`,
      ],
      creative: [
        `Welcome, Creator ${userName}. ${pendingOpportunities > 0 ? `${pendingOpportunities} audiences await your art.` : 'May your voice inspire many.'}`,
        `Artist of the people, ${pendingOpportunities > 0 ? `${pendingOpportunities} bookings are calling.` : 'Your talent lights the way.'}`,
      ],
      education: [
        `Blessings, Teacher ${userName}. ${pendingOpportunities > 0 ? `${pendingOpportunities} students seek your wisdom.` : 'Knowledge flows through you.'}`,
        `Guide of minds, ${pendingOpportunities > 0 ? `${pendingOpportunities} learners are waiting.` : 'May your teachings bear fruit.'}`,
      ],
      security: [
        `Honor to you, Protector ${userName}. ${pendingOpportunities > 0 ? `${pendingOpportunities} people need your shield.` : 'Stand strong in your watch.'}`,
        `Guardian of safety, ${pendingOpportunities > 0 ? `${pendingOpportunities} calls for protection.` : 'Your vigilance keeps us safe.'}`,
      ],
      technology: [
        `Greetings, Innovator ${userName}. ${pendingOpportunities > 0 ? `${pendingOpportunities} problems await your solutions.` : "May your skills solve today's challenges."}`,
        `Master of systems, ${pendingOpportunities > 0 ? `${pendingOpportunities} requests need fixing.` : 'Technology bends to your knowledge.'}`,
      ],
      getting_started: [
        `Welcome, ${userName}. ${pendingOpportunities > 0 ? `${pendingOpportunities} opportunities are waiting for you.` : 'Your journey begins today.'}`,
        `New friend, ${pendingOpportunities > 0 ? `${pendingOpportunities} people are ready to connect.` : 'Explore and discover your path.'}`,
      ],
    };
    
    // Get blessings for this village, or use default
    const villageBlessings = blessings[villageId || ''] || [
      `Welcome back, ${userName}. ${pendingOpportunities > 0 ? `${pendingOpportunities} opportunities await.` : 'Ready to make an impact today.'}`,
    ];
    
    // Return random blessing from array
    return villageBlessings[Math.floor(Math.random() * villageBlessings.length)];
  };
  
  const blessingMessage = generateBlessing();
  
  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/30' 
        : 'bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200'
    }`}>
      {/* Decorative Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <Heart className="w-full h-full" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Blessing Message */}
        <p className={`text-base sm:text-lg font-medium mb-4 ${
          theme === 'dark' ? 'text-purple-100' : 'text-purple-900'
        }`}>
          {blessingMessage}
        </p>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* Pending Opportunities */}
          {pendingOpportunities > 0 && (
            <div className={`flex items-center gap-2 p-3 rounded-lg ${
              theme === 'dark' ? 'bg-black/20' : 'bg-white/60'
            }`}>
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <Users className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Waiting
                </p>
                <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {pendingOpportunities}
                </p>
              </div>
            </div>
          )}
          
          {/* Cowrie in Escrow */}
          {cowrieInEscrow > 0 && (
            <div className={`flex items-center gap-2 p-3 rounded-lg ${
              theme === 'dark' ? 'bg-black/20' : 'bg-white/60'
            }`}>
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  In Escrow
                </p>
                <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  ₵{cowrieInEscrow.toLocaleString()}
                </p>
              </div>
            </div>
          )}
          
          {/* Urgent Alerts */}
          {urgentAlerts > 0 && (
            <div className={`flex items-center gap-2 p-3 rounded-lg ${
              theme === 'dark' ? 'bg-black/20' : 'bg-white/60'
            }`}>
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Urgent
                </p>
                <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {urgentAlerts}
                </p>
              </div>
            </div>
          )}
          
          {/* Default state when nothing pending */}
          {pendingOpportunities === 0 && cowrieInEscrow === 0 && urgentAlerts === 0 && (
            <div className={`col-span-2 sm:col-span-3 text-center p-3 rounded-lg ${
              theme === 'dark' ? 'bg-black/20' : 'bg-white/60'
            }`}>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                All clear. Ready to start your day! ✨
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlessingCard;