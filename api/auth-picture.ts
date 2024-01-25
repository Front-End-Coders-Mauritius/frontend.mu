import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async (req: VercelRequest, res: VercelResponse): Promise<void> => {
	try {
		// Extract environment variables
		const googleClientId = process.env.AUTH_GOOGLE_CLIENT_ID;
		const googleClientSecret = process.env.AUTH_GOOGLE_CLIENT_SECRET;

		const userId = req.headers['user-id'] as string;
		const accessToken = req.headers['access-token'] as string;


		const directusApiEndpoint = 'https://directus.frontend.mu/users/me';


		let refreshToken

		axios.get(directusApiEndpoint, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		})
			.then((response: any) => {
				const userData = response.data;
				if ('refreshToken' in userData) {
					refreshToken = userData.refreshToken;
				} else {
					console.log('Refresh Token not found in the response.');
				}
			})
			.catch((error: Error) => {
				console.error('Error fetching user data:', error.message);
			});


		const tokenEndpoint = 'https://accounts.google.com/o/oauth2/token';
		const tokenResponse = await axios.post(tokenEndpoint, null, {
			params: {
				client_id: googleClientId,
				client_secret: googleClientSecret,
				refresh_token: refreshToken,
				grant_type: 'refresh_token',
			},
		});

		const gAccessToken = tokenResponse.data.access_token;

		const userInfoEndpoint = 'https://www.googleapis.com/oauth2/v1/userinfo';
		const userInfoResponse = await axios.get(userInfoEndpoint, {
			params: {
				access_token: gAccessToken,
			},
		});

		const googleUserInfo = userInfoResponse.data;
		var imageUrl = googleUserInfo['picture'];

		console.log(`Retrieved profile picture for user ${userId} : ${imageUrl}`)

		res.status(200).json({
			imageUrl: imageUrl,

		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};
