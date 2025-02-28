<template>
  <div class="traction-login grid w-screen h-screen">
    <div class="col-12 md:col-6 xl:col-4">
      <div class="px-8">
        <div class="pt-4 pb-6">
          <img src="/img/bc/bc_logo.png" class="logo-bc" />

          <img
            src="/img/logo/traction-logo-bc-text.svg"
            class="logo-traction"
          />
        </div>

        <!-- Logging In -->
        <div v-if="loginMode === LOGIN_MODE.SIGNIN" class="py-6">
          <LoginForm />
          <div
            v-if="config.frontend.showOIDCReservationLogin"
            class="oidc-login"
          >
            <div v-if="!user" class="oidc-choice">
              <hr />
              <span class="mb-0">{{ $t('admin.orRequestAccessWith') }}</span>
              <LoginOIDC class="mt-0" />
            </div>
          </div>

          <div
            v-if="
              (config.frontend.showOIDCReservationLogin && user) ||
              !config.frontend.showOIDCReservationLogin
            "
            class="mt-6"
          >
            <p>
              {{ $t('login.noAccount') }}
              <a
                href="#"
                class="p-button-link login-mode"
                @click.prevent="loginMode = LOGIN_MODE.RESERVE"
                >{{ $t('login.createRequest') }}</a
              >
            </p>

            <p>
              {{ $t('login.submittedRequest') }}
              <a
                href="#"
                class="p-button-link login-mode"
                @click.prevent="loginMode = LOGIN_MODE.STATUS"
                >{{ $t('login.checkStatus') }}</a
              >
            </p>
          </div>
        </div>

        <!-- Making Reservation -->
        <div v-else-if="loginMode === LOGIN_MODE.RESERVE" class="py-6">
          <Button
            :label="$t('login.backToSignIn')"
            icon="pi pi-arrow-left"
            class="p-button-text"
            @click="goBack($event)"
          />
          <Reserve />
        </div>

        <!-- Checking Status -->
        <div v-else-if="loginMode === LOGIN_MODE.STATUS" class="py-6">
          <Button
            :label="$t('login.backToSignIn')"
            icon="pi pi-arrow-left"
            class="p-button-text"
            @click="goBack($event)"
          />
          <Status />
        </div>
      </div>
    </div>

    <div class="cover-image hidden md:block col-0 md:col-6 xl:col-8 p-0">
      <span v-if="config.frontend.ux.coverImageCopyright" class="copyright">
        {{ config.frontend.ux.coverImageCopyright }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginOIDC from '@/components/oidc/LoginOIDC.vue';

// Vue
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// PrimeVue
import Button from 'primevue/button';
import { useConfirm } from 'primevue/useconfirm';
// Components
import LoginForm from '@/components/LoginForm.vue';
import Reserve from './reservation/Reserve.vue';
import Status from './reservation/Status.vue';
// State
import { storeToRefs } from 'pinia';
import { useConfigStore } from '@/store';
import { useReservationStore } from '@/store';
import { useOIDCStore } from '@/store';

import { RESERVATION_STATUSES } from '@/helpers/constants';

const reservationStore = useReservationStore();
const { config } = storeToRefs(useConfigStore());
const { status } = storeToRefs(useReservationStore());
const { user } = storeToRefs(useOIDCStore());

const route = useRoute();
const router = useRouter();

const confirm = useConfirm();

// Other login form swtiching
enum LOGIN_MODE {
  SIGNIN,
  RESERVE,
  STATUS,
}
const loginMode = ref(LOGIN_MODE.SIGNIN);
if (route.name === 'TenantUiReservationStatus') {
  loginMode.value = LOGIN_MODE.STATUS;
}

const goBack = (event: any) => {
  if (status.value === RESERVATION_STATUSES.SHOW_WALLET) {
    confirm.require({
      target: event.currentTarget,
      message:
        'Are you sure you want to leave this page? You will not be able to retrieve these details again.',
      header: 'Have you saved your Wallet ID and Key Somewhere?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        doGoBack();
      },
    });
  } else {
    doGoBack();
  }
};
const doGoBack = () => {
  loginMode.value = LOGIN_MODE.SIGNIN;
  reservationStore.resetState();
  router.push('/');
};
</script>

<style scoped lang="scss">
// See layout.scss for generalized common login layout stuff
// Set the image specific to this component here though
.cover-image {
  background-image: url('/img/default-login-image.jpg');
}
</style>
