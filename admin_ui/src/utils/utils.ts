
export const fetchCall = (url: string, options: RequestInit, onSuccess: (json: any)=>void, onError: (e: Error)=>void): void => {

	fetch(url, options).then(result => {
			if(result.ok) {
				return result.json();
			}
			throw new Error(result.status.toString());
		})
		.then(json => {
			onSuccess(json);
		})
		.catch(e => {
			onError(e);
		});
}