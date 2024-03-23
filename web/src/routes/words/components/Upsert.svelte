<script lang="ts">
	import type { AddWordDto, UpdateWordDto, WordDto } from '$lib/word/model';
	import { Alert, Button, Spinner } from 'flowbite-svelte';
	import { CheckSolid, TrashBinSolid, PlusSolid } from 'flowbite-svelte-icons';
	import { required } from '../../shared/validators';
	import type { InputValidator } from '../../shared/input';
	import Input from '../../shared/Input.svelte';
	import Select from '../../shared/Select.svelte';
	import { languages } from '../index';
	import type { TagPreviewDto } from '$lib/tag/model';
	import type { LinkPreviewDto } from '$lib/link/model';
	import { getTags } from '$lib/tag';
	import { getLinks } from '$lib/link';
	import { getSources } from '$lib/source';
	import type { SourcePreviewDto } from '$lib/source/model';
	import MultiSelect from '../../shared/MultiSelect.svelte';
	import { addWord, updateWord } from '$lib/word';
	import { createEventDispatcher } from 'svelte';

	export let word: WordDto | null = null;
	const dispatch = createEventDispatcher();

	const invalidFormErrMsg = 'please fill in all required fields';
	let success = false;

	let form: AddWordDto = {
		content: word?.content ?? '',
		language: word?.language ?? 'English',
		tagIds: word?.tags.map((tag) => tag.id) ?? [],
		linkIds: word?.links.map((link) => link.id) ?? [],
		definitions: word?.definitions.map((def) => def.content) ?? [],
		examples: word?.examples.map((ex) => ex.content) ?? [],
		sourceId: word?.source?.id,
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
		success = false;
		for (const entry of Object.entries(validators)) {
			const [key, validator] = entry;
			// @ts-ignore
			validator.errMsg = validator.fn(form[key as any]);
			validators = { ...validators, [key]: validator };
		}
	}

	$: err = Object.values(validators).some((v) => v.errMsg !== '' && v.isTouched)
		? invalidFormErrMsg
		: '';

	let isSubmitting = false;

	async function onSubmit(): Promise<void> {
		success = false;
		isSubmitting = true;
		err = '';
		if (Object.values(validators).some((v) => v.errMsg !== '')) {
			err = invalidFormErrMsg;
			isSubmitting = false;
			return;
		}

		const toSubmit = {
			...form,
			definitions: form.definitions.filter((def) => def !== ''),
			examples: form.examples.filter((ex) => ex !== ''),
			sourceId: form.sourceId === '' ? null : form.sourceId,
		};

		let res;
		if (!word) res = await addWord(toSubmit as AddWordDto);
		else res = await updateWord(word.id, toSubmit as UpdateWordDto);
		isSubmitting = false;

		if (res) {
			dispatch('create');
			success = true;
		} else err = 'something went wrong';
	}

	async function getRelated(): Promise<{
		tags: TagPreviewDto[];
		links: LinkPreviewDto[];
		sources: SourcePreviewDto[];
	}> {
		const _res = await Promise.all([getTags(), getLinks(), getSources()]);

		return {
			tags: _res[0]?.items ?? [],
			links: _res[1]?.items ?? [],
			sources: _res[2]?.items ?? [],
		};
	}
</script>

{#await getRelated()}
	<div class="flex h-32 items-center justify-center">
		<Spinner class="h-8 w-8 text-primary-500" />
	</div>
{:then related}
	<div class="flex flex-col gap-2">
		{#if word}
			<slot class="bg-neutral-800 text-white" name="detailMode" />
		{/if}
		<form class="flex flex-col" method="POST" on:submit|preventDefault>
			<div>
				<div class="mb-4 flex">
					<div class="flex-1">
						<Input
							disabled={isSubmitting}
							label="content*"
							bind:value={form.content}
							validator={validators.content}
						></Input>
					</div>
				</div>
				<div class="mb-4 flex">
					<div class="flex-1">
						<Select
							disabled={isSubmitting}
							choices={languages.map((lang) => ({ value: lang, name: lang }))}
							label="language*"
							bind:value={form.language}
							validator={validators.language}
						></Select>
					</div>
				</div>
				<div class="mb-4">
					<Select
						disabled={isSubmitting}
						choices={[
							{ value: '', name: '-' },
							...related.sources.map((s) => ({ value: s.id, name: s.content })),
						]}
						label="source"
						bind:value={form.sourceId}
					></Select>
				</div>
				<div class="mb-4">
					<MultiSelect
						disabled={isSubmitting}
						choices={related.tags.map((s) => ({ value: s.id, name: s.title }))}
						label="tags"
						bind:value={form.tagIds}
					></MultiSelect>
				</div>
				<div class="mb-4">
					<MultiSelect
						disabled={isSubmitting}
						choices={related.links.map((s) => ({ value: s.id, name: s.title }))}
						label="links"
						bind:value={form.linkIds}
					></MultiSelect>
				</div>
				<div class="mb-4 flex flex-col gap-1">
					<div class="flex items-center">
						<Button
							disabled={isSubmitting}
							on:click={() => {
								form.definitions = [...form.definitions, ''];
								form = { ...form };
							}}
							color="none"
							class=" text-primary-900 ring-neutral-800 hover:text-primary-700"
						>
							<PlusSolid></PlusSolid>
						</Button>
						<h1>definitions</h1>
					</div>
					{#each form.definitions as _, i}
						<div class="flex flex-1 items-center justify-center gap-3">
							<div class="flex-1">
								<Input bind:value={form.definitions[i]}></Input>
							</div>
							<Button
								disabled={isSubmitting}
								on:click={() => {
									form.definitions = form.definitions.filter((_, index) => index !== i);
									form = { ...form };
								}}
								color="none"
								class="text-primary-900 ring-neutral-800 hover:text-primary-700"
							>
								<TrashBinSolid></TrashBinSolid>
							</Button>
						</div>
					{/each}
				</div>
				<div class="mb-4 flex flex-col gap-1">
					<div class="flex items-center">
						<Button
							disabled={isSubmitting}
							on:click={() => {
								form.examples = [...form.examples, ''];
								form = { ...form };
							}}
							color="none"
							class="text-primary-800 ring-neutral-800 hover:text-primary-700"
						>
							<PlusSolid></PlusSolid>
						</Button>
						<h1>examples</h1>
					</div>
					{#each form.examples as _, i}
						<div class="flex flex-1 items-center justify-center gap-3">
							<div class="flex-1">
								<Input bind:value={form.examples[i]}></Input>
							</div>
							<Button
								disabled={isSubmitting}
								on:click={() => {
									form.examples = form.examples.filter((_, index) => index !== i);
									form = { ...form };
								}}
								color="none"
								class="text-primary-900 ring-neutral-800 hover:text-primary-700"
							>
								<TrashBinSolid></TrashBinSolid>
							</Button>
						</div>
					{/each}
				</div>
			</div>
			<div class="flex flex-col">
				<Button
					disabled={isSubmitting || err}
					color="primary"
					outline
					size="xs"
					on:click={onSubmit}
				>
					{#if isSubmitting}
						<Spinner class="me-3" size="4" color="primary" />loading ...
					{:else}
						<CheckSolid></CheckSolid>
					{/if}
				</Button>
				{#if err}
					<Alert class="bg-neutral-800" color="none">
						<p class="underline decoration-red-900 decoration-wavy">{err}</p>
					</Alert>
				{/if}
				{#if success}
					<Alert class="bg-neutral-800" color="none">
						<p class="underline decoration-green-900 decoration-wavy">success</p>
					</Alert>
				{/if}
			</div>
		</form>
	</div>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}
