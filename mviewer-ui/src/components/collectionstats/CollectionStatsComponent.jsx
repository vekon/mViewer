import React from 'react'
import collectionStatsStyles from './collectionstats.css'
import $ from 'jquery'
import Modal from 'react-modal'
import service from '../../gateway/service.js';

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
    var partialUrl = 'stats/db/' + this.props.selectedDB + '/collection/'+this.props.selectedCollection+'?connectionId=' + this.props.connectionId;
    var collectionStatsCall = service('GET', partialUrl, '');
    collectionStatsCall.then(this.success.bind(this), this.failure.bind(this));
    this.setState({modalIsOpen: true});
  }

  success(data) {
    this.setState({collectionStats: data.response.result});
  }

  failure() {
    this.setState({ message: 'Unexpected Error Occurred' })
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
            <div className={collectionStatsStyles.header}>
              <span className={collectionStatsStyles.text}>Statistics</span>
            </div>
          <div className = {collectionStatsStyles.tableBody}>
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
