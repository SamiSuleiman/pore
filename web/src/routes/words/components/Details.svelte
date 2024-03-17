<script lang="ts">
	import type { WordDto } from '$lib/word/model';
	import { AccordionItem, Accordion } from 'flowbite-svelte';

	export let word: WordDto;

	let accordionOpts = {
		borderOpenClass: 'border-b-primary-800 border-dotted',
		borderClass: 'border-none',
	};
</script>

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
