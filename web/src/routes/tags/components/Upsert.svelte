<script lang="ts">
	import type { TagDto, UpsertTagDto } from '$lib/tag/model';
	import { createEventDispatcher } from 'svelte';
	import type { InputValidator } from '../../shared/input';
	import { required } from '../../shared/validators';
	import { addTag, updateTag } from '$lib/tag';
	import { isOutdated } from '../../../stores/tag.store';

	export let tag: TagDto | null = null;
	const dispatch = createEventDispatcher();

	const invalidFormErrMsg = 'please fill in all required fields';
	let success = false;

	let form: UpsertTagDto = {
		title: '',
		desc: '',
		color: '',
		wordIds: [],
	};

	let validators: Record<string, InputValidator> = {
		title: {
			fn: required,
			errMsg: '',
			isTouched: false,
		},
	};

	$: {
		success = false;
		for (const entry of Object.entries(validators)) {
			const [key, validator] = entry;
			// @ts-ignore
			validator.errMsg = validator.fn(form[key as any]);
			validators = { ...validators, [key]: validator };
		}
	}

	$: err = Object.values(validators).some((v) => v.errMsg !== '' && v.isTouched)
		? invalidFormErrMsg
		: '';

	let isSubmitting = false;

	async function onSubmit(): Promise<void> {
		success = false;
		isSubmitting = true;
		err = '';
		if (Object.values(validators).some((v) => v.errMsg !== '')) {
			err = invalidFormErrMsg;
			isSubmitting = false;
			return;
		}

		let res = tag ? await updateTag(tag.id, form) : addTag(form);
		isSubmitting = false;

		if (res) {
			$isOutdated = true;
			dispatch('create');
			success = true;
		} else err = 'something went wrong';
	}
</script>

upsert boyyyy
