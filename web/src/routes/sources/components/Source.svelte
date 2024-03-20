<script lang="ts">
	import type { SourcePreviewDto } from '$lib/source/model';
	import { Button, ListgroupItem } from 'flowbite-svelte';
	import { TrashBinSolid } from 'flowbite-svelte-icons';
	import type { ItemActionEvent } from '../../models';
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';

	export let source: SourcePreviewDto;

	const dispatch = createEventDispatcher();

	function onDelete() {
		dispatch<ItemActionEvent>('delete', source.id);
	}

	function onOpen() {
		dispatch<ItemActionEvent>('open', source.id);
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
				<h1>{source.content}</h1>
				<p>{source.type}</p>
			</div>
		</div>
	</ListgroupItem>
	<Button on:click={onDelete} class="ring-neutral-800 hover:text-primary-700" color="none">
		<TrashBinSolid size="md"></TrashBinSolid>
	</Button>
</div>
