import React from 'react'
import GridFSListStyles from '../shared/listpanel.css'
import $ from 'jquery'
class GridFSItemComponent extends React.Component {

 constructor(props) {
   super(props);
   this.state = {
     hover_flag: false
   }
  }

  render () {
    return (
      <div className={(this.props.isSelected ? GridFSListStyles.menuItem +' ' +GridFSListStyles.highlight :GridFSListStyles.menuItem)} key={this.props.name} onClick={this.props.onClick} value={this.props.name} >
        <span>
          <i className="fa fa-folder-open-o" aria-hidden="true"></i>
        </span>
        <button>{this.props.name}</button>
      </div>
    );
  }
}
GridFSItemComponent.getDefaultProps = {
  isSelected: false
}
GridFSItemComponent.propTypes = {
  onClick: React.PropTypes.func.isRequired,
  isSelected: React.PropTypes.bool
}

export default GridFSItemComponent;
