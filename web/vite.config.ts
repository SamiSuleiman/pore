import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	 	server: {
 		port: 4200,
 		strictPort: true,
 	},

 	preview: {
 		port: 4173,
 		strictPort: false,
 	}
});
