<script lang="ts">
	import type { TagDto } from '$lib/tag/model';
	import Details from './Details.svelte';
	import Upsert from './Upsert.svelte';

	export let tag: TagDto | null = null;
	export let isUpsertMode = false;

	$: {
	}
</script>

<div class="flex flex-col gap-2">
	{#if isUpsertMode}
		{#if tag}
			<slot class="bg-neutral-800 text-white" name="upsertMode" />
		{/if}
		<Upsert on:create {tag}></Upsert>
	{:else if tag}
		<slot class="bg-neutral-800 text-white" name="detailMode" />
		<Details {tag}></Details>
	{/if}
</div>
