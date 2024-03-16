<script lang="ts">
	import type { WordPreviewDto } from '$lib/word/model';
	import { fade } from 'svelte/transition';
	import { Button, ListgroupItem, Badge } from 'flowbite-svelte';
	import { TrashBinSolid } from 'flowbite-svelte-icons';
	import { createEventDispatcher } from 'svelte';
	import type { ItemActionEvent } from '../../models';

	export let word: WordPreviewDto;

	const dispatch = createEventDispatcher();

	function onDelete() {
		dispatch<ItemActionEvent>('delete', word.id);
	}

	function onOpen() {
		dispatch<ItemActionEvent>('open', word.id);
	}
</script>

<div transition:fade={{ delay: 100, duration: 100 }} class="flex justify-between p-3 align-middle">
	<ListgroupItem
		on:click={onOpen}
		focusClass="focus:z-40 focus:outline-none focus:ring-2 focus:ring-primary-700 dark:focus:ring-gray-500 dark:focus:text-white"
		hoverClass="hover:text-primary-700 hover:bg-neutral-900"
		class="flex justify-between gap-2 border-x-neutral-500 text-base font-semibold"
	>
		<div class="flex flex-col gap-3">
			<div>
				<h1>{word.content}</h1>
				<p>{word.language}</p>
			</div>
			<div class="flex flex-wrap gap-3">
				{#each word.tags as tag}
					<Badge
						color="none"
						class="rounded-none bg-neutral-800 p-1 text-gray-300 ring-1 ring-primary-900"
						>{tag.title}</Badge
					>
				{/each}
			</div>
		</div>
		<div class="flex flex-col max-sm:hidden">
			<i><small>{word.source?.type}: {word.source?.content}</small></i>
			<i><small>related/linked to {word.links.length} word(s) </small></i>
		</div>
	</ListgroupItem>
	<Button
		on:click={onDelete}
		class="ring-neutral-800 hover:text-primary-700"
		size="md"
		color="none"
	>
		<TrashBinSolid size="md"></TrashBinSolid>
	</Button>
</div>
