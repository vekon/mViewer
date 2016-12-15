import React from 'react';
import databaseTabsStyles from './database-tabs.css';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
import {Tabs, Tab} from 'react-draggable-tab';
import { browserHistory } from 'react-router';
import CollectionsComponent from '../collections/CollectionsComponent.jsx';

//allow react dev tools work
window.React = React;

const tabsClassNames = {
  tabWrapper : databaseTabsStyles.myWrapper,
  tabBar : databaseTabsStyles.myTabBar,
  tabBarAfter : databaseTabsStyles.myTabBarAfter,
  tab : databaseTabsStyles.myTab,
  tabTitle : databaseTabsStyles.myTabTitle,
  tabCloseIcon : databaseTabsStyles.tabCloseIcon,
  tabBefore : databaseTabsStyles.myTabBefore,
  tabAfter : databaseTabsStyles.myTabAfter,
  tabActive : databaseTabsStyles.myTabActive
};

const tabsStyles = {
  tabWrapper : {marginTop : '0px'},
  tabBar : {},
  tab : {},
  tabTitle : {},
  tabCloseIcon : {},
  tabBefore : {},
  tabAfter : {},
  tabActive : {}
};

class DatabaseTabsComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tabs : [
        (<Tab key={'tab1'} title={this.props.location.query.db} >
          <CollectionsComponent propss = {this.props} closeDbTab = {this.closeDbTab} ref='child' />
        </Tab>)
      ],
      badgeCount : 0,
      menuPosition : {},
      showMenu : false,
      currentDb : this.props.location.query.db
    };
  }

  handleTabSelect(e, key, currentTabs) {
    var selectedTabObject = null;
    for (let i = 0; i < currentTabs.length; i++) {
      if (currentTabs[i].key === key) {
        selectedTabObject = currentTabs[i];
        break;
      }
    }
    if(selectedTabObject != null) {
      sessionStorage.setItem('selectedTabTitle', JSON.stringify(selectedTabObject.props.title));
      sessionStorage.setItem('selectedTabKey', JSON.stringify(selectedTabObject.key));
      this.setState({currentDb : selectedTabObject.props.title});
      this.props.changeDbName();
      this.setState({selectedTab : key, tabs : currentTabs});
    }
  }

  handleTabClose(e, key, currentTabs) {
    this.setState({tabs : currentTabs});
    if (currentTabs.length === 0 ) {
      browserHistory.push({ pathname : '/dashboard/home', query : { collapsed : false} });
    }
  }


  closeDbTab = () => {
    this.closeTab();
  }

  closeTab() {
    let currentTabs = this.state.tabs;
    if (currentTabs.length === 1 || typeof(sessionStorage.getItem('selectedTabTitle')) == 'undefined') {
      browserHistory.push({ pathname : '/dashboard/home', query : { collapsed : false} });
    } else{
      let tabTitle = JSON.parse(sessionStorage.getItem('selectedTabTitle'));
      currentTabs = currentTabs.filter(function(tab) {
        return tab.props.title !== tabTitle;
      });
      this.setState({tabs : currentTabs});
      if(currentTabs.length === 0) {
        browserHistory.push({ pathname : '/dashboard/home', query : { collapsed : false} });
      } else{
        browserHistory.push({ pathname : '/dashboard/database', query : { collapsed : false} });
      }
    }
  }

  handleTabPositionChange(e, key, currentTabs) {
    this.setState({tabs : currentTabs});
  }


  handleTabContextMenu(key, e) {
    e.preventDefault();
    this.setState({
      showMenu : true,
      contextTarget : key,
      menuPosition : {
        top : `${e.pageY}px`,
        left : `${e.pageX}px`
      }
    });
  }


  shouldTabClose() {
    return true;
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.location.query.db !== this.props.location.query.db && typeof(nextProps.location.query.db) != 'undefined') {
      const key = 'newTab_' + Date.now();
      let newTab = (<Tab key={key} title={nextProps.location.query.db} >
                    <CollectionsComponent propss = {nextProps} closeDbTab = {this.closeDbTab} />
                  </Tab>);
      let previousTabs = this.state.tabs;
      let newTabs = previousTabs.concat([newTab]);
      this.setState({
        tabs : newTabs,
        selectedTab : key
      });
      this.setState({currentDb : nextProps.location.query.db});
      sessionStorage.setItem('selectedTabTitle', JSON.stringify(nextProps.location.query.db));
      sessionStorage.setItem('selectedTabKey', JSON.stringify(key));
    }
  }



  componentDidMount () {

  }

  render() {
    return (

      <div className={this.props.location.query.collapsed === 'false' ? databaseTabsStyles.mainContainer + ' collectionsContainer col-lg-10  col-sm-9 col-xs-8 col-md-9' : databaseTabsStyles.mainContainer + ' collectionsContainer col-lg-11  col-sm-11 col-xs-10 col-md-11 ' + databaseTabsStyles.collapsedContainer}>
        <Tabs
          tabsClassNames={tabsClassNames}
          tabsStyles={tabsStyles}
          selectedTab={this.state.selectedTab ? this.state.selectedTab : 'tab1'}
          onTabSelect={this.handleTabSelect.bind(this)}
          onTabClose={this.handleTabClose.bind(this)}
          onTabPositionChange={this.handleTabPositionChange.bind(this)}
          shouldTabClose={this.shouldTabClose.bind(this)}
          tabs={this.state.tabs}
          shortCutKeys={
            {
              'close' : ['alt+command+w', 'alt+ctrl+w'],
              'create' : ['alt+command+t', 'alt+ctrl+t'],
              'moveRight' : ['alt+command+tab', 'alt+ctrl+tab'],
              'moveLeft' : ['shift+alt+command+tab', 'shift+alt+ctrl+tab']
            }
          }
          keepSelectedTab={true}
        />
      </div>
    );
  }
}

DatabaseTabsComponent.propTypes = {
  location : React.PropTypes.object,
  changeDbName : React.PropTypes.func
};

export default DatabaseTabsComponent;