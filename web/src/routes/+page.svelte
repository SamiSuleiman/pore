<script>
	import { isLoggedIn } from '../stores/auth.store';
	import Auth from './components/auth.svelte';
	import Profile from './components/profile.svelte';
</script>

{#if $isLoggedIn}
	<Profile />
{:else}
	<Auth />
{/if}
