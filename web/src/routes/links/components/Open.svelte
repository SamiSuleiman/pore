<script lang="ts">
	import type { LinkDto } from '$lib/link/model';
	import Details from './Details.svelte';
	import Upsert from './Upsert.svelte';

	export let link: LinkDto | null = null;
	export let isUpsertMode = false;

	$: {
	}
</script>

<div class="flex flex-col gap-2">
	{#if isUpsertMode}
		{#if link}
			<slot class="bg-neutral-800 text-white" name="upsertMode" />
		{/if}
		<Upsert on:create {link}></Upsert>
	{:else if link}
		<slot class="bg-neutral-800 text-white" name="detailMode" />
		<Details {link}></Details>
	{/if}
</div>
