<script lang="ts">
	import { onMount } from 'svelte';
	import { isLoggedIn } from '../../stores/auth.store';
	import { goto } from '$app/navigation';
	import { links } from '../../stores/link.store';
	import Link from './components/Link.svelte';
	import { Button, Listgroup, Modal, Spinner, Toast } from 'flowbite-svelte';
	import { deleteLink, getLink, getLinks } from '$lib/link';
	import type { LinkDto } from '$lib/link/model';
	import { isOutdated } from '../../stores/link.store';
	import { FireSolid, PenSolid, PlusSolid, UndoSolid } from 'flowbite-svelte-icons';
	import Open from './components/Open.svelte';

	const upsertBtnStyle =
		'border-primary-900 bg-neutral-800 text-primary-900 hover:border-primary-700 hover:bg-neutral-800 hover:text-primary-700 active:ring-0';
	let modalTitle = '';
	let isOpen = false;
	let selectedLink: LinkDto | null = null;
	let isUpsertMode = false;
	let hasError: null | string = null;
	let isLoading = true;

	onMount(async () => {
		if (!$isLoggedIn) goto('/');

		if ($links.items.length === 0 || $isOutdated)
			$links = (await getLinks()) ?? { items: [], count: 0 };

		isLoading = false;
	});

	async function onDelete(event: CustomEvent<string>): Promise<void> {
		const _id = event.detail;
		if (!_id) return;

		const _res = await deleteLink(_id);
		if (!_res) {
			hasError = 'an error occurred';
			return;
		}

		$links = {
			items: $links.items.filter((l) => l.id !== _id),
			count: $links.count - 1,
		};
	}

	async function onOpen(event?: CustomEvent<string>): Promise<void> {
		isOpen = true;

		const _id = event?.detail;
		if (!_id) {
			isUpsertMode = true;
		} else {
			isLoading = true;
			hasError = null;

			const _link = await getLink(_id);

			if (!_link) {
				hasError = 'an error occurred';
				return;
			}

			isLoading = false;
			selectedLink = _link;
		}
	}

	function onClose(): void {
		isOpen = false;
		selectedLink = null;
		isUpsertMode = false;
	}

	async function onCreate(): Promise<void> {
		$links = (await getLinks()) ?? {
			items: [],
			count: 0,
		};
	}

	$: {
		if (!isUpsertMode) modalTitle = 'details';
		else modalTitle = selectedLink ? 'edit' : 'add';
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
		{#each $links.items as link (link.id)}
			<Link on:open={onOpen} on:delete={onDelete} {link}></Link>
		{/each}
		{#if $links.count === 0 && !isLoading}
			<div class="p-4 text-center">no links found</div>
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
		<Open link={selectedLink} {isUpsertMode} on:create={onCreate}>
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
