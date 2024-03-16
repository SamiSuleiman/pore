<script>
	import '../app.pcss';
	import { page } from '$app/stores';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	$: activeUrl = $page.url.pathname;
	import { isLoggedIn } from '../stores/auth.store';
</script>

<Navbar color="none">
	<NavBrand href="/">
		<span
			class="self-center whitespace-nowrap text-xl font-bold text-white underline decoration-primary-800 decoration-wavy"
			>pore</span
		>
	</NavBrand>
	<NavHamburger menuClass="text-white hover:text-gray-500" />
	<NavUl
		ulClass="flex flex-col p-4 mt-4 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:text-sm md:font-medium bg-neutral-800 border-transparent"
		nonActiveClass="text-gray-500 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-primary-700 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-neutral-800 dark:hover:text-white md:dark:hover:bg-transparent"
		{activeUrl}
	>
		{#if $isLoggedIn}
			<NavLi activeClass="underline decoration-wavy text-primary-800 font-bold" href="/words"
				>words</NavLi
			>
			<NavLi activeClass="underline decoration-wavy text-primary-800 font-bold" href="/tags"
				>tags</NavLi
			>
			<NavLi activeClass="underline decoration-wavy text-primary-800 font-bold" href="/links"
				>links</NavLi
			>
			<NavLi activeClass="underline decoration-wavy text-primary-800 font-bold" href="/sources"
				>sources</NavLi
			>
		{/if}
		<NavLi activeClass="underline decoration-wavy text-primary-800 font-bold" href="/"
			>{$isLoggedIn ? 'profile' : 'login'}</NavLi
		>
	</NavUl>
</Navbar>
<slot />
