import React from 'react';
import Formsy from 'formsy-react';
import classNames from 'classnames/bind';
import textCss from './TextInput.css';

Formsy.addValidationRule('isRequired', (values, value) => {
  return typeof value !== 'undefined' && value !== '' && value !== false;
});

const TextInput = React.createClass({
  // Add the Formsy Mixin
  mixins: [Formsy.Mixin],

  // setValue() will set the value of the component, which in
  // turn will validate it and the rest of the form
  changeValue(event) {
      this.setValue(event.currentTarget['value']);
  },
  render() {
     // An error message is returned ONLY if the component is invalid
     // or the server has returned an error message
     const errorMessage = this.getErrorMessage();
     return (
       <div className={textCss.formGroup + (this.props.className || ' ') + (this.showRequired() ? textCss.required : this.showError() ? textCss.error : '')}>
         <label htmlFor={this.props.name}>{this.props.title}</label>
         <input type={this.props.type || 'text'} name={this.props.name} placeholder={this.props.placeholder} onChange={this.changeValue} value={this.getValue()}  />
         <span className={textCss.validationError}>{errorMessage}</span>
       </div>
     );
  }
});

export default TextInput;