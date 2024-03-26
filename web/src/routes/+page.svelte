<script>
	import { isLoggedIn } from '../stores/auth.store';
	import Auth from './components/Auth.svelte';
	import Profile from './components/Profile.svelte';
</script>

<svelte:head>
	{#if $isLoggedIn}
		<title>pore | welcome</title>
	{:else}
		<title>pore | authenticate</title>
	{/if}
</svelte:head>

{#if $isLoggedIn}
	<Profile />
{:else}
	<Auth />
{/if}
