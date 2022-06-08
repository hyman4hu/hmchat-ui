<template>
    <div class="container">
        <div class="box shadow">
            <LeftNav class="nav-box" />
            <router-view class="router-view" />
        </div>
    </div>
</template>
<script>
import LeftNav from "@/views/LeftNav";

export default {
    name: "LayoutView",
    components: {
        LeftNav
    }
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
        flex: 0 0 60px;
    }

    .router-view {
        height: 100%;
        flex: 1;
    }
}
</style>