import React from 'react'
import serverStatsStyles from './serverstats.css'
import $ from 'jquery'
import TreeView from 'react-json-tree'
import service from '../../gateway/service.js';

class ServerStatsComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      serverStats: {},
    }
  }

  componentDidMount(){
    var that = this;
    var partialUrl = 'stats?connectionId='+this.props.location.query.connectionId;
    var serverStatsCall = service('GET', partialUrl, '');
    serverStatsCall.then(this.success.bind(this), this.failure.bind(this));
  }

  success(data) {
    this.setState({serverStats : data.response.result});
  }

  failure() {
  }

  render () {
    var that = this;
    const getItemString = (type, data, itemType, itemString) => (<span></span>);
    return(
      <div className={serverStatsStyles.mainContainer}>
        <h3>Server Statistics</h3>
        <div className={serverStatsStyles.container}>
          <span className={serverStatsStyles.headContainer}>
            <span className={serverStatsStyles.key}>Key</span> <span className={serverStatsStyles.value}>Value</span>
          </span>
          <TreeView data={this.state.serverStats} shouldExpandNode={() => true } keyPath = {['Statistics']} key = {this.state.serverStats['host']} getItemString={getItemString}/>
        </div>
      </div>
    );
  }
}

export default ServerStatsComponent;
