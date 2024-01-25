import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

// Extract environment variables
const googleClientId = process.env.AUTH_GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.AUTH_GOOGLE_CLIENT_SECRET;


const directusApiEndpoint = 'https://directus.frontend.mu/users/me';

async function fetchPicture(accessToken: string, userId: string) {
	fetch(directusApiEndpoint, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	})
		.then((response: any) => response.json())
		.then(async (response: any) => {
			console.log(response)
			const userData = response.data;
			if (userData.auth_data === null) {
				console.log('Authdata is null, this is probably does not have the correct role');

			} else {
				const { refreshToken } = JSON.parse(userData.auth_data)
				let accessToken

				try {
					accessToken = await getAccessTokenFromGoogle(refreshToken);
				} catch (err) {
					throw new Error('Could not retrieve access token');
				}

				try {
					return await getProfilePictureFromGoogle(accessToken, userId)
				} catch (err) {
					throw new Error('Could not retrieve profile picture');
				}
			}

		})
		.catch((error: Error) => {
			console.error('Error fetching user data:', error.message);
		});
}


async function getAccessTokenFromGoogle(refreshToken: string) {

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
	return gAccessToken;
}

async function getProfilePictureFromGoogle(googleAccessToken: string, userId: string) {
	const userInfoEndpoint = 'https://www.googleapis.com/oauth2/v1/userinfo';
	const userInfoResponse = await axios.get(userInfoEndpoint, {
		params: {
			access_token: googleAccessToken,
		},
	});

	const googleUserInfo = userInfoResponse.data;
	var imageUrl = googleUserInfo['picture'];

	console.log(`Retrieved profile picture for user ${userId} : ${imageUrl}`)
	return imageUrl;


}

export default async (req: VercelRequest, res: VercelResponse): Promise<void> => {
	try {
		const userId = req.headers['user-id'] as string;
		const accessToken = req.headers['access-token'] as string;

		// let shout = await echo('Welcome')

		// res.status(200).json({
		// 	userId: userId,
		// 	accessToken: accessToken,
		// 	shout: shout,
		// 	// imageUrl: imageUrl,
		// });

		let imageUrl = await fetchPicture(accessToken, userId)
		console.log(imageUrl);
		res.status(200).json({
			imageUrl: imageUrl,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};
