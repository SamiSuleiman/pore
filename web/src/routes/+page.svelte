<script>
	import { isLoggedIn } from '../stores/auth.store';
	import Auth from './components/Auth.svelte';
	import Profile from './components/Profile.svelte';
</script>

{#if $isLoggedIn}
	<Profile />
{:else}
	<Auth />
{/if}
