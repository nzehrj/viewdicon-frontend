import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar,
  Clock,
  Users,
  Filter,
  Plus,
  Video,
  Building,
  Globe,
  CheckCircle,
  X,
  Share2,
  Bell,
  User,
} from 'lucide-react';
import { useAppSelector } from '@store/hooks';

interface EventCalendarProps {
  onCreateEvent?: () => void;
  onEventClick?: (eventId: string) => void;
  onRSVP?: (eventId: string, status: 'going' | 'interested' | 'not_going') => void;
}

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: {
    type: 'physical' | 'virtual' | 'hybrid';
    address?: string;
    meetingLink?: string;
  };
  organizer: {
    id: string;
    name: string;
    avatar?: string;
  };
  category: 'workshop' | 'networking' | 'social' | 'education' | 'business';
  attendees: {
    going: number;
    interested: number;
    total: number;
  };
  userStatus?: 'going' | 'interested' | 'not_going';
  isPublic: boolean;
  maxAttendees?: number;
}

type ViewMode = 'month' | 'week' | 'list';
type FilterType = 'all' | 'workshop' | 'networking' | 'social' | 'education' | 'business';

/**
 * EVENT CALENDAR COMPONENT
 * 
 * Community events calendar with RSVP functionality
 * Shows village events, workshops, networking sessions
 * Mobile-first design with month/week/list views
 * 
 * Location: src/components/events/EventCalendar.tsx
 */
export const EventCalendar: React.FC<EventCalendarProps> = ({
  onCreateEvent,
  onEventClick: _onEventClick,
  onRSVP,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);

  const [_currentDate, _setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Mock events data
  const mockEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'React & TypeScript Workshop',
      description: 'Learn advanced React patterns with TypeScript. Build type-safe applications.',
      startTime: '2024-12-15T10:00:00',
      endTime: '2024-12-15T12:00:00',
      location: {
        type: 'virtual',
        meetingLink: 'https://meet.google.com/abc-defg-hij',
      },
      organizer: {
        id: 'org1',
        name: 'Chioma Adeyemi',
      },
      category: 'workshop',
      attendees: {
        going: 24,
        interested: 12,
        total: 36,
      },
      userStatus: 'going',
      isPublic: true,
      maxAttendees: 50,
    },
    {
      id: '2',
      title: 'Tech Networking Mixer',
      description: 'Connect with fellow tech professionals. Bring your ideas and projects!',
      startTime: '2024-12-16T18:00:00',
      endTime: '2024-12-16T21:00:00',
      location: {
        type: 'physical',
        address: 'Innovation Hub, Victoria Island, Lagos',
      },
      organizer: {
        id: 'org2',
        name: 'Kwame Osei',
      },
      category: 'networking',
      attendees: {
        going: 45,
        interested: 23,
        total: 68,
      },
      userStatus: 'interested',
      isPublic: true,
      maxAttendees: 100,
    },
    {
      id: '3',
      title: 'Village Town Hall',
      description: 'Monthly community gathering. Discuss village initiatives and updates.',
      startTime: '2024-12-18T19:00:00',
      endTime: '2024-12-18T20:30:00',
      location: {
        type: 'hybrid',
        address: 'Community Center, Ikeja',
        meetingLink: 'https://zoom.us/j/123456789',
      },
      organizer: {
        id: 'org3',
        name: 'Village Council',
      },
      category: 'social',
      attendees: {
        going: 89,
        interested: 34,
        total: 123,
      },
      isPublic: true,
    },
    {
      id: '4',
      title: 'Business Strategy Masterclass',
      description: 'Scale your startup. Learn from successful founders.',
      startTime: '2024-12-20T14:00:00',
      endTime: '2024-12-20T17:00:00',
      location: {
        type: 'virtual',
        meetingLink: 'https://meet.google.com/xyz-abcd-efg',
      },
      organizer: {
        id: 'org4',
        name: 'Amara Nwosu',
      },
      category: 'business',
      attendees: {
        going: 67,
        interested: 45,
        total: 112,
      },
      userStatus: 'going',
      isPublic: true,
      maxAttendees: 150,
    },
    {
      id: '5',
      title: 'Financial Literacy Workshop',
      description: 'Master personal finance. Budgeting, investing, and wealth building.',
      startTime: '2024-12-22T11:00:00',
      endTime: '2024-12-22T13:00:00',
      location: {
        type: 'virtual',
        meetingLink: 'https://teams.microsoft.com/l/meetup-join',
      },
      organizer: {
        id: 'org5',
        name: 'Zuri Mensah',
      },
      category: 'education',
      attendees: {
        going: 34,
        interested: 28,
        total: 62,
      },
      isPublic: true,
      maxAttendees: 80,
    },
  ];

  // Filter events
  const filteredEvents = mockEvents.filter(event => {
    if (selectedFilter === 'all') return true;
    return event.category === selectedFilter;
  });

  // Sort by date
  const sortedEvents = [...filteredEvents].sort((a, b) => 
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true,
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      workshop: { bg: 'bg-purple-600', text: 'text-purple-600', bgLight: 'bg-purple-100', label: 'Workshop' },
      networking: { bg: 'bg-blue-600', text: 'text-blue-600', bgLight: 'bg-blue-100', label: 'Networking' },
      social: { bg: 'bg-green-600', text: 'text-green-600', bgLight: 'bg-green-100', label: 'Social' },
      education: { bg: 'bg-amber-600', text: 'text-amber-600', bgLight: 'bg-amber-100', label: 'Education' },
      business: { bg: 'bg-red-600', text: 'text-red-600', bgLight: 'bg-red-100', label: 'Business' },
    };
    return colors[category as keyof typeof colors] || colors.social;
  };

  const getLocationIcon = (type: string) => {
    if (type === 'virtual') return <Video className="w-4 h-4" />;
    if (type === 'physical') return <Building className="w-4 h-4" />;
    return <Globe className="w-4 h-4" />;
  };

  const handleRSVP = (eventId: string, status: 'going' | 'interested' | 'not_going') => {
    onRSVP?.(eventId, status);
    setSelectedEvent(null);
  };

  return (
    <div className="w-full p-2">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Events Calendar
            </h2>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {sortedEvents.length} upcoming events
            </p>
          </div>
          
          {onCreateEvent && (
            <button
              onClick={onCreateEvent}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create</span>
            </button>
          )}
        </div>
      </div>

      {/* View Mode & Filters */}
      <div className="flex items-center justify-between gap-2 mb-4">
        {/* View Mode Toggle */}
        <div className={`flex rounded-lg p-1 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-purple-600 text-white'
                : theme === 'dark'
                ? 'text-gray-400 hover:text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            List
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              viewMode === 'week'
                ? 'bg-purple-600 text-white'
                : theme === 'dark'
                ? 'text-gray-400 hover:text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              viewMode === 'month'
                ? 'bg-purple-600 text-white'
                : theme === 'dark'
                ? 'text-gray-400 hover:text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Month
          </button>
        </div>

        {/* Filter Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            showFilters || selectedFilter !== 'all'
              ? 'bg-purple-600 text-white'
              : theme === 'dark'
              ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
        </button>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className={`p-4 rounded-xl ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <label className={`text-xs font-semibold mb-2 block ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                CATEGORY
              </label>
              <div className="flex flex-wrap gap-2">
                {['all', 'workshop', 'networking', 'social', 'education', 'business'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter as FilterType)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedFilter === filter
                        ? 'bg-purple-600 text-white'
                        : theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {filter === 'all' ? 'All Events' : getCategoryColor(filter).label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Events List */}
      <div className="space-y-3">
        {sortedEvents.length > 0 ? (
          sortedEvents.map((event) => {
            const categoryStyle = getCategoryColor(event.category);
            const isFull = event.maxAttendees && event.attendees.going >= event.maxAttendees;
            
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 hover:bg-gray-750'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedEvent(event)}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 ${categoryStyle.bgLight} ${categoryStyle.text} text-xs font-semibold rounded`}>
                        {categoryStyle.label}
                      </span>
                      {event.userStatus === 'going' && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                      {isFull && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-semibold rounded">
                          Full
                        </span>
                      )}
                    </div>
                    <h3 className={`font-bold text-base mb-1 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {event.title}
                    </h3>
                    <p className={`text-sm line-clamp-2 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {event.description}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {formatDate(event.startTime)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {formatTime(event.startTime)} - {formatTime(event.endTime)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getLocationIcon(event.location.type)}
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {event.location.type === 'physical' && event.location.address}
                      {event.location.type === 'virtual' && 'Online Event'}
                      {event.location.type === 'hybrid' && 'Hybrid (Online + In-person)'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <User className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      by {event.organizer.name}
                    </span>
                  </div>
                </div>

                {/* Attendees */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-green-600" />
                      <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                        {event.attendees.going} going
                      </span>
                    </div>
                    <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                      {event.attendees.interested} interested
                    </div>
                  </div>
                  
                  {event.userStatus && (
                    <span className={`text-xs px-2 py-1 rounded ${
                      event.userStatus === 'going'
                        ? 'bg-green-100 text-green-700'
                        : event.userStatus === 'interested'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {event.userStatus === 'going' ? 'Going' : event.userStatus === 'interested' ? 'Interested' : 'Not Going'}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className={`p-12 rounded-xl text-center ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
          }`}>
            <Calendar className={`w-12 h-12 mx-auto mb-3 ${
              theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <p className={`text-sm font-medium mb-1 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              No events found
            </p>
            <p className="text-xs text-gray-500">
              Try adjusting your filters
            </p>
          </div>
        )}
      </div>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0 }}
                className={`w-full max-w-lg rounded-t-2xl sm:rounded-2xl pointer-events-auto max-h-[80vh] overflow-y-auto ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                {/* Modal Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b backdrop-blur-sm ${
                  theme === 'dark' ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-gray-200'
                }">
                  <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Event Details
                  </h3>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className={`p-2 rounded-lg ${
                      theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-4 space-y-4">
                  <div>
                    <span className={`px-3 py-1 ${getCategoryColor(selectedEvent.category).bgLight} ${getCategoryColor(selectedEvent.category).text} text-sm font-semibold rounded`}>
                      {getCategoryColor(selectedEvent.category).label}
                    </span>
                    <h2 className={`text-xl font-bold mt-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {selectedEvent.title}
                    </h2>
                    <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {selectedEvent.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {formatDate(selectedEvent.startTime)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatTime(selectedEvent.startTime)} - {formatTime(selectedEvent.endTime)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      {getLocationIcon(selectedEvent.location.type)}
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {selectedEvent.location.type === 'physical' && 'In-Person'}
                          {selectedEvent.location.type === 'virtual' && 'Virtual Event'}
                          {selectedEvent.location.type === 'hybrid' && 'Hybrid Event'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {selectedEvent.location.address || 'Online meeting link will be shared'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {selectedEvent.attendees.going} Going • {selectedEvent.attendees.interested} Interested
                        </p>
                        <p className="text-xs text-gray-500">
                          {selectedEvent.maxAttendees && `${selectedEvent.maxAttendees - selectedEvent.attendees.going} spots left`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* RSVP Buttons */}
                  <div className="space-y-2 pt-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}">
                    <button
                      onClick={() => handleRSVP(selectedEvent.id, 'going')}
                      className={`w-full py-3 rounded-lg font-medium transition-colors ${
                        selectedEvent.userStatus === 'going'
                          ? 'bg-green-600 text-white'
                          : theme === 'dark'
                          ? 'bg-gray-700 text-white hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      {selectedEvent.userStatus === 'going' ? '✓ Going' : 'Mark as Going'}
                    </button>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRSVP(selectedEvent.id, 'interested')}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedEvent.userStatus === 'interested'
                            ? 'bg-blue-600 text-white'
                            : theme === 'dark'
                            ? 'bg-gray-700 text-white hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        }`}
                      >
                        Interested
                      </button>
                      
                      <button
                        className={`p-2 rounded-lg ${
                          theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                      
                      <button
                        className={`p-2 rounded-lg ${
                          theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        <Bell className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventCalendar;