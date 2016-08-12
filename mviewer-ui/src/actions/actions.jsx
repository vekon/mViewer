/*
This module contains action creators. They are functions which will return an object describing the actions.
These actions are imported by Redux-aware components who need them, in our case it is just Home.
*/

module.exports = {
	getConnectionId: function(){
		// A normal action creator, returns a simple object describing the action.
		return {type: 'GETCONNECTIONID'};
	}
	};
