import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import { nodeResolve } from '@rollup/plugin-node-resolve';
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
		nodeResolve(),
		typescript({
			tsconfig: 'tsconfig.json',
		}),
		postcss({
			extensions: ['.css'],
			minimize: true,
			modules: false,
			extract: 'styles.css',
		}),
	],
	external: [
		'react',
		'react-dom',
		'lucide-react',
		'swr',
		'zustand',
		'tailwindcss',
		'clsx',
	],
});
