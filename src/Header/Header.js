import React from "react";
import "./Header.css";
import ReactDOM from "react-dom";
import { Button, Modal } from "react-bootstrap";
import { Dropdown, MenuItem, DropdownButton } from "react-bootstrap";


class Header extends React.Component {
    constructor() {
        super();
        this.state = {
            show: false,
            setShow: false
        }
    }
    handleShow = () => {
        this.setState({
            setShow: true,
            show: true
        })
    }
    handleClose = () => {
        this.setState({
            show: false,
            setShow: false
        })
    }


    render() {
        const { show } = this.state;
        return (
            <>
                <div className="header">
                    Task Manager
          <Button type="button" className="addtask" onClick={this.handleShow} >+ Add Task</Button>
                    <Modal show={show} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add Title</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Task <input class="form-control" type="text" placeholder="Enter the Task" ></input></Modal.Body>
                        <Modal.Body>Due Date  <input class="form-control" type="datetime-local" id="birthdaytime" name="birthdaytime"></input></Modal.Body>
                        <Modal.Body>Category<select id="inputState" class="form-control">
                            <option selected>Choose...</option>
                            <option>Urgent</option>
                            <option>Important</option>
                            <option>Others</option>
                        </select></Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={this.handleClose}>
                                Submit
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </>
        );
    }
}
export default Header;