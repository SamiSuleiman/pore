<script>
	import { login } from '$lib/auth';
	import { onMount } from 'svelte';

	onMount(() => {
		// navigateGithubToOAuth();
		login();
	});
</script>
