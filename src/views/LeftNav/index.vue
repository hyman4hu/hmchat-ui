<template>
    <div>
        <div class="box">
            <div class="avatar-div">
                <img class="avatar" src="chat_white.svg" alt="头像" title="头像">
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "LeftNav"
}
</script>
<style lang="scss" scoped>
.box {
    height: 100%;
    width: 100%;
    background-color: rgb(46, 46, 46);

    .avatar-div {
        text-align: center;
        padding-top: 16px;

        .avatar {
            height: 40px;
            cursor: pointer;
            transition: all 0.3s;

            &:hover {
                transform: scale(1.1);
            }
        }
    }

}
</style>