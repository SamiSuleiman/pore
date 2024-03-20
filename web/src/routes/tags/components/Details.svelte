<script lang="ts">
	import type { TagDto } from '$lib/tag/model';

	export let tag: TagDto;

	let accordionOpts = {
		borderOpenClass: 'border-b-primary-800 border-dotted',
		borderClass: 'border-none',
		headerClass: 'text-lg underline decoration-primary-800 decoration-wavy',
	};
</script>

{tag.title}
