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

const onFolderClick = async (folderName:string, folderId: string) => {
  await folderStore.getFolderItems({ folderId: folderId })
  folderStore.handlePath(folderName, folderId)
}

</script>
<template>
  <div class="root">
    <div class="file-explorer">
      <h2 class="title">File Explorer</h2>
      <div class="path">
        <span v-for="path in folderStore.currentFolder.path" :key="path.id" class="path-item" @click="onFolderClick(path.name, path.id)">
          <span class="indicator">/</span>
          {{ path.name }}
        </span>
      </div>
      <div v-if="!folderStore.isLoading" class="items-container">
        <div v-for="folder in folderStore.getCurrentFolderFolders" :key="folder.id" class="item" @click="onFolderClick(folder.name, folder.id)">
          <i class="icon-folder fa-solid fa-folder"></i>
          {{ folder.name }}
        </div>
        <div v-for="systemFile in folderStore.getCurrentFolderSystemFiles" :key="systemFile.id" class="item">
          <i class="icon-file fa-solid fa-file-lines"></i>
          {{ systemFile.name }}
        </div>
      </div>
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
  color: #202531;

  .file-explorer {
    height: 60vh;
    width: 100%;

    .title {
      font-size: 36px;
      padding: 24px;
    }

    .path {
      display: inline-flex;
      gap: 8px;
      padding: 24px;

      .path-item {
        font-size: 16px;
        cursor: pointer;

        .indicator {
          font-size: 16px;
          margin-right: 4px;
        }
      }
    }

    .items-container {
      display: grid;
      row-gap: 20px;
      grid-template-columns: repeat(8, 150px [col-start]);

      .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 24px;

        .icon-folder {
          font-size: 120px;
          color: #FFEE99;
          cursor: pointer;
        }

        .icon-file {
          font-size: 120px;
          color: #73D0FE;
        }
      }
    }
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
