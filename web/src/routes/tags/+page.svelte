<script lang="ts">
	import { onMount } from 'svelte';
	import { isLoggedIn } from '../../stores/auth.store';
	import { goto } from '$app/navigation';
	import { isOutdated, tags } from '../../stores/tag.store';
	import Tag from './components/Tag.svelte';
	import { Button, Listgroup, Modal, Spinner, Toast } from 'flowbite-svelte';
	import { deleteTag, getTag, getTags } from '$lib/tag';
	import type { TagDto } from '$lib/tag/model';
	import { FireSolid, PenSolid, PlusSolid, UndoSolid } from 'flowbite-svelte-icons';
	import Open from './components/Open.svelte';

	const upsertBtnStyle =
		'border-primary-900 bg-neutral-800 text-primary-900 hover:border-primary-700 hover:bg-neutral-800 hover:text-primary-700 active:ring-0';
	let modalTitle = '';
	let isOpen = false;
	let selectedTag: TagDto | null = null;
	let isUpsertMode = false;
	let hasError: null | string = null;
	let isLoading = true;

	onMount(async () => {
		if (!$isLoggedIn) goto('/');

		if ($tags.length === 0 || $isOutdated) $tags = (await getTags()) ?? [];

		isLoading = false;
	});

	async function onDelete(event: CustomEvent<string>): Promise<void> {
		const _id = event.detail;
		if (!_id) return;

		const _res = await deleteTag(_id);
		if (!_res) {
			hasError = 'an error occurred';
			return;
		}

		$tags = $tags.filter((tag) => tag.id !== _id);
	}

	async function onOpen(event?: CustomEvent<string>): Promise<void> {
		isOpen = true;

		const _id = event?.detail;
		if (!_id) {
			isUpsertMode = true;
		} else {
			isLoading = true;
			hasError = null;

			const _tag = await getTag(_id);

			if (!_tag) {
				hasError = 'an error occurred';
				return;
			}

			isLoading = false;
			selectedTag = _tag;
		}
	}

	function onClose(): void {
		isOpen = false;
		selectedTag = null;
		isUpsertMode = false;
	}

	async function onCreate(): Promise<void> {
		$tags = (await getTags()) ?? [];
	}

	$: {
		if (!isUpsertMode) modalTitle = 'details';
		else modalTitle = selectedTag ? 'edit' : 'add';
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
		{#each $tags as tag (tag.id)}
			<Tag on:open={onOpen} on:delete={onDelete} {tag}></Tag>
		{/each}
		{#if $tags.length === 0 && !isLoading}
			<div class="p-4 text-center">no tags found</div>
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
		<Open tag={selectedTag} {isUpsertMode} on:create={onCreate}>
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
