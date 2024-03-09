import { NoImageColors } from '@prisma/client'

const generateNoImageColor = (): NoImageColors => {
	const random = Math.floor(Math.random() * 5)
	switch (random) {
		case 0:
			return 'orange'
		case 1:
			return 'red'
		case 2:
			return 'green'
		case 3:
			return 'blue'
		case 4:
			return 'yellow'
		default:
			return 'orange'
	}
}

export default generateNoImageColor
