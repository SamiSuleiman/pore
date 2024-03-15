<script>
	import { onMount } from 'svelte';
	import { isLoggedIn } from '../../stores/auth.store';
	import { goto } from '$app/navigation';
	import { Button } from 'flowbite-svelte';

	onMount(() => {
		if (!$isLoggedIn) goto('/');
	});
</script>
