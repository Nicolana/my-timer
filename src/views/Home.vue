<template>
  <div class="home-page-container">
    <div class="timer-content-wrapper">
      <div class="timer-wrapper">
        04:55
      </div>
      <div class="footer-wrapper">
        <el-button type="primary" @click="dialogVisible = true">编辑计时器</el-button>
        <el-button type="warning">重置</el-button>
        <el-button type="success">开始</el-button>
      </div>
    </div>
  </div>
  <el-dialog v-model="dialogVisible" title="编辑计时器">
    <div class="edit-timer-content">
      <div class="edit-item-wrapper">
        <el-radio-group v-model="timerTypeRadio">
          <el-radio label="timerType">倒数计时</el-radio>
        </el-radio-group>
        <div class="edit-item-content flex">
          <div class="edit-hours flex-grow">
            <div class="edit-name">小时</div>
            <el-dropdown>
              <el-button type="primary" @click="onTimerClick">
                {{ timer.hours }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu class="timer-dropdown-menu">
                  <el-dropdown-item
                    v-for="(item, index) in timerListHours"
                    :key="index">{{ item }}</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <div class="edit-minutes flex-grow">
            <div class="edit-name">分钟</div>
            <el-button type="primary">
              {{ timer.minutes }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
          </div>
          <div class="edit-seconds flex-grow">
            <div class="edit-name">秒</div>
            <el-button type="primary">
              {{ timer.seconds }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
// eslint-disable-next-line import/no-extraneous-dependencies
import { ArrowDown } from '@element-plus/icons';
import { defineComponent, reactive, ref } from 'vue';

export default defineComponent({
  name: 'Home',
  components: {
    ArrowDown,
  },
  setup() {
    const dialogVisible = ref(false);
    const timerTypeRadio = ref('timerType');
    const timerListHours = ref<any>([]);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 100; i++) {
      timerListHours.value.push(i);
    }
    const timer = reactive({
      hours: '00',
      minutes: '00',
      seconds: '00',
    });

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const onTimerClick = () => {};
    return {
      timer,
      dialogVisible,
      timerTypeRadio,
      timerListHours,
      onTimerClick,
    };
  },
});
</script>

<style>
.home-page-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  /*background-color: #f0f0f0;*/
}
.timer-wrapper {
  font-family: clockicons,sans-serif;
  color: #555!important;
  font-size: 95px;
}

.timer-content-wrapper {
  height: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.timer-wrapper {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timer-dropdown-menu {
  height: 200px;
  overflow: auto;
}
</style>
