export default function sleep(ms = 0): Promise<void> {
	return new Promise(res => {
		setInterval(res, ms);
	});
}