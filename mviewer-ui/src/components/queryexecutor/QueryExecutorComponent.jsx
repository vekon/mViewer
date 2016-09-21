import React from 'react'
import queryExecutorStyles from './queryexecutor.css'
import TreeView from '../treeview/TreeViewComponent.jsx'
import $ from 'jquery'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import Config from '../../../config.json'
import update from 'react-addons-update'
import DeleteComponent from '../deletecomponent/DeleteComponent.jsx'
import NewCollection from '../newcollection/newCollectionComponent.jsx'
import NewDocument from '../newdocument/newDocumentComponent.jsx'
import CollectionStats from '../collectionstats/CollectionStatsComponent.jsx'
import Document from '../document/DocumentComponent.jsx'
import NewFile from '../newfile/NewFileComponent.jsx'
class QueryExecutorComponent extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
            collectionObjects:[],
            startLabel: 0,
            endLabel: 0,
            componentMounted:false,
            componentUpdated:false ,
            selectedTab:0,
            limit: 10,
            skip: 0,
            sort:'_id:-1',
            totalCount: 0,
            data: [],
            offset: 0,
            skipValue:0,
            limitValue:10,
            fields: [],
            modalIsOpen: false,
            singleDocument: '',
            query: this.props.queryType == "collection" ? 'db.'+this.props.currentItem+'.find({})' :
                   'db.'+this.props.currentItem+'.files.find({})'
      }
  }

  openModal() {
    this.setState({modalIsOpen: true});
    this.setState({message: ''});
  }

  closeModal(successMessage) {
    this.setState({modalIsOpen: false});
    if (successMessage == true){
      this.props.refreshCollectionList(false);
    }

  }

  getAttributes (currentDb,currentItem, connectionId) {
    var that = this;
    $.ajax({
      type: "GET",
      dataType: 'json',
      credentials: 'same-origin',
      crossDomain: false,
      url : Config.host+Config.service_path+'/services/'+currentDb+'/'+currentItem+'/document/keys?connectionId='+connectionId+'&allKeys=true',
      success: function(data) {
        var arr = data.response.result.keys;
        var newArr = [];
        for(var i=0; i < arr.length; i++) {
          newArr.push({"value": arr[i], "selected" :true});
        }
        that.setState({fields:newArr});
      }, error: function(jqXHR, exception) {
      }
    });
  }

  componentDidMount (){
    var that = this;
    var currentDb = this.props.currentDb;
    var currentItem = this.props.currentItem;
    var connectionId = this.props.connectionId;
    var url = this.props.queryType == "collection" ? Config.host+Config.service_path+'/services/'+currentDb+'/'+currentItem+'/document?query='+this.state.query+'&connectionId='+connectionId+'&fields=""&limit=10&skip=0&sortBy=%7B_id%3A1%7D&allKeys=true' :
              Config.host+Config.service_path+'/services/'+currentDb+'/gridfs/'+currentItem+'/getfiles?query='+this.state.query+'&fields=""&limit=10&skip=0&sortBy=%7B_id%3A1%7D&connectionId='+connectionId;
    $.ajax({
      type: "GET",
      dataType: 'json',
      credentials: 'same-origin',
      crossDomain: false,
      url : url,
      success: function(data) {
        var array = data.response.result.documents;
        that.setState({collectionObjects:array});
        that.props.queryType == "collection" ? that.getAttributes(currentDb,currentItem, connectionId) : null;
        that.props.queryType == "fs" ?
            $.ajax({
              type: "GET",
              dataType: 'json',
              credentials: 'same-origin',
              crossDomain: false,
              url :  Config.host+Config.service_path+'/services/'+currentDb+'/gridfs/'+currentItem+'/count?connectionId='+connectionId,
              success: function(data) {
                that.setState({totalCount:data.response.result.count});
                if (that.state.skipValue < that.state.totalCount) {
                  var size = that.state.skipValue + that.state.limitValue;
                  that.setState({startLabel:(that.state.totalCount != 0 ? that.state.skipValue + 1 : 0)})
                  that.setState({endLabel:(that.state.totalCount <= size ? that.state.totalCount : that.state.skipValue + that.state.limitValue)})
                }
              }, error: function(jqXHR, exception) {
              }
            })
            : that.setState({totalCount:data.response.result.count});
              if (that.state.skipValue < that.state.totalCount) {
                var size = that.state.skipValue + that.state.limitValue;
                that.setState({startLabel:(that.state.totalCount != 0 ? that.state.skipValue + 1 : 0)})
                that.setState({endLabel:(that.state.totalCount <= size ? that.state.totalCount : that.state.skipValue + that.state.limitValue)})
              };
            if(data.response.error) {
              that.setState({collectionObjects:[]});
            }
        }, error: function(jqXHR, exception) {
      }
    });
  }


  componentWillReceiveProps(nextProps){
    this.setState({selectedTab:0});
    this.setState({query:this.props.queryType == "collection" ? 'db.'+this.props.currentItem+'.find({})' :
                         'db.'+this.props.currentItem+'.files.find({})'});
    this.setState({collectionObjects:[]});
    this.setState({skip:0});
    this.setState({limit:10});
    this.setState({sort:'_id:-1'});
    var currentDb = nextProps.currentDb;
    var currentItem = nextProps.currentItem;
    var connectionId = this.props.connectionId;
    var url = this.props.queryType == "collection" ? Config.host+Config.service_path+'/services/'+currentDb+'/'+currentItem+'/document?query=db.'+currentItem+'.find(%7B%7D)&connectionId='+connectionId+'&fields=""&limit=10&skip=0&sortBy=%7B_id%3A1%7D&allKeys=true' :
              Config.host+Config.service_path+'/services/'+currentDb+'/gridfs/'+currentItem+'/getfiles?query=db.'+currentItem+'.files.find(%7B%7D)&fields=""&limit=10&skip=0&sortBy=%7B_id%3A1%7D&connectionId='+connectionId;
    this.setState({query:nextProps.queryType == "collection" ? 'db.'+currentItem+'.find({})' :
                                   'db.'+currentItem+'.files.find({})'});

    var that = this;
    $.ajax({
      type: "GET",
      dataType: 'json',
      credentials: 'same-origin',
      crossDomain: false,
      url : url,
      success: function(data) {
        if(data.response.result!=undefined)
        {
          var array = data.response.result.documents;
          that.setState({collectionObjects:array});
          that.props.queryType == "collection" ? that.getAttributes(currentDb,currentItem, connectionId) : null;
          that.props.queryType == "fs" ?
              $.ajax({
                type: "GET",
                dataType: 'json',
                credentials: 'same-origin',
                crossDomain: false,
                url :  Config.host+Config.service_path+'/services/'+currentDb+'/gridfs/'+currentItem+'/count?connectionId='+connectionId,
                success: function(data) {
                  that.setState({totalCount:data.response.result.count});
                  that.setState({totalCount:data.response.result.count});
                  if (data.response.result.count < 10)
                  {
                    that.setState({limitValue:data.response.result.count});
                    that.setState({skipValue:0});
                  }
                  else {
                    that.setState({limitValue:that.state.limit});
                    that.setState({skipValue:0});
                  }
                  if (that.state.skipValue < that.state.totalCount) {
                    var size = that.state.skipValue + that.state.limitValue;
                    that.setState({startLabel:(that.state.totalCount != 0 ? that.state.skipValue + 1 : 0)})
                    that.setState({endLabel:(that.state.totalCount <= size ? that.state.totalCount : that.state.skipValue + that.state.limitValue)})
                  } else {
                  }
                  if(data.response.result.count==0){
                    that.setState({startLabel: 0});
                    that.setState({endLabel: 0});
                  }
                  if(data.response.error) {
                    that.setState({collectionObjects:[]});
                  }
                }, error: function(jqXHR, exception) {
                }
              })
            : that.setState({totalCount:data.response.result.count});
              if (data.response.result.count < 10)
              {
                that.setState({limitValue:data.response.result.count});
                that.setState({skipValue:0});
              }
              else {
                that.setState({limitValue:that.state.limit});
                that.setState({skipValue:0});
              }
              if (that.state.skipValue < that.state.totalCount) {
                var size = that.state.skipValue + that.state.limitValue;
                that.setState({startLabel:(that.state.totalCount != 0 ? that.state.skipValue + 1 : 0)})
                that.setState({endLabel:(that.state.totalCount <= size ? that.state.totalCount : that.state.skipValue + that.state.limitValue)})
              } else {
              }
              if(data.response.result.count==0){
                that.setState({startLabel: 0});
                that.setState({endLabel: 0});
              }
            }
            if(data.response.error) {
              that.setState({collectionObjects:[]});
            }
      }, error: function(jqXHR, exception) {
      }
    });
  }

  clickHandler(){
    var that = this;
    that.setState({limitValue:parseInt(that.state.limit)});
    that.setState({skipValue:parseInt(that.state.skip)});
    var attributes = [];
    var allSelected = true;
    var currentDb = this.props.currentDb;
    var currentItem = this.props.currentItem;
    var connectionId = this.props.connectionId;
    this.state.fields.map(function(e) {
      if(e.selected){
        attributes.push(e.value);
      } else {
        allSelected = false;
      }
    });
   var url = this.props.queryType == "collection" ? Config.host+Config.service_path+'/services/'+currentDb+'/'+currentItem+'/document?query=' + this.state.query + 'db.'+currentItem+'.find(%7B%7D)&connectionId='+connectionId+'&fields=' + attributes +'&limit='+this.state.limit+'&skip='+this.state.skip+'&sortBy={'+this.state.sort+'}&allKeys=' + allSelected :
              Config.host+Config.service_path+'/services/'+currentDb+'/gridfs/'+currentItem+'/getfiles?query='+ this.state.query +'&fields=""&limit='+this.state.limit+'&skip='+this.state.skip+'&sortBy={'+this.state.sort+'}&connectionId='+connectionId;
    $.ajax({
      type: "GET",
      dataType: 'json',
      credentials: 'same-origin',
      crossDomain: false,
      url : url,
      success: function(data) {
        if(data.response.result!=undefined)
        {
          var array = data.response.result.documents;
          that.setState({collectionObjects:array});
          that.props.queryType == "collection" ? that.getAttributes(currentDb,currentItem, connectionId) : null;
          that.props.queryType == "fs" ?
              $.ajax({
              type: "GET",
              dataType: 'json',
              credentials: 'same-origin',
              crossDomain: false,
              url :  Config.host+Config.service_path+'/services/'+currentDb+'/gridfs/'+currentItem+'/count?connectionId='+connectionId,
              success: function(data) {
                that.setState({totalCount:data.response.result.count});
                if (that.state.skipValue < that.state.totalCount) {
                  var size = that.state.skipValue + that.state.limitValue;
                  that.setState({startLabel:(that.state.totalCount != 0 ? that.state.skipValue + 1 : 0)})
                  that.setState({endLabel:(that.state.totalCount <= size ? that.state.totalCount : that.state.skipValue + that.state.limitValue)})
                }
              }, error: function(jqXHR, exception) {
              }
            })
            : that.setState({totalCount:data.response.result.count});
              if (that.state.skipValue < that.state.totalCount) {
                var size = that.state.skipValue + that.state.limitValue;
                that.setState({startLabel:(that.state.totalCount != 0 ? that.state.skipValue + 1 : 0)})
                that.setState({endLabel:(that.state.totalCount <= size ? that.state.totalCount : that.state.skipValue + that.state.limitValue)})
              };
          if(data.response.error) {
            that.setState({collectionObjects:[]});
          }
        }
      }, error: function(jqXHR, exception) {
      }
     });
  }

  refresh(buttonValue){
    if( buttonValue == 'new'){
      this.clickHandler();
    }
    else{
      this.paginationHandler();
    }
    this.getAttributes(this.props.currentDb, this.props.currentItem, this.props.connectionId);
  }

  attributeHandler(r) {
    var that = this;
    var index = 0;
    var checkUncheck = function(value) {
      that.state.fields.map(function(e) {
        if(e.value == r.result.value) {
          that.setState(update(that.state.fields[index], {selected: {$set: value}}));
          ++index;
        }
      });
    }
    return function(e) {
      if(r.result.selected == true){
        r.result.selected = false;
        checkUncheck(false);
      }
      else {
        r.result.selected = true;
        checkUncheck(true);
      }
    }.bind(this);
  }

  selectAllHandler () {
    var index = 0;
    var that = this;
    return function() {
      var state = this.state.fields.map(function(d) {
        return {
          value: d.value,
          selected: true
        };
      });
      this.setState({fields:state});
    }.bind(this);
  }

  unSelectAllHandler () {
    return function() {
      var state = this.state.fields.map(function(d) {
        return {
          value: d.value,
          selected: false
        };
      });
      this.setState({fields:state});
    }.bind(this);
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

  paginationHandler(e){
    var attributes = [];
    var allSelected = true;
    this.state.fields.map(function(e) {
      if(e.selected){
        attributes.push(e.value);
      } else {
        allSelected = false;
      }
    });
    var position =''
    if(e != undefined){
      position = e.target.id;
    }
    else {
      position = '';
    }

    var skipValue = parseInt(this.state.skipValue), limitValue = parseInt(this.state.limit), countValue = parseInt(this.state.totalCount);
    if (position === "first") {
     skipValue = 0;
    } else if (position === "prev") {
      skipValue = (skipValue - limitValue) < 0 ? 0 : (skipValue - limitValue);
    } else if (position === "next") {
      skipValue = skipValue + limitValue;
    } else if (position === "last") {
      var docCountInLastPage = (countValue % limitValue == 0) ? limitValue : (countValue % limitValue);
      skipValue = countValue - docCountInLastPage;
    } else if (position === "") {
        countValue = countValue - 1;
        if (countValue != 0 && skipValue == countValue) {
          skipValue= skipValue - limitValue;
        }
    }
    var currentDb = this.props.currentDb;
    var currentItem = this.props.currentItem;
    var connectionId = this.props.connectionId;
    this.setState({skipValue:skipValue});
    var url = this.props.queryType == "collection" ? Config.host+Config.service_path+'/services/'+this.props.currentDb+'/'+this.props.currentItem+'/document?query='+this.state.query+'&connectionId='+this.props.connectionId+'&fields=' +attributes+ '&limit='+limitValue+'&skip='+skipValue+'&sortBy={'+this.state.sort+'}&allKeys=' + allSelected:
              Config.host+Config.service_path+'/services/'+currentDb+'/gridfs/'+currentItem+'/getfiles?query='+this.state.query+'&fields=""&limit='+this.state.limit+'&skip='+this.state.skip+'&sortBy={'+this.state.sort+'}&connectionId='+connectionId;

    var that = this;
    $.ajax({
      type: "GET",
      dataType: 'json',
      credentials: 'same-origin',
      crossDomain: false,
      url : url,
      success: function(data) {
        if(data.response.result!=undefined)
        {
          var array = data.response.result.documents;
          that.setState({collectionObjects:array});
        that.props.queryType == "collection" ? that.getAttributes(currentDb,currentItem, connectionId) : null;
        that.props.queryType == "fs" ?
            $.ajax({
              type: "GET",
              dataType: 'json',
              credentials: 'same-origin',
              crossDomain: false,
              url :  Config.host+Config.service_path+'/services/'+currentDb+'/gridfs/'+currentItem+'/count?connectionId='+connectionId,
              success: function(data) {
                that.setState({totalCount:data.response.result.count});
                if (that.state.skipValue < that.state.totalCount) {
                  var size = that.state.skipValue + that.state.limitValue;
                  that.setState({startLabel:(that.state.totalCount != 0 ? that.state.skipValue + 1 : 0)})
                  that.setState({endLabel:(that.state.totalCount <= size ? that.state.totalCount : that.state.skipValue + that.state.limitValue)})
                }
                else{
                  that.setState({startLabel: 0});
                  that.setState({endLabel: 0});
                }
              }, error: function(jqXHR, exception) {
              }
            })
            : that.setState({totalCount:data.response.result.count});
              if (that.state.skipValue < that.state.totalCount) {
                var size = that.state.skipValue + that.state.limitValue;
                that.setState({startLabel:(that.state.totalCount != 0 ? that.state.skipValue + 1 : 0)})
                that.setState({endLabel:(that.state.totalCount <= size ? that.state.totalCount : that.state.skipValue + that.state.limitValue)})
              }
              else{
                that.setState({startLabel: 0});
                that.setState({endLabel: 0});
              }
          if(data.response.error) {
            that.setState({collectionObjects:[]});
          }
        }
      }, error: function(jqXHR, exception) {
      }
    });
  }

  handleSelect(index){
    this.setState({selectedTab:index}, function(){
    });
  }

  render () {
    var i =0;
    var that = this;
    var items =null;
    var items = this.state.collectionObjects.map(function (collection ,i) {
      return <Document  key={collection._id["counter"] || collection._id } uId={collection._id} key1={collection._id["counter"] || collection._id} value={JSON.stringify(collection,null,4)} onChange={this.hand.bind(this)} currentDb={this.props.currentDb} currentItem={this.props.currentItem} connectionId={this.props.connectionId} refresh={this.refresh.bind(this)} queryType = {this.props.queryType} ></Document>
    }.bind(this));

    return(
      <div className = {queryExecutorStyles.mainContainer}>
        { this.props.queryType == "collection" ?
          <span><CollectionStats selectedDB={this.props.currentDb} selectedCollection={this.props.currentItem} connectionId={this.props.connectionId}></CollectionStats>
          <span className={queryExecutorStyles.deleteButton} onClick={this.openModal.bind(this)}><i className="fa fa-trash" aria-hidden="true"></i><span>Delete Collection</span></span>
          {this.state.modalIsOpen?<DeleteComponent modalIsOpen={this.state.modalIsOpen} closeModal={this.closeModal.bind(this)} title = 'collection' dbName = {this.props.currentDb} collectionName = {this.props.currentItem} connectionId={this.props.connectionId} ></DeleteComponent> : ''}
          <NewCollection queryType='collection' currentDb={this.props.currentDb} currentItem={this.props.currentItem} connectionId={this.props.connectionId} addOrUpdate={2} refreshCollectionList={this.props.refreshCollectionList.bind(this)} refreshRespectiveData = {this.props.refreshRespectiveData.bind(this)}/>
          <NewDocument currentDb={this.props.currentDb} currentItem={this.props.currentItem} connectionId={this.props.connectionId} refresh={this.refresh.bind(this,'new')} addOrEdit='Add' ></NewDocument></span>
          : <span>
            <span className={queryExecutorStyles.deleteButtonGridfs} onClick={this.openModal.bind(this)}><i className="fa fa-trash" aria-hidden="true"></i><span>Delete GridFS Bucket</span></span>
            { this.state.modalIsOpen?<DeleteComponent modalIsOpen={this.state.modalIsOpen} closeModal={this.closeModal.bind(this)} title = 'GridFS Bucket' dbName = {this.props.currentDb} gridFSName = {this.props.currentItem} connectionId={this.props.connectionId} ></DeleteComponent> : '' }
             <NewFile currentDb={this.props.currentDb} currentItem={this.props.currentItem} connectionId={this.props.connectionId} refresh={this.refresh.bind(this, 'new')}></NewFile>
            </span>
        }
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
          { this.props.queryType == "collection" ?
             <label className={queryExecutorStyles.attributesLabel}>Attributes
               <span className={queryExecutorStyles.attributesSpan}>
                 <a onClick = {this.selectAllHandler()}>Select All</a> /
                 <a onClick = {this.unSelectAllHandler()}>Unselect All</a>
               </span>
             </label>
            : null
          }
          { this.props.queryType == "collection" ?
            <div className={queryExecutorStyles.queryAttributesDiv}>
              <ol id="attributesList" className={queryExecutorStyles.attributeList}>
                { this.state.fields.map(function(result) {
                  return <li key={result.value} className={queryExecutorStyles.attributesItems}>
                  <span className={queryExecutorStyles.checkboxSpan}><input type="checkbox" id={result.value} checked={result.selected} onChange = {that.attributeHandler({result}).bind(that)}></input></span>{result.value}</li>;
                }) }
              </ol>
            </div>
            : null
          }
          <div className={this.props.queryType == "collection" ? queryExecutorStyles.parametersDiv : queryExecutorStyles.parametersDiv1}>
            <label htmlFor="skip"> Skip(No. of records) </label><br /><input id="skip" type="text" onChange = {this.skipHandler()} name="skip" value={this.state.skip} data-search_name="skip" /><br />
            <label htmlFor="limit"> Max page size: </label><br /><span><select id="limit" name="limit" onChange = {this.limitHandler()} value={this.state.limit} data-search_name="max limit" ><option value="10">10</option><option value="25">25</option><option value="50">50</option></select></span><br />
            <label htmlFor="sort"> Sort by fields </label><br /><input id="sort" type="text" onChange = {this.sortHandler()}name="sort" value={this.state.sort} data-search_name="sort" /><br /><br />
            <button id="execQueryButton" className={queryExecutorStyles.bttnNavigable} data-search_name="Execute Query" onClick = {this.clickHandler.bind(this)}>Execute Query</button>
          </div>
        </div>
        <div className={queryExecutorStyles.resultContainer} key={this.props.currentItem}>
          <Tabs selectedIndex={this.state.selectedTab} onSelect={this.handleSelect.bind(this)}>
            <TabList className={queryExecutorStyles.treeTab}>
              <Tab><span className={this.state.selectedTab==0 ? queryExecutorStyles.activeTab : ''}>JSON</span></Tab>
              <Tab><span className={this.state.selectedTab==1 ? queryExecutorStyles.activeTab : ''}>Tree Table</span></Tab>
            </TabList>
            <TabPanel>
              <div id='paginator' className={queryExecutorStyles.paginator}>
              <a id='first' className = {(this.state.skipValue == 0 || this.state.skipValue >= this.state.totalCount)? queryExecutorStyles.disabled : ''} onClick = {this.paginationHandler.bind(this)} href='javascript:void(0)' data-search_name='First'>&laquo; First</a>
              <a id='prev'  className = {(this.state.skipValue >= this.state.totalCount || this.state.skipValue + this.state.limitValue <= this.state.limitValue)? queryExecutorStyles.disabled : ''} onClick = {this.paginationHandler.bind(this)}  href='javascript:void(0)' data-search_name='Previous'>&lsaquo; Previous</a>
              <label>Showing</label>&nbsp;<label id='startLabel'></label>{this.state.startLabel}<label> - </label>
              <label id='endLabel'>{this.state.endLabel}</label>&nbsp;<label> of </label><label id='countLabel'>{this.state.totalCount}</label>
              <a id='next' className = {(this.state.skipValue >= this.state.totalCount - this.state.limitValue)? queryExecutorStyles.disabled : ''} onClick = {this.paginationHandler.bind(this)} href='javascript:void(0)' data-search_name='Next'>Next &rsaquo;</a>
              <a id='last' className = {(this.state.skipValue + this.state.limitValue >= this.state.totalCount )? queryExecutorStyles.disabled : ''} onClick = {this.paginationHandler.bind(this)} href='javascript:void(0)' data-search_name='Last'>Last &raquo;</a>
              </div>
              {items.length>0 ? items: <span className={queryExecutorStyles.exceptionContainer}>No Documents to be displayed</span>}
            </TabPanel>
            <TabPanel>
              <div id='paginator' className={queryExecutorStyles.paginator}>
                <a id='first' className = {(this.state.skipValue == 0 || this.state.skipValue >= this.state.totalCount)? queryExecutorStyles.disabled : ''} onClick = {this.paginationHandler.bind(this)} href='javascript:void(0)' data-search_name='First'>&laquo; First</a>
                <a id='prev'  className = {(this.state.skipValue >= this.state.totalCount || this.state.skipValue + this.state.limitValue <= this.state.limitValue)? queryExecutorStyles.disabled : ''} onClick = {this.paginationHandler.bind(this)}  href='javascript:void(0)' data-search_name='Previous'>&lsaquo; Previous</a>
                <label>Showing</label>&nbsp;<label id='startLabel'></label>{this.state.startLabel}<label> - </label>
                <label id='endLabel'>{this.state.endLabel}</label>&nbsp;<label> of </label><label id='countLabel'>{this.state.totalCount}</label>
                <a id='next' className = {(this.state.skipValue >= this.state.totalCount - this.state.limitValue)? queryExecutorStyles.disabled : ''} onClick = {this.paginationHandler.bind(this)} href='javascript:void(0)' data-search_name='Next'>Next &rsaquo;</a>
                <a id='last' className = {(this.state.skipValue + this.state.limitValue >= this.state.totalCount )? queryExecutorStyles.disabled : ''} onClick = {this.paginationHandler.bind(this)} href='javascript:void(0)' data-search_name='Last'>Last &raquo;</a>
              </div>
              <TreeView collectionObjects = {this.state.collectionObjects} currentDb={this.props.currentDb} currentItem={this.props.currentItem} connectionId={this.props.connectionId} refresh={this.refresh.bind(this)} queryType={this.props.queryType}></TreeView>
            </TabPanel>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default QueryExecutorComponent;
