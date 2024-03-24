<script lang="ts">
	import { onMount } from 'svelte';
	import { isLoggedIn } from '../../stores/auth.store';
	import { goto } from '$app/navigation';
	import Tag from './components/Tag.svelte';
	import { Button, Listgroup, Modal, Pagination, Spinner, Toast } from 'flowbite-svelte';
	import { deleteTag, getTag, getTags } from '$lib/tag';
	import type { TagDto, TagPreviewDto } from '$lib/tag/model';
	import { FireSolid, PenSolid, PlusSolid, UndoSolid } from 'flowbite-svelte-icons';
	import Open from './components/Open.svelte';
	import type { List } from '$lib/models';
	import { getPages } from '../shared/pager';

	const upsertBtnStyle =
		'border-primary-900 bg-neutral-800 text-primary-900 hover:border-primary-700 hover:bg-neutral-800 hover:text-primary-700 active:ring-0';
	let modalTitle = '';
	let isOpen = false;
	let selectedTag: TagDto | null = null;
	let isUpsertMode = false;
	let hasError: null | string = null;
	let isLoading = true;
	let tags: List<TagPreviewDto> = { items: [], count: 0 };
	let pages = getPages(10, tags?.count ?? 0);
	let pagerPages: { name: string; active: boolean }[] = [];

	let currPage = 1;

	onMount(async () => {
		if (!$isLoggedIn) goto('/');

		if (!tags || tags.count === 0) tags = (await getTags()) ?? { items: [], count: 0 };

		isLoading = false;
	});

	$: {
		pages = getPages(10, tags.count);

		const _pagerPages = pages.slice(currPage - 1, currPage + 3).map((page) => {
			const _page = currPage.toString();
			const _isActive = page.name === _page;
			return {
				name: page.name,
				active: _isActive,
			};
		});
		pagerPages = _pagerPages;
	}

	async function onPaginate(event: any): Promise<void> {
		let _page = event;
		if (typeof event !== 'number') _page = parseInt(event.target.innerText);
		if (_page === currPage) return;
		currPage = _page;
		tags = (await getTags({ page: currPage - 1 })) ?? { items: [], count: 0 };
	}

	async function onDelete(event: CustomEvent<string>): Promise<void> {
		const _id = event.detail;
		if (!_id) return;

		const _res = await deleteTag(_id);
		if (!_res) {
			hasError = 'an error occurred';
			return;
		}

		tags = {
			items: tags.items.filter((w) => w.id !== _id),
			count: tags.count - 1,
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
		tags = (await getTags({ page: currPage - 1 })) ?? { items: [], count: 0 };
	}

	$: {
		if (!isUpsertMode) modalTitle = 'details';
		else modalTitle = selectedTag ? 'edit' : 'add';
	}
</script>

<div class="flex w-full flex-col gap-5 bg-neutral-800 sm:p-4">
	<Button
		on:click={() => onOpen()}
		color="none"
		class="text-primary-900 ring-neutral-800 hover:text-primary-700"
	>
		<PlusSolid></PlusSolid>
	</Button>
	{#if tags.count > 0}
		<Pagination
			on:click={onPaginate}
			ulClass="flex justify-center align-middle"
			class=""
			activeClass="text-white border bg-primary-900 hover:bg-primary-800 hover:text-white"
			normalClass="text-gray-500 bg-white hover:bg-primary-800 hover:text-white bg-neutral-800"
			pages={pagerPages}
			on:previous={() => {
				if (currPage > 1) onPaginate(currPage - 1);
			}}
			on:next={() => {
				if (currPage < pages.length) onPaginate(currPage + 1);
			}}
		/>
	{/if}
	<Listgroup
		active
		class="divide-y divide-gray-200 border-none bg-neutral-800 text-gray-300 dark:divide-gray-600"
	>
		{#each tags.items as tag (tag.id)}
			<Tag on:open={onOpen} on:delete={onDelete} {tag}></Tag>
		{/each}
		{#if tags.count === 0 && !isLoading}
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
	{#if tags.count > 0}
		<Pagination
			on:click={onPaginate}
			ulClass="flex justify-center align-middle"
			class=""
			activeClass="text-white border bg-primary-900 hover:bg-primary-800 hover:text-white"
			normalClass="text-gray-500 bg-white hover:bg-primary-800 hover:text-white bg-neutral-800"
			pages={pagerPages}
			on:previous={() => {
				if (currPage > 1) onPaginate(currPage - 1);
			}}
			on:next={() => {
				if (currPage < pages.length) onPaginate(currPage + 1);
			}}
		/>
	{/if}
</div>
