import * as StompJs from "@stomp/stompjs";
let client, clientId;

/**
 * WebSocket 服务初始化
 */
function init(userId, callBack) {
    console.log("ws init userId=", userId);
    clientId = userId;
    let loc = window.location, new_uri;
    if (loc.host.includes('localhost') || loc.host.includes('127.0.0.1')) {
        new_uri = 'ws://localhost:8083/ws';
        // new_uri = 'ws://hyman4hu.fun/ws';
    } else {
        if (loc.protocol === "https:") {
            new_uri = "wss:";
        } else {
            new_uri = "ws:";
        }
        new_uri += "//" + loc.host + "/ws";
    }
    // new_uri += `/${clientId}`;
    console.log("WebSocket 初始化", new_uri);
    client = new StompJs.Client({
        connectHeaders: {
            clientId
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
        client.subscribe(`/user/${clientId}/msg`, callBack);
    };
    client.activate();
    
}

/**
 * 发送消息
 * @param msg 信息
 */
function sendMsg(msgData) {
    let msgObj = {
        clientId,
        data: msgData,
    };
    console.log("sendMsg -", msgObj);
    let msgStr = JSON.stringify(msgObj);
    client.publish({ destination: '/app/say', body: msgStr });
}

export default {
    init,
    sendMsg
}