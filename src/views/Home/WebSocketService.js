import { Client } from "@stomp/stompjs";

export default class WebSocketService {
  stompClient = null;

  constructor(callback) {
    this.connect(callback);
  }

  sendMsg(msg) {
    this.stompClient.publish({
      destination: "/app/say",
      body: JSON.stringify(msg),
    });
  }

  connect(callback) {
    console.log("websocket尝试连接");
    this.stompClient = new Client({
      brokerURL: "ws://" + window.location.host + "/stomp-websocket",
      // connectHeaders: {
      //   login: "user",
      //   passcode: "password",
      // },
      debug: function (str) {
        console.log(str);
      },
      // reconnectDelay: 5000,
      // heartbeatIncoming: 4000,
      // heartbeatOutgoing: 4000,
    });
    this.stompClient.onConnect = (frame) => {
      console.log("websocket 连接成功", frame);
      this.stompClient.subscribe("/topic/msg", (msg) => {
        let obj = JSON.parse(msg.body);
        callback(obj);
      });
    };

    this.stompClient.activate();
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
    }
  }
}
