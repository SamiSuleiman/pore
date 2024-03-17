<script>
	import { onMount } from 'svelte';
	import { isLoggedIn } from '../../stores/auth.store';
	import { goto } from '$app/navigation';
	import { links } from '../../stores/link.store';
	import Link from './components/Link.svelte';
	import { Listgroup } from 'flowbite-svelte';
	import { getLinks } from '$lib/link';

	onMount(async () => {
		if (!$isLoggedIn) goto('/');

		if ($links.length === 0) $links = await getLinks();
	});
</script>

<div class="w-full bg-neutral-800 sm:p-4">
	<Listgroup
		active
		class="divide-y divide-gray-200 border-none bg-neutral-800 text-gray-300 dark:divide-gray-600"
	>
		{#each $links as link (link.id)}
			<Link {link}></Link>
		{/each}
	</Listgroup>
</div>
