import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Smartphone,
  Monitor,
  Tablet,
  Laptop,
  Watch,
  Tv,
  MoreHorizontal,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Trash2,
  Shield,
  Eye,
  EyeOff,
  RefreshCw,
  Plus,
  Chrome,
  Globe
} from 'lucide-react';

// Types
type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'laptop' | 'watch' | 'tv' | 'other';
type DeviceStatus = 'active' | 'trusted' | 'new' | 'suspicious' | 'blocked';
type Browser = 'chrome' | 'safari' | 'firefox' | 'edge' | 'other';

interface Device {
  id: string;
  name: string;
  type: DeviceType;
  browser: Browser;
  browserVersion: string;
  os: string;
  osVersion: string;
  status: DeviceStatus;
  location: {
    city: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  ipAddress: string;
  lastActive: Date;
  firstSeen: Date;
  isCurrent: boolean;
  trustScore: number; // 0-100
  loginCount: number;
}

interface DeviceManagerProps {
  devices: Device[];
  currentDeviceId: string;
  onTrustDevice?: (deviceId: string) => void;
  onBlockDevice?: (deviceId: string) => void;
  onRemoveDevice?: (deviceId: string) => void;
  onRefreshDevices?: () => void;
  onAddDevice?: () => void;
}

const DeviceManager: React.FC<DeviceManagerProps> = ({
  devices,
  onTrustDevice,
  onBlockDevice,
  onRemoveDevice,
  onRefreshDevices,
  onAddDevice
}) => {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'trusted' | 'suspicious'>('all');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const getDeviceIcon = (type: DeviceType) => {
    const iconMap = {
      mobile: Smartphone,
      tablet: Tablet,
      desktop: Monitor,
      laptop: Laptop,
      watch: Watch,
      tv: Tv,
      other: MoreHorizontal
    };
    return iconMap[type];
  };

  const getBrowserIcon = (browser: Browser) => {
    const iconMap = {
      chrome: Chrome,
      safari: Globe,
      firefox: Globe,
      edge: Globe,
      other: Globe
    };
    return iconMap[browser];
  };

  const getStatusInfo = (status: DeviceStatus) => {
    const statusMap = {
      active: {
        label: 'Active Now',
        color: 'green',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        borderColor: 'border-green-200',
        icon: CheckCircle
      },
      trusted: {
        label: 'Trusted',
        color: 'blue',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-200',
        icon: Shield
      },
      new: {
        label: 'New Device',
        color: 'purple',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-700',
        borderColor: 'border-purple-200',
        icon: AlertTriangle
      },
      suspicious: {
        label: 'Suspicious',
        color: 'amber',
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-700',
        borderColor: 'border-amber-200',
        icon: AlertTriangle
      },
      blocked: {
        label: 'Blocked',
        color: 'red',
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
        borderColor: 'border-red-200',
        icon: XCircle
      }
    };
    return statusMap[status];
  };

  const getTrustScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-red-600';
  };

  const formatDate = (date: Date): string => {
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

  const filteredDevices = devices.filter(device => {
    if (filter === 'all') return true;
    if (filter === 'active') return device.status === 'active';
    if (filter === 'trusted') return device.status === 'trusted';
    if (filter === 'suspicious') return device.status === 'suspicious' || device.status === 'new';
    return true;
  });

  const handleDeviceClick = (device: Device) => {
    setSelectedDevice(device);
    setShowDetails(true);
  };

  const handleTrustDevice = (deviceId: string) => {
    onTrustDevice?.(deviceId);
    setShowDetails(false);
  };

  const handleBlockDevice = (deviceId: string) => {
    onBlockDevice?.(deviceId);
    setShowDetails(false);
  };

  const handleRemoveDevice = (deviceId: string) => {
    if (confirmDelete === deviceId) {
      onRemoveDevice?.(deviceId);
      setConfirmDelete(null);
      setShowDetails(false);
    } else {
      setConfirmDelete(deviceId);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Device Manager</h1>
            <p className="text-blue-100">Manage your trusted devices</p>
          </div>
          <button
            onClick={onRefreshDevices}
            className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="text-2xl font-bold">{devices.length}</div>
            <div className="text-xs text-blue-100">Total Devices</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="text-2xl font-bold">
              {devices.filter(d => d.status === 'active' || d.status === 'trusted').length}
            </div>
            <div className="text-xs text-blue-100">Trusted</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="text-2xl font-bold">
              {devices.filter(d => d.status === 'suspicious' || d.status === 'new').length}
            </div>
            <div className="text-xs text-blue-100">Need Review</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex gap-2 overflow-x-auto">
          {[
            { key: 'all', label: 'All Devices' },
            { key: 'active', label: 'Active' },
            { key: 'trusted', label: 'Trusted' },
            { key: 'suspicious', label: 'Need Review' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as typeof filter)}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                filter === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Device List */}
      <div className="p-4 space-y-3">
        {filteredDevices.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <Monitor className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No devices found</p>
          </div>
        ) : (
          filteredDevices.map((device) => {
            const DeviceIcon = getDeviceIcon(device.type);
            const BrowserIcon = getBrowserIcon(device.browser);
            const statusInfo = getStatusInfo(device.status);
            const StatusIcon = statusInfo.icon;

            return (
              <motion.div
                key={device.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-xl p-4 shadow-sm border-2 ${
                  device.isCurrent ? 'border-blue-300 bg-blue-50' : 'border-transparent'
                }`}
                onClick={() => handleDeviceClick(device)}
              >
                <div className="flex items-start gap-3">
                  {/* Device Icon */}
                  <div className={`p-3 rounded-xl ${
                    device.isCurrent ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <DeviceIcon className={`w-6 h-6 ${
                      device.isCurrent ? 'text-blue-600' : 'text-gray-600'
                    }`} />
                  </div>

                  {/* Device Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {device.name}
                          {device.isCurrent && (
                            <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                              This Device
                            </span>
                          )}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <BrowserIcon className="w-4 h-4" />
                          <span>{device.browser}</span>
                          <span>•</span>
                          <span>{device.os}</span>
                        </div>
                      </div>
                      
                      {/* Status Badge */}
                      <div className={`${statusInfo.bgColor} ${statusInfo.borderColor} border px-2 py-1 rounded-lg flex items-center gap-1.5`}>
                        <StatusIcon className={`w-3 h-3 ${statusInfo.textColor}`} />
                        <span className={`text-xs font-medium ${statusInfo.textColor}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                    </div>

                    {/* Location & Last Active */}
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{device.location.city}, {device.location.country}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(device.lastActive)}</span>
                      </div>
                    </div>

                    {/* Trust Score */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-600">Trust Score</span>
                        <span className={`font-semibold ${getTrustScoreColor(device.trustScore)}`}>
                          {device.trustScore}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${device.trustScore}%` }}
                          className={`h-full ${
                            device.trustScore >= 80 ? 'bg-green-500' :
                            device.trustScore >= 60 ? 'bg-blue-500' :
                            device.trustScore >= 40 ? 'bg-amber-500' :
                            'bg-red-500'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Add New Device Button */}
      <div className="fixed bottom-24 right-6">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onAddDevice}
          className="w-14 h-14 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Device Details Modal */}
      <AnimatePresence>
        {showDetails && selectedDevice && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowDetails(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl z-50 max-h-[85vh] overflow-y-auto"
            >
              <div className="p-6">
                {/* Handle */}
                <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />

                {/* Device Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-4 bg-blue-100 rounded-2xl">
                    {React.createElement(getDeviceIcon(selectedDevice.type), {
                      className: 'w-8 h-8 text-blue-600'
                    })}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">
                      {selectedDevice.name}
                    </h2>
                    <div className={`${getStatusInfo(selectedDevice.status).bgColor} ${getStatusInfo(selectedDevice.status).borderColor} border inline-flex items-center gap-1.5 px-3 py-1 rounded-lg`}>
                      {React.createElement(getStatusInfo(selectedDevice.status).icon, {
                        className: `w-4 h-4 ${getStatusInfo(selectedDevice.status).textColor}`
                      })}
                      <span className={`text-sm font-medium ${getStatusInfo(selectedDevice.status).textColor}`}>
                        {getStatusInfo(selectedDevice.status).label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Device Details */}
                <div className="space-y-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Device Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type</span>
                        <span className="font-medium text-gray-900 capitalize">{selectedDevice.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Browser</span>
                        <span className="font-medium text-gray-900">{selectedDevice.browser} {selectedDevice.browserVersion}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Operating System</span>
                        <span className="font-medium text-gray-900">{selectedDevice.os} {selectedDevice.osVersion}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">IP Address</span>
                        <span className="font-medium text-gray-900">{selectedDevice.ipAddress}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Location & Activity</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location</span>
                        <span className="font-medium text-gray-900">{selectedDevice.location.city}, {selectedDevice.location.country}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Active</span>
                        <span className="font-medium text-gray-900">{formatDate(selectedDevice.lastActive)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">First Seen</span>
                        <span className="font-medium text-gray-900">{formatDate(selectedDevice.firstSeen)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Login Count</span>
                        <span className="font-medium text-gray-900">{selectedDevice.loginCount} times</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Trust Score</h3>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Security Rating</span>
                      <span className={`text-2xl font-bold ${getTrustScoreColor(selectedDevice.trustScore)}`}>
                        {selectedDevice.trustScore}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          selectedDevice.trustScore >= 80 ? 'bg-green-500' :
                          selectedDevice.trustScore >= 60 ? 'bg-blue-500' :
                          selectedDevice.trustScore >= 40 ? 'bg-amber-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${selectedDevice.trustScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {!selectedDevice.isCurrent && (
                  <div className="space-y-3">
                    {selectedDevice.status !== 'trusted' && selectedDevice.status !== 'blocked' && (
                      <button
                        onClick={() => handleTrustDevice(selectedDevice.id)}
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
                      >
                        <Shield className="w-5 h-5" />
                        Trust This Device
                      </button>
                    )}

                    {selectedDevice.status !== 'blocked' && (
                      <button
                        onClick={() => handleBlockDevice(selectedDevice.id)}
                        className="w-full bg-amber-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-amber-700 transition-colors"
                      >
                        <EyeOff className="w-5 h-5" />
                        Block This Device
                      </button>
                    )}

                    <button
                      onClick={() => handleRemoveDevice(selectedDevice.id)}
                      className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                        confirmDelete === selectedDevice.id
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Trash2 className="w-5 h-5" />
                      {confirmDelete === selectedDevice.id ? 'Tap Again to Confirm' : 'Remove Device'}
                    </button>
                  </div>
                )}

                {selectedDevice.isCurrent && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-start gap-3">
                      <Eye className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-900">
                        <p className="font-semibold mb-1">This is your current device</p>
                        <p className="text-blue-800">
                          You cannot remove or block the device you're currently using.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeviceManager;