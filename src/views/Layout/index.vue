<template>
    <div>
        <div class="box">
            <router-view />
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
}
</style>