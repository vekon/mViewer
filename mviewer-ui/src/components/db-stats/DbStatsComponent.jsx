import React from 'react';
import dbStatsStyles from './db-stats.css';
import $ from 'jquery';
import service from '../../gateway/service.js';

class DbStatsComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dbStats: {},
      selectedDB: null,
      sidebarOpen: false
    };
  }

  componentDidMount(){
    const that = this;
    let queryData = {};
    queryData['query'] = 'db.runCommand({dbStats:1})';
    queryData['fields'] = '';
    queryData['limit'] = 10;
    queryData['skip'] = 0;
    queryData['sortBy'] =  "{'_id':-1}";
    const partialUrl = 'db/' + that.props.selectedDB + '?connectionId=' + that.props.connectionId;
    const dbStatsCall = service('POST', partialUrl, JSON.stringify(queryData), 'query');
    dbStatsCall.then(this.success.bind(this), this.failure.bind(this));
  }

  success(data) {
    const that = this;
    let stats = [];
    const oldStats = data.response.result.documents;
    oldStats.length > 0 ? Object.keys(oldStats[0]).map(function(key) {
      if(typeof(oldStats[0][key]) == 'object') {
        Object.keys(oldStats[0][key]).map(function(item){
          const keyValue = key + '.' + item;
          stats.push({key: keyValue, value: oldStats[0][key][item]});
        });
      } else {
        stats.push({key: key, value: oldStats[0][key]});
      }
    }) : null;
    this.setState({dbStats: stats});
  }

  failure() {
  }

  render () {
    const that = this;
    return(
      <div className={dbStatsStyles.mainContainer}>
        { that.props.selectedDB  ?
          <div className={dbStatsStyles.dbStatsBody}>
            <table>
              <tbody>
                <tr>
                  <th>Keys</th>
                  <th>Values</th>
                </tr>
                { that.state.dbStats.length > 0 ? that.state.dbStats.map((item) => {
                    return <tr key={item.key}><td>{item.key}</td><td>{item.value}</td></tr>;
                }): null}
              </tbody>
            </table>
          </div>
          : null
        }
      </div>
    );
  }
}

export default DbStatsComponent;
