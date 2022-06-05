import * as StompJs from "@stomp/stompjs";
let client;

/**
 * WebSocket 服务初始化
 */
function init(options) {
    let userId = options.userId;
    let fullName = options.fullName;
    let subscribes = options.subscribes;
    console.log("ws init userId=", userId);
    let loc = window.location, new_uri;
    if (loc.host.includes('localhost') || loc.host.includes('127.0.0.1')) {
        new_uri = 'ws://localhost:8083/ws';
        // new_uri = 'ws://hyman4hu.fun/ws';
    } else {
        new_uri = 'wss://hyman4hu.fun/ws';
    }
    // new_uri = 'wss://hyman4hu.fun/ws';
    // new_uri += `/${userId}`;
    console.log("WebSocket 初始化", new_uri);
    client = new StompJs.Client({
        connectHeaders: {
            userId,
            fullName,
        },
        brokerURL: new_uri,
        // heartbeatIncoming: 10000,
        // heartbeatOutgoing: 10000,
        splitLargeFrames: true
    });
    // client.debug = function(str) {
    //     console.log("client.debug --------- ", str);
    // };
    client.onConnect = function () {
        console.log("WebSocket 连接成功");
        for(let one of subscribes) {
            console.log("订阅：" + one.topic);
            client.subscribe(one.topic, one.callback);
        }
        // client.subscribe(`/user/${userId}/msg`, callback);
    };
    client.activate();
}

function heartbeat(userId, fullName) {
    let msgObj = {
        userId,
        fullName
    };
    let msgStr = JSON.stringify(msgObj);
    client.publish({ destination: '/app/heartbeat', body: msgStr });
}

/**
 * 发送消息
 * @param msg 信息
 */
function sendMsg(msgObj) {
    let msgStr = JSON.stringify(msgObj);
    client.publish({ destination: '/app/say', body: msgStr });
}

export default {
    init,
    sendMsg,
    heartbeat
}