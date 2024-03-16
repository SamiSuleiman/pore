<script>
	import { onMount } from 'svelte';
	import { isLoggedIn } from '../../stores/auth.store';
	import { goto } from '$app/navigation';
	import { words } from '../../stores/word.store';
	import { getWords } from '$lib/word';
	import Word from './components/Word.svelte';
	import { Listgroup } from 'flowbite-svelte';

	onMount(async () => {
		if (!$isLoggedIn) goto('/');

		if ($words.length === 0) words.set(await getWords());
		console.log($words);
	});
</script>

<div class="w-full bg-neutral-800 sm:p-4">
	<Listgroup
		active
		class="divide-y divide-gray-200 border-none bg-neutral-800 text-gray-300 dark:divide-gray-600"
	>
		{#each $words as word}
			<Word {word}></Word>
		{/each}
	</Listgroup>
</div>
