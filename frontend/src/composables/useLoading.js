import { ref, provide, inject } from 'vue';

const loadingSymbol = Symbol('loading');

export function provideLoading() {
  const isLoading = ref(false);
  const loadingText = ref('Cargando...');

  const startLoading = (text = 'Cargando...') => {
    loadingText.value = text;
    isLoading.value = true;
  };

  const stopLoading = () => {
    isLoading.value = false;
  };

  const setLoadingText = (text) => {
    loadingText.value = text;
  };

  provide(loadingSymbol, {
    isLoading,
    loadingText,
    startLoading,
    stopLoading,
    setLoadingText
  });

  return {
    isLoading,
    loadingText,
    startLoading,
    stopLoading,
    setLoadingText
  };
}

export function useLoading() {
  const loading = inject(loadingSymbol);
  if (!loading) {
    throw new Error('useLoading() is used without provider.');
  }
  return loading;
}
