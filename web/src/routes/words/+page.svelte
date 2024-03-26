<script lang="ts">
	import { onMount } from 'svelte';
	import { isLoggedIn } from '../../stores/auth.store';
	import { goto } from '$app/navigation';
	import { deleteWord, getWord, getWords } from '$lib/word';
	import Word from './components/Word.svelte';
	import { PenSolid, UndoSolid } from 'flowbite-svelte-icons';
	import { Button } from 'flowbite-svelte';
	import Open from './components/Open.svelte';
	import type { WordDto, WordPreviewDto } from '$lib/word/model';
	import { getPages } from '../shared/pager';
	import type { List } from '$lib/models';
	import ItemsList from '../components/ItemsList.svelte';

	const upsertBtnStyle =
		'border-primary-900 bg-neutral-800 text-primary-900 hover:border-primary-700 hover:bg-neutral-800 hover:text-primary-700 active:ring-0';
	let modalTitle = '';
	let isOpen = false;
	let selectedWord: WordDto | null = null;
	let isUpsertMode = false;
	let hasError: null | string = null;
	let isLoading = true;
	let words: List<WordPreviewDto> = {
		items: [],
		count: 0,
	};
	let pages = getPages(10, words?.count ?? 0);
	let pagerPages: { name: string; active: boolean }[] = [];

	let currPage = 1;

	onMount(async () => {
		if (!$isLoggedIn) goto('/');

		if (!words || words.count === 0) words = (await getWords()) ?? { items: [], count: 0 };

		isLoading = false;
	});

	$: {
		pages = getPages(10, words.count);

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
		words = (await getWords({ page: currPage - 1 })) ?? { items: [], count: 0 };
	}

	async function onDelete(event: CustomEvent<string>): Promise<void> {
		const _id = event.detail;
		if (!_id) return;

		const _res = await deleteWord(_id);
		if (!_res) {
			hasError = 'an error occurred';
			return;
		}

		words = (await getWords({ page: currPage - 1 })) ?? { items: [], count: 0 };
	}

	async function onOpen(event?: CustomEvent<string>): Promise<void> {
		isOpen = true;

		const _id = event?.detail;
		if (!_id) {
			isUpsertMode = true;
		} else {
			isLoading = true;
			hasError = null;

			const _word = await getWord(_id);

			if (!_word) {
				hasError = 'an error occurred';
				return;
			}

			isLoading = false;
			selectedWord = _word;
		}
	}

	function onClose(): void {
		isOpen = false;
		selectedWord = null;
		isUpsertMode = false;
	}

	async function onCreate(): Promise<void> {
		words = (await getWords({ page: currPage - 1 })) ?? { items: [], count: 0 };
	}

	$: {
		if (!isUpsertMode) modalTitle = 'details';
		else modalTitle = selectedWord ? 'edit' : 'add';
	}
</script>

<svelte:head>
	<title>pore | words</title>
</svelte:head>

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
	showPagination={words.count > 10 || currPage > 1}
	{pagerPages}
	{isLoading}
	{hasError}
	{modalTitle}
	{isOpen}
>
	<svelte:fragment slot="items">
		{#each words.items as word (word.id)}
			<Word on:open={onOpen} on:delete={onDelete} {word}></Word>
		{/each}
		{#if words.count === 0 && !isLoading}
			<div class="p-4 text-center">no words found</div>
		{/if}
	</svelte:fragment>
	<div slot="open">
		<Open word={selectedWord} {isUpsertMode} on:create={onCreate}>
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
