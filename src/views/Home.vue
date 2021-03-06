<template>
  <div class="home-page-container">
    <div class="timer-content-wrapper">
      <div class="timer-wrapper select-none">
        {{ countDownSecText }}
      </div>
      <div class="footer-wrapper">
        <el-button type="primary" @click="dialogVisible = true">编辑计时器</el-button>
        <el-button type="warning" @click="resetTimer">重置</el-button>
        <el-button :type="isRunning ? 'danger' : 'success'" @click="startTimer">
          {{ isRunning ? '停止' : '开始' }}
        </el-button>
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
            <el-dropdown trigger="click" @command="onTimerClick">
              <el-button type="primary">
                {{ hours }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu class="timer-dropdown-menu">
                  <el-dropdown-item
                    v-for="(item, index) in timerListHours"
                    :command="{index, type: 'hour'}"
                    :key="index">{{ item }}</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <div class="edit-minutes flex-grow">
            <div class="edit-name">分钟</div>
            <el-dropdown trigger="click" @command="onTimerClick">
              <el-button type="primary">
                {{ minutes }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu class="timer-dropdown-menu">
                  <el-dropdown-item
                    v-for="(item, index) in timerListHours"
                    :command="{index, type: 'minute'}"
                    :key="index">{{ item }}</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <div class="edit-seconds flex-grow">
            <div class="edit-name">秒</div>
            <el-dropdown trigger="click" @command="onTimerClick">
              <el-button type="primary">
                {{ seconds }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu class="timer-dropdown-menu">
                  <el-dropdown-item
                    v-for="(item, index) in timerListHours"
                    :command="{index, type: 'second'}"
                    :key="index">{{ item }}</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
      <div class="edit-item-wrapper mt-4">
        <div class="edit-item-title">
          声音
        </div>
        <div class="edit-item-content">
          <div class="flex items-center select-none">
            <el-select v-model="audioOptionIndex"
                       placeholder="选择提示音频"
                       class="audio-select flex-grow">
              <el-option
                v-for="(item, index) in audioOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <div class="cursor-pointer
                        ml-1
                        mr-3
                        pl-4
                        pr-4
                        border-solid
                        border-gray-200
                        border-2
                        bg-gray-200
                        flex
                        items-center
                        justify-center
                        h-10"
                 @click="onPlayMusic"
            >
              <el-icon v-if="!audioPlying">
                <video-play />
              </el-icon>
              <el-icon v-else><video-pause /></el-icon>
            </div>
            <el-checkbox v-model="isAudioLoop" label="循环播放"></el-checkbox>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="success" @click="onEditTimerConfirm">开始</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="stopDialogVisible" title="计时器" custom-class="stop-dialog">
    <div class="stop-dialog-content">
      <div class="logo-wrapper">
      </div>
      <div class="text-lg text-center">{{ totalCountText }}</div>
      <div class="text-lg text-center">
        备注blablablabla
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer flex justify-center">
        <el-button type="success"
                   class="stop-restart-button"
                   @click="continueTimer">重新开始</el-button>
        <el-button type="danger"
                   class="stop-confirm-button"
                   @click="onStopConfirm">确定</el-button>
      </div>
    </template>
  </el-dialog>
  <audio controls class="hidden" id="audio" ref="audio" :loop="isAudioLoop">
    <source src="@/assets/audio/xylophone.mp3" type="audio/mpeg">
  </audio>
</template>

<script lang="ts">
// eslint-disable-next-line import/no-extraneous-dependencies
import { ArrowDown, VideoPlay, VideoPause } from '@element-plus/icons';
import {
  computed, defineComponent, reactive, ref,
} from 'vue';
import moment from 'moment';

interface dropDownEvent {
  index: number
  type: string
}

interface timerIndexTypes {
  hourIndex: number
  minuteIndex: number
  secondIndex: number
}

export default defineComponent({
  name: 'Home',
  components: {
    ArrowDown,
    VideoPlay,
    VideoPause,
  },
  setup() {
    const dialogVisible = ref<boolean>(false);
    const timerTypeRadio = ref<string>('timerType');
    const timerListHours = ref<any>([]);
    const countDownSeconds = ref<number>(0);
    const isRunning = ref<null | boolean>(false);
    // 倒计时停止界面
    const stopDialogVisible = ref(false);
    let startTime: moment.Moment | null = null;
    const total = ref<number>(0);
    const totalCount = ref<number>(0);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 100; i++) {
      const val = i.toString().padStart(2, '0');
      timerListHours.value.push(val);
    }
    const audio = ref<null | HTMLAudioElement>(null);
    const isAudioLoop = ref<boolean>(true);
    const audioOptions = ref([
      {
        value: 0,
        label: '木琴',
      },
    ]);
    const audioOptionIndex = ref(0);
    const audioPlying = ref(false);
    const onPlayMusic = () => {
      if (audioPlying.value) {
        // eslint-disable-next-line no-unused-expressions
        audio.value?.pause();
        audioPlying.value = false;
        return;
      }
      audioPlying.value = true;
      // eslint-disable-next-line no-unused-expressions
      audio.value?.play();
    };
    const stopMusic = () => {
      // eslint-disable-next-line no-unused-expressions
      audio.value?.pause();
      audioPlying.value = false;
    };
    const timerIndex = reactive({
      hourIndex: 0,
      minuteIndex: 0,
      secondIndex: 0,
    }) as timerIndexTypes;
    const timer = ref();
    const hours = computed(() => timerListHours.value[timerIndex.hourIndex]);
    const minutes = computed(() => timerListHours.value[timerIndex.minuteIndex]);
    const seconds = computed(() => timerListHours.value[timerIndex.secondIndex]);
    const sendNotification = (msg: string) => {
      const myNotification = new Notification('计时器', {
        body: msg,
      });
      myNotification.onclick = () => {
        console.log('通知被点击!!!');
      };
    };

    const onTimerClick = (val: dropDownEvent) : void => {
      const { index, type } = val;
      if (type === 'hour') {
        timerIndex.hourIndex = index;
      } else if (type === 'minute') {
        timerIndex.minuteIndex = index;
      } else if (type === 'second') {
        timerIndex.secondIndex = index;
      }
    };
    const closeDialog = () => {
      dialogVisible.value = false;
      timerIndex.hourIndex = 0;
      timerIndex.minuteIndex = 0;
      timerIndex.secondIndex = 0;
    };
    const countDown = () => {
      timer.value = setTimeout(() => {
        const diff = moment().diff(startTime, 'seconds');
        if (total.value - diff < 0) {
          clearTimeout(timer.value);
          isRunning.value = false;
          timer.value = undefined;
          countDownSeconds.value = 0;
          sendNotification('🍕计时结束啦!');
          stopDialogVisible.value = true;
          onPlayMusic();
          return;
        }
        countDownSeconds.value = total.value - diff;
        countDown();
      }, 50);
    };
    const countDownSecText = computed(() => {
      const minuteTime : string = parseInt((countDownSeconds.value / 60).toString(), 10).toString().padStart(2, '0');
      const secondTime : string = parseInt((countDownSeconds.value % 60).toString(), 10).toString().padStart(2, '0');
      return `${minuteTime}:${secondTime}`;
    });
    const startTimer = () : void => {
      if (countDownSeconds.value <= 0) return;
      if (isRunning.value) {
        clearTimeout(timer.value);
        isRunning.value = false;
        total.value = countDownSeconds.value;
        return;
      }
      isRunning.value = true;
      startTime = moment();
      countDown();
    };
    const onEditTimerConfirm = () => {
      // eslint-disable-next-line max-len
      total.value = Number(hours.value) * 60 * 60 + Number(minutes.value) * 60 + Number(seconds.value);
      countDownSeconds.value = total.value;
      totalCount.value = total.value;
      startTimer();
      closeDialog();
    };
    const resetTimer = () => {
      clearTimeout(timer.value);
      timer.value = undefined;
      isRunning.value = false;
      countDownSeconds.value = 0;
    };

    const totalCountText = computed(() => {
      const time = moment.duration(totalCount.value, 'seconds');
      const input = { h: time.hours(), m: time.minutes(), s: time.seconds() };
      return moment(input).format('HH:mm:ss');
    });
    const closeStopDialog = () => {
      stopDialogVisible.value = false;
    };
    const onStopConfirm = () => {
      stopMusic();
      closeStopDialog();
    };
    const continueTimer = () => {
      stopMusic();
      total.value = totalCount.value;
      countDownSeconds.value = total.value;
      startTimer();
      closeStopDialog();
    };
    return {
      audio,
      hours,
      minutes,
      seconds,
      totalCount,
      totalCountText,
      audioPlying,
      isAudioLoop,
      dialogVisible,
      timerTypeRadio,
      timerListHours,
      stopDialogVisible,
      timerIndex,
      isRunning,
      audioOptions,
      audioOptionIndex,
      countDownSecText,
      startTimer,
      resetTimer,
      continueTimer,
      onStopConfirm,
      onPlayMusic,
      closeDialog,
      onTimerClick,
      onEditTimerConfirm,
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

.audio-select .el-icon {
  height: 100%!important;
  display: flex;
  align-items: center;
}

.stop-dialog .el-dialog__header{
  background-color: #EF6262;
}

.stop-dialog .el-dialog__title {
  color: #fff;
}

.stop-dialog .el-dialog__close {
  color: #fff;
}

.stop-dialog .el-dialog__footer {
  background-color: #fcfcfc;
  border-top: 1px solid #e5e5e5;
}

.stop-restart-button {
  background-color: #4aae71;
  border-color: #4aae71;
  min-width: 100px;
}

.stop-confirm-button {
  min-width: 100px;
}
</style>
