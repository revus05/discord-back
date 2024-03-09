import { JwtPayload } from 'jsonwebtoken'
import * as JWT from 'jsonwebtoken'
import { ErrorMessage, SuccessMessage } from '../types/Messages'

export type GetIdWithJwtResponse = SuccessMessage<'Authorized', { id: number }> | ErrorMessage<'Unauthorized'>

const getIdWithJwt = (jwt: string): GetIdWithJwtResponse => {
	try {
		let jwtPayload = JWT.verify(jwt, process.env.SECRET) as JwtPayload
		const id = jwtPayload.id
		if (!id) {
			return {
				success: false,
				message: 'Unauthorized',
			}
		}
		return {
			success: true,
			message: 'Authorized',
			payload: { id },
		}
	} catch (e) {
		return {
			success: false,
			message: 'Unauthorized',
		}
	}
}

export default getIdWithJwt
