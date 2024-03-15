<script>
	import { logout } from '$lib/auth';
	import { Button } from 'flowbite-svelte';
</script>

<Button on:click={logout} color="red">logout</Button>
