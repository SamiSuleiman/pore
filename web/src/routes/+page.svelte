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

<div class=" m-12 flex justify-center bg-gray-900 align-middle">
	<Card class="flex flex-col items-center gap-4 bg-gray-800 p-1 pb-4 ">
		<h5 class="bg-gray-800 font-bold text-white">Login/Sign up</h5>
		<Button on:click={onNavToGithub}
			>Continue with GitHub <GithubSolid class="ms-1"></GithubSolid></Button
		>
		<Button on:click={onNavToGoogle}
			>Continue with Google <GoogleSolid class="ms-1"></GoogleSolid></Button
		>
	</Card>
</div>
