import { defineStore } from 'pinia';

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    isLoading: false,
    loadingText: 'Cargando...'
  }),
  
  actions: {
    startLoading(text = 'Cargando...') {
      this.isLoading = true;
      this.loadingText = text;
    },
    
    stopLoading() {
      this.isLoading = false;
    },
    
    setLoadingText(text) {
      this.loadingText = text;
    }
  }
});
