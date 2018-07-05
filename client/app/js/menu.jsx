/*jshint esversion: 6 */
import React from 'react';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import BoardActions from './actions/BoardActions';
import BoardStore from './store/BoardStore';

class MyMenu extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.getState();
  }

  getState = () => {
    if (this.props.landing) {
      var menue_items = [
        {
          name: "Add Board",
          action: BoardActions.openBoardDialog
        },
        {
          name: "Board List",
          action: BoardActions.showBoardList
        },
      ];
      if (BoardStore.getLoggedin() || document.cookie.length > 0) {
        menue_items.push(
          {
            name: "Manage Users",
            action: BoardActions.showUserManage
          },
          {
            name: "User Assgin",
            action: BoardActions.showUserAssign
          },
          {
            name: "Logout",
            action: BoardActions.logoutUser
          });
      } else {
        menue_items.push(
          {
            name: "Login",
            action: BoardActions.showLogin
          });
      }
      return { menue: menue_items };
    } else {
      var menu_items = [
        {
          name: "Add Task",
          action: BoardActions.showTaskDialog
        },
        {
          name: "Add Story",
          action: BoardActions.openStoryEditDialog
        },
        {
          name: "Add Story from Issue ID",
          action: BoardActions.openStoryFromIssueEditDialog
        },
        {
          name: "Add Column",
          action: BoardActions.showColumnDialog
        },
        {
          name: "Sprint Burndown",
          action: BoardActions.showChartDialog
        },
        {
          name: "Definition of Done",
          action: BoardActions.showDodDialog
        },
        {
          name: "Archived Stories",
          action: BoardActions.showArchivedStories
        }
      ];
      return { menue: menu_items };
    }
  }

  handle_menue_action = (action) => {
    BoardActions.toggleBoardMenu();
    action();
  }

  _onChange = () => {
    this.setState(this.getState());
  }

  componentWillUnmount = () => {
    BoardStore.removeChangeListener(this._onChange);
  }

  componentDidMount = () => {
    BoardStore.addChangeListener(this._onChange);
  }

  render() {
    return (
      <div>
        <Popover
          open={this.props.open}
          anchorEl={this.props.achor}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.props.touchAwayHandler}
        >
          <Menu>
            {this.getState().menue.map((item, key) => {
              return <MenuItem
                key={key}
                primaryText={item.name}
                onTouchTap={this.handle_menue_action.bind(this, item.action)}
              />;
            })}
          </Menu>
        </Popover>
      </div>
    );
  }
}
export default MyMenu;
