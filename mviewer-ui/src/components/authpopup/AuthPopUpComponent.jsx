import React from 'react'
import authPopUpStyles from './authpopup.css'
import $ from 'jquery'
import Modal from 'react-modal'
import service from '../../gateway/service.js';

class AuthPopUpComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: this.props.modalIsOpen,
      message:'',
    }
  }

  closeModal() {
    this.setState({modalIsOpen : false});
  }

  componentWillReceiveProps(){
    this.setState({modalIsOpen: this.props.modalIsOpen});
  }



  render () {
    const customStyles = {
      content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        width                 : '25%',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)',
        zIndex                :  '4',
        borderRadius          :  '2px'
      }
    };

    return(
      <Modal
        isOpen={this.state.modalIsOpen}
        onRequestClose={this.closeModal.bind(this)}
        style = {customStyles}>
        <div className={authPopUpStyles.two}>
          <label>You Don't Have Previlages to {this.props.action}</label>
        </div>
      </Modal>
    );
  }
}

export default AuthPopUpComponent;
