# JSModal

This project is configurable JavaScript CSS3 modal plugin.

##Features

- Can launch different modals based upon option sets
- Allows users to define custom transitions
- Responsive
- Configurable max/min width points
- Anchors to the top of the page if too tall
- Will remain centered otherwise
- No dependencies

## Dependencies

- None! (Hurray! It is all written in plain vanilla JS)

## Steps to Follow

- git clone - https://github.com/akiperez/JSMVC.git
- cd in JSModal
- open index.html


## Default Usage

var myModal = new Modal({
	modalType:'DefaultModal',
  	yesLabel:'Save',
  	noLabel:'Cancel',
  	autoOpen: false,
  	className: 'fade-and-drop',
  	closeButton: true,
  	message: 'This is the default message.',
  	maxWidth: 600,
  	minWidth: 280,
  	overlay: true
});
myModal.open();