// src/components/tv/JollofTVContainer.tsx
// Main Jollof TV Container - Orchestrates ALL TV components with Redux

import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { startTV, stopTV, setTVMode } from '@/store/slices/tvSlice';

// Import types
import type { TVChannel } from '@/types/tv/tv.types';

// Import ALL TV components
import { TVStatusBar } from './TVStatusBar';
import { TVPlayerCore } from './TVPlayerCore';
import { TVBubble } from './TVBubble';
import { TVFloating } from './TVFloating';
import { TVHalfScreen } from './TVHalfScreen';
import { TVNativePiP } from './TVNativePiP';
import { ChannelGrid } from './ChannelGrid';
import { TVScheduler } from './TVScheduler';
import { TVBookingWizard } from './TVBookingWizard';
import { VillageHourSlot } from './VillageHourSlot';
import { SorosokeOverlay } from './SorosokeOverlay';
import { CowrieRainOverlay } from './CowrieRainOverlay';
import { DJTelemetryDisplay } from './DJTelemetryDisplay';

// Helper: Convert TVChannel to simple Channel format for components
const toSimpleChannel = (channel: TVChannel) => ({
  id: channel.id,
  name: channel.name,
  description: channel.description,
  type: channel.type === 'region' ? 'regional' : channel.type as 'village' | 'regional' | 'national' | 'pan-african',
  isLive: channel.isLive,
  viewerCount: channel.viewerCount,
  thumbnail: channel.logo,
  color: channel.color,
});

// Mock data (replace with API calls in production)
const MOCK_CHANNELS: TVChannel[] = [
  {
    id: 'national-1',
    name: 'National Broadcast',
    slug: 'national-broadcast',
    description: 'Official national programming and news',
    type: 'national',
    logo: '/images/channels/national-logo.png',
    bannerImage: '/images/channels/national-banner.jpg',
    color: '#8b5cf6',
    categories: ['news', 'government', 'policy'],
    streamUrl: 'https://stream.example.com/national-1',
    isLive: true,
    viewerCount: 1247,
    subscriberCount: 45000,
    active: true,
    schedule: [],
    upcomingPrograms: [],
    currentProgram: {
      id: 'prog-1',
      channelId: 'national-1',
      title: 'National Town Hall',
      description: 'Governor\'s Address on Economic Development',
      type: 'live-event',
      thumbnailUrl: '/images/programs/townhall.jpg',
      startTime: new Date(),
      endTime: new Date(Date.now() + 7200000),
      duration: 120,
      isVillageHour: false,
      status: 'live',
      heat: 567,
      viewerCount: 1247,
      peakViewers: 1500,
      recordingAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'tech-village-1',
    name: 'Tech Village Channel',
    slug: 'tech-village',
    description: 'Technology and innovation programming',
    type: 'village',
    villageId: 'technology',
    logo: '/images/channels/tech-logo.png',
    bannerImage: '/images/channels/tech-banner.jpg',
    color: '#3b82f6',
    categories: ['technology', 'innovation', 'startups'],
    streamUrl: 'https://stream.example.com/tech-village-1',
    isLive: true,
    viewerCount: 432,
    subscriberCount: 12000,
    active: true,
    schedule: [],
    upcomingPrograms: [],
    currentProgram: {
      id: 'prog-2',
      channelId: 'tech-village-1',
      title: 'Startup Showcase',
      description: 'Weekly tech startup presentations',
      type: 'education',
      thumbnailUrl: '/images/programs/startup.jpg',
      startTime: new Date(),
      endTime: new Date(Date.now() + 3600000),
      duration: 60,
      isVillageHour: true,
      villageId: 'technology',
      status: 'live',
      heat: 234,
      viewerCount: 432,
      peakViewers: 500,
      recordingAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'regional-west-1',
    name: 'West Regional',
    slug: 'west-regional',
    description: 'Western region news and culture',
    type: 'region',
    region: 'west',
    logo: '/images/channels/west-logo.png',
    bannerImage: '/images/channels/west-banner.jpg',
    color: '#10b981',
    categories: ['news', 'culture', 'regional'],
    streamUrl: 'https://stream.example.com/regional-west-1',
    isLive: false,
    viewerCount: 0,
    subscriberCount: 8500,
    active: true,
    schedule: [],
    upcomingPrograms: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

interface JollofTVContainerProps {
  showStatusBar?: boolean;
  villageName?: string;
  villageColor?: string;
}

export const JollofTVContainer: React.FC<JollofTVContainerProps> = ({
  showStatusBar = true,
  villageName = 'Technology',
  villageColor = '#3b82f6',
}) => {
  const dispatch = useAppDispatch();
  
  // ✅ Redux state - properly connected
  const player = useAppSelector((state) => state.tv.player);
  const sorosoke = useAppSelector((state) => state.tv.sorosoke);
  
  // Local state for modals
  const [showChannelGrid, setShowChannelGrid] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [showBookingWizard, setShowBookingWizard] = useState(false);
  const [showVillageHour, setShowVillageHour] = useState(false);
  const [showTelemetry, setShowTelemetry] = useState(false);
  const [showSorosokeOverlay, setShowSorosokeOverlay] = useState(false);
  
  // Current channel data
  const [currentChannel, setCurrentChannel] = useState(MOCK_CHANNELS[0]);

  // ✅ Handle channel selection from status bar
  const handleChannelClick = (channelId: string) => {
    console.log('📺 Channel clicked:', channelId);
    const channel = MOCK_CHANNELS.find(c => c.id === channelId);
    if (channel) {
      setCurrentChannel(channel);
      dispatch(startTV({ channelId, mode: 'bubble' }));
      console.log('✅ TV started via Redux');
    }
  };

  // ✅ Handle TV close - properly dispatches Redux action
  const handleTVClose = () => {
    console.log('❌ Closing TV via Redux');
    dispatch(stopTV());
  };

  // ✅ Handle TV expand
  const handleTVExpand = () => {
    console.log('🔼 Expanding TV via Redux');
    dispatch(setTVMode('floating'));
  };

  // ✅ Handle TV minimize
  const handleTVMinimize = () => {
    console.log('🔽 Minimizing TV via Redux');
    dispatch(setTVMode('native-pip'));
  };

  // Handle Channel Grid
  const handleChannelGridOpen = () => {
    console.log('📺 Opening Channel Grid');
    setShowChannelGrid(true);
  };

  // Handle TV Scheduler
  const handleSchedulerOpen = () => {
    console.log('📅 Opening TV Scheduler');
    setShowScheduler(true);
  };

  // Handle DJ Telemetry
  const handleTelemetryOpen = () => {
    console.log('📊 Opening DJ Telemetry');
    setShowTelemetry(true);
  };

  // Handle Sorosoke
  const handleSorosokeOpen = () => {
    console.log('📣 Opening Sorosoke');
    setShowSorosokeOverlay(true);
  };

  // Handle Sorosoke call-in
  const handleSorosokeCallIn = (callType: 'voice' | 'video' | 'text') => {
    console.log('🎙️ User called in with type:', callType);
    // TODO: Dispatch to Redux
  };

  // ✅ Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!player.isActive) return;
      
      // F key = Fullscreen
      if (e.key === 'f') {
        dispatch(setTVMode('fullscreen'));
      }
      // P key = Picture-in-Picture
      if (e.key === 'p') {
        dispatch(setTVMode('native-pip'));
      }
      // ESC key = Close TV
      if (e.key === 'Escape') {
        dispatch(stopTV());
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [player.isActive, dispatch]);

  console.log('🎬 JollofTV Render - player.isActive:', player.isActive, 'mode:', player.mode);

  return (
    <>
      {/* TV Status Bar - Shows at top of feed */}
      {showStatusBar && (
        <TVStatusBar 
          channels={MOCK_CHANNELS.map(toSimpleChannel)} 
          onChannelClick={handleChannelClick}
        />
      )}

      {/* TV Player - Renders based on Redux player.mode */}
      {player.isActive && (
        <>
          {/* Bubble Mode */}
          {player.mode === 'bubble' && (
            <TVBubble 
              channel={currentChannel}
              isVisible={true}
              onClose={handleTVClose}
              onExpand={handleTVExpand}
              onMinimize={handleTVMinimize}
              onChannelGrid={handleChannelGridOpen}
              onScheduler={handleSchedulerOpen}
              onTelemetry={handleTelemetryOpen}
              onSorosoke={handleSorosokeOpen}
            />
          )}

          {/* Floating Mode */}
          {player.mode === 'floating' && (
            <TVFloating 
              channel={currentChannel}
              isVisible={true}
            />
          )}

          {/* Half-Screen Mode */}
          {player.mode === 'half-screen' && (
            <TVHalfScreen 
              channel={currentChannel}
              isVisible={true}
              position="right"
            />
          )}

          {/* Native PiP Mode */}
          {player.mode === 'native-pip' && (
            <TVNativePiP 
              channel={currentChannel}
              isVisible={true}
            />
          )}

          {/* Fullscreen Mode */}
          {player.mode === 'fullscreen' && (
            <div className="fixed inset-0 z-[100] bg-black">
              <TVPlayerCore
                channelId={currentChannel.id}
                programTitle={currentChannel.currentProgram?.title || 'Live Stream'}
                programDescription={currentChannel.currentProgram?.description}
                streamerName={currentChannel.name}
                viewerCount={currentChannel.viewerCount}
                isLive={currentChannel.isLive}
                onModeChange={(mode) => dispatch(setTVMode(mode))}
                onClose={handleTVClose}
              />
            </div>
          )}
        </>
      )}

      {/* Channel Grid Modal */}
      <ChannelGrid
        channels={MOCK_CHANNELS.map(toSimpleChannel)}
        isOpen={showChannelGrid}
        onClose={() => setShowChannelGrid(false)}
        onChannelSelect={handleChannelClick}
      />

      {/* TV Scheduler Modal */}
      <TVScheduler
        programs={[]}
        isOpen={showScheduler}
        onClose={() => setShowScheduler(false)}
        onWatchProgram={(programId) => {
          console.log('Watch program:', programId);
          setShowScheduler(false);
        }}
        onSetReminder={(programId) => {
          console.log('Set reminder:', programId);
        }}
      />

      {/* Village Hour Booking Modal */}
      {showVillageHour && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowVillageHour(false)}
          />
          <div className="relative max-w-4xl w-full">
            <VillageHourSlot
              villageName={villageName}
              villageColor={villageColor}
              slots={[
                {
                  date: new Date().toISOString().split('T')[0],
                  timeSlot: '17:00-18:00',
                  isBooked: false,
                  isAvailable: true,
                  price: 5000,
                },
                {
                  date: new Date().toISOString().split('T')[0],
                  timeSlot: '18:00-19:00',
                  isBooked: true,
                  isAvailable: false,
                  price: 5000,
                  bookedBy: {
                    name: 'John Doe',
                    programTitle: 'Tech Talks Weekly',
                  },
                },
              ]}
              onBookSlot={(date, timeSlot) => {
                console.log('Book slot:', date, timeSlot);
                setShowBookingWizard(true);
                setShowVillageHour(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Booking Wizard Modal */}
      <TVBookingWizard
        isOpen={showBookingWizard}
        onClose={() => setShowBookingWizard(false)}
        villageName={villageName}
        villageColor={villageColor}
        price={5000}
        availableSlots={[
          { date: new Date().toISOString().split('T')[0], timeSlot: '17:00-18:00' },
        ]}
        onSubmit={(bookingData) => {
          console.log('Booking submitted:', bookingData);
          setShowBookingWizard(false);
        }}
      />

      {/* Sorosoke Call-In Overlay */}
      <SorosokeOverlay
        isOpen={showSorosokeOverlay}
        onClose={() => setShowSorosokeOverlay(false)}
        onCallIn={handleSorosokeCallIn}
      />

      {/* DJ Telemetry Display */}
      <DJTelemetryDisplay
        sessionId={sorosoke.sessionId || 'session-1'}
        isOpen={showTelemetry}
        onClose={() => setShowTelemetry(false)}
      />

      {/* Cowrie Rain Overlay */}
      <CowrieRainOverlay />
    </>
  );
};

export default JollofTVContainer;