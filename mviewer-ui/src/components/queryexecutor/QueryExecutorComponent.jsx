import React from 'react'
import queryExecutorStyles from './queryexecutor.css'
import $ from 'jquery'

class QueryExecutorComponent extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
            collectionObjects:[],
            componentMounted:false,
            componentUpdated:false ,
            limit: '10',
            skip:'0',
            sort:'_id:-1',
            query: 'db.'+this.props.currentCollection+'.find({})'
      }
  }

  componentDidMount (){
    var that = this;
     $.ajax({
         type: "GET",
         dataType: 'json',
         credentials: 'same-origin',
         crossDomain: false,
         url : 'http://172.16.55.42:8080/mViewer-0.9.2/services/'+this.props.currentDb+'/'+this.props.currentCollection+'/document?query=db.'+this.props.currentCollection+'.find(%7B%7D)&connectionId='+this.props.connectionId+'&fields=""&limit=10&skip=0&sortBy=%7B_id%3A1%7D&allKeys=true',
         success: function(data) {
          var array = data.response.result.documents
          that.setState({collectionObjects:array})

         },

         error: function(jqXHR, exception) {

         }

     });


     }


  componentWillReceiveProps(nextProps){
     this.setState({query:'db.'+nextProps.currentCollection+'.find({})'});
     this.setState({collectionObjects:[]});
     this.setState({skip:'0'});
     this.setState({limit:'10'});
     this.setState({sort:'_id:-1'});
     var that = this;
      $.ajax({
          type: "GET",
          dataType: 'json',
          credentials: 'same-origin',
          crossDomain: false,
          url : 'http://172.16.55.42:8080/mViewer-0.9.2/services/'+nextProps.currentDb+'/'+nextProps.currentCollection+'/document?query='+'db.'+nextProps.currentCollection+'.find({})'+'&connectionId='+this.props.connectionId+'&fields=""&limit=10&skip=0&sortBy=%7B_id%3A1%7D&allKeys=true',
          success: function(data) {
          if(data.response.result!=undefined)
           {
             var array = data.response.result.documents;
             that.setState({collectionObjects:array});
          }
         if(data.response.error) {
              that.setState({collectionObjects:[]});
            }

          },

          error: function(jqXHR, exception) {

          }

      });

  }

  clickHandler(){
     var that = this;
     $.ajax({
         type: "GET",
         dataType: 'json',
         credentials: 'same-origin',
         crossDomain: false,
         url : 'http://172.16.55.42:8080/mViewer-0.9.2/services/'+this.props.currentDb+'/'+this.props.currentCollection+'/document?query='+this.state.query+'&connectionId='+this.props.connectionId+'&fields=""&limit='+this.state.limit+'&skip='+this.state.skip+'&sortBy={'+this.state.sort+'}&allKeys=true',
         success: function(data) {
         if(data.response.result!=undefined)
          {
            var array = data.response.result.documents;
            that.setState({collectionObjects:array});
         }
        if(data.response.error) {
             that.setState({collectionObjects:[]});
           }

         },

         error: function(jqXHR, exception) {

         }

     });
  }

  changeHandler(){
    return function(e) {
        this.setState({query:e.target.value});
    }.bind(this);
  }

  skipHandler(){
    return function(e) {
        this.setState({skip:e.target.value});
    }.bind(this);

  }

  limitHandler(){
    return function(e) {
        this.setState({limit:e.target.value});
    }.bind(this);

  }

  sortHandler(){
    return function(e) {
        this.setState({sort:e.target.value});
    }.bind(this);

  }

  hand(){

  }


  render () {
    var i =0;
    var items =null;

    var items = this.state.collectionObjects.map(function (collection) {


              return <textarea className={queryExecutorStyles.results} key={collection._id["counter"] || collection._id }value={JSON.stringify(collection,null,4)} onChange={this.hand.bind(this)}></textarea>

          }.bind(this));

    return(
      <div className = {queryExecutorStyles.mainContainer}>
        <div className={queryExecutorStyles.buffer}>
                        <div id="queryExecutor" className={queryExecutorStyles.tab}>Query Executor</div>
                        <div className={queryExecutorStyles.queryBoxDiv}>
        <div className={queryExecutorStyles.queryBoxlabels}>
        <label>Define Query</label>
        </div>
        <div className={queryExecutorStyles.textAreaContainer}>
          <textarea id="queryBox" name="queryBox" value={this.state.query} onChange = {this.changeHandler()} className= {queryExecutorStyles.queryBox} data-search_name="query">
          </textarea>
        </div>
      </div>
      <div className={queryExecutorStyles.parametersDiv}>
        <label htmlFor="skip"> Skip(No. of records) </label><br /><input id="skip" type="text" onChange = {this.skipHandler()} name="skip" value={this.state.skip} className={queryExecutorStyles.navigable} data-search_name="skip" /><br />
        <label htmlFor="limit"> Max page size: </label><br /><span><select id="limit" name="limit" onChange = {this.limitHandler()} value={this.state.limit} className={queryExecutorStyles.navigable} data-search_name="max limit" ><option value="10">10</option><option value="25">25</option><option value="50">50</option></select></span><br />
        <label htmlFor="sort"> Sort by fields </label><br /><input id="sort" type="text" onChange = {this.sortHandler()}name="sort" value={this.state.sort} className={queryExecutorStyles.navigable} data-search_name="sort" /><br /><br />
        <button id="execQueryButton" className={queryExecutorStyles.bttnNavigable} data-search_name="Execute Query" onClick = {this.clickHandler.bind(this)}>Execute Query</button>
        </div>
        </div>
        <div className={queryExecutorStyles.resultContainer} key={this.props.currentCollection}>
             {items}
        </div>
      </div>

    );
  }
}

export default QueryExecutorComponent;
