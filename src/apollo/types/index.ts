export interface User {
  id: string
  email: string
  rootFolder: {
    id: string
  }
}

export interface RegisterInput {
  email?: string
  password?: string
  passwordConfirmation?: string
}

export interface RegisterResponse {
  register: {
    user: User
    accessToken: string
  }
}

export interface SignInInput {
  email?: string
  password?: string
}

export interface SignInResponse {
  signIn: {
    user: User
    accessToken: string
  }
}

export interface GetMeResponse {
  me: User
}

export interface SystemFile {
  id: string
  name: string
  data?: string
  size?: number
  type: string
}

export interface Folder {
  id: string
  path: {
    id: string
    name: string
  }[]
  name: string
  folders?: Folder[]
  systemFiles?: SystemFile[]
  size?: number
  type: string
}

export interface GetItemsInput {
  folderId: string
}

export interface GetItemsResponse {
  items: {
    folders: {
      id: string
      name: string
      type: string
    }[]
    systemFiles: {
      id: string
      name: string
      type: string
    }[]
  }
}

export interface RunCommandInput {
  command: string
  folderId: string
}

export interface RunCommandResponse {
  runCommand: {
    error: string
    result: string
    currentFolderId: string
  }
}
