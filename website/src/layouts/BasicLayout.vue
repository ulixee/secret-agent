<template lang="pug">
CoreLayout.BasicLayout
  .Content
    slot
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class BasicLayout extends Vue {}
</script>

<style lang="scss">
.BasicLayout {
  .topbar {
    margin: 10px 25px 5px;
  }
  .Content {
    margin: 0 25px 25px;
    padding: 35px;
    min-height: 500px;
  }
}
</style>
