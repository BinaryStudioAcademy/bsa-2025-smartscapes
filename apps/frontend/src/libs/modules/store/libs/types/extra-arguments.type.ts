import { type Storage } from "~/libs/modules/storage/storage.js";
import { type toastNotifier } from "~/libs/modules/toast-notifier/toast-notifier.js";
import { type authApi } from "~/modules/auth/auth.js";
import { type userApi } from "~/modules/users/users.js";

type ExtraArguments = {
	authApi: typeof authApi;
	storage: Storage;
	toastNotifier: typeof toastNotifier;
	userApi: typeof userApi;
};

export { type ExtraArguments };
