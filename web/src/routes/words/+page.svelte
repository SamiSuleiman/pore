<script lang="ts">
	import { onMount } from 'svelte';
	import { isLoggedIn } from '../../stores/auth.store';
	import { goto } from '$app/navigation';
	import { deleteWord, getWord, getWords } from '$lib/word';
	import Word from './components/Word.svelte';
	import { Listgroup, Pagination } from 'flowbite-svelte';
	import { Toast } from 'flowbite-svelte';
	import { FireSolid, PenSolid, UndoSolid, PlusSolid } from 'flowbite-svelte-icons';
	import { Spinner, Modal, Button } from 'flowbite-svelte';
	import Open from './components/Open.svelte';
	import type { WordDto, WordPreviewDto } from '$lib/word/model';
	import { getPages } from '../shared/pager';
	import type { List } from '$lib/models';

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

		words = {
			items: words.items.filter((w) => w.id !== _id),
			count: words.count - 1,
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

<div class="flex w-full flex-col gap-5 bg-neutral-800 sm:p-4">
	<Button
		on:click={() => onOpen()}
		color="none"
		class="text-primary-900 ring-neutral-800 hover:text-primary-700"
	>
		<PlusSolid></PlusSolid>
	</Button>
	{#if words.count > 0}
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
		{#each words.items as word (word.id)}
			<Word on:open={onOpen} on:delete={onDelete} {word}></Word>
		{/each}
		{#if words.count === 0 && !isLoading}
			<div class="p-4 text-center">no words found</div>
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
	</Modal>
	{#if words.count > 0}
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
