import React from 'react'
import modalStyles from '../shared/modal.css'
import $ from 'jquery'
import modal from 'react-modal'

class ModalComponent extends React.Component {

 constructor(props) {
      super(props);
      this.state = {
          modalIsOpen: false
      }
  }

 getInitialState () {
    return { modalIsOpen: false };
  }

  openModal () {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal () {
    // references are now sync'd and can be accessed.
    this.refs.subtitle.style.color = '#f00';
  }

  closeModal () {
    this.setState({modalIsOpen: false});
  }

    render: function() {
        return (
          <div>
            <modal
              isOpen={this.state.modalIsOpen}
              onAfterOpen={this.afterOpenModal}
              onRequestClose={this.closeModal}
              style={customStyles} >

              <h2 ref="subtitle">Hello</h2>
              <button onClick={this.closeModal}>close</button>
              <div>I am a modal</div>
              <form>
                <input />
                <button>tab navigation</button>
                <button>stays</button>
                <button>inside</button>
                <button>the modal</button>
              </form>
            </modal>
          </div>
        );
      }
    });

}

export default ModalComponent;
