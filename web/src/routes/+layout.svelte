<script>
	import '../app.pcss';
	import { page } from '$app/stores';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	$: activeUrl = $page.url.pathname;
</script>

<Navbar>
	<NavBrand href="/">
		<img src="/images/flowbite-svelte-icon-logo.svg" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" />
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">pore</span>
	</NavBrand>
	<NavHamburger />
	<NavUl {activeUrl}>
		<NavLi href="/home">home</NavLi>
		<NavLi href="/">account</NavLi>
	</NavUl>
</Navbar>
<slot />
