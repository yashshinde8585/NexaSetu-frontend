import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (this.socket) return;

    const token = localStorage.getItem('token');

    this.socket = io(SOCKET_URL, {
      auth: { token },
      withCredentials: true,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      transports: ['websocket', 'polling']
    });


    this.socket.on('connect_error', (err) => {
      console.error(`[REAL-TIME SYNC] Connection error: ${err.message}`);
    });

    this.socket.on('connect', () => {
      console.log(`[REAL-TIME SYNC] Strategist terminal connected: ${this.socket.id}`);
    });

    this.socket.on('disconnect', () => {
      console.log(`[REAL-TIME SYNC] Strategist terminal disconnected`);
    });
  }

  joinMission(taskId) {
    if (!taskId) return;
    if (!this.socket) this.connect();
    this.socket.emit('join_task', taskId.toString());
    console.debug(`[SOCKET] Joined mission room: ${taskId}`);
  }

  /**
   * Leaves a mission room to prevent signal interference.
   */
  leaveMission(taskId) {
    if (!taskId || !this.socket) return;
    this.socket.emit('leave_task', taskId.toString());
    console.debug(`[SOCKET] Left mission room: ${taskId}`);
  }

  /**
   * Joins a project room for broad-spectrum task updates and agent activity.
   */
  joinProject(projectId) {
    if (!projectId) return;
    if (!this.socket) this.connect();
    this.socket.emit('join_project', projectId.toString());
    console.debug(`[SOCKET] Joined project room: ${projectId}`);
  }

  /**
   * Leaves a project room when exiting the project dashboard.
   */
  leaveProject(projectId) {
    if (!projectId || !this.socket) return;
    this.socket.emit('leave_project', projectId.toString());
    console.debug(`[SOCKET] Left project room: ${projectId}`);
  }

  /**
   * Listens for any registered system event.
   */
  onEvent(event, callback) {
    if (!this.socket) this.connect();
    this.socket.on(event, callback);
  }

  /**
   * Removes a specific event listener.
   */
  offEvent(event) {
    if (this.socket) {
      this.socket.off(event);
    }
  }

  /**
   * Listens for new incoming signals (comments) on the current mission frequency.
   * @deprecated Use onEvent('new_signal', callback) instead.
   */
  onSignal(callback) {
    this.onEvent('new_signal', callback);
  }

  offSignal() {
    this.offEvent('new_signal');
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

const socketService = new SocketService();
export default socketService;
