import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || '';

export let socket = null;

let getToken = async () => localStorage.getItem('token');

export const setTokenGetter = (fn) => {
  getToken = fn;
};

export const connect = (explicitToken = null) => {
  if (socket?.connected && !explicitToken) return;
  if (socket) socket.disconnect();

  socket = io(SOCKET_URL, {
    auth: async (cb) => {
      try {
        const token = explicitToken || (await getToken());
        cb({ token });
      } catch (err) {
        console.error('[SOCKET] Failed to fetch auth token:', err);
        cb({ token: null });
      }
    },
    withCredentials: true,
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
    reconnectionDelayMax: 10000,
    timeout: 20000,
    transports: ['websocket', 'polling'], // Prioritize websocket but fall back to polling if blocked
  });

  socket.on('connect_error', (err) => {
    console.error(`[REAL-TIME SYNC] Connection error: ${err.message}`);
  });

  socket.on('connect', () => {
    console.log(`[REAL-TIME SYNC] Strategist terminal connected: ${socket.id}`);
  });

  socket.on('disconnect', () => {
    console.log(`[REAL-TIME SYNC] Strategist terminal disconnected`);
  });
};

export const joinMission = (taskId) => {
  if (!taskId) return;
  if (!socket) connect();
  socket.emit('join_task', taskId.toString());
  console.debug(`[SOCKET] Joined mission room: ${taskId}`);
};

export const leaveMission = (taskId) => {
  if (!taskId || !socket) return;
  socket.emit('leave_task', taskId.toString());
  console.debug(`[SOCKET] Left mission room: ${taskId}`);
};

export const joinProject = (projectId) => {
  if (!projectId) return;
  if (!socket) connect();
  socket.emit('join_project', projectId.toString());
  console.debug(`[SOCKET] Joined project room: ${projectId}`);
};

export const leaveProject = (projectId) => {
  if (!projectId || !socket) return;
  socket.emit('leave_project', projectId.toString());
  console.debug(`[SOCKET] Left project room: ${projectId}`);
};

export const onEvent = (event, callback) => {
  if (!socket) connect();
  socket.on(event, callback);
};

export const offEvent = (event, callback) => {
  if (socket) {
    socket.off(event, callback);
  }
};

export const onSignal = (callback) => {
  onEvent('new_signal', callback);
};

export const offSignal = () => {
  offEvent('new_signal');
};

export const disconnect = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export default {
  get socket() {
    return socket;
  },
  connect,
  joinMission,
  leaveMission,
  joinProject,
  leaveProject,
  onEvent,
  offEvent,
  onSignal,
  offSignal,
  disconnect,
  setTokenGetter,
};
