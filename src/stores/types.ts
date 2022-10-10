import { User, Folder } from '@/apollo/types/index'

export interface UserState {
  user?: User
  accessToken?: string
}

export interface FolderState {
  currentFolder: Folder
  cliCurrentFolder: Folder
}
