<template>
  <MainCardContent
    :title="$t('tenant.profile.tenantProfile')"
    :refresh-callback="loadTenantSettings"
  >
    <form @submit.prevent="handleSubmit(!v$.$invalid)">
      <ProgressSpinner v-if="loading" />
      <div v-else class="settings-form">
        <!-- Wallet Label -->
        <div class="field">
          <label for="walletLabel">{{ $t('profile.walletLabel') }}</label>
          <InputText
            id="walletLabel"
            v-model="v$.walletLabel.$model"
            class="w-full"
            :class="{ 'p-invalid': v$.walletLabel.$invalid && submitted }"
          />
          <span v-if="v$.walletLabel.$error && submitted">
            <span v-for="(error, index) of v$.walletLabel.$errors" :key="index">
              <small class="p-error">{{ error.$message }}</small>
            </span>
          </span>
        </div>

        <!-- Webhooks -->
        <div class="webhooks">
          <TransitionGroup appear name="wh">
            <div
              v-for="(webhook, index) of formFields.webhooks"
              :key="index"
              class="webhook"
            >
              <div class="field">
                <label for="webhookUrl">{{ $t('profile.webHookUrl') }}</label>
                <InputText
                  id="webhookUrl"
                  v-model="webhook.webhookUrl"
                  class="w-full"
                />
              </div>

              <div class="field">
                <label for="webhookKey">{{ $t('profile.webHookKey') }}</label>
                <Password
                  id="webhookKey"
                  v-model="webhook.webhookKey"
                  class="w-full"
                  toggle-mask
                  :feedback="false"
                />
              </div>

              <Button
                title="Delete this webhook"
                icon="pi pi-trash"
                text
                rounded
                @click="() => removeWebhook(index)"
              />

              <Button
                title="Add another webhook"
                class="add"
                icon="pi pi-plus-circle"
                text
                rounded
                @click="addWebhook"
              />
            </div>
          </TransitionGroup>
        </div>

        <Divider class="mt-2" />

        <!-- Image URL -->
        <div class="field">
          <label for="imageUrl">{{ $t('profile.imageUrl') }}</label>
          <InputText
            id="imageUrl"
            v-model="v$.imageUrl.$model"
            class="w-full"
            :class="{ 'p-invalid': v$.imageUrl.$invalid && submitted }"
          />
          <span v-if="v$.imageUrl.$error && submitted">
            <span v-for="(error, index) of v$.imageUrl.$errors" :key="index">
              <small class="p-error">{{ error.$message }}</small>
            </span>
          </span>
        </div>

        <!-- Extra Acapy Settings -->
        <Panel v-if="!hideAcapySettings" class="settings-group mb-5" toggleable>
          <template #header>
            <b>{{ $t('tenant.settings.extraSettings') }}</b>
          </template>
          <div class="field">
            <label for="ACAPY_ENDORSER_ROLE">
              {{ $t('tenant.settings.acapyEndorserRole') }}
              <i
                v-tooltip="$t('tenant.settings.acapyHelpEndorserRole')"
                class="pi pi-question-circle"
              />
            </label>
            <Dropdown
              v-model="v$.ACAPY_ENDORSER_ROLE.$model"
              :options="endorserRole"
              class="w-full"
            />
          </div>

          <div class="field">
            <label for="ACAPY_INVITE_PUBLIC">
              {{ $t('tenant.settings.acapyInvitePublic') }}
              <i
                v-tooltip="$t('tenant.settings.acapyHelpInvitePublic')"
                class="pi pi-question-circle"
              />
            </label>
            <InputSwitch
              id="ACAPY_INVITE_PUBLIC"
              v-model="v$.ACAPY_INVITE_PUBLIC.$model"
            />
          </div>

          <div class="field">
            <label for="ACAPY_LOG_LEVEL">
              {{ $t('tenant.settings.acapyLogLevel') }}
              <i
                v-tooltip="$t('tenant.settings.acapyHelpLogLevel')"
                class="pi pi-question-circle"
              />
            </label>
            <Dropdown
              v-model="v$.ACAPY_LOG_LEVEL.$model"
              :options="logLevels"
              class="w-full"
            />
          </div>

          <div class="field">
            <label for="ACAPY_MONITOR_PING">
              {{ $t('tenant.settings.acapyMonitorPing') }}
              <i
                v-tooltip="$t('tenant.settings.acapyHelpMonitorPing')"
                class="pi pi-question-circle"
              />
            </label>
            <InputSwitch
              id="ACAPY_MONITOR_PING"
              v-model="v$.ACAPY_MONITOR_PING.$model"
            />
          </div>

          <div class="field">
            <label for="ACAPY_NOTIFY_REVOCATION">
              {{ $t('tenant.settings.acapyNotifyRevocation') }}
              <i
                v-tooltip="$t('tenant.settings.acapyHelpNotifyRevocation')"
                class="pi pi-question-circle"
              />
            </label>
            <InputSwitch
              id="ACAPY_NOTIFY_REVOCATION"
              v-model="v$.ACAPY_NOTIFY_REVOCATION.$model"
            />
          </div>

          <div class="field">
            <label for="ACAPY_PUBLIC_INVITES">
              {{ $t('tenant.settings.acapyPublicInvites') }}
              <i
                v-tooltip="$t('tenant.settings.acapyHelpPublicInvites')"
                class="pi pi-question-circle"
              />
            </label>
            <InputSwitch
              id="ACAPY_PUBLIC_INVITES"
              v-model="v$.ACAPY_PUBLIC_INVITES.$model"
            />
          </div>

          <p>
            <strong>{{ $t('tenant.settings.auto') }}</strong>
          </p>

          <div class="field">
            <label for="ACAPY_AUTO_ACCEPT_INVITES">
              {{ $t('tenant.settings.acapyAutoAcceptInvites') }}
              <i
                v-tooltip="$t('tenant.settings.acapyHelpAutoAcceptInvites')"
                class="pi pi-question-circle"
              />
            </label>
            <InputSwitch
              id="ACAPY_AUTO_ACCEPT_INVITES"
              v-model="v$.ACAPY_AUTO_ACCEPT_INVITES.$model"
            />
          </div>

          <div class="field">
            <label for="ACAPY_AUTO_ACCEPT_REQUESTS">
              {{ $t('tenant.settings.acapyAutoAcceptRequests') }}
              <i
                v-tooltip="$t('tenant.settings.acapyHelpAutoAcceptRequests')"
                class="pi pi-question-circle"
              />
            </label>
            <InputSwitch
              id="ACAPY_AUTO_ACCEPT_REQUESTS"
              v-model="v$.ACAPY_AUTO_ACCEPT_REQUESTS.$model"
            />
          </div>

          <div class="field">
            <label for="ACAPY_AUTO_PING_CONNECTION">
              {{ $t('tenant.settings.acapyAutoPingConnection') }}
              <i
                v-tooltip="$t('tenant.settings.acapyHelpAutoPingConnection')"
                class="pi pi-question-circle"
              />
            </label>
            <InputSwitch
              id="ACAPY_AUTO_PING_CONNECTION"
              v-model="v$.ACAPY_AUTO_PING_CONNECTION.$model"
            />
          </div>

          <div class="field">
            <label for="ACAPY_AUTO_REQUEST_ENDORSEMENT">
              {{ $t('tenant.settings.acapyAutoRequestEndorsement') }}
              <i
                v-tooltip="
                  $t('tenant.settings.acapyHelpAutoRequestEndorsement')
                "
                class="pi pi-question-circle"
              />
            </label>
            <InputSwitch
              id=" ACAPY_AUTO_REQUEST_ENDORSEMENT "
              v-model="v$.ACAPY_AUTO_REQUEST_ENDORSEMENT.$model"
            />
          </div>

          <div class="field">
            <label for="ACAPY_AUTO_RESPOND_CREDENTIAL_OFFER">
              {{ $t('tenant.settings.acapyAutoRespondCredentialOffer') }}
              <i
                v-tooltip="
                  $t('tenant.settings.acapyHelpAutoRespondCredentialOffer')
                "
                class="pi pi-question-circle"
              />
            </label>
            <InputSwitch
              id="ACAPY_AUTO_RESPOND_CREDENTIAL_OFFER"
              v-model="v$.ACAPY_AUTO_RESPOND_CREDENTIAL_OFFER.$model"
            />
          </div>

          <div class="field">
            <label for="ACAPY_AUTO_RESPOND_CREDENTIAL_REQUEST">
              {{ $t('tenant.settings.acapyAutoRespondCredentialRequest') }}
              <i
                v-tooltip="
                  $t('tenant.settings.acapyHelpAutoRespondCredentialRequest')
                "
                class="pi pi-question-circle"
              />
            </label>
            <InputSwitch
              id="ACAPY_AUTO_RESPOND_CREDENTIAL_REQUEST"
              v-model="v$.ACAPY_AUTO_RESPOND_CREDENTIAL_REQUEST.$model"
            />
          </div>

          <div class="field">
            <label for="ACAPY_AUTO_RESPOND_MESSAGES">
              {{ $t('tenant.settings.acapyAutoRespondMessages') }}
              <i
                v-tooltip="$t('tenant.settings.acapyHelpAutoRespondMessages')"
                class="pi pi-question-circle"
              />
            </label>
            <InputSwitch
              id="ACAPY_AUTO_RESPOND_MESSAGES"
              v-model="v$.ACAPY_AUTO_RESPOND_MESSAGES.$model"
            />
          </div>

          <div class="field">
            <label for="ACAPY_AUTO_WRITE_TRANSACTIONS">
              {{ $t('tenant.settings.acapyAutoWriteTransactions') }}
              <i
                v-tooltip="$t('tenant.settings.acapyHelpAutoWriteTransactions')"
                class="pi pi-question-circle"
              />
            </label>
            <InputSwitch
              id=" ACAPY_AUTO_WRITE_TRANSACTIONS "
              v-model="v$.ACAPY_AUTO_WRITE_TRANSACTIONS.$model"
            />
          </div>

          <div class="field">
            <label for="ACAPY_AUTO_VERIFY_PRESENTATION">
              {{ $t('tenant.settings.acapyAutoVerifyPresentation') }}
              <i
                v-tooltip="
                  $t('tenant.settings.acapyHelpAutoVerifyPresentation')
                "
                class="pi pi-question-circle"
              />
            </label>
            <InputSwitch
              id="ACAPY_AUTO_VERIFY_PRESENTATION"
              v-model="v$.ACAPY_AUTO_VERIFY_PRESENTATION.$model"
            />
          </div>
        </Panel>

        <div>
          <Accordion>
            <AccordionTab header="Tenant Wallet Details">
              <vue-json-pretty :data="tenantWallet" />
            </AccordionTab>
          </Accordion>
        </div>
        <Button
          class="mt-6 mb-3"
          :disabled="loading"
          :loading="loading"
          label="Save Changes"
          type="submit"
        />
      </div>
    </form>
  </MainCardContent>
</template>

<script setup lang="ts">
// Vue
import { onMounted, reactive, ref, TransitionGroup } from 'vue';
// PrimeVue/Validation
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import Dropdown from 'primevue/dropdown';
import InputSwitch from 'primevue/inputswitch';
import InputText from 'primevue/inputtext';
import Panel from 'primevue/panel';
import Password from 'primevue/password';
import ProgressSpinner from 'primevue/progressspinner';
import VueJsonPretty from 'vue-json-pretty';
import { useToast } from 'vue-toastification';
import { required, url } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
// State/etc
import { storeToRefs } from 'pinia';
import { useTenantStore } from '@/store';
// Components
import MainCardContent from '@/components/layout/mainCard/MainCardContent.vue';

const toast = useToast();

// State setup
const tenantStore = useTenantStore();
const { tenantWallet, loading } = storeToRefs(useTenantStore());

// Get Tenant Configuration
const loadTenantSettings = async () => {
  await tenantStore
    .getTenantSubWallet()
    .then(() => {
      // set the local form settings (don't bind controls directly to state for this)
      formFields.walletLabel = tenantWallet.value.settings.default_label;
      formFields.imageUrl = tenantWallet.value.settings.image_url;

      const webHookUrls = tenantWallet.value.settings['wallet.webhook_urls'];

      // Clear the webhook array if necessary
      if (formFields.webhooks.length > 0) {
        formFields.webhooks = [];
      }

      if (webHookUrls && webHookUrls.length) {
        webHookUrls.forEach((whItem: string) => {
          if (!whItem.match(/#/g)) {
            // If there is no token just add the url
            formFields.webhooks.push({
              webhookUrl: whItem,
              webhookKey: '',
            });
          } else {
            // Otherwise split the url and token
            const webhookUrl = whItem.substring(0, whItem.indexOf('#'));
            const webhookKey = whItem.substring(whItem.indexOf('#') + 1);
            formFields.webhooks.push({
              webhookUrl,
              webhookKey,
            });
          }
        });
      }

      // If there are no webhooks, add a blank one
      if (formFields.webhooks.length === 0) {
        formFields.webhooks.push({ webhookUrl: '', webhookKey: '' });
      }
    })
    .catch((err: any) => {
      console.error(err);
      toast.error(`Failure: ${err}`);
    });
};
onMounted(async () => {
  loadTenantSettings();
});

// Hide out the acapy settings until they are implemented
const hideAcapySettings = ref(true);

// Dropdown values
const endorserRole = ref(['author', 'endorser', 'none']);
const logLevels = ref(['debug', 'info', 'warning', 'error', 'critical']);

// Form Fields and Validation
const formFields = reactive({
  webhooks: [{ webhookUrl: '', webhookKey: '' }],
  walletLabel: '',
  imageUrl: '',
  ACAPY_AUTO_ACCEPT_INVITES: false,
  ACAPY_AUTO_ACCEPT_REQUESTS: false,
  ACAPY_AUTO_PING_CONNECTION: false,
  ACAPY_AUTO_REQUEST_ENDORSEMENT: false,
  ACAPY_AUTO_RESPOND_CREDENTIAL_OFFER: false,
  ACAPY_AUTO_RESPOND_CREDENTIAL_REQUEST: false,
  ACAPY_AUTO_RESPOND_MESSAGES: false,
  ACAPY_AUTO_VERIFY_PRESENTATION: false,
  ACAPY_AUTO_WRITE_TRANSACTIONS: false,
  ACAPY_CREATE_REVOCATION_TRANSACTIONS: false,
  ACAPY_ENDORSER_ROLE: 'author',
  ACAPY_INVITE_PUBLIC: false,
  ACAPY_LOG_LEVEL: 'info',
  ACAPY_MONITOR_PING: false,
  ACAPY_NOTIFY_REVOCATION: false,
  ACAPY_PUBLIC_INVITES: false,
});
const rules = {
  webhooks: {
    $each: {
      webhookKey: {},
      webhookUrl: { url },
    },
  },
  ACAPY_AUTO_ACCEPT_INVITES: {},
  ACAPY_AUTO_ACCEPT_REQUESTS: {},
  ACAPY_AUTO_PING_CONNECTION: {},
  ACAPY_AUTO_REQUEST_ENDORSEMENT: {},
  ACAPY_AUTO_RESPOND_CREDENTIAL_OFFER: {},
  ACAPY_AUTO_RESPOND_CREDENTIAL_REQUEST: {},
  ACAPY_AUTO_RESPOND_MESSAGES: {},
  ACAPY_AUTO_VERIFY_PRESENTATION: {},
  ACAPY_AUTO_WRITE_TRANSACTIONS: {},
  ACAPY_CREATE_REVOCATION_TRANSACTIONS: {},
  ACAPY_ENDORSER_ROLE: {},
  ACAPY_INVITE_PUBLIC: {},
  ACAPY_LOG_LEVEL: {},
  ACAPY_MONITOR_PING: {},
  ACAPY_NOTIFY_REVOCATION: {},
  ACAPY_PUBLIC_INVITES: {},
  walletLabel: { required },
  imageUrl: { url },
};
const v$ = useVuelidate(rules, formFields);

/**
 * Add a blank webhook entry
 */
const addWebhook = () => {
  formFields.webhooks.push({ webhookUrl: '', webhookKey: '' });
};

/**
 * Remove a webhook but don't allow the last one to be removed.
 * Just blank it out.
 */
const removeWebhook = (index: number) => {
  console.log('delete webhook', formFields.webhooks[index]);
  formFields.webhooks.splice(index, 1);

  // If this is the last entry in the array, add a new blank one.
  if (formFields.webhooks.length === 0) addWebhook();
};

// Submitting form
const submitted = ref(false);
const handleSubmit = async (isFormValid: boolean) => {
  submitted.value = true;

  if (!isFormValid) {
    return;
  }

  try {
    const webhooks: Array<string> = [];
    if (formFields.webhooks && formFields.webhooks.length) {
      formFields.webhooks.forEach((whItem: any) => {
        let url = whItem.webhookUrl;

        // If there is a token, add it to the url
        if (whItem.webhookKey) {
          url += `#${whItem.webhookKey}`;
        }

        // Don't add blank webhooks
        if (url.length > 0) {
          webhooks.push(url);
        }
      });
    }

    // const extraSettings = {
    //   ACAPY_AUTO_ACCEPT_INVITES: formFields.ACAPY_AUTO_ACCEPT_INVITES,
    //   ACAPY_AUTO_ACCEPT_REQUESTS: formFields.ACAPY_AUTO_ACCEPT_REQUESTS,
    //   ACAPY_AUTO_PING_CONNECTION: formFields.ACAPY_AUTO_PING_CONNECTION,
    //   ACAPY_AUTO_REQUEST_ENDORSEMENT: formFields.ACAPY_AUTO_REQUEST_ENDORSEMENT,
    //   ACAPY_AUTO_RESPOND_CREDENTIAL_OFFER:
    //     formFields.ACAPY_AUTO_RESPOND_CREDENTIAL_OFFER,
    //   ACAPY_AUTO_RESPOND_CREDENTIAL_REQUEST:
    //     formFields.ACAPY_AUTO_RESPOND_CREDENTIAL_REQUEST,
    //   ACAPY_AUTO_RESPOND_MESSAGES: formFields.ACAPY_AUTO_RESPOND_MESSAGES,
    //   ACAPY_AUTO_VERIFY_PRESENTATION: formFields.ACAPY_AUTO_VERIFY_PRESENTATION,
    //   ACAPY_AUTO_WRITE_TRANSACTIONS: formFields.ACAPY_AUTO_WRITE_TRANSACTIONS,
    //   ACAPY_CREATE_REVOCATION_TRANSACTIONS:
    //     formFields.ACAPY_CREATE_REVOCATION_TRANSACTIONS,
    //   ACAPY_ENDORSER_ROLE: formFields.ACAPY_ENDORSER_ROLE,
    //   ACAPY_INVITE_PUBLIC: formFields.ACAPY_INVITE_PUBLIC,
    //   ACAPY_LOG_LEVEL: formFields.ACAPY_LOG_LEVEL,
    //   ACAPY_MONITOR_PING: formFields.ACAPY_MONITOR_PING,
    //   ACAPY_NOTIFY_REVOCATION: formFields.ACAPY_NOTIFY_REVOCATION,
    //   ACAPY_PUBLIC_INVITE: formFields.ACAPY_PUBLIC_INVITES,
    // };

    // alert(`
    // "Extra settings", will be added to payload in save call when implemented in acapy.
    // (this to be commented out before merge)
    // ${JSON.stringify(extraSettings, undefined, 2)}
    // `);

    const payload = {
      image_url: formFields.imageUrl,
      label: formFields.walletLabel,
      wallet_webhook_urls: webhooks,
    };
    // if (!hideAcapySettings) {
    //   payload.extra_settings = extraSettings;
    // }

    await tenantStore.updateTenantSubWallet(payload);
    loadTenantSettings();
    toast.success('Your Settings have been Updated');
  } catch (error) {
    toast.error(`Failure: ${error}`);
  } finally {
    submitted.value = false;
  }
};
</script>

<style scoped lang="scss">
hr {
  height: 1px;
  background-color: rgb(186, 186, 186);
  border: 0;
}
.settings-form {
  width: 40rem !important;
}
.settings-group {
  :deep(.p-panel-header) {
    border-radius: 0;
    border-top: none;
    border-left: none;
    border-right: none;
    background-color: transparent;
  }
}
.webhook {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .field {
    width: 41%;
  }
  :deep(button) {
    margin-top: 20px;
  }
  :deep(button .p-button-icon) {
    font-size: 30px !important;
  }
  button.add {
    visibility: hidden;
  }
}
/* Show the add button on the last webhook */
.webhooks div:last-of-type {
  button.add {
    visibility: visible;
  }
}
.wh-enter-active,
.wh-leave-active {
  transition: opacity 0.5s ease;
}
.wh-enter-from,
.wh-leave-to {
  opacity: 0;
}
</style>
