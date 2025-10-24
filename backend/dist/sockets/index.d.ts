import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
export declare const initSocket: (server: HTTPServer) => SocketIOServer;
export declare const setIo: (io: SocketIOServer) => void;
export declare const getIo: () => SocketIOServer;
//# sourceMappingURL=index.d.ts.map