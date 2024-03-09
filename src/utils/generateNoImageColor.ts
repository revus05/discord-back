import { NoImageColors } from '@prisma/client'

const generateNoImageColor = (): NoImageColors => {
	const random = Math.floor(Math.random() * 5)
	switch (random) {
		case 1:
			return 'orange'
		case 2:
			return 'red'
		case 3:
			return 'green'
		case 4:
			return 'blue'
		case 5:
			return 'yellow'
	}
}

export default generateNoImageColor
