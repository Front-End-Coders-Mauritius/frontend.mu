import type { VercelRequest, VercelResponse } from '@vercel/node';
import { echo } from './_picture';

export default async (req: VercelRequest, res: VercelResponse): Promise<void> => {
	try {
		const userId = req.headers['user-id'] as string;
		const accessToken = req.headers['access-token'] as string;

		let shout = echo('Welcome')

		res.status(200).json({
			userId: userId,
			accessToken: accessToken,
			shout: shout,
			// imageUrl: imageUrl,
		});

		// let imageUrl = await fetchPicture(accessToken, userId)

		// res.status(200).json({
		// 	imageUrl: imageUrl,
		// });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};
