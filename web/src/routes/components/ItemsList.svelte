<script lang="ts">
	import type { List } from '$lib/models';
	import { Button, Listgroup, Modal, Pagination, Spinner, Toast } from 'flowbite-svelte';
	import { FireSolid, PlusSolid } from 'flowbite-svelte-icons';
	import { createEventDispatcher } from 'svelte';

	export const dispatch = createEventDispatcher();

	export let list: List<any> = { items: [], count: 0 };
	export let pagerPages: { name: string; active: boolean }[] = [];
	export let isLoading = false;
	export let hasError: null | string = null;
	export let modalTitle = '';
	export let isOpen = false;
</script>

<div class="flex w-full flex-col gap-5 bg-neutral-800 sm:p-4">
	<Button
		on:click={() => dispatch('open')}
		color="none"
		class="text-primary-900 ring-neutral-800 hover:text-primary-700"
	>
		<PlusSolid></PlusSolid>
	</Button>
	{#if list.count > 0 && pagerPages.length > 1}
		<Pagination
			on:click={(e) => dispatch('paginate', e)}
			ulClass="flex justify-center align-middle"
			class=""
			activeClass="text-white border bg-primary-900 hover:bg-primary-800 hover:text-white"
			normalClass="text-gray-500 bg-white hover:bg-primary-800 hover:text-white bg-neutral-800"
			pages={pagerPages}
			on:previous={() => dispatch('previous')}
			on:next={() => dispatch('next')}
		/>
	{/if}
	<Listgroup
		active
		class="divide-y divide-gray-200 border-none bg-neutral-800 text-gray-300 dark:divide-gray-600"
	>
		<slot name="items" />
	</Listgroup>
	{#if hasError}
		<Toast
			class="z-50"
			divClass="w-full max-w-xs p-4 text-white bg-primary-900 shadow gap-3"
			on:close={() => (hasError = null)}
			position="bottom-right"
			color="red"
		>
			<FireSolid slot="icon" />
			<span>{hasError}</span>
		</Toast>
	{/if}
	{#if isLoading}
		<div class="flex h-32 items-center justify-center">
			<Spinner class="h-8 w-8 text-primary-500" />
		</div>
	{/if}
	<Modal
		color="none"
		defaultClass="max-h-full bg-neutral-800 text-white relative flex flex-col mx-auto"
		title={modalTitle}
		bind:open={isOpen}
		on:close={() => dispatch('close')}
	>
		<slot name="open" />
	</Modal>
	{#if list.count > 0 && pagerPages.length > 1}
		<Pagination
			on:click={(e) => dispatch('paginate', e)}
			ulClass="flex justify-center align-middle"
			class=""
			activeClass="text-white border bg-primary-900 hover:bg-primary-800 hover:text-white"
			normalClass="text-gray-500 bg-white hover:bg-primary-800 hover:text-white bg-neutral-800"
			pages={pagerPages}
			on:previous={() => dispatch('previous')}
			on:next={() => dispatch('next')}
		/>
	{/if}
</div>
