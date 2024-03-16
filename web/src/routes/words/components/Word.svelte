<script lang="ts">
	import type { WordPreviewDto } from '$lib/word/model';

	export let word: WordPreviewDto;
</script>

{word.content}
