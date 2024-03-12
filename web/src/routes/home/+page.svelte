<script>
	import { Alert } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { isLoggedIn } from '../../stores/auth.store';
	import { goto } from '$app/navigation';

	onMount(() => {
		if (!$isLoggedIn) goto('/');
	});
</script>

<div class="p-8">
	<Alert>
		<span class="font-medium">Info alert!</span>
		Change a few things up and try submitting again.
	</Alert>
</div>
