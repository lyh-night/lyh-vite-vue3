<template>
  <div>
    <h1>icon使用</h1>
    <div>
      <h2>iconfont</h2>
      <i class="iconfont icon-add-circle" />
    </div>
    <div>
      <h2>svg使用</h2>
      <!-- 文件路径为 assets/svg/chat/deepseek.svg -->
      <SvgIcon name="chat-deepseek" width="32px" height="32px" />
      <!-- 文件路径为 assets/svg/deepseek.svg -->
      <SvgIcon name="deepseek" width="32px" height="32px" />
      <!--img 方式 -->
      <img src="@/assets/svg/deepseek.svg" />
      <!-- svg -->
      <svg aria-hidden="true" width="32px" height="32px">
        <use xlink:href="#icon-deepseek" />
      </svg>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped></style>
