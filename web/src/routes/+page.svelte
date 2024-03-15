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
		<h5 class="bg-neutral-800 font-bold text-white">Login / Sign up</h5>
		<Button class="w-full" on:click={onNavToGithub}
			>Continue with GitHub <GithubSolid class="ms-1"></GithubSolid></Button
		>
		<Button class="w-full" on:click={onNavToGoogle}
			>Continue with Google <GoogleSolid class="ms-1"></GoogleSolid></Button
		>
	</Card>
</div>
