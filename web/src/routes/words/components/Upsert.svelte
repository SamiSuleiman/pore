<script lang="ts">
	import type { WordDto } from '$lib/word/model';

	export let word: WordDto | null = null;
</script>

<div>
	<h1>{word?.content}</h1>
	<slot class="bg-neutral-800 text-white" name="footer" />
</div>
