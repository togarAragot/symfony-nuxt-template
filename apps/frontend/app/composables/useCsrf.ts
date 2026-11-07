import type CsrfToken from "~/types/csrf-token";

export const useCsrf = () => {
    const state = useState<CsrfToken | null>('csrf-token', () => null);

    const isValid = computed(() => {
        return state?.value && Date.now() < state.value.expiresAt;
    });

    return {
        state,
        isValid,
    }
};