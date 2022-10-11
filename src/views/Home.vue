<script setup lang="ts">
import { reactive, nextTick, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useFolderStore } from '@/stores/folder'
import { useUserStore } from '@/stores/user'

const folderStore = useFolderStore()
const userStore = useUserStore()
const inputCommand = ref(null)

const { cliCurrentFolder } = storeToRefs(folderStore)
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
  state.commandInput = state.commandInput.trim()
  if (state.commandInput === 'clear') {
    state.inputHistory = ''
  } else {
    const data = await folderStore.runCommand({
      command: state.commandInput,
      folderId: cliCurrentFolder.value.id
    })
    state.inputHistory = state.inputHistory.concat(
      `${state.promptCommand}\t${state.commandInput}\n`
    )
    if (data) {
      if (state.commandInput.match('^cd.*$')) {
        if (!data.error) {
          folderStore.cliCurrentFolder.id = data.currentFolderId
          state.promptCommand = `$ ${data.result}`.trim()
        } else {
          state.inputHistory = state.inputHistory.concat(`${data.error}\n`)
        }
      } else {
        state.inputHistory = state.inputHistory.concat(
          `${data.result || data.error}\n`
        )
      }
    }
    await folderStore.getFolderItems({ folderId: folderStore.currentFolder.id })
  }
  state.commandInput = ''

  nextTick(() => {
    const targetEl = document.getElementById("input-history");
    if (targetEl) targetEl.scrollTop = targetEl.scrollHeight;
  })
}

const onFolderClick = async (folderName: string, folderId: string) => {
  await folderStore.getFolderItems({ folderId: folderId })
  folderStore.handlePath(folderName, folderId)
}

const signOut = async () => {
  if (confirm('Process to Sign out?')) {
    await userStore.signOut()
  }
}

const onClickInputHistory = () => {
  // @ts-ignore
  inputCommand.value.focus()
}
</script>
<template>
  <div class="root">
    <div class="file-explorer">
      <div class="header">
        <p class="title">File Explorer</p>
        <p class="greeting">
          Hello, {{ userStore.email }}
          <font-awesome-icon
            icon="fa-solid fa-right-from-bracket"
            class="icon-sign-out"
            @click="signOut"
          />
        </p>
      </div>
      <div class="path">
        <span
          v-for="path in folderStore.currentFolder.path"
          :key="path.id"
          class="path-item"
          @click="onFolderClick(path.name, path.id)"
        >
          <span class="indicator">/</span>
          {{ path.name }}
        </span>
      </div>
      <div v-if="!folderStore.loading" class="items-container">
        <div
          v-for="folder in folderStore.getCurrentFolderFolders"
          :key="folder.id"
          class="item"
          @click="onFolderClick(folder.name, folder.id)"
        >
          <font-awesome-icon icon="fa-solid fa-folder" class="icon-folder" />
          {{ folder.name }}
        </div>
        <div
          v-for="systemFile in folderStore.getCurrentFolderSystemFiles"
          :key="systemFile.id"
          class="item"
        >
          <font-awesome-icon icon="fa-solid fa-file-lines" class="icon-file" />
          {{ systemFile.name }}
        </div>
      </div>
    </div>
    <div class="command-line">
      <div id="input-history" class="input-history" contenteditable="false" @click="onClickInputHistory">
        {{ state.inputHistory }}
      </div>
      <div class="command">
        <span class="prompt-command">{{ state.promptCommand }}</span>
        <input
          class="input-command"
          v-model="state.commandInput"
          ref="inputCommand"
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

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px;

      .title {
        font-size: 36px;
      }

      .greeting {
        font-size: 20px;

        .icon-sign-out {
          margin-left: 8px;
          color: #ffa759;
          cursor: pointer;
        }
      }
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
          color: #ffee99;
          cursor: pointer;
        }

        .icon-file {
          font-size: 120px;
          color: #73d0fe;
        }
      }
    }
  }

  .command-line {
    height: 35vh;
    width: 100%;
    background-color: #202531;
    color: #caccc6;
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
        color: #caccc6;
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
