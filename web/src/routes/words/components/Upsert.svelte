<script lang="ts">
	import type { AddWordDto, WordDto } from '$lib/word/model';
	import { Label, Input, Helper, Button } from 'flowbite-svelte';
	import { CheckSolid } from 'flowbite-svelte-icons';

	export let word: WordDto | null = null;

	const form: AddWordDto = {
		content: '',
		language: 'en',
		tagIds: [],
		linkIds: [],
		definitions: [],
		examples: [],
	};

	$: {
	}

	function onSubmit() {
		console.log('submitting form');
	}
</script>

<div class="flex flex-col gap-2">
	{#if word}
		<slot class="bg-neutral-800 text-white" name="detailMode" />
	{/if}
	<form class="flex flex-col" method="POST" on:submit|preventDefault>
		<div class="mb-6">
			<Label for="content" color="red" class="mb-2 block">content</Label>
			<Input bind:value={form.content} id="content" name="content" color="red" />
			<Helper class="mt-2" color="red"
				><span class="font-medium">Not so well done!</span> Some error message.</Helper
			>
		</div>
		<Button
			on:click={() => onSubmit()}
			color="none"
			class="text-primary-900 ring-neutral-800 hover:text-primary-700"
		>
			<CheckSolid></CheckSolid>
		</Button>
	</form>
</div>
