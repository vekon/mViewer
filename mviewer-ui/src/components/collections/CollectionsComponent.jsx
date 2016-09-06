import React from 'react'
import collectionsStyles from './collections.css'
import NewCollection from '../newcollection/newCollectionComponent.jsx'
import NewDocument from '../newdocument/newDocumentComponent.jsx'
import QueryExecutor from '../queryexecutor/QueryExecutorComponent.jsx'
import $ from 'jquery'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

class CollectionsComponent extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
        selectedTab : 0
      }
  }

  handleSelect(index){
    this.setState({selectedTab:index}, function(){
    });
  }

  componentWillReceiveProps(){
    this.setState({selectedTab:0});
  }

  render () {
    return(
      <div className = {collectionsStyles.mainContainer}>
        <ul className={collectionsStyles.breadCrumb}>
          <li><a href="#">{this.props.location.query.db}</a></li>
          <li><a href="#">{this.props.location.query.collection}</a></li>
        </ul>
        <Tabs selectedIndex={this.state.selectedTab} onSelect={this.handleSelect.bind(this)}>
          <TabList>
            <Tab>Query Executor</Tab>
            <Tab>Add Document</Tab>
            <Tab>Update Collection</Tab>
            <Tab>Statistics</Tab>
          </TabList>
          <TabPanel>
            <QueryExecutor ref='right' queryType= {this.props.location.query.queryType} currentDb={this.props.location.query.db} currentItem={this.props.location.query.collection} connectionId={this.props.connectionId}></QueryExecutor>
          </TabPanel>
          <TabPanel>
            <NewDocument currentDb={this.props.location.query.db} currentItem={this.props.location.query.collection} connectionId={this.props.connectionId}></NewDocument>
          </TabPanel>
          <TabPanel>
            <NewCollection queryType= {this.props.location.query.queryType} currentDb={this.props.location.query.db} currentItem={this.props.location.query.collection} connectionId={this.props.connectionId} addOrUpdate={this.state.selectedTab} />
          </TabPanel>
          <TabPanel>
            <h2>Statistics</h2>
          </TabPanel>
      </Tabs>
      </div>
    );
  }
}

export default CollectionsComponent;
