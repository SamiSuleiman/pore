<script lang="ts">
	import type { SourcePreviewDto } from '$lib/source/model';
	import { Button, ListgroupItem } from 'flowbite-svelte';
	import { TrashBinSolid } from 'flowbite-svelte-icons';

	export let source: SourcePreviewDto;
</script>

<div class="flex justify-between p-3 align-middle">
	<ListgroupItem
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
	<Button class="ring-neutral-800 hover:text-primary-700" size="md" color="none">
		<TrashBinSolid size="md"></TrashBinSolid>
	</Button>
</div>
