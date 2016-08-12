import React from 'react'
import dbStatsStyles from './dbstats.css'
import $ from 'jquery'

class DbStatsComponent extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
          dbNames:['test1'],
          connectionId: this.props.connectionId,
          dbStats: {},
          selectedDB: null
      }
  }

  onClickHandler (item, e) {
//     $(function() {
//
//             alert('jquery');
//             $( this ).parent().find( 'li.active' ).removeClass( 'active' );
//             $( this ).addClass( 'active' );
//
// });
    var that = this;
    that.setState({selectedDB : item});
    console.log(that.state.selectedDB);
    $.ajax({
        type: "GET",
        dataType: 'json',
        credentials: 'same-origin',
        crossDomain: false,
        // url: 'http://localhost:8080/mViewer-0.9.2/services/db/this.dbName?connectionId='+ that.props.location.query.connectionId +'&query=db.runCommand(%7BdbStats%3A1%7D)&limit=10&skip=0&fields=&sortBy={_id:-1}',

        url : 'http://172.16.55.42:8080/mViewer-0.9.2/services/db/' + that.state.selectedDB + '?connectionId=' + this.state.connectionId + '&ts=1470390555265&query=db.runCommand(%7BdbStats%3A1%7D)&limit=10&skip=0&fields=&sortBy={_id:-1}',
        //url : 'http://localhost:8080/mViewer-0.9.2/services/db/' + that.state.selectedDB + '?connectionId=' + this.state.connectionId + '&ts=1470390555265&query=db.runCommand(%7BdbStats%3A1%7D)&limit=10&skip=0&fields=&sortBy={_id:-1}',
        success: function(data) {
          console.log(data);
          that.setState({dbStats: data.response.result.documents});
        },

        error: function(jqXHR, exception) {

        }
    });

  }

  componentDidMount(){
   var that = this;
   console.log(this.props.connectionId);
   console.log(this.state.connectionId + ' connectionId ')
    $.ajax({
        type: "GET",
        dataType: 'json',
        credentials: 'same-origin',
        crossDomain: false,
        // url: 'http://localhost:8080/mViewer-0.9.2/services/db/test?connectionId='+ that.props.location.query.connectionId +'&query=db.runCommand(%7BdbStats%3A1%7D)&limit=10&skip=0&fields=&sortBy={_id:-1}',

        url : 'http://172.16.55.42:8080/mViewer-0.9.2/services/login/details?connectionId='+ this.state.connectionId,
        //url : 'http://localhost:8080/mViewer-0.9.2/services/login/details?connectionId='+ this.state.connectionId,
        success: function(data) {
          console.log(data);
          that.setState({dbNames: data.response.result.dbNames});

        },

        error: function(jqXHR, exception) {

        }


    });

}

  render () {
    var that = this;
    return(
      <div className={dbStatsStyles.mainContainer}>

         <div className ={dbStatsStyles.listContainer}>
           <h2>Databases</h2>
          <ul className={dbStatsStyles.dbList}>
            {
                this.state.dbNames.map(function(dbName) {
                    let boundItemClick = that.onClickHandler.bind(that, dbName);
                    return <li key={dbName} onClick= {boundItemClick}><span className={dbStatsStyles.dbIcon}><i className="fa fa-database" aria-hidden="true"></i></span>{dbName}</li>
                })
            }
            </ul>
            </div>
            { that.state.selectedDB ?
                <div className={dbStatsStyles.dbStats}>
                    <h3 className={dbStatsStyles.dbStatsHeader}> Statistics: { that.state.selectedDB } </h3>
                        <div>
                            <table>
                                <tbody>
                                    <tr>
                                        <th>Keys</th>
                                        <th>Values</th>
                                    </tr>
                                    { Object.keys(that.state.dbStats[0]).map(function(key) {
                                        return <tr key={key}><td>{key}</td><td>{that.state.dbStats[0][key]}</td></tr>
                                    })}
                                </tbody>
                            </table>
                        </div>
                </div>
              : null
            }
      </div>
    );
  }
}

export default DbStatsComponent;
