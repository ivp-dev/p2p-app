class P2PClient {
  constructor(stream?: MediaStream) {
    this.connection = new RTCPeerConnection();
    if (stream) {
      stream.getTracks().forEach((track) => {
        this.connection.addTrack(track, stream);
      });
    }
  }

  private connection: RTCPeerConnection;

  get getConnect() {
    return this.connection;
  }
}

export default P2PClient;
