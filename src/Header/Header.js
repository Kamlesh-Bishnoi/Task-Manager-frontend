import React from "react";
import "./Header.css";
import { Button, Modal } from "react-bootstrap";
import axios from 'axios';

class Header extends React.Component {
    constructor() {
        super();
        this.state = {
            show: false,
            setShow: false,
            task:"",
            category:"",
            dueDate:''
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
changeHandler=(e)=>{
    this.setState({[e.target.name]:e.target.value})
}
submitHandler=e=>{
    e.preventDefault();
    console.log(this.state);
    axios.post("http://localhost:4070/app/task",this.state)
    .then(response=>{
        console.log(response);
    })
    .catch(err=>{
        console.log(err);
    })
   
}
componentDidMount(){
    axios.get("http://localhost:4070/app/task")
    .then(response=>{
        console.log("response from get api",response);
    })
    .catch(err=>{
        console.log(err);
    })
}

    render() {
        const { show,task,category,dueDate } = this.state;
        return (
            <>
                <div className="header">
                    Task Manager
          <Button type="button" className="addtask" onClick={this.handleShow} >+ Add Task</Button>
                    <Modal show={show} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add Title</Modal.Title>
                        </Modal.Header>
                        <form onSubmit={this.submitHandler}>
                        <Modal.Body>Task <input class="form-control" type="text" placeholder="Enter the Task" name="task" value={task} onChange={this.changeHandler} ></input></Modal.Body>
                        <Modal.Body>Due Date  <input class="form-control" type="date"  name="dueDate" value={dueDate} onChange={this.changeHandler}></input></Modal.Body>
                        <Modal.Body>Category<select id="inputState" class="form-control" name="category" value={category} onChange={this.changeHandler}>
                            <option selected>Choose...</option>
                            <option>Urgent</option>
                            <option>Important</option>
                            <option>Others</option>
                        </select> </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={this.handleClose} type="submit">
                                Submit
                            </Button>
                        </Modal.Footer>
                        </form>
                        {/* <Modal.Footer>
                            <Button variant="secondary" onClick={this.handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={this.handleClose} type="submit">
                                Submit
                            </Button>
                        </Modal.Footer> */}
                    </Modal>
                </div>
            </>
        );
    }
}
export default Header;