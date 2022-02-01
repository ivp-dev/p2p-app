import { v4 as uuidv4 } from 'uuid';
import P2PClient from './p2p-client';
import { CallHistory, P2PConnectionConfig } from '../types';

class P2PConnection {
  private remoteClient: P2PClient;

  private openConnectionTimestamp: number = 0;

  private closeConnectionTimestamp: number = 0;

  constructor(
    private localClient: P2PClient,
    private config?: P2PConnectionConfig,
  ) {
    this.remoteClient = new P2PClient();

    this.onLocalClientIceCandidate = this.onLocalClientIceCandidate.bind(this);
    this.onRemoteCientIceCandidate = this.onRemoteCientIceCandidate.bind(this);
    this.onGotRemoteStream = this.onGotRemoteStream.bind(this);

    this.localClient.getConnect.addEventListener('icecandidate', this.onLocalClientIceCandidate);
    this.remoteClient.getConnect.addEventListener('icecandidate', this.onRemoteCientIceCandidate);

    this.remoteClient.getConnect.addEventListener('track', this.onGotRemoteStream);
  }

  async open() {
    try {
      const offer = await this.localClient.getConnect.createOffer();
      await this.onCreateOfferSuccess(offer);
      this.openConnectionTimestamp = Date.now();
    } catch (err: unknown) {
      console.log(err);
    }
  }

  disconect(): CallHistory {
    this.remoteClient.getConnect.close();

    this.config?.onClose?.();

    this.remoteClient.getConnect.removeEventListener('icecandidate', this.onRemoteCientIceCandidate);
    this.remoteClient.getConnect.removeEventListener('track', this.onGotRemoteStream);

    this.closeConnectionTimestamp = Date.now();

    return {
      id: uuidv4(),
      start: this.openConnectionTimestamp,
      stop: this.closeConnectionTimestamp,
      duration: this.closeConnectionTimestamp - this.openConnectionTimestamp,
    };
  }

  private async onLocalClientIceCandidate(e: RTCPeerConnectionIceEvent) {
    try {
      if (e.candidate) {
        await this.remoteClient.getConnect.addIceCandidate(e.candidate);
      }
    } catch (err: unknown) {
      console.log(err);
    }
  }

  private async onRemoteCientIceCandidate(e: RTCPeerConnectionIceEvent) {
    try {
      if (e.candidate) {
        await this.localClient.getConnect.addIceCandidate(e.candidate);
      }
    } catch (err: unknown) {
      console.log(err);
    }
  }

  private async onCreateOfferSuccess(desc: RTCSessionDescriptionInit) {
    try {
      await this.localClient.getConnect.setLocalDescription(desc);
    } catch {
      console.log('error');
    }

    try {
      await this.remoteClient.getConnect.setRemoteDescription(desc);
    } catch (err: unknown) {
      console.log(err);
    }

    try {
      const answer = await this.remoteClient.getConnect.createAnswer();
      await this.onCreateAnswerSuccess(answer);
    } catch (err: unknown) {
      console.log(err);
    }
  }

  private async onCreateAnswerSuccess(desc: RTCSessionDescriptionInit) {
    try {
      await this.remoteClient.getConnect.setLocalDescription(desc);
    } catch (err: unknown) {
      console.log(err);
    }

    try {
      await this.localClient.getConnect.setRemoteDescription(desc);
    } catch (err: unknown) {
      console.log(err);
    }
  }

  private onGotRemoteStream(e: RTCTrackEvent) {
    this.config?.gotRemoteStream?.(e.streams[0]);
  }
}

export default P2PConnection;
