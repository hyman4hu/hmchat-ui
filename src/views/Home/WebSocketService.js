import SockJS from "sockjs-client";
import Stomp from "stompjs";

export default class WebSocketService {

    stompClient = null;

    constructor(callback) {
        this.connect(callback);
    }

    sendMsg(msg) {
        this.stompClient.send("/app/say", {}, JSON.stringify(msg));
    }

    connect(callback) {
        console.log("websocket尝试连接");
        // 建立连接对象
        let socket = new SockJS("/stomp-websocket/");
        // 获取STOMP子协议的客户端对象
        this.stompClient = Stomp.over(socket);
        this.stompClient.debug = () => {};
        // 向服务器发起websocket连接
        this.stompClient.connect({},
            () => {
                console.log("websocket连接成功");

                this.stompClient.subscribe(
                    "/topic/msg",
                    msg => {
                        console.log('topic msg - ', msg)
                        let obj = JSON.parse(msg.body);
                        callback(obj);
                    }, {}
                )
            },
            error => {
                // 连接发生错误时的处理函数
                console.error("ws发生异常", error);
                setTimeout(() => {
                    console.log("ws断线重连");
                    this.connect(callback);
                }, 10000);
            }
        );
    }

    disconnect() {
        if (this.stompClient) {
            this.stompClient.disconnect(() => { });
        }
    }
}