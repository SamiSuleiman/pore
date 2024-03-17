<script lang="ts">
	import type { WordDto } from '$lib/word/model';
	import { isUpsertMode } from '../../../stores/word.store';
	import Details from './Details.svelte';

	export let word: WordDto | null = null;

	$: {
		console.log(word);
	}
</script>

<div class="flex flex-col gap-2">
	{#if $isUpsertMode}
		{#if word}
			<slot class="bg-neutral-800 text-white" name="upsertMode" />
		{/if}
		<!--  we show the form here -->
	{:else}
		<!--  we show the details here -->
		{#if word}
			<slot class="bg-neutral-800 text-white" name="detailMode" />
			<Details {word}></Details>
		{/if}
	{/if}
</div>
