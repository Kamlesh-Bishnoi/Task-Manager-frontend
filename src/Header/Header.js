import React from 'react';
import './Header.css';

class Header extends React.Component {
    render() {
        return (
            <>
                <div className="header">
                    Task Manager
      <button type="button" className="btn  circle" onClick={this.modal}>+ Add Task</button>
                </div>
            </>
        )
    }
}

export default Header;
