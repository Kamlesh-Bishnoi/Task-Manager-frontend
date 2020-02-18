import React from "react";
import "./Header.css";
import { Button, Modal } from "react-bootstrap";
import swal from 'sweetalert';
import axios from 'axios';

class Header extends React.Component {
    constructor() {
        super();
        this.state = {
            show: false,
            setShow: false,
            task: "",
            category: "",
            dueDate: " ",
            detail:[]
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

    changeHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }
    submitHandler = e => {
        e.preventDefault();
        console.log(this.state);
        swal("Task Added Successfully !");
        this.setState({
            task: '',
            dueDate: '',
            category: ''
          
        })
        axios.post("http://localhost:4070/app/task",this.state)
        .then(response=>{
            console.log(response);
        })
        .catch(err=>{
            console.log(err);
        })

    }
    changeHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }
    submitHandler = e => {
       
        this.getdetail();
        // e.preventDefault();
        console.log(this.state);
        axios.post("http://localhost:4070/app/task", this.state)
            .then(response => {
                console.log(response);
            })
            .catch(err => {
                console.log(err);
            })
          
    }
    getdetail(){
           axios.get("http://localhost:4070/app/task")
            .then(response => {
                console.log("response.data.data", response.data.data);
                this.setState({
                    detail:response.data.data
                })
                console.log("response from get api", response);
            })
            .catch(err => {
                console.log(err);
            })
    }
    componentDidMount() {
        this.getdetail();
        // axios.get("http://localhost:4070/app/task")
        //     .then(response => {
        //         console.log("response.data.data", response.data.data);
        //         this.setState({
        //             detail:response.data.data
        //         })
        //         console.log("response from get api", response);
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     })
    }
       
    render() {
        console.log("detatatat",this.state.detail);
        const { show, task, category, dueDate,detail } = this.state;
        return (
            <>
                <div className="header">
                    <span style={{ fontFamily: "Times New Roman", marginLeft: "170px" }}>Task Manager</span>                    
                    <Button type="button" className="addtask" onClick={this.handleShow} >+ Add Task</Button>
                   
                    <Modal show={show} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add Title</Modal.Title>
                        </Modal.Header>
                        <form onSubmit={this.submitHandler}>
                            <Modal.Body>Task <input class="form-control" type="text" placeholder="Enter the Task" name="task" value={task} onChange={this.changeHandler} ></input></Modal.Body>
                            <Modal.Body>Due Date  <input class="form-control" type="date" name="dueDate" value={dueDate} onChange={this.changeHandler}></input></Modal.Body>
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
                    </Modal>
                   
                    <div className="container-fluid back">
                    <span class="badge badge-pill badge-dark">Categories</span>
                        <div className="row">
                            <div className="col-md-4 first">
                                      <h3>Urgent</h3>
                                      {detail.filter(item=>item.category==="Urgent").map(item=>(
                                      <div className="card">
                                          <div className="card-body">
                                              <h5 className="card-title">{item.task}</h5>
                                              <h6 className="card-subtitle mb-2 text-muted">{item.dueDate}</h6>
                                          </div>
                                      </div>
                                      
                                ))}
                            </div>
                            <div className="col-md-4 first">
                               
                                
                                      <h3>Important</h3>

                                      {detail.filter(item=>item.category==="Important").map(item=>(
                                      <div className="card">
                                          <div className="card-body">
                                              <h5 className="card-title">{item.task}</h5>
                                              <h6 className="card-subtitle mb-2 text-muted">{item.dueDate}</h6>
                                          </div>
                                      </div>
                                ))}
                            </div>
                            <div className="col-md-4 first">
                               
                                
                               <h3>Others</h3>

                               {detail.filter(item=>item.category==="Others").map(item=>(
                               <div className="card">
                                   <div className="card-body">
                                       <h5 className="card-title">{item.task}</h5>
                                       <h6 className="card-subtitle mb-2 text-muted">{item.dueDate}</h6>
                                   </div>
                               </div>
                         ))}
                     </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
export default Header;