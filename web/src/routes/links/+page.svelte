<script lang="ts">
	import { onMount } from 'svelte';
	import { isLoggedIn } from '../../stores/auth.store';
	import { goto } from '$app/navigation';
	import Link from './components/Link.svelte';
	import { Button } from 'flowbite-svelte';
	import { deleteLink, getLink, getLinks } from '$lib/link';
	import type { LinkDto, LinkPreviewDto } from '$lib/link/model';
	import { PenSolid, UndoSolid } from 'flowbite-svelte-icons';
	import Open from './components/Open.svelte';
	import type { List } from '$lib/models';
	import { getPages } from '../shared/pager';
	import ItemsList from '../components/ItemsList.svelte';

	const upsertBtnStyle =
		'border-primary-900 bg-neutral-800 text-primary-900 hover:border-primary-700 hover:bg-neutral-800 hover:text-primary-700 active:ring-0';
	let modalTitle = '';
	let isOpen = false;
	let selectedLink: LinkDto | null = null;
	let isUpsertMode = false;
	let hasError: null | string = null;
	let isLoading = true;
	let links: List<LinkPreviewDto> = { items: [], count: 0 };
	let pages = getPages(10, links?.count ?? 0);
	let pagerPages: { name: string; active: boolean }[] = [];

	let currPage = 1;

	onMount(async () => {
		if (!$isLoggedIn) goto('/');

		if (!links || links.count === 0) links = (await getLinks()) ?? { items: [], count: 0 };

		isLoading = false;
	});

	$: {
		pages = getPages(10, links.count);

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
		links = (await getLinks({ page: currPage - 1 })) ?? { items: [], count: 0 };
	}

	async function onDelete(event: CustomEvent<string>): Promise<void> {
		const _id = event.detail;
		if (!_id) return;

		const _res = await deleteLink(_id);
		if (!_res) {
			hasError = 'an error occurred';
			return;
		}

		links = {
			items: links.items.filter((w) => w.id !== _id),
			count: links.count - 1,
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
		links = (await getLinks({ page: currPage - 1 })) ?? { items: [], count: 0 };
	}

	$: {
		if (!isUpsertMode) modalTitle = 'details';
		else modalTitle = selectedLink ? 'edit' : 'add';
	}
</script>

<ItemsList
	on:paginate={(e) => onPaginate(e.detail)}
	on:previous={() => {
		if (currPage > 1) onPaginate(currPage - 1);
	}}
	on:next={() => {
		if (currPage < pages.length) onPaginate(currPage + 1);
	}}
	on:open={onOpen}
	on:close={onClose}
	on:delete={onDelete}
	on:create={onCreate}
	showPagination={links.count > 10 || currPage > 1}
	{pagerPages}
	{isLoading}
	{hasError}
	{modalTitle}
	{isOpen}
>
	<svelte:fragment slot="items">
		{#each links.items as link (link.id)}
			<Link on:open={onOpen} on:delete={onDelete} {link}></Link>
		{/each}
		{#if links.count === 0 && !isLoading}
			<div class="p-4 text-center">no words found</div>
		{/if}
	</svelte:fragment>
	<div slot="open">
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
	</div>
</ItemsList>
