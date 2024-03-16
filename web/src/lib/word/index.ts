import { env } from '$lib/env';
import { del, get, post, put } from '$lib/http';
import { type AddWordDto, type UpdateWordDto, type WordDto, type WordPreviewDto } from './model';

const WORDS_URL = `${env.baseUrl}/words`;

export async function getWords(): Promise<WordPreviewDto[] | undefined> {
	return get<WordPreviewDto[]>(`${WORDS_URL}`);
}

export async function getWord(id: string): Promise<WordDto | undefined> {
	return get<WordDto>(`${WORDS_URL}/${id}`);
}

export async function addWord(word: AddWordDto): Promise<void> {
	post<AddWordDto>(`${WORDS_URL}`, word);
}

export async function updateWord(id: string, word: UpdateWordDto): Promise<boolean> {
	return put<UpdateWordDto>(`${WORDS_URL}/${id}`, word);
}

export async function deleteWord(id: string): Promise<boolean> {
	return del(`${WORDS_URL}/${id}`);
}
