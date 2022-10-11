<script setup lang="ts">
import { reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useFolderStore } from '@/stores/folder'

const folderStore = useFolderStore()
const { currentFolder, cliCurrentFolder } = storeToRefs(folderStore)
const state: {
  inputHistory: string
  commandInput: string
  promptCommand: string
} = reactive({
  inputHistory: '',
  commandInput: '',
  promptCommand: '$'
})

const onEnterPressed = async () => {
  if (state.commandInput === 'clear') {
    state.inputHistory = ''
  } else {
    const data = await folderStore.runCommand({
      command: state.commandInput,
      folderId: cliCurrentFolder.value.id
    })
    state.inputHistory = state.inputHistory.concat(`${state.promptCommand}\t${state.commandInput}\n`)
    if (data) {
      if (state.commandInput.match('^cd.*$')) {
        if (!data.error) {
          folderStore.cliCurrentFolder.id = data.currentFolderId
          state.promptCommand = `$ ${data.result}`.trim()
        } else {
          state.inputHistory = state.inputHistory.concat(`${data.error}\n`)
        }
      } else {
        state.inputHistory = state.inputHistory.concat(`${data.result || data.error}\n`)
      }
    } 
  }
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
      <div class="command">
        <span class="prompt-command">{{ state.promptCommand }}</span>
        <input
          class="input-command"
          v-model="state.commandInput"
          @keyup.enter="onEnterPressed"
        />
      </div>
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
    background-color: #202531;
    color: #CACCC6;
    font-family: 'Inconsolata', monospace;
    padding: 16px;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .input-history {
      white-space: pre-line;
      overflow-y: auto;
      margin-top: auto;
    }

    .command {
      display: flex;

      .prompt-command {
        margin-right: 6px;
        white-space: pre;
      }

      .input-command {
        font-family: 'Inconsolata', monospace;
        background-color: #202531;
        color: #CACCC6;
        border: 0;
        width: 100%;
      }

      .input-command:focus {
        outline: 0;
      }
    }
  }
}
</style>
