<script lang="ts">
	import type { WordDto } from '$lib/word/model';
	import type { AccordionProps } from 'flowbite-svelte/Accordion.svelte';
	import { isUpsertMode } from '../../../stores/word.store';
	import { AccordionItem, Accordion } from 'flowbite-svelte';

	export let word: WordDto | null = null;

	let accordionOpts = {
		borderOpenClass: 'border-b-primary-800 border-dotted',
		borderClass: 'border-none',
	};

	$: {
		console.log(word);
	}
</script>

<div class="flex flex-col gap-2">
	{#if $isUpsertMode}
		<slot class="bg-neutral-800 text-white" name="upsertMode" />
		<!--  we show the form here -->
	{:else}
		<!--  we show the details here -->
		{#if word}
			<slot class="bg-neutral-800 text-white" name="detailMode" />
			<Accordion
				activeClass="text-white focus:ring-2 focus:ring-primary-900"
				inactiveClass="text-gray-500 text-gray-400 "
				multiple
			>
				<AccordionItem
					open
					borderOpenClass={accordionOpts.borderOpenClass}
					borderClass={accordionOpts.borderClass}
				>
					<span slot="header" class="underline decoration-primary-800 decoration-wavy">meta</span>
					<p>
						{word.content}
					</p>
				</AccordionItem>
				<AccordionItem
					borderOpenClass={accordionOpts.borderOpenClass}
					borderClass={accordionOpts.borderClass}
				>
					<span slot="header" class="underline decoration-primary-800 decoration-wavy"
						>definitions & examples</span
					>
					<div class="flex flex-col gap-10">
						<div class="flex flex-col gap-3">
							<h1 class="underline decoration-wavy">definitions</h1>
							<div>
								{#each word.definitions as definition}
									<p>
										<i class="text-primary-800">- </i>
										{definition.content}
									</p>
								{/each}
							</div>
						</div>
						<div class="flex flex-col gap-3">
							<h1 class="underline decoration-wavy">examples</h1>
							<div>
								{#each word.examples as example}
									<p>
										<i class="text-primary-800">- </i>
										{example.content}
									</p>
								{/each}
							</div>
						</div>
					</div>
				</AccordionItem>
			</Accordion>
		{/if}
	{/if}
</div>
