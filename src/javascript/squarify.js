const app = document.getElementById('app')

let imageWidth
let imageHeight

const createCanvas = document.createElement('canvas')
createCanvas.id = 'image'
createCanvas.className = 'canvas'
app.appendChild(createCanvas)

const createToolbar = document.createElement('section')
createToolbar.className = 'toolbar'

const createFile = document.createElement('input')
createFile.id = 'file'
createFile.className = 'add-photo__input'
createFile.type = 'file'
createFile.accept = 'image/png, image/jpeg'
createToolbar.appendChild(createFile)

const createFileButton = document.createElement('label')
createFileButton.setAttribute('for', 'file')
createFileButton.className = 'button button--add-photo'
createFileButton.appendChild(document.createTextNode('Add photo'))
createToolbar.appendChild(createFileButton)

const rotateLink = document.createElement('button')
rotateLink.id = 'rotate-clockwise'
rotateLink.className = 'button buttton--rotate button--not-in-use'
rotateLink.appendChild(document.createTextNode('Rotate'))
createToolbar.appendChild(rotateLink)

rotateLink.addEventListener('click', (event) => {
	if (event.target.classList.contains('button--not-in-use')) return

	rotation = rotation >= 270 ? 0 : rotation + 90

	drawImage({ image })
})

const createDownloadLink = document.createElement('a')
createDownloadLink.id = 'target-link'
createDownloadLink.className = 'button button--download button--not-in-use'
createDownloadLink.appendChild(document.createTextNode('Download'))
createToolbar.appendChild(createDownloadLink)

app.appendChild(createToolbar)

const canvas = document.getElementById('image')
const ctx = canvas.getContext('2d')
const fileUploadr = document.getElementById('file')
const image = new Image()
const reader = new FileReader()

let filename
let rotation = 0
let dataURL

ctx.canvas.width  = (window.innerWidth >= 480) ? 480 : window.innerWidth
ctx.canvas.height = (window.innerWidth >= 480) ? 480 : window.innerWidth

const drawImage = ({image}) => {
	const whichIsTheLongestSide = (image.width >= image.height) ? image.width : image.height

	// Safari on iOS won't render a canvas if it exceeds maximum limit of
	// width * height 16777216, so we need to limit the canvas size. Bonus,
	// it runs a bit faster too.
	const longestSide = (whichIsTheLongestSide >= 2000) ? 2000 : whichIsTheLongestSide

	// Scale the image width and height if the image needs to be reduced
	// to fit within the maximum limit.
	const imageWidth = (image.width >= image.height ) ? longestSide : (longestSide / image.height) * image.width
	const imageHeight = (image.height >= image.width ) ? longestSide : (longestSide / image.width) * image.height

	// Add 2% of the width as a margin, so the image isn't flush with the side
	// of the canvas.
	const margin = ( longestSide / 100 ) * 2

	// Make the canvas the right size, which includes space for the margins.
	// TODO: make this margin user editable.
	const canvasWidthHeight = longestSide + (margin * 2)

	// Canvas dimensions are set from the top left, so we need to calculate
	// what the x and y coordinates are - these are different if the image
	// is portrait or landscape.
	const xPosition = (imageWidth >= imageHeight) ? margin : ((imageHeight - imageWidth) / 2) + margin
	const yPosition = (imageHeight >= imageWidth) ? margin : ((imageWidth - imageHeight) / 2) + margin

	// All clear please.
	ctx.clearRect(0, 0, canvas.width, canvas.height)

	// Set up the canvas.
	ctx.canvas.width = canvasWidthHeight
	ctx.canvas.height = canvasWidthHeight

	// Draw a white background.
	ctx.rect(0, 0, canvasWidthHeight, canvasWidthHeight)

	// TODO: make this background colour user editable.
	// TODO: make this colour selectable from the image itself with a colour
	// picker.
	ctx.fillStyle = '#ffffff'
	ctx.fill()

	// When rotating the image, we need to rejig the canvas a bit with
	// some translation.
	const rotationOffset = imageWidth  + ( 2 * xPosition)

	if (rotation === 90) ctx.translate(rotationOffset, 0)
	if (rotation === 180) ctx.translate(rotationOffset, rotationOffset)
	if (rotation === 270) ctx.translate(0, rotationOffset)

	ctx.rotate(rotation * Math.PI / 180)

	// Add the image to the canvas.
	ctx.drawImage(image, xPosition, yPosition, imageWidth, imageHeight)

	// Convert the canvas to a encoded dataURL to add to the download link.
	dataURL = canvas.toDataURL()
	document.getElementById('target-link').download = 'borders--' + filename
	document.getElementById('target-link').href = dataURL
}

reader.addEventListener('load', () => {
	image.src = reader.result

	document.querySelectorAll('.button--not-in-use')
		.forEach( (obj) => {
			obj.classList.remove('button--not-in-use')
		})
}, false)

fileUploadr.addEventListener('change', (event) => {
	reader.readAsDataURL(event.target.files[0])
	filename = event.target.files[0].name
}, false)

image.addEventListener('load', () => {
	drawImage({ image })
})
