//@ts-ignore
import { env as e} from '$env/dynamic/public';

export const env = {
	baseUrl: e.PUBLIC_BASE_URL,
}
