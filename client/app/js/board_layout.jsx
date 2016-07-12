/*jshint esversion: 6 */
import React from 'react';
import AppBar from 'material-ui/AppBar';
import MyMenu from './menu';
import Layout from './layout';
import ColumnDialog from './column_dialog';

class BoardLayout extends Layout  {
  constructor(props) {
    super(props);
    this.state = {menu_open: false, story_open: false};
    this.menu_items = [
      {
        name: "Add Story",
        handler: this.handleStorydAdd
      },
      {
        name: "Add Column",
        handler: this.handleColumnAdd
      }
    ]
  }

  handleStorydAdd = () => {
  }

  handleColumnAdd = () => {
    this.setState({menu_open: false, story_open: true});
  }

  handleColumnAddClose = (reload) => {
    if(reload) {
      this.props.boardReloadHandler();
    }
    this.setState({menu_open: false, story_open: false});
  }

  handleTouchTapMenuBtn = (event) => {
    event.preventDefault();
    this.setState({menu_open: true, menu_achor: event.currentTarget});
  }

  handleTouchTapCloseMenu = () => {
    var achor_element = this.state.menu_achor;
    this.setState({menu_open: false, menu_achor: achor_element});
  }

  render() {
    return <div>
      <AppBar
        title={this.props.title}
        iconClassNameRight="muidocs-icon-navigation-expand-more"
        onLeftIconButtonTouchTap={this.handleTouchTapMenuBtn}
      />
      <MyMenu open={this.state.menu_open} achor={this.state.menu_achor}
        touchAwayHandler={this.handleTouchTapCloseMenu} items={this.menu_items}/>
      <ColumnDialog board_id={this.props.board_id} open={this.state.story_open}
        handleClose={this.handleColumnAddClose}/>
      {this.props.children}
     </div>
  }
}

export default BoardLayout;