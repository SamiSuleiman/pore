<script>
	import '../app.pcss';
	import { page } from '$app/stores';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	$: activeUrl = $page.url.pathname;
	import { isLoggedIn } from '../stores/auth.store';
</script>

<Navbar color="none">
	<NavBrand href="/">
		<img
			src="/images/flowbite-svelte-icon-logo.svg"
			class="me-3 h-6 text-white sm:h-9"
			alt="pore Logo"
		/>
		<span class="self-center whitespace-nowrap text-xl font-semibold text-white">pore</span>
	</NavBrand>
	<NavHamburger menuClass="text-white hover:text-gray-500" />
	<NavUl
		ulClass="flex flex-col p-4 mt-4 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:text-sm md:font-medium bg-neutral-800 border-transparent"
		nonActiveClass="text-gray-500 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-primary-700 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-neutral-800 dark:hover:text-white md:dark:hover:bg-transparent"
		{activeUrl}
	>
		<NavLi href="/words">words</NavLi>
		<NavLi href="/words">tags</NavLi>
		<NavLi href="/words">links</NavLi>
		<NavLi href="/words">sources</NavLi>
		<NavLi href="/">{$isLoggedIn ? 'profile' : 'login'}</NavLi>
	</NavUl>
</Navbar>
<slot />
