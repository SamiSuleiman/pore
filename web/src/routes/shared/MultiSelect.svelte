<script lang="ts">
	import { Label, Helper } from 'flowbite-svelte';
	import type { InputValidator } from './input';

	export let label = '';
	export let value: any[] = [];
	export let choices: any[] = [];
	export let validator: InputValidator | undefined = undefined;
	export let disabled = false;

	$: hasErr = !!validator?.errMsg && validator?.isTouched;

	function onChange(ev: Event & { currentTarget: EventTarget & HTMLSelectElement }) {
		const _selected = ev.currentTarget.selectedOptions;
		value = Array.from(_selected)
			.filter((v) => v.value !== '')
			.map((option) => option.value);
	}
</script>

<div class="mb-6 {disabled ? 'pointer-events-none' : ''}">
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
	<select multiple class="w-full rounded-md border-neutral-500 bg-neutral-800" on:change={onChange}>
		<option value=""> none </option>
		{#each choices as choice (choice.value)}
			<option selected={value.includes(choice.value)} class="p-3" value={choice.value}
				>{choice.name}</option
			>
		{/each}
	</select>
</div>
