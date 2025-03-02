// Types
import { V10PresentationSendRequestRequest } from '@/types/acapyApi/acapyInterface';

import { useAcapyApi } from './acapyApi';
import { API_PATH } from '@/helpers/constants';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { fetchItem } from './utils/fetchItem';
import { fetchList } from './utils/fetchList';

export const useVerifierStore = defineStore('verifier', () => {
  const acapyApi = useAcapyApi();

  // state
  const presentations: any = ref(null);
  const selectedPresentation: any = ref(null);
  const loading: any = ref(false);
  const error: any = ref(null);

  // getters

  // actions

  async function listPresentations() {
    selectedPresentation.value = null;
    return fetchList(
      API_PATH.PRESENT_PROOF_RECORDS,
      presentations,
      error,
      loading
    );
  }

  async function getPresentation(id: string, params: any = {}) {
    const getloading: any = ref(false);
    return fetchItem(
      API_PATH.VERIFIER_PRESENTATIONS,
      id,
      error,
      getloading,
      params
    );
  }

  async function deleteRecord(id: string) {
    loading.value = true;
    try {
      await acapyApi.deleteHttp(API_PATH.PRESENT_PROOF_RECORD(id));
      listPresentations();
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
    if (error.value != null) {
      // throw error so $onAction.onError listeners can add their own handler
      throw error.value;
    }
  }

  async function sendPresentationRequest(
    payload: V10PresentationSendRequestRequest
  ) {
    loading.value = true;
    error.value = null;

    let result = null;
    try {
      result = await acapyApi.postHttp(
        API_PATH.PRESENT_PROOF_SEND_REQUEST,
        payload
      );
      listPresentations();
    } catch (err) {
      console.log(err);
      error.value = err;
    } finally {
      loading.value = false;
    }

    if (error.value != null) {
      throw error.value;
    }
    return result;
  }

  return {
    presentations,
    selectedPresentation,
    loading,
    error,
    listPresentations,
    getPresentation,
    deleteRecord,
    sendPresentationRequest,
  };
});

export default {
  useVerifierStore,
};
