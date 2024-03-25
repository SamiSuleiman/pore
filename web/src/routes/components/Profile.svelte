<script lang="ts">
	import { logout } from '$lib/auth';
	import { Button } from 'flowbite-svelte';
	import { getUserOverview } from '$lib/user';
	import { onMount } from 'svelte';
	import { Card, Avatar } from 'flowbite-svelte';
	import type { UserOverviewDto } from '$lib/user/models';

	let user: UserOverviewDto | undefined;

	onMount(async () => {
		user = await getUserOverview();
	});
</script>

<div class="w-full bg-neutral-800 lg:p-4">
	{#if user}
		<Card
			size="none"
			class="flex items-center gap-4 border-transparent bg-transparent shadow-transparent"
		>
			<div class="flex flex-col gap-3">
				<Button class="w-full font-bold" outline size="xs" on:click={logout} color="red"
					>logout</Button
				>
				<Avatar src={user.avatar} size="xl" rounded />
			</div>
			<div>
				<h5 class="bg-neutral-800 text-white">welcome, {user.name}</h5>
				<div class="pt-4">
					<p>word count: {user.wordCount}</p>
					<p>tag count: {user.tagCount}</p>
					<p>link count: {user.linkCount}</p>
					<p>source count: {user.sourceCount}</p>
				</div>
			</div>
		</Card>
	{/if}
</div>
