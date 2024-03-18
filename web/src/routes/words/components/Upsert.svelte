<script lang="ts">
	import type { AddWordDto, WordDto } from '$lib/word/model';
	import { Button } from 'flowbite-svelte';
	import { CheckSolid } from 'flowbite-svelte-icons';
	import { required } from '../../shared/validators';
	import type { InputValidator } from '../../shared/input';
	import Input from '../../shared/Input.svelte';
	import Select from '../../shared/Select.svelte';
	import { languages } from '../index';
	import { onMount } from 'svelte';

	export let word: WordDto | null = null;

	const form: AddWordDto = {
		content: '',
		language: 'English',
		tagIds: [],
		linkIds: [],
		definitions: [],
		examples: [],
	};

	let validators: Record<string, InputValidator> = {
		content: {
			fn: required,
			errMsg: '',
			isTouched: false,
		},
		language: {
			fn: required,
			errMsg: '',
			isTouched: false,
		},
	};

	$: {
		for (const entry of Object.entries(validators)) {
			const [key, validator] = entry;
			// @ts-ignore
			validator.errMsg = validator.fn(form[key as any]);
			validators = { ...validators, [key]: validator };
		}
	}

	onMount(() => {
		form.content = word?.content || '';
		form.language = word?.language ?? 'English';
		form.tagIds = word?.tags.map((tag) => tag.id) || [];
		form.linkIds = word?.links.map((link) => link.id) || [];
		form.definitions = word?.definitions.map((def) => def.content) || [];
		form.examples = word?.examples.map((ex) => ex.content) || [];
	});

	function onSubmit(): void {
		console.log(form);
	}
</script>

<div class="flex flex-col gap-2">
	{#if word}
		<slot class="bg-neutral-800 text-white" name="detailMode" />
	{/if}
	<form class="flex flex-col" method="POST" on:submit|preventDefault>
		<div class="mb-6">
			<Input label="content" bind:value={form.content} validator={validators.content}></Input>
			<Select
				choices={languages}
				label="language"
				bind:value={form.language}
				validator={validators.language}
			></Select>
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
