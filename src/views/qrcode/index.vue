<template>
  <div>二维码</div>
  <img :src="codeUrl" />
</template>

// https://www.npmjs.com/package/qrcode
<script setup>
import QRCode from 'qrcode'
import { nextTick, onMounted } from 'vue'

const codeUrl = ref(null)

onMounted(() => {
  console.log(QRCode, '二维码')
  nextTick(() => {
    initQrcode()
  })
})

function initQrcode() {
  // QRCode.toDataURL('I am a pony!')
  //   .then((url) => {
  //     console.log(url)
  //     codeUrl.value = url
  //   })
  //   .catch((err) => {
  //     console.error(err)
  //   })

  const option = {
    type: 'image/jepg',
    quality: 0.3,
    margin: 5
  }
  QRCode.toDataURL('I am a pony!', option, (error, url) => {
    console.log(error, url, '123')
    codeUrl.value = url
  })
}
</script>

<style lang="scss" scoped></style>
