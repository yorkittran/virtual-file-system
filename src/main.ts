import App from './App.vue'
import router from './router'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { DefaultApolloClient } from '@vue/apollo-composable'
import { apolloClient } from './service/apolloClient'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faFolder, faFileLines, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'

library.add(faFolder, faFileLines, faRightFromBracket)

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)
app.provide(DefaultApolloClient, apolloClient)

app.mount('#app')
