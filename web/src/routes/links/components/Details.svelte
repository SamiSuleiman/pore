<script lang="ts">
	import type { LinkDto } from '$lib/link/model';
	import { Accordion, AccordionItem } from 'flowbite-svelte';
	import { BookSolid } from 'flowbite-svelte-icons';

	export let link: LinkDto;

	let accordionOpts = {
		borderOpenClass: 'border-b-primary-800 border-dotted',
		borderClass: 'border-none',
		headerClass: 'text-lg underline decoration-primary-800 decoration-wavy',
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
		<span slot="header" class={accordionOpts.headerClass}>meta</span>
		<h1 class="mb-4 text-xl text-white">
			<BookSolid class="inline text-center text-primary-800"></BookSolid>
			{link.title}
		</h1>
		<p>
			description
			<span class="text-primary-800">: </span>
			<span class="text-white">
				{link.desc}
			</span>
		</p>
	</AccordionItem>
	<AccordionItem
		borderOpenClass={accordionOpts.borderOpenClass}
		borderClass={accordionOpts.borderClass}
	>
		<span slot="header" class={accordionOpts.headerClass}>words</span>
		<div class="flex flex-col gap-3">
			<div>
				{#each link.words as word (word.id)}
					<p>
						<i class="text-primary-800">- </i>
						{word.content}
					</p>
				{/each}
				{#if link.words.length === 0}
					<p class="text-gray-500">
						no words
						<i class="text-primary-800">.</i>
					</p>
				{/if}
			</div>
		</div>
	</AccordionItem>
</Accordion>
