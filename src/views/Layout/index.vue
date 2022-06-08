<template>
    <div class="container">
        <div class="box shadow">
            <div class="nav-box"></div>
            <router-view class="router-view" />
        </div>
    </div>
</template>
<script>
export default {
    name: "LayoutView"
}
</script>

<style lang="scss" scoped>
.box {
    height: 90vh;
    background-color: rgb(245, 245, 245);
    border: 1px rgba(0, 0, 0, 0.1) solid;
    width: 100%;
    display: flex;

    .nav-box {
        background-color: rgb(46, 46, 46);
        flex: 0 0 60px;
    }

    .router-view {
        height: 100%;
        flex: 1;
    }
}
</style>