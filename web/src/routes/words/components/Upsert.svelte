<script lang="ts">
	import type { AddWordDto, WordDto } from '$lib/word/model';
	import { Label, Input, Helper, Button } from 'flowbite-svelte';
	import { CheckSolid } from 'flowbite-svelte-icons';
	import { required } from '../../helpers/validators';

	export let word: WordDto | null = null;

	const form: AddWordDto = {
		content: '',
		language: 'en',
		tagIds: [],
		linkIds: [],
		definitions: [],
		examples: [],
	};

	let validators: Record<
		string,
		{
			fn: (value: string) => boolean;
			isValid: boolean;
			isTouched: boolean;
		}
	> = {
		content: {
			fn: required,
			isValid: false,
			isTouched: false,
		},
	};

	$: {
		for (const entry of Object.entries(validators)) {
			const [key, validator] = entry;
			// @ts-ignore
			validator.isValid = validator.fn(form[key as any]);
			validators = { ...validators, [key]: validator };

			console.log(validator.isValid);
		}
	}

	function onSubmit(): void {
		console.log('submitting form');
	}
</script>

<div class="flex flex-col gap-2">
	{#if word}
		<slot class="bg-neutral-800 text-white" name="detailMode" />
	{/if}
	<form class="flex flex-col" method="POST" on:submit|preventDefault>
		<div class="mb-6">
			<Label for="content" class="mb-2 block text-white">content</Label>
			<Input
				class="bg-neutral-800 text-white"
				size="sm"
				bind:value={form.content}
				id="content"
				name="content"
				on:blur={() => (validators.content.isTouched = true)}
			/>
			{#if !validators.content.isValid && validators.content.isTouched}
				<Helper class="mt-2" color="red"
					><span class="font-medium">Not so well done!</span> Some error message.</Helper
				>
			{/if}
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
