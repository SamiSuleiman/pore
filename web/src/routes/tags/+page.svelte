<script>
	import { onMount } from 'svelte';
	import { isLoggedIn } from '../../stores/auth.store';
	import { goto } from '$app/navigation';
	import { tags } from '../../stores/tag.store';
	import Tag from './components/Tag.svelte';
	import { Listgroup } from 'flowbite-svelte';
	import { getTags } from '$lib/tag';

	onMount(async () => {
		if (!$isLoggedIn) goto('/');

		if ($tags.length === 0) $tags = await getTags();
	});
</script>

<div class="w-full bg-neutral-800 sm:p-4">
	<Listgroup
		active
		class="divide-y divide-gray-200 border-none bg-neutral-800 text-gray-300 dark:divide-gray-600"
	>
		{#each $tags as tag (tag.id)}
			<Tag {tag}></Tag>
		{/each}
	</Listgroup>
</div>
