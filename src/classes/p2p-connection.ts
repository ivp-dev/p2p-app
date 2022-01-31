import P2PClient from './p2p-client';
import { P2PConnectionConfig } from '../types';

class P2PConnection {
  private remoteClient: P2PClient;

  private state: 'closed' | 'opened';

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

    this.state = 'closed';
  }

  get isOpened(): boolean {
    return this.state === 'opened';
  }

  async open() {
    try {
      const offer = await this.localClient.getConnect.createOffer();
      await this.onCreateOfferSuccess(offer);
      this.state = 'opened';
    } catch (err: unknown) {
      console.log(err);
    }
  }

  close() {
    this.remoteClient.getConnect.removeEventListener('icecandidate', this.onRemoteCientIceCandidate);
    this.remoteClient.getConnect.removeEventListener('track', this.onGotRemoteStream);

    // this.localClient.getConnect.close();
    this.remoteClient.getConnect.close();

    this.config?.onClose?.();

    this.state = 'closed';
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
