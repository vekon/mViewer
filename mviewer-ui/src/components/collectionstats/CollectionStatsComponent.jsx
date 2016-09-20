import React from 'react'
import collectionStatsStyles from './collectionstats.css'
import $ from 'jquery'
import Modal from 'react-modal'
import Config from '../../../config.json';

class CollectionStatsComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dbNames:[],
      connectionId: this.props.connectionId,
      collectionStats: [],
      selectedDB: null,
      sidebarOpen: false,
      modalIsOpen: false
    }
  }

  openModal() {
    var that = this;
    $.ajax({
      type: "GET",
      dataType: 'json',
      credentials: 'same-origin',
      crossDomain: false,
      url : Config.host+Config.service_path+'/services/stats/db/' + that.props.selectedDB + '/collection/'+that.props.selectedCollection+'?connectionId=' + this.props.connectionId,
      success: function(data) {
        that.setState({collectionStats: data.response.result});
      }, error: function(jqXHR, exception) {
      }
    });
    this.setState({modalIsOpen: true});
    this.setState({message: ''});

  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  render () {
    var that = this;
    return(

      <div className={collectionStatsStyles.mainContainer}>
        <span className={collectionStatsStyles.statsButton} onClick={this.openModal.bind(this)}><i className="fa fa-area-chart" aria-hidden="true"></i>Stats</span>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal.bind(this)}
          className={collectionStatsStyles.modal}>
          <div className={collectionStatsStyles.collectionStats}>
            {this.state.message}
            <h3 className={collectionStatsStyles.collectionStatsHeader}> Statistics: { that.state.selectedDB } </h3>
          <div>
          <table>
            <tbody>
              <tr>
                <th>Keys</th>
                <th>Values</th>
              </tr>
              {
                 this.state.collectionStats.map(function(db) {
                   return (<tr key={db.Key}><td>{db.Key}</td><td>{db.Value}</td></tr>)
                })
            }
            </tbody>
          </table>
          </div>
          </div>
    </Modal>
  </div>
    );
  }
}

export default CollectionStatsComponent;
