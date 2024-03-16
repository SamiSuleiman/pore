<script lang="ts">
	import type { WordDto } from '$lib/word/model';
	import { isUpsertMode } from '../../../stores/word.store';

	export let word: WordDto | null = null;
</script>

<div>
	{#if $isUpsertMode}
		<!--  we show the form here -->
	{:else}
		<!--  we show the details here -->
		{#if word}
			<slot class="bg-neutral-800 text-white" name="footer" />
		{/if}
	{/if}
</div>
