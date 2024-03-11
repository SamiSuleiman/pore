<script>
	import { goto } from '$app/navigation';
	import { Alert } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { isLoggedIn } from '../stores/auth.store';

	onMount(() => {
		console.log($isLoggedIn);
		goto('/auth');
	});
</script>

<div class="p-8">
	<Alert>
		<span class="font-medium">Info alert!</span>
		Change a few things up and try submitting again.
	</Alert>
</div>
