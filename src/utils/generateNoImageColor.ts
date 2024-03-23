import { NoImageColors } from '@prisma/client'

const generateNoImageColor = (): NoImageColors => {
	const random = Math.floor(Math.random() * 9)
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
		case 5:
			return 'purple'
		case 6:
			return 'lime'
		case 7:
			return 'pink'
		case 8:
			return 'crimson'
		default:
			return 'orange'
	}
}

export default generateNoImageColor
