import React from "react";
import styles from "./index.module.scss";
import moment from "moment";
import WebSocketService from "./WebSocketService";

const appKey = "hmchat1919";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "匿名",
      textareaValue: "",
      chats: [],
    };
    this.ws = new WebSocketService(this.handleMsg.bind(this));
  }

  componentDidMount() {
    this.init();
    // setInterval(() => {
    //   console.log('发送测试...');
    //   this.ws.sendMsg({
    //     username: 'test',
    //     timestamp: moment(new Date()).valueOf(),
    //     msg: 'this.state.textareaValue'
    //   });
    // }, 5000);
  }

  init() {
    // localStorage.clear();
    let storage = localStorage.getItem(appKey);
    if (storage) {
      let json = JSON.parse(storage);
      json.textareaValue = "";
      this.setState(json);
      console.log("localStorage - ", json);
    }
    this.scrollToBottom();
  }

  handleMsg(msg) {
    console.log("handleMsg - ", msg);
    let username = msg.username;
    if (username === this.state.username) {
      return;
    } else {
      let chats = this.state.chats.concat(msg);
      this.setState({
        chats,
      });
      this.notify(msg);
    }
    this.scrollToBottom();
    this.storeData();
  }

  sendMsg() {
    console.log("sendmsg");
    if (this.state.textareaValue.trim() === "") {
      console.log("ret");
      return;
    }
    let msg = {
      username: this.state.username,
      timestamp: moment(new Date()).valueOf(),
      msg: this.state.textareaValue,
    };
    this.ws.sendMsg(msg);
    let chats = this.state.chats;
    chats.push(msg);
    this.setState({
      textareaValue: "",
      chats,
    });
    this.scrollToBottom();
    this.storeData();
  }

  notify(msg) {
    if (!("Notification" in window)) {
      console.warn("你的浏览器不支持Notification");
      return;
    }
    let options = {
      body: msg.msg,
    };
    //检查是否拥有通知权限；有就通知，没有请求；
    if (Notification.permission === "granted") {
      new Notification(msg.username, options);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (result) {
        if (result === "granted") {
          new Notification(msg.username, options);
        }
      });
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.messagesEnd) {
        const scrollHeight = this.messagesEnd.scrollHeight; //里面div的实际高度  2000px
        const height = this.messagesEnd.clientHeight; //网页可见高度  200px
        const maxScrollTop = scrollHeight - height;
        this.messagesEnd.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
        //如果实际高度大于可见高度，说明是有滚动条的，则直接把网页被卷去的高度设置为两个div的高度差，实际效果就是滚动到底部了。
      }
    }, 10);
  }

  storeData() {
    let str = JSON.stringify(this.state);
    localStorage.setItem(appKey, str);
  }

  handleGetTextareaValue(e) {
    this.setState({
      textareaValue: e.target.value,
    });
  }

  changeUsername() {
    let username = prompt("请输入用户名");
    if (username == null || username === "") {
      return;
    } else {
      this.setState({
        username,
      });
      setTimeout(() => {
        this.storeData();
      }, 10);
    }
  }

  render() {
    return (
      <div className={styles.box}>
        <div className={styles.header}>
          <div className={styles.show}>
            <span onClick={this.changeUsername.bind(this)}>
              {this.state.username}
            </span>
          </div>
        </div>
        <div
          className={styles.content}
          ref={(el) => {
            this.messagesEnd = el;
          }}
        >
          {this.state.chats.map((chat) => {
            return (
              <div
                className={
                  chat.username !== this.state.username
                    ? styles.msgBox
                    : styles.myMsgBox
                }
                key={chat.timestamp}
              >
                <div className={styles.msgHead}>
                  {moment(chat.timestamp).format("YYYY-MM-DD HH:mm:ss")}{" "}
                  {chat.username}
                </div>
                <div className={styles.msgContent}>{chat.msg}</div>
              </div>
            );
          })}
        </div>
        <div className={styles.footer}>
          <textarea
            value={this.state.textareaValue}
            onChange={this.handleGetTextareaValue.bind(this)}
          ></textarea>
          <button type="button" onClick={this.sendMsg.bind(this)}>
            发送
          </button>
        </div>
      </div>
    );
  }

  dis;
}
