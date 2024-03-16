<script lang="ts">
	import { onMount } from 'svelte';
	import { isLoggedIn } from '../../stores/auth.store';
	import { goto } from '$app/navigation';
	import {
		words,
		hasError,
		isLoading,
		isOpen,
		selectedWord,
		isUpsertMode,
	} from '../../stores/word.store';
	import { deleteWord, getWord, getWords } from '$lib/word';
	import Word from './components/Word.svelte';
	import { Listgroup } from 'flowbite-svelte';
	import { Toast } from 'flowbite-svelte';
	import { FireSolid, PenSolid } from 'flowbite-svelte-icons';
	import { Spinner, Modal, Button } from 'flowbite-svelte';
	import Upsert from './components/Upsert.svelte';

	let modalTitle = '';

	onMount(async () => {
		if (!$isLoggedIn) goto('/');

		$hasError = null;
		$isLoading = true;

		if ($words.length === 0) $words = (await getWords()) ?? [];

		$isLoading = false;
	});

	async function onDelete(event: CustomEvent<string>): Promise<void> {
		const _id = event.detail;
		if (!_id) return;

		const _res = await deleteWord(_id);
		if (!_res) {
			$hasError = 'an error occurred';
			return;
		}

		$words = $words.filter((word) => word.id !== _id);
	}

	async function onOpen(event: CustomEvent<string>): Promise<void> {
		$isOpen = true;

		const _id = event.detail;
		if (!_id) {
			// here is for adding a new word
		} else {
			$isLoading = true;
			$hasError = null;

			const _word = await getWord(_id);

			if (!_word) {
				$hasError = 'an error occurred';
				return;
			}

			$isLoading = false;
			$selectedWord = _word;
		}
	}

	function onEdit(): void {
		$isUpsertMode = true;
	}

	function onClose(): void {
		$isOpen = false;
		$selectedWord = null;
		$isUpsertMode = false;
	}

	$: {
		if (!$isUpsertMode) modalTitle = 'details';
		else modalTitle = $selectedWord ? 'edit' : 'add';
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
		{#if $words.length === 0 && !$isLoading}
			<div class="p-4 text-center">no words found</div>
		{/if}
	</Listgroup>
	{#if $hasError}
		<Toast
			divClass="w-full max-w-xs p-4 text-white bg-primary-900 shadow gap-3"
			on:close={() => ($hasError = null)}
			position="bottom-right"
			color="red"
		>
			<FireSolid slot="icon" />
			<span>{$hasError}</span>
		</Toast>
	{/if}
	{#if $isLoading}
		<div class="flex h-32 items-center justify-center">
			<Spinner class="h-8 w-8 text-primary-500" />
		</div>
	{/if}
	<Modal
		color="none"
		defaultClass="bg-neutral-800 text-white relative flex flex-col mx-auto"
		title={modalTitle}
		bind:open={$isOpen}
		on:close={onClose}
	>
		<Upsert word={$selectedWord}>
			<svelte:fragment slot="footer">
				<Button size="sm" on:click={onEdit}>
					<PenSolid size="sm"></PenSolid>
				</Button>
			</svelte:fragment>
		</Upsert>
	</Modal>
</div>
