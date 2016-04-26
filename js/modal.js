// Create an immediately invoked functional expression to wrap our code
(function() {

  // Define our constructor 
  this.Modal = function() {

    // Create global element references
    this.closeButton = null;
    this.modal = null;
    this.overlay = null;

    // Determine proper prefix
    this.transitionEnd = transitionSelect();

    // Define option defaults 
      
    var defaults = {
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
    }

    // Create options by extending defaults with the passed in arugments
    if (arguments[0] && typeof arguments[0] === "object") {
      this.options = extendDefaults(defaults, arguments[0]);
    }

    if (this.options.autoOpen === true){
      this.open();
    } 

  }

  // Public Methods

  Modal.prototype.close = function() {
    var _ = this;
    this.modal.className = this.modal.className.replace(" modalManager-open", "");
    this.overlay.className = this.overlay.className.replace(" modalManager-open",
      "");
    this.modal.addEventListener(this.transitionEnd, function() {
      _.modal.parentNode.removeChild(_.modal);
    });
    this.overlay.addEventListener(this.transitionEnd, function() {
      if (_.overlay.parentNode) _.overlay.parentNode.removeChild(_.overlay);
    });
  }

  Modal.prototype.open = function() {
    buildModal.call(this);
    initializeEvents.call(this);
    window.getComputedStyle(this.modal).height;
    this.modal.className = this.modal.className +
      (this.modal.offsetHeight > window.innerHeight ?
        " modalManager-open modalManager-anchored" : " modalManager-open");
    this.overlay.className = this.overlay.className + " modalManager-open";
  }

  // Private Methods

  function buildModal() {

    var message, contentHolder, docFrag;

    /*
     * If content is an HTML string, append the HTML string.
     * If content is not return false, can be expanded later to grab a dom element and present in modal
     */

    if (typeof this.options.message === "string") {
      message = this.options.message;
    } else {
      return false
    }

    // Create a DocumentFragment to build with
    docFrag = document.createDocumentFragment();

    // Create modal element
    this.modal = document.createElement("div");
    this.modal.className = "modalManager-modal " + this.options.className;
    this.modal.style.minWidth = this.options.minWidth + "px";
    this.modal.style.maxWidth = this.options.maxWidth + "px";

    // If closeButton option is true, add a close button
    if (this.options.closeButton === true) {
      this.closeButton = document.createElement("button");
      this.closeButton.className = "modalManager-close close-button";
      this.closeButton.innerHTML = "&times;";
      this.modal.appendChild(this.closeButton);
    }

    // If overlay is true, add one
    if (this.options.overlay === true) {
      this.overlay = document.createElement("div");
      this.overlay.className = "modalManager-overlay " + this.options.className;
      docFrag.appendChild(this.overlay);
    }

    // Create content area and append to modal
    contentHolder = document.createElement("div");
    contentHolder.className = "modalManager-content";
    contentHolder.innerHTML = "<h2>"+message+"</h2>";
    this.modal.appendChild(contentHolder);

    if (this.options.modalType === 'YesNoModal') {
      //Create button Wrapper
      this.buttonWrapper = document.createElement("div");
      this.buttonWrapper.className = "modalManager-button-wrapper ";
      contentHolder.appendChild(this.buttonWrapper);

      //Create No Button
      this.noButton = document.createElement("button");
      this.noButton.className = "modalManager-cancel modalManager-cancel-button";
      this.noButton.type = "button";
      this.noButton.innerHTML = this.options.noLabel;
      //contentHolder.appendChild(this.noButton);
      this.buttonWrapper.appendChild(this.noButton);

      //Create Yes Button
      this.yesButton = document.createElement("button");
      this.yesButton.className = "modalManager-confirm modalManager-confirm-button";
      this.yesButton.type = "button";
      this.yesButton.id = "saveButton";
      this.yesButton.innerHTML = this.options.yesLabel;
      //contentHolder.appendChild(this.yesButton);
      this.buttonWrapper.appendChild(this.yesButton);
    
    } else if (this.options.modalType === 'InputModal') {
      this.form = document.createElement("form");
      this.form.id = "myForm";
      this.form.className = "modalManager-form";
      //this.form.action = "";
      contentHolder.appendChild(this.form);

      //Create Text Input
      this.inputControl = document.createElement("input");
      this.inputControl.type = "text" ;
      this.inputControl.id = "inputText";
      this.inputControl.name = "myFormTextInput";
      this.inputControl.className = "modalManager-input-text modalManager-input";
      this.form.appendChild(this.inputControl);

      //Create button Wrapper
      this.buttonWrapper = document.createElement("div");
      this.buttonWrapper.className = "modalManager-button-wrapper ";
      this.form.appendChild(this.buttonWrapper);

      //Create No Button
      this.noButton = document.createElement("button");
      this.noButton.className = "modalManager-cancel modalManager-cancel-button";
      this.noButton.type = "button";
      this.noButton.innerHTML = this.options.noLabel;
      this.buttonWrapper.appendChild(this.noButton);

      //Create Yes Button
      this.yesButton = document.createElement("button");
      this.yesButton.className = "modalManager-confirm modalManager-confirm-button";
      this.yesButton.type = "submit";
      this.yesButton.innerHTML = this.options.yesLabel;
      this.buttonWrapper.appendChild(this.yesButton);

    } else {
      //console.log('We need to make a DefaultModal');
    }

    // Append modal to DocumentFragment
    docFrag.appendChild(this.modal);

    // Append DocumentFragment to body
    document.body.appendChild(docFrag);

    //if YesNoModal events
    if(this.options.modalType === 'YesNoModal'){
      saveButtonPressed();
    }

    //if InputModal events
    if(this.options.modalType === 'InputModal'){
      catchSubmit();
    }

  }

  function extendDefaults(source, properties) {
    var property;
    for (property in properties) {
      if (properties.hasOwnProperty(property)) {
        source[property] = properties[property];
      }
    }
    return source;
  }

  function initializeEvents() {

    if (this.closeButton) {
      this.closeButton.addEventListener('click', this.close.bind(this));
    }

    if (this.overlay) {
      this.overlay.addEventListener('click', this.close.bind(this));
    }

    if (this.noButton) {
      this.noButton.addEventListener('click', this.close.bind(this));
    }

    //Listen for Esc / Enter Keys
    document.onkeydown = function(e){
      if (e == null) { // ie
        keycode = e.keyCode;
      } else { // mozilla
        keycode = e.which;
      }
      // escape, close box, esc
      if(keycode == 27){
        escapeModal();
      }

      // enter
      if(keycode == 13){
        //We could be catching the enter button presses here
        //console.log('we could be stopping this'); 
      }  
    
    };

  }

  function catchSubmit(){
    var myForm = document.getElementById("myForm");
    myForm.addEventListener("submit", function(event) {
      event.preventDefault();
      // actual logic, e.g. validate the form
      var inputValue = document.getElementById('inputText').value;
      alert("Form submission = "+inputValue);
      escapeModal();
    });

  }

  function saveButtonPressed(){
    var saveButton = document.getElementById('saveButton');
    saveButton.addEventListener("click", function(event) {
      event.preventDefault();
      alert("Save Pressed");
      escapeModal();
    });

  }

  function escapeModal(){
    var x = document.getElementsByClassName("modalManager-close");
    x[0].click();
  }

  function transitionSelect() {
    var el = document.createElement("div");
    if (el.style.WebkitTransition) return "webkitTransitionEnd";
    if (el.style.OTransition) return "oTransitionEnd";
    return 'transitionend';
  }

}());

//Default Usage
// var myModal = new Modal({
  // modalType:'DefaultModal',
  // yesLabel:'Save',
  // noLabel:'Cancel',
  // autoOpen: false,
  // className: 'fade-and-drop',
  // closeButton: true,
  // message: 'This is the default message.',
  // maxWidth: 600,
  // minWidth: 280,
  // overlay: true
// });
//myModal.open();