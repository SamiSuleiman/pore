<script>
	import { onMount } from 'svelte';
	import { isLoggedIn } from '../../stores/auth.store';
	import { goto } from '$app/navigation';
	import { sources } from '../../stores/source.store';
	import Source from './components/Source.svelte';
	import { Listgroup } from 'flowbite-svelte';
	import { getSources } from '$lib/source';

	onMount(async () => {
		if (!$isLoggedIn) goto('/');

		if ($sources.length === 0) $sources = await getSources();
		console.log($sources);
	});
</script>

<div class="w-full bg-neutral-800 sm:p-4">
	<Listgroup
		active
		class="divide-y divide-gray-200 border-none bg-neutral-800 text-gray-300 dark:divide-gray-600"
	>
		{#each $sources as source}
			<Source {source}></Source>
		{/each}
	</Listgroup>
</div>
