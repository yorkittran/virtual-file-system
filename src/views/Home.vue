<script setup lang="ts">
import { reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useFolderStore } from '@/stores/folder'

const folderStore = useFolderStore()
const { currentFolder, cliCurrentFolder } = storeToRefs(folderStore)
const state: {
  inputHistory: string
  commandInput: string
} = reactive({
  inputHistory: '',
  commandInput: ''
})

const onEnterPressed = async () => {
  const result = await folderStore.runCommand({
    command: state.commandInput,
    folderId: cliCurrentFolder.value.id
  })
  state.inputHistory = state.inputHistory.concat(`\n${state.commandInput}`)
  if (result) state.inputHistory = state.inputHistory.concat(`\n${result}`)
  state.commandInput = ''
}
</script>
<template>
  <div class="root">
    <div class="file-explorer">
      <h2>File Explorer here</h2>
    </div>
    <div class="command-line">
      <div class="input-history" contenteditable="false">
        {{ state.inputHistory }}
      </div>
      <input
        class="input"
        v-model="state.commandInput"
        @keyup.enter="onEnterPressed"
      />
    </div>
  </div>
</template>

<style lang="scss">
.root {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;

  .file-explorer {
    height: 60vh;
    width: 100%;
  }

  .command-line {
    height: 35vh;
    width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .input-history {
      white-space: pre-line;
      overflow-y: auto;
    }
  }
}
</style>
