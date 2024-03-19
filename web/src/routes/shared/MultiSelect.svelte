<script lang="ts">
	import { Label, Helper, MultiSelect } from 'flowbite-svelte';
	import type { InputValidator } from './input';

	export let label = '';
	export let value: any[] = [];
	export let choices: any[] = [];
	export let validator: InputValidator | undefined = undefined;

	$: hasErr = !!validator?.errMsg && validator?.isTouched;
</script>

<div class="mb-6">
	<Label for={label} class="mb-2 flex justify-between text-white">
		<span class={hasErr ? 'font-bold text-primary-800 underline decoration-wavy' : 'font-bold'}
			>{label}</span
		>
		{#if hasErr}
			<Helper class="mt-2" color="red"
				><span class="font-medium">
					{validator?.errMsg}
				</span></Helper
			>
		{/if}
	</Label>
	<MultiSelect
		items={choices}
		dropdownClass="bg-neutral-800 text-white [&>*]:bg-neutral-800 [&>*]:text-white [&>*:hover]:hover:bg-primary-900 [&>*:hover]:hover:text-white"
		size="sm"
		color={hasErr ? 'red' : 'base'}
		bind:value
		id={label}
		name={label}
		on:blur|once={() => {
			if (validator) {
				validator.isTouched = true;
			}
		}}
	/>
</div>
