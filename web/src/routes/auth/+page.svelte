<script>
	import { onMount } from 'svelte';
	import { navigateGithubToOAuth } from '$lib/data-access/auth';

	onMount(() => {
		navigateGithubToOAuth();
	});
</script>

<p>this is the auth page, i have to figure out how to</p>
