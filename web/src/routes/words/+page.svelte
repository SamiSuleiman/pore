<script>
	import { onMount } from 'svelte';
	import { isLoggedIn } from '../../stores/auth.store';
	import { goto } from '$app/navigation';
	import { words } from '../../stores/word.store';
	import { getWords } from '$lib/word';
	import Word from './components/Word.svelte';

	onMount(async () => {
		if (!$isLoggedIn) goto('/');

		if ($words.length === 0) words.set(await getWords());
		console.log($words);
	});
</script>

{#each $words as word}
	<Word {word}></Word>
{/each}
