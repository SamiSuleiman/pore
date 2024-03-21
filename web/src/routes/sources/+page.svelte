<script lang="ts">
	import { onMount } from 'svelte';
	import { isLoggedIn } from '../../stores/auth.store';
	import { goto } from '$app/navigation';
	import { sources } from '../../stores/source.store';
	import Source from './components/Source.svelte';
	import { Button, Listgroup, Modal, Spinner, Toast } from 'flowbite-svelte';
	import { deleteSource, getSource, getSources } from '$lib/source';
	import type { SourceDto } from '$lib/source/model';
	import { isOutdated } from '../../stores/source.store';
	import { FireSolid, PenSolid, PlusSolid, UndoSolid } from 'flowbite-svelte-icons';
	import Open from './components/Open.svelte';

	const upsertBtnStyle =
		'border-primary-900 bg-neutral-800 text-primary-900 hover:border-primary-700 hover:bg-neutral-800 hover:text-primary-700 active:ring-0';
	let modalTitle = '';
	let isOpen = false;
	let selectedSource: SourceDto | null = null;
	let isUpsertMode = false;
	let hasError: null | string = null;
	let isLoading = true;

	onMount(async () => {
		if (!$isLoggedIn) goto('/');

		if ($sources.length === 0 || $isOutdated) $sources = (await getSources()) ?? [];

		isLoading = false;
	});

	async function onDelete(event: CustomEvent<string>): Promise<void> {
		const _id = event.detail;
		if (!_id) return;

		const _res = await deleteSource(_id);
		if (!_res) {
			hasError = 'an error occurred';
			return;
		}

		$sources = $sources.filter((source) => source.id !== _id);
	}

	async function onOpen(event?: CustomEvent<string>): Promise<void> {
		isOpen = true;

		const _id = event?.detail;
		if (!_id) {
			isUpsertMode = true;
		} else {
			isLoading = true;
			hasError = null;

			const _source = await getSource(_id);

			if (!_source) {
				hasError = 'an error occurred';
				return;
			}

			isLoading = false;
			selectedSource = _source;
		}
	}

	function onClose(): void {
		isOpen = false;
		selectedSource = null;
		isUpsertMode = false;
	}

	async function onCreate(): Promise<void> {
		$sources = (await getSources()) ?? [];
	}

	$: {
		if (!isUpsertMode) modalTitle = 'details';
		else modalTitle = selectedSource ? 'edit' : 'add';
	}
</script>

<div class="flex w-full flex-col bg-neutral-800 sm:p-4">
	<Button
		on:click={() => onOpen()}
		color="none"
		class="text-primary-900 ring-neutral-800 hover:text-primary-700"
	>
		<PlusSolid></PlusSolid>
	</Button>
	<Listgroup
		active
		class="divide-y divide-gray-200 border-none bg-neutral-800 text-gray-300 dark:divide-gray-600"
	>
		{#each $sources as source (source.id)}
			<Source on:open={onOpen} on:delete={onDelete} {source}></Source>
		{/each}
		{#if $sources.length === 0 && !isLoading}
			<div class="p-4 text-center">no sources found</div>
		{/if}
	</Listgroup>
	{#if hasError}
		<Toast
			class="z-50"
			divClass="w-full max-w-xs p-4 text-white bg-primary-900 shadow gap-3"
			on:close={() => (hasError = null)}
			position="bottom-right"
			color="red"
		>
			<FireSolid slot="icon" />
			<span>{hasError}</span>
		</Toast>
	{/if}
	{#if isLoading}
		<div class="flex h-32 items-center justify-center">
			<Spinner class="h-8 w-8 text-primary-500" />
		</div>
	{/if}
	<Modal
		color="none"
		defaultClass="max-h-full bg-neutral-800 text-white relative flex flex-col mx-auto"
		title={modalTitle}
		bind:open={isOpen}
		on:close={onClose}
	>
		<Open source={selectedSource} {isUpsertMode} on:create={onCreate}>
			<svelte:fragment slot="upsertMode">
				<Button size="sm" on:click={() => (isUpsertMode = false)} outline class={upsertBtnStyle}>
					<UndoSolid size="sm"></UndoSolid>
				</Button>
			</svelte:fragment>
			<svelte:fragment slot="detailMode">
				<Button size="sm" on:click={() => (isUpsertMode = true)} outline class={upsertBtnStyle}>
					<PenSolid size="sm"></PenSolid>
				</Button>
			</svelte:fragment>
		</Open>
	</Modal>
</div>
