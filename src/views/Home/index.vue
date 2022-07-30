<template>
<div>
    <div class="box">
        <div class="head border-bottom">
            <span class="full-name" title="点击修改昵称" @click="onFullNameClick">{{ getFullName() }}<span class="tip" v-if="!userInfo.fullName">（匿名用户请点击设置昵称）</span></span>
            <span class="online" :title="onlineUserTipContent">在线人数 {{ onlineNum }}</span>
        </div>
        <div class="msg-list-box" ref="msgListBox">
            <div class="msg-item" :class="{mine: isMyMsg(item) }" v-for="(item, index) in chatMsgList" :key="`msgbox-${index}`">
                <div class="avatar-box">
                    {{getFullNameFirst(item)}}
                </div>
                <div class="content-box">
                    <div class="msg-head">
                        <span class="full-name">{{ item.fullName }}</span>
                        <span class="datetime">{{ item.datetime }}</span>
                    </div>
                    <div class="msg">{{ item.msg }}</div>
                </div>
            </div>
        </div>
        <div class="input-msg-box border-top">
            <div class="tool-row">
                <img :src="smileSvg" title="表情" alt="表情">
                <img :src="folderSvg" title="发送文件" alt="发送文件">
            </div>
            <textarea v-model="chatMsgInput" @keydown.enter="handleKeyCode"></textarea>
            <div class="foot-row">
                <button @click="sendMsg" type="button" class="btn btn-light send-btn">发送</button>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import PerfectScrollbar from 'perfect-scrollbar';
import smileSvg from "@/assets/icon/smile.svg";
import folderSvg from "@/assets/icon/folder.svg";
import WsService from "./WsService";
import * as dayjs from 'dayjs';
import axios from "@/common/axios.js";

export default {
    name: "HomeView",
    setup() {
        return {
            smileSvg,
            folderSvg
        }
    },
    data() {
        return {
            userInfo: {
                fullName: null,
                userId: "",
            },
            chatMsgInput: "",
            chatMsgList: [],
            onlineNum: 1,
            userInfos: []
        }
    },
    computed: {
        onlineUserTipContent() {
            let ret = "";
            let length = this.userInfos.length;
            if (length == 0) {
                return undefined;
            } else {
                ret += this.userInfos[0].fullName;
            }
            if (length == 1) {
                return ret;
            }
            for(let i=1; i< length; i++) {
                ret += "\n" + this.userInfos[i].fullName;
            }
            return ret;
        }
    },
    mounted() {
        // localStorage.setItem("chatMsgList", "[]");
        this.initData();
        this.initWebSocket();
        new PerfectScrollbar(this.$refs.msgListBox);
        Notification.requestPermission();
    },
    methods: {
        initData() {
            let userInfoStr = localStorage.getItem("userInfo");
            if (userInfoStr) {
                let userInfo = JSON.parse(userInfoStr);
                this.userInfo = userInfo;
            } else {
                this.userInfo = {
                    userId: new Date().getTime(),
                    fullName: '匿名' + Math.floor(Math.random() * 100 + 1)
                }
                localStorage.setItem("userInfo", JSON.stringify(this.userInfo));
            }
            // let chatMsgListStr = localStorage.getItem("chatMsgList");
            // let chatMsgList = JSON.parse(chatMsgListStr);
            // if (!chatMsgList) {
            //     chatMsgList = [];
            // }
            // this.chatMsgList = chatMsgList;
            axios({
                url: "/chat/allmsgs",
                method: "get",
            }).then(res => {
                this.chatMsgList = res.data.data;
                this.$nextTick(() => {
                    this.$refs.msgListBox.scrollTop = this.$refs.msgListBox.scrollHeight;
                });
            });
        },
        initWebSocket() {
            WsService.init({
                userId: this.userInfo.userId,
                fullName: this.userInfo.fullName,
                subscribes: [{
                    // topic: `/user/${this.userInfo.userId}/msg`,
                    topic: `/topic/msg`,
                    callback: this.receiveMsgCallback
                }, {
                    topic: "/topic/userInfos",
                    callback: this.receiveUserInfosCallback
                }]
            });
            setInterval(() => {
                WsService.heartbeat(this.userInfo.userId, this.userInfo.fullName);
            }, 10000);
        },
        
        onFullNameClick() {
            let fullName = prompt("请输入你的昵称");
            if(!fullName || fullName.trim() == '') {
                return;
            }
            fullName = fullName.trim();
            this.userInfo.fullName = fullName;
            // this.userInfo.userId = new Date().getTime();
            localStorage.setItem("userInfo", JSON.stringify(this.userInfo));
        },
        getFullNameFirst(msg) {
            if (msg.fullName) {
                return msg.fullName.toString().substring(0, 1).toUpperCase();
            } else {
                return "匿";
            }
        },
        getFullName() {
            if (this.userInfo.fullName) {
                return this.userInfo.fullName;
            } else {
                return this.userInfo.userId;
            }
        },
        handleKeyCode(event) {
            if(event.keyCode == 13) {
                if (!event.ctrlKey) {
                    event.preventDefault();
                    this.sendMsg();
                } else {
                    this.chatMsgInput = this.chatMsgInput + '\n';
                }
            }
        },
        sendMsg() {
            if (!this.chatMsgInput || this.chatMsgInput.trim() == '') {
                this.chatMsgInput = "";
                return;
            }
            let msg = {
                fullName: this.userInfo.fullName,
                userId: this.userInfo.userId,
                msg: this.chatMsgInput,
                datetime: dayjs().format('YYYY-MM-DD HH:mm:ss')
            }
            WsService.sendMsg(msg);
            this.chatMsgInput = "";
        },
        receiveMsgCallback(e) {
            let msg = JSON.parse(e.body);
            this.chatMsgList.push(msg);
            this.$nextTick(() => {
                this.$refs.msgListBox.scrollTop = this.$refs.msgListBox.scrollHeight;
            });
            if (document.hidden && !this.isMyMsg(msg)) {
                new Notification(msg.fullName, {'body': msg.msg});
            }
        },
        receiveUserInfosCallback(e) {
            let msg = JSON.parse(e.body);
            this.userInfos = msg;
            this.onlineNum = msg.length;
        },
        isMyMsg(item) {
            let userId = item.userId;
            if (userId == this.userInfo.userId) {
                return true;
            }
            return false;
        }
    }
}
</script>
<style lang="scss" scoped>
.box {
    width: 100%;
    height: 100%;

    .msg-list-box {
        height: calc(100% - 280px);
        position: relative;
        width: 100%;
        padding: 0 32px;

        @mixin triangle {
            content: "";
            width: 0;
            height: 0;
            border-width: 6px;
            border-style: solid;
            border-color: transparent #FFF transparent transparent;
            position: absolute;
            left: -12px;
            top: 15px;
        }

        .msg-item {
            margin-top: 20px;
            display: flex;

            .avatar-box {
                height: 40px;
                width: 40px;
                background-color: #3f72af;
                color: #FFF;
                text-align: center;
                line-height: 40px;
                font-size: 18px;
                margin-right: 10px;
                flex: 0 0 40px;

            }

            .content-box {
                max-width: 70%;
                position: relative;
                padding-top: 12px;

                .msg-head {
                    position: absolute;
                    top: -12px;
                    left: 0px;
                    white-space: nowrap;

                    .full-name {
                        color: rgba(0, 0, 0, 0.5);
                        font-size: 12px;
                        margin-bottom: 4px;
                    }

                    .datetime {
                        color: rgba(0, 0, 0, 0.3);
                        font-size: 12px;
                        margin-left: 100px;
                        line-height: 12px;
                        font-style:oblique;
                    }
                }

                .msg {
                    color: #333333;
                    white-space: pre-wrap;
                    background-color: #FFF;
                    padding: 8px 10px;
                    border-radius: 5px;
                    font-size: 14px;
                    line-height: 24px;
                    position: relative;

                    &:before{
                        @include triangle;
                    }
                }

            }


            &.mine {
                flex-flow: row-reverse;

                .avatar-box {
                    color: #333333;
                    background-color: #dbe2ef;
                    margin-left: 10px;
                    margin-right: 0px;
                }

                .content-box {
                    .msg-head {
                        left: auto;
                        right: 0px;

                        .full-name {
                            display: none;
                        }
                    }

                    .msg {
                        background-color: rgb(149, 236, 105);

                        &:before{
                            display: none;
                        }

                        &:after{
                            @include triangle;
                            right: -12px;
                            left: auto;
                            border-color: transparent transparent transparent rgb(149, 246, 105);
                        }
                    }
                }
            }

        }
    }

    .input-msg-box {
        padding: 0px 32px;

        .tool-row {
            padding: 8px 0px;
            img {
                height: 22px;
                margin-right: 8px;
                cursor: pointer;
            }
        }

        .foot-row {
            display: flex;
            justify-content: flex-end;

            .send-btn {
                color: rgb(7, 193, 96);
                width: 100px;
                background-color: rgb(233, 233, 233);
            }
        }

        textarea {
            border-style: none;
            width: 100%;
            resize: none;
            font-size: 15px;
            height: 120px;
            background-color: rgb(245, 245, 245);

            &:focus {
                outline: none;

                &::placeholder{
                    opacity: 0;
                }
            }

            &::-webkit-scrollbar {
                width: 5px;
            }

            &::-webkit-scrollbar-thumb {
                background-color: rgba(0,0,0,0.2);
            }
        }
    }

    .head {
        padding: 16px 16px 8px 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .full-name {
            font-size: 18px;
            cursor: pointer;

            .tip {
                font-size: 12px;
                color: rgba(0, 0, 0, 0.5);
            }
        }

        .online {
            font-size: 14px;
            margin-left: 16px;
            color: rgba(0, 0, 0, 0.5);
        }
    }
}
</style>