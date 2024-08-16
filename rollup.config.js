import typescript from 'rollup-plugin-typescript2';
import { defineConfig } from 'rollup';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default defineConfig({
	input: 'src/index.ts',
	output: [
		{
			file: pkg.main,
			format: 'cjs',
			exports: 'named',
			sourcemap: true,
		},
		{
			file: pkg.module,
			format: 'es',
			exports: 'named',
			sourcemap: true,
		},
	],
	plugins: [
		typescript({
			tsconfig: 'tsconfig.json',
		}),
	],
	external: ['react', 'react-dom', 'lucide-react', 'swr', 'zustand', 'tailwindcss'],
});
