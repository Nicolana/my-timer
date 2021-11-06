<template>
  <div class="about-content-page pl-4 pt-1 pr-2">
    <h3 class="pb-4">
      <el-icon><bell /></el-icon>
      闹钟房间</h3>
    <div class="about-content-wrapper flex text-sm">
      <span class="label">Version: </span>
      <span class="value ml-2">0.0.1</span>
    </div>
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line import/no-extraneous-dependencies
import { Bell } from '@element-plus/icons';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { Bell },
  name: 'Version',
  setup() {
    document.title = '关于我们';
    const closebt = () => {
      console.log('关闭窗口!!!');
    };
    return {
      closebt,
    };
  },
});
</script>

<style>
-webkit-app-region: drag;
</style>
