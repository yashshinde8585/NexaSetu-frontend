import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

let socket = null;

export const connect = () => {
  if (socket) return;

  const token = localStorage.getItem('token');

  socket = io(SOCKET_URL, {
    auth: { token },
    withCredentials: true,
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    transports: ['websocket', 'polling']
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

export const offEvent = (event) => {
  if (socket) {
    socket.off(event);
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
};

