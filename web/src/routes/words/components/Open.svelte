<script lang="ts">
	import type { WordDto } from '$lib/word/model';
	import Details from './Details.svelte';
	import Upsert from './Upsert.svelte';

	export let word: WordDto | null = null;
	export let isUpsertMode = false;

	$: {
	}
</script>

<div class="flex flex-col gap-2">
	{#if isUpsertMode}
		{#if word}
			<slot class="bg-neutral-800 text-white" name="upsertMode" />
		{/if}
		<Upsert on:create {word}></Upsert>
	{:else if word}
		<slot class="bg-neutral-800 text-white" name="detailMode" />
		<Details {word}></Details>
	{/if}
</div>
