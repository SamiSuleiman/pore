<script>
	import { logout } from '$lib/auth';
	import { Button } from 'flowbite-svelte';
	import { userOverview } from '../../stores/user.store';
	import { getUserOverview } from '$lib/user';
	import { onMount } from 'svelte';
	import { Card, Avatar } from 'flowbite-svelte';

	onMount(async () => {
		if ($userOverview === undefined) userOverview.set(await getUserOverview());
	});
</script>

<div class="w-full bg-neutral-800 lg:p-4">
	{#if $userOverview}
		<Card
			size="none"
			class="flex items-center gap-4 border-transparent bg-transparent shadow-transparent"
		>
			<Avatar src={$userOverview.avatar} size="xl" rounded />
			<div>
				<h5 class="bg-neutral-800 text-white">welcome, {$userOverview.name}</h5>
				<div class="pt-4">
					<p>word count: {$userOverview.wordCount}</p>
					<p>tag count: {$userOverview.tagCount}</p>
					<p>link count: {$userOverview.linkCount}</p>
					<p>source count: {$userOverview.sourceCount}</p>
				</div>
			</div>
			<Button class="w-full" on:click={logout} color="red">logout</Button>
		</Card>
	{:else}
		<p>Loading...</p>
	{/if}
</div>
