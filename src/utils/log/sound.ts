import * as path from "node:path";
import { fileURLToPath } from "node:url";

import play from "play-sound";

const player = play();
const mediaDir = path.resolve(fileURLToPath(import.meta.url), "../../../../media");

async function playSound(file: string): Promise<void> {
	return new Promise((resolve, reject) => {
		player.play(path.join(mediaDir, file), (err: Error | null) => {
			if (err) reject(err);
			else resolve();
		});
	});
}

type FeedbackFunction = () => Promise<void>;

const error: FeedbackFunction = () => playSound("error.mp3");
const success: FeedbackFunction = () => playSound("success.mp3");
const warning: FeedbackFunction = () => playSound("warning.mp3");

export const sound = {
	error,
	success,
	warning,
};
