<script lang="ts">
	import type { AddWordDto, WordDto } from '$lib/word/model';
	import { Button, Spinner } from 'flowbite-svelte';
	import { CheckSolid, TrashBinSolid, PlusSolid } from 'flowbite-svelte-icons';
	import { required } from '../../shared/validators';
	import type { InputValidator } from '../../shared/input';
	import Input from '../../shared/Input.svelte';
	import Select from '../../shared/Select.svelte';
	import { languages } from '../index';
	import type { TagPreviewDto } from '$lib/tag/model';
	import type { LinkPreviewDto } from '$lib/link/model';
	import { tags } from '../../../stores/tag.store';
	import { links } from '../../../stores/link.store';
	import { sources } from '../../../stores/source.store';
	import { getTags } from '$lib/tag';
	import { getLinks } from '$lib/link';
	import { getSources } from '$lib/source';
	import type { SourcePreviewDto } from '$lib/source/model';
	import MultiSelect from '../../shared/MultiSelect.svelte';

	export let word: WordDto | null = null;

	let form: AddWordDto = {
		content: '',
		language: 'English',
		tagIds: [],
		linkIds: [],
		definitions: [],
		examples: [],
		sourceId: '',
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

	form.content = word?.content || '';
	form.language = word?.language ?? 'English';
	form.sourceId = word?.source?.id || '';
	form.tagIds = word?.tags.map((tag) => tag.id) || [];
	form.linkIds = word?.links.map((link) => link.id) || [];
	form.definitions = word?.definitions.map((def) => def.content) || [];
	form.examples = word?.examples.map((ex) => ex.content) || [];

	function onSubmit(): void {
		console.log(form);
	}

	async function getRelated(): Promise<{
		tags: TagPreviewDto[];
		links: LinkPreviewDto[];
		sources: SourcePreviewDto[];
	}> {
		const _res = await Promise.all([getTags(), getLinks(), getSources()]);

		return { tags: _res[0], links: _res[1], sources: _res[2] };
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
				<div class="mb-4">
					<Input label="content" bind:value={form.content} validator={validators.content}></Input>
				</div>
				<div class="mb-4">
					<Select
						choices={languages.map((lang) => ({ value: lang, name: lang }))}
						label="language"
						bind:value={form.language}
						validator={validators.language}
					></Select>
				</div>
				<div class="mb-4">
					<Select
						choices={related.sources.map((s) => ({ value: s.id, name: s.content }))}
						label="source"
						bind:value={form.sourceId}
					></Select>
				</div>
				<div class="mb-4">
					<MultiSelect
						choices={related.tags.map((s) => ({ value: s.id, name: s.title }))}
						label="tags"
						bind:value={form.tagIds}
					></MultiSelect>
				</div>
				<div class="mb-4">
					<MultiSelect
						choices={related.links.map((s) => ({ value: s.id, name: s.title }))}
						label="links"
						bind:value={form.linkIds}
					></MultiSelect>
				</div>
				<div class="mb-4 flex flex-col gap-1">
					<div class="flex items-center">
						<Button
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
			<Button color="primary" outline size="xs" on:click={() => onSubmit()}>
				<CheckSolid></CheckSolid>
			</Button>
		</form>
	</div>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}
