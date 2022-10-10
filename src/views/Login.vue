<script setup lang="ts">
import { reactive } from 'vue'
import { useUserStore } from '@/stores/user'

enum MODE {
  LOGIN = 'login',
  REGISTER = 'register',
  REQUEST_RESET_PASSWORD = 'request_reset_password',
  RESET_PASSWORD = 'reset_password'
}

const state: {
  currentMode: string
  loginEmail?: string
  loginPassword?: string
  registerEmail?: string
  registerPassword?: string
  registerConfirmPassword?: string
} = reactive({
  currentMode: MODE.LOGIN,
  loginEmail: undefined,
  loginPassword: undefined,
  registerEmail: undefined,
  registerPassword: undefined,
  registerConfirmPassword: undefined
})

const userStore = useUserStore()

const resetInputs = () => {
  state.loginEmail = undefined
  state.loginPassword = undefined
  state.registerEmail = undefined
  state.registerPassword = undefined
  state.registerConfirmPassword = undefined
}

const changeMode = (mode: MODE) => {
  if (state.currentMode === mode) return
  state.currentMode = mode
  resetInputs()
}

const onLogin = async () => {
  await userStore.signIn({
    email: state.loginEmail,
    password: state.loginPassword
  })
}

const onRegister = async () => {
  await userStore.register({
    email: state.registerEmail,
    password: state.registerPassword,
    passwordConfirmation: state.registerConfirmPassword
  })
}

const onEnterPressed = async () => {
  switch (state.currentMode) {
    case MODE.LOGIN:
      await onLogin()
      break
    case MODE.REGISTER:
      await onRegister()
      break
  }
}
</script>

<template>
  <div class="root" @keyup.enter="onEnterPressed">
    <div
      :class="['container', { active: state.currentMode === MODE.REGISTER }]"
    >
      <div class="card" />

      <!-- White card -->
      <div class="card">
        <!-- Login card -->
        <template v-if="state.currentMode === MODE.LOGIN">
          <h1 class="title">Login</h1>
          <div class="input-container">
            <input
              type="text"
              id="email"
              v-model="state.loginEmail"
              required
              autocomplete="nope"
            />
            <label for="email">Email</label>
            <div class="bar" />
          </div>
          <div class="input-container">
            <input
              type="password"
              id="password"
              v-model="state.loginPassword"
              required
              autocomplete="nope"
            />
            <label for="password"> Password </label>
            <div class="bar" />
          </div>
          <div class="button-container">
            <button @click="onLogin"><span>Login</span></button>
          </div>
        </template>
      </div>

      <!-- Black card -->
      <div class="card alt">
        <!-- Register card -->
        <template v-if="state.currentMode !== MODE.RESET_PASSWORD">
          <div
            class="toggle"
            role="button"
            @click="changeMode(MODE.REGISTER)"
          />
          <h1 class="title">
            Sign Up
            <div class="close" @click="changeMode(MODE.LOGIN)" />
          </h1>
          <div class="input-container">
            <input
              type="text"
              id="register-email"
              v-model="state.registerEmail"
              required
              autocomplete="nope"
            />
            <label for="register-email">Email</label>
            <div class="bar" />
          </div>
          <div class="input-container">
            <input
              type="password"
              id="register-password"
              v-model="state.registerPassword"
              required
              autocomplete="nope"
            />
            <label for="register-password">Password</label>
            <div class="bar" />
          </div>
          <div class="input-container">
            <input
              type="password"
              id="register-confirmPassword"
              v-model="state.registerConfirmPassword"
              required
              autocomplete="nope"
            />
            <label for="register-confirmPassword">Confirm Password</label>
            <div class="bar" />
          </div>
          <div class="button-container">
            <button @click="onRegister"><span>Confirm</span></button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.root {
  height: 100vh;
  flex: 1;
  margin: auto auto;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
}
/* Container */
.container {
  position: relative;
  max-width: 500px;
  width: 100%;
  margin: 0 auto 100px;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 30px 90px;

  &.active {
    .card {
      &:first-child,
      &:nth-child(2) {
        background: linear-gradient(
          to right bottom,
          rgba(255, 255, 255, 0.8),
          rgba(255, 255, 255, 0.1)
        );
      }

      &.alt {
        top: 20px;
        right: 0;
        width: 100%;
        min-width: 100%;
        height: auto;
        border-radius: 5px;
        padding: 60px 0 40px;
        overflow: hidden;
        min-height: 573px;

        .toggle {
          position: absolute;
          top: 40px;
          right: -70px;
          box-shadow: none;
          transform: scale(10);
          transition: transform 0.3s ease;

          &:before {
            content: '';
          }
        }

        .title,
        .input-container,
        .button-container {
          left: 0;
          opacity: 1;
          visibility: visible;
          transition: 0.3s ease;
        }

        .title {
          transition-delay: 0.3s;
        }

        .input-container {
          transition-delay: 0.4s;

          &:nth-child(2) {
            transition-delay: 0.5s;
          }

          &:nth-child(3) {
            transition-delay: 0.6s;
          }
        }

        .button-container {
          transition-delay: 0.7s;
        }
      }
    }
  }
}

/* Card */
.card {
  position: relative;
  background: linear-gradient(
    to right bottom,
    rgba(255, 255, 255, 0.8),
    rgba(255, 255, 255, 0.1)
  );
  border-radius: 5px;
  padding: 60px 0 40px 0;
  box-sizing: border-box;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:first-child {
    background: linear-gradient(
      to right bottom,
      rgba(255, 255, 255, 0.8),
      rgba(255, 255, 255, 0.1)
    );
    height: 10px;
    border-radius: 5px 5px 0 0;
    padding: 0;
  }

  &:nth-child(2) {
    min-height: 575px;
  }

  /* Title */
  .title {
    position: relative;
    z-index: 1;
    border-left: 5px solid var(--color-primary);
    margin: 0 0 35px;
    padding: 10px 0 10px 50px;
    color: var(--color-primary);
    font-size: 32px;
    font-weight: var(--font-weight-bold);
    text-transform: uppercase;

    .close {
      cursor: pointer;
      position: absolute;
      top: -10%;
      right: 60px;
      display: inline;
      color: var(--color-white);
      font-size: 58px;
      font-weight: 400;
      width: fit-content;

      &:before {
        content: '\00d7';
      }
    }
  }

  /* Inputs */
  .input-container {
    position: relative;
    margin: 0 60px 50px;

    input {
      outline: none;
      z-index: 1;
      position: relative;
      background: none;
      width: 100%;
      height: 60px;
      border: 0;
      color: #212121;
      font-size: 24px;
      font-weight: 400;

      &:focus {
        ~ label {
          color: var(--color-primary);
          transform: translate(-12%, -50%) scale(0.75);
        }

        ~ .bar {
          &:before,
          &:after {
            width: 50%;
          }
        }
      }

      &:valid {
        ~ label {
          color: var(--color-primary);
          transform: translate(-12%, -50%) scale(0.75);
        }
      }
    }

    label {
      position: absolute;
      top: 0;
      left: 0;
      color: var(--color-primary);
      font-size: 24px;
      font-weight: 300;
      line-height: 60px;
      transition: 0.2s ease;
    }

    .bar {
      position: absolute;
      left: 0;
      bottom: 0;
      background: var(--color-primary);
      width: 100%;
      height: 1px;

      &:before,
      &:after {
        content: '';
        position: absolute;
        background: var(--color-primary);
        width: 0;
        height: 2px;
        transition: 0.2s ease;
      }

      &:before {
        left: 50%;
      }

      &:after {
        right: 50%;
      }
    }
  }

  /* Button */
  .button-container {
    margin: 0 60px;
    text-align: center;

    button {
      outline: 0;
      cursor: pointer;
      position: relative;
      display: inline-block;
      background: 0;
      width: 240px;
      border: 2px solid var(--color-primary);
      padding: 20px 0;
      font-size: 24px;
      font-weight: var(--font-weight-bold);
      line-height: 1;
      text-transform: uppercase;
      overflow: hidden;
      transition: all 0.3 ease;

      &:hover {
        opacity: 0.7;
      }
    }
  }

  /* Footer */
  .footer {
    margin: 40px 0 0;
    color: #d3d3d3;
    font-size: 24px;
    font-weight: 300;
    text-align: center;

    a {
      color: var(--color-primary);
      text-decoration: none;
      transition: 0.3s ease;

      &:hover {
        opacity: 0.8;
      }
    }
  }

  /* Alt Card */
  &.alt {
    position: absolute;
    top: 40px;
    right: -70px;
    z-index: 10;
    width: 140px;
    height: 140px;
    background: none;
    border-radius: 100%;
    box-shadow: none;
    padding: 0;
    transition: 0.3s ease;

    /* Toggle */
    .toggle {
      position: relative;
      background: var(--color-primary);
      width: 140px;
      height: 140px;
      border-radius: 100%;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
      color: var(--color-white);
      font-size: 58px;
      line-height: 140px;
      text-align: center;
      cursor: pointer;

      &:before {
        content: '+';
        display: inline-block;
        font-size: inherit;
        text-rendering: auto;
        transform: translate(0, 0);
      }
    }

    .title,
    .input-container,
    .button-container {
      left: 100px;
      opacity: 0;
      visibility: hidden;
    }

    /* Title */
    .title {
      position: relative;
      border-color: var(--color-white);
      color: var(--color-white);

      .close {
        cursor: pointer;
        position: absolute;
        top: 0;
        right: 60px;
        display: inline;
        color: var(--color-white);
        font-size: 58px;
        font-weight: 400;

        &:before {
          content: '\00d7';
        }
      }
    }

    /* Input */
    .input-container {
      input {
        color: var(--color-white);

        &:focus {
          ~ label {
            color: var(--color-white);
          }

          ~ .bar {
            &:before,
            &:after {
              background: var(--color-white);
            }
          }
        }

        &:valid {
          ~ label {
            color: var(--color-white);
          }
        }
      }

      label {
        color: var(--color-white);
      }

      .bar {
        background: var(--color-white);
      }
    }

    /* Button */
    .button-container {
      button {
        width: 100%;
        background: var(--color-white);
        border-color: var(--color-white);
      }
    }
  }
}

/* Keyframes */
@keyframes buttonFadeInUp {
  0% {
    bottom: 30px;
    opacity: 0;
  }
}
</style>
