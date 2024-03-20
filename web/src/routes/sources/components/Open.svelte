<script lang="ts">
	import type { SourceDto } from '$lib/source/model';
	import Details from './Details.svelte';
	import Upsert from './Upsert.svelte';

	export let source: SourceDto | null = null;
	export let isUpsertMode = false;

	$: {
	}
</script>

<div class="flex flex-col gap-2">
	{#if isUpsertMode}
		{#if source}
			<slot class="bg-neutral-800 text-white" name="upsertMode" />
		{/if}
		<Upsert on:create {source}></Upsert>
	{:else if source}
		<slot class="bg-neutral-800 text-white" name="detailMode" />
		<Details {source}></Details>
	{/if}
</div>
