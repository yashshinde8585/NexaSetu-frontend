import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
  }

  /**
   * Initializes the mission frequency for real-time signaling.
   * Ensures the terminal is ready for bidirectional telemetry.
   */
  connect() {
    if (this.socket) return;

    this.socket = io(SOCKET_URL, {
      withCredentials: true,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log(`[REAL-TIME SYNC] Strategist terminal connected: ${this.socket.id}`);
    });

    this.socket.on('disconnect', () => {
      console.log(`[REAL-TIME SYNC] Strategist terminal disconnected`);
    });
  }

  /**
   * Joins a specific mission (task) room to receive localized tactical signals.
   */
  joinMission(taskId) {
    if (!this.socket) this.connect();
    this.socket.emit('join_task', taskId);
  }

  /**
   * Listens for new incoming signals (comments) on the current mission frequency.
   */
  onSignal(callback) {
    if (!this.socket) this.connect();
    this.socket.on('new_signal', callback);
  }

  /**
   * Cleans up signal listeners to prevent telemetry interference.
   */
  offSignal() {
    if (this.socket) {
      this.socket.off('new_signal');
    }
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
