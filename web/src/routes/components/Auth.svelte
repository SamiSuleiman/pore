<script>
	import { navigateToGoogleOAuth, login, navigateToGithubOAuth } from '$lib/auth';
	import { onMount } from 'svelte';
	import { GithubSolid, GoogleSolid } from 'flowbite-svelte-icons';
	import { Card } from 'flowbite-svelte';
	import { Button } from 'flowbite-svelte';

	onMount(() => {
		login();
	});

	function onNavToGithub() {
		navigateToGithubOAuth();
	}

	function onNavToGoogle() {
		navigateToGoogleOAuth();
	}
</script>

<div class="w-full bg-neutral-800 lg:p-4">
	<Card
		size="none"
		class="flex items-center gap-4 border-transparent bg-transparent shadow-transparent"
	>
		<h1 class="mb-8 bg-neutral-800 text-4xl font-bold text-white">login / sign up</h1>
		<Button size="sm" outline class="w-full border-none md:w-1/2" on:click={onNavToGithub}>
			<span
				class="hover:devoration-white text-white underline decoration-primary-900 decoration-wavy"
				>continue with gitHub</span
			>
			<GithubSolid class="ms-1"></GithubSolid></Button
		>
		<Button size="sm" outline class="w-full border-none md:w-1/2" on:click={onNavToGoogle}
			><span
				class="text-white underline decoration-primary-900 decoration-wavy hover:decoration-white"
				>continue with google</span
			>
			<GoogleSolid class="ms-1"></GoogleSolid></Button
		>
	</Card>
</div>
