<script lang="ts">
	import type { LinkPreviewDto } from '$lib/link/model';
	import { Button, ListgroupItem } from 'flowbite-svelte';
	import { TrashBinSolid } from 'flowbite-svelte-icons';
	import type { ItemActionEvent } from '../../models';
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';

	export let link: LinkPreviewDto;

	const dispatch = createEventDispatcher();

	function onDelete() {
		dispatch<ItemActionEvent>('delete', link.id);
	}

	function onOpen() {
		dispatch<ItemActionEvent>('open', link.id);
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
			<h1>{link.title}</h1>
		</div>
		<div class="flex flex-wrap gap-3 max-sm:hidden">
			{#each link.wordContents.slice(0, 3) as word, i}
				<i
					><small
						>{word}

						{#if link.wordContents.length > 3 && i < 2}
							<i>,</i>
						{:else if i === 2}
							<i>...</i>
						{/if}
					</small></i
				>
			{/each}
			{#if link.wordContents.length === 0}
				<p class="text-gray-500">no words</p>
			{/if}
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
