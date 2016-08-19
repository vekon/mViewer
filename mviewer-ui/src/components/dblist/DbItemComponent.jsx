import React from 'react'
import dbListStyles from './dblist.css'
import $ from 'jquery'
class DbItemComponent extends React.Component {

 constructor(props) {
      super(props);
      this.state = {
          hover_flag: false
      }
  }

  render () {
         return (
             <div className={(this.props.isSelected ? dbListStyles.menuItem +' ' +dbListStyles.highlight :dbListStyles.menuItem)} key={this.props.name} >
               <span>
                 <i className="fa fa-database" aria-hidden="true"></i>
               </span>
               <button onClick={this.props.onClick} value={this.props.name}>{this.props.name}</button>
            </div>
         );
     }

  }
  DbItemComponent.getDefaultProps = {
          isSelected: false
  }
  DbItemComponent.propTypes = {
         onClick: React.PropTypes.func.isRequired,
         isSelected: React.PropTypes.bool
     }

export default DbItemComponent;
