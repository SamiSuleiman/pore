<script>
	import { onMount } from 'svelte';
	import { login, navigateGithubToOAuth } from '$lib/data-access/auth';

	onMount(() => {
		// navigateGithubToOAuth();
		login();
	});
</script>

<p>this is the auth page, i have to figure out how to</p>
