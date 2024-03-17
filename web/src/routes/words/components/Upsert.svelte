<script lang="ts">
	import type { WordDto } from '$lib/word/model';

	export let word: WordDto | null = null;
</script>

<div class="flex flex-col gap-2">
	{#if word}
		<slot class="bg-neutral-800 text-white" name="detailMode" />
	{/if}
</div>
