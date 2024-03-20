<script lang="ts">
	import type { WordDto } from '$lib/word/model';
	import { AccordionItem, Accordion } from 'flowbite-svelte';
	import { ArrowRightSolid, BookSolid } from 'flowbite-svelte-icons';

	export let word: WordDto;

	function getLinkOtherWords(linkId: string) {
		return (
			word.links.find((link) => link.id === linkId)?.words.filter((w) => w.id !== word.id) ?? []
		);
	}

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
			{word.content}
		</h1>
		<p>
			language
			<span class="text-primary-800">: </span>
			<span class="text-white">
				{word.language}
			</span>
		</p>
		{#if word.source}
			<p>
				source <span class="text-primary-800">: </span>
				<span class="text-white">
					{word.source?.type}
				</span>
				<i class="text-primary-800"> - </i>
				<span class="text-white">
					{word.source?.content}
				</span>
			</p>
		{/if}
	</AccordionItem>
	<AccordionItem
		borderOpenClass={accordionOpts.borderOpenClass}
		borderClass={accordionOpts.borderClass}
	>
		<span slot="header" class={accordionOpts.headerClass}>definitions & examples</span>
		<div class="flex flex-col gap-10">
			<div class="flex flex-col gap-3">
				<h1 class="underline decoration-wavy">definitions</h1>
				<div>
					{#each word.definitions as definition (definition.id)}
						<p>
							<i class="text-primary-800">- </i>
							{definition.content}
						</p>
					{/each}
					{#if word.definitions.length === 0}
						<p class="text-gray-500">
							no definitions
							<i class="text-primary-800">.</i>
						</p>
					{/if}
				</div>
			</div>
			<div class="flex flex-col gap-3">
				<h1 class="underline decoration-wavy">examples</h1>
				<div>
					{#each word.examples as example (example.id)}
						<p>
							<i class="text-primary-800">- </i>
							{example.content}
						</p>
					{/each}
					{#if word.examples.length === 0}
						<p class="text-gray-500">
							no examples
							<i class="text-primary-800">.</i>
						</p>
					{/if}
				</div>
			</div>
		</div>
	</AccordionItem>
	<AccordionItem
		borderOpenClass={accordionOpts.borderOpenClass}
		borderClass={accordionOpts.borderClass}
	>
		<span slot="header" class={accordionOpts.headerClass}>links</span>
		<div class="flex flex-col gap-10">
			{#each word.links as link (link.id)}
				<div>
					<p>
						<i class="text-primary-800">- </i>
						<span>
							{link.title}
							<ArrowRightSolid class="inline text-center"></ArrowRightSolid>
							{#each getLinkOtherWords(link.id) as word (word.id)}
								<span>
									{word.content}
								</span>
							{/each}
							{#if word.links.length === 0}
								<p class="text-gray-500">
									no links
									<i class="text-primary-800">.</i>
								</p>
							{/if}
						</span>
					</p>
				</div>
			{/each}
		</div>
	</AccordionItem>
</Accordion>
