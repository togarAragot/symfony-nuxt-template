<script setup lang="ts">
const protectedFetch = useProtectedFetch();
const { data: testData, pending: testPending } = await useApi<{message: string}>('/test', {
    lazy: true,
});

const pong = ref<string|null>(null);
const pongInput = ref<string>('');

async function onSubmit() {
    const res = await protectedFetch<{ pong: string }>('/ping', {
        method: 'POST',
        body: { message: pongInput.value },
    });
    pong.value = res.pong;
}

</script>

<template>
    <h1>Nuxt loaded this page</h1>
    <div v-if="testPending">Loading test...</div>
    <div v-else-if="testData">Symfony responded with {{ testData.message }}</div>
    <div v-else>Received invalid response from Symfony</div>

    <div>Current Pong Value: {{ pong }}</div>
    
    <form @submit.prevent="onSubmit">
        <input type="text" v-model="pongInput" placeholder="Symfony responds with this">
        <button type="submit">Submit</button>
    </form>
</template>