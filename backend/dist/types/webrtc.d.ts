export interface RTCIceCandidateInit {
    candidate?: string;
    sdpMid?: string | null;
    sdpMLineIndex?: number | null;
}
export interface RTCSessionDescriptionInit {
    type: 'offer' | 'pranswer' | 'answer' | 'rollback';
    sdp?: string;
}
//# sourceMappingURL=webrtc.d.ts.map