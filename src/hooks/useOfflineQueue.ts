import { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import {
  addToQueue,
  updateActionStatus,
  removeFromQueue,
  setOnlineStatus,
  setPauseStatus,
  clearSuccessful,
  type QueuedAction,
} from '@store/slices/syncSlice';

export const useOfflineQueue = () => {
  const dispatch = useAppDispatch();
  const syncQueue = useAppSelector((state) => state.sync?.queue || []);
  const isOnline = useAppSelector((state) => state.sync?.isOnline ?? true);
  const isPaused = useAppSelector((state) => state.sync?.isPaused ?? false);
  
  const [showSyncModal, setShowSyncModal] = useState(false);

  // Listen to online/offline events
  useEffect(() => {
    const handleOnline = () => {
      console.log('Network: Back online');
      dispatch(setOnlineStatus(true));
      
      // Auto-sync pending/failed actions when back online
      if (!isPaused) {
        const actionsToSync = syncQueue.filter(
          (a: QueuedAction) => a.status === 'pending' || a.status === 'failed'
        );
        
        actionsToSync.forEach((action: QueuedAction) => {
          // Small delay between retries
          setTimeout(() => {
            handleRetry(action.id);
          }, 500);
        });
      }
    };

    const handleOffline = () => {
      console.log('Network: Gone offline');
      dispatch(setOnlineStatus(false));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [dispatch, syncQueue, isPaused]);

  // Add action to queue
  const queueAction = useCallback((
    action: Omit<QueuedAction, 'id' | 'timestamp' | 'status' | 'retryCount'>
  ) => {
    const queuedAction: QueuedAction = {
      ...action,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      status: 'pending',
      retryCount: 0,
    };
    
    dispatch(addToQueue(queuedAction));
    
    // Try to sync immediately if online and not paused
    if (isOnline && !isPaused) {
      setTimeout(() => {
        handleRetry(queuedAction.id);
      }, 100);
    }
    
    return queuedAction.id;
  }, [dispatch, isOnline, isPaused]);

  // Retry single action
  const handleRetry = useCallback(async (actionId: string) => {
    const action = syncQueue.find((a: QueuedAction) => a.id === actionId);
    if (!action) {
      console.warn('Action not found in queue:', actionId);
      return;
    }

    // Don't retry if max attempts reached
    if (action.retryCount >= 3) {
      console.log('Max retry attempts reached for action:', actionId);
      dispatch(updateActionStatus({
        id: actionId,
        status: 'failed',
        error: 'Max retry attempts reached',
        retryCount: action.retryCount,
      }));
      return;
    }

    console.log('Retrying action:', actionId, action.type);
    dispatch(updateActionStatus({ 
      id: actionId, 
      status: 'syncing',
      retryCount: action.retryCount + 1,
    }));

    try {
      // Attempt to sync the action
      await syncAction(action);
      
      console.log('Action synced successfully:', actionId);
      dispatch(updateActionStatus({ id: actionId, status: 'success' }));
      
      // Remove successful actions after 2 seconds
      setTimeout(() => {
        dispatch(removeFromQueue(actionId));
      }, 2000);
      
    } catch (error: any) {
      console.error('Action sync failed:', actionId, error);
      dispatch(updateActionStatus({
        id: actionId,
        status: 'failed',
        error: error.message || 'Sync failed',
        retryCount: action.retryCount + 1,
      }));
    }
  }, [dispatch, syncQueue]);

  // Retry all failed actions
  const handleRetryAll = useCallback(async () => {
    const failedActions = syncQueue.filter((a: QueuedAction) => a.status === 'failed');
    
    console.log('Retrying all failed actions:', failedActions.length);
    
    for (const action of failedActions) {
      await handleRetry(action.id);
      // Small delay between retries
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }, [syncQueue, handleRetry]);

  // Delete action from queue
  const handleDelete = useCallback((actionId: string) => {
    console.log('Deleting action from queue:', actionId);
    dispatch(removeFromQueue(actionId));
  }, [dispatch]);

  // Pause syncing
  const handlePause = useCallback(() => {
    console.log('Pausing sync');
    dispatch(setPauseStatus(true));
  }, [dispatch]);

  // Resume syncing
  const handleResume = useCallback(() => {
    console.log('Resuming sync');
    dispatch(setPauseStatus(false));
    
    // Sync pending/failed actions
    const actionsToSync = syncQueue.filter(
      (a: QueuedAction) => a.status === 'pending' || a.status === 'failed'
    );
    
    actionsToSync.forEach((action: QueuedAction) => {
      setTimeout(() => {
        handleRetry(action.id);
      }, 500);
    });
  }, [dispatch, syncQueue, handleRetry]);

  // Clear all successful actions
  const handleClearSuccessful = useCallback(() => {
    dispatch(clearSuccessful());
  }, [dispatch]);

  return {
    syncQueue,
    isOnline,
    isPaused,
    showSyncModal,
    setShowSyncModal,
    queueAction,
    handleRetry,
    handleRetryAll,
    handleDelete,
    handlePause,
    handleResume,
    handleClearSuccessful,
    pendingCount: syncQueue.filter((a: QueuedAction) => a.status === 'pending').length,
    failedCount: syncQueue.filter((a: QueuedAction) => a.status === 'failed').length,
    successCount: syncQueue.filter((a: QueuedAction) => a.status === 'success').length,
  };
};

// Helper function to sync action based on type
async function syncAction(action: QueuedAction): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  switch (action.type) {
    case 'message':
      console.log('Syncing message:', action.data);
      // Replace with actual API call
      // await fetch('/api/messages', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(action.data),
      // }).then(res => {
      //   if (!res.ok) throw new Error('Failed to send message');
      // });
      break;
      
    case 'post':
      console.log('Syncing post:', action.data);
      // Replace with actual API call
      // await fetch('/api/posts', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(action.data),
      // });
      break;
      
    case 'upload':
      console.log('Syncing upload:', action.data);
      // Replace with actual API call
      // const formData = new FormData();
      // formData.append('file', action.data.file);
      // await fetch('/api/upload', {
      //   method: 'POST',
      //   body: formData,
      // });
      break;
      
    case 'transaction':
      console.log('Syncing transaction:', action.data);
      // Replace with actual API call
      break;
      
    case 'update':
      console.log('Syncing update:', action.data);
      // Replace with actual API call
      break;
      
    default:
      throw new Error('Unknown action type');
  }
  
  // For demo purposes, randomly fail some syncs
  if (Math.random() < 0.2) {
    throw new Error('Network error - please retry');
  }
}