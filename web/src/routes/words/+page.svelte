<script lang="ts">
	import { onMount } from 'svelte';
	import { isLoggedIn } from '../../stores/auth.store';
	import { goto } from '$app/navigation';
	import { words, error, loading, open } from '../../stores/word.store';
	import { deleteWord, getWords } from '$lib/word';
	import Word from './components/Word.svelte';
	import { Listgroup } from 'flowbite-svelte';
	import { Toast } from 'flowbite-svelte';
	import { FireSolid } from 'flowbite-svelte-icons';
	import { Spinner, Modal, Button } from 'flowbite-svelte';
	import Upsert from './components/Upsert.svelte';

	$: isModalOpen = $open !== null;

	onMount(async () => {
		if (!$isLoggedIn) goto('/');

		$error = null;
		$loading = true;

		if ($words.length === 0) $words = (await getWords()) ?? [];

		$loading = false;
	});

	async function onDelete(event: CustomEvent<string>): Promise<void> {
		const _id = event.detail;
		if (!_id) return;

		// const _res = await deleteWord(_id);
		// if (!_res) {
		// 	$error = 'an error occurred';
		// 	return;
		// }

		$words = $words.filter((word) => word.id !== _id);
	}

	async function onOpen(event: CustomEvent<string>): Promise<void> {
		const _id = event.detail;
		if (!_id) return;
		$open = _id;
	}
</script>

<div class="w-full bg-neutral-800 sm:p-4">
	<Listgroup
		active
		class="divide-y divide-gray-200 border-none bg-neutral-800 text-gray-300 dark:divide-gray-600"
	>
		{#each $words as word}
			<Word on:open={onOpen} on:delete={onDelete} {word}></Word>
		{/each}
		{#if $words.length === 0 && !$loading}
			<div class="p-4 text-center">no words found</div>
		{/if}
	</Listgroup>
	{#if $error}
		<Toast
			divClass="w-full max-w-xs p-4 text-white bg-primary-900 shadow gap-3"
			on:close={() => ($error = null)}
			position="bottom-right"
			color="red"
		>
			<FireSolid slot="icon" />
			<span>{$error}</span>
		</Toast>
	{/if}
	{#if $loading}
		<div class="flex h-32 items-center justify-center">
			<Spinner class="h-8 w-8 text-primary-500" />
		</div>
	{/if}
	<Modal title="Terms of Service" bind:open={isModalOpen} autoclose on:close={() => ($open = null)}>
		<Upsert>
			<svelte:fragment slot="footer">
				<Button on:click={() => alert('Handle "success"')}>I accept</Button>
				<Button color="alternative">Decline</Button>
			</svelte:fragment>
		</Upsert>
	</Modal>
</div>
