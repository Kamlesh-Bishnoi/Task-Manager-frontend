import React from "react";
import "./Header.css";
import { Button, Modal } from "react-bootstrap";
import swal from "sweetalert";
import axios from "axios";
import PropTypes from "prop-types";

class Header extends React.Component {
  constructor() {
    super();
    this.state = {
      show: false,
      setShow: false,
      task: "",
      category: "",
      dueDate: " ",
      detail: [],
      drop: {}
    };
  }
  getdetail() {
    axios
      .get("http://localhost:4070/app/task")
      .then(response => {
        console.log("response.data.data", response.data.data);
        this.setState({
          detail: response.data.data
        });
        console.log("response from get api", response);
      })
      .catch(err => {
        console.log(err);
      });
  }
  updatetask(_id, category) {
    axios
      .post("http://localhost:4070/app/task/update", { _id, category })
      .then(response => {
        console.log("response.data.data", response.data.data);
        console.log("response from get api", response);
      })
      .catch(err => {
        console.log(err);
      });
    window.location.reload(false);
  }
  handleShow = () => {
    this.setState({
      setShow: true,
      show: true
    });
  };
  handleClose = () => {
    swal("No Task Added !");
    this.setState({
      show: false,
      setShow: false
    });
  };

  changeHandler = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  submitHandler = e => {
    this.getdetail();
    this.updatetask();
    e.preventDefault();
    console.log(this.state);

    this.setState({
      task: "",
      dueDate: "",
      category: ""
    });
    axios
      .post("http://localhost:4070/app/task", this.state)
      .then(response => {
        console.log(response);
      })
      .catch(err => {
        console.log(err);
      });
  };
  changeHandler = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  submitHandler = e => {
    this.getdetail();
    // e.preventDefault();
    console.log(this.state);
    axios
      .post("http://localhost:4070/app/task", this.state)
      .then(response => {
        console.log(response);
      })
      .catch(err => {
        console.log(err);
      });
  };

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
  drag = (e, item) => {
    console.log("draggg", e, item);
    this.setState({
      drop: item
    });
  };
  noAllowDrop = e => {
    console.log("noAllowDrop", e);
    e.stopPropagation();
  };
  drop = (e, category) => {
    console.log("Drop", e);
    console.log("drop vari", this.state.drop);
    console.log("cat", category);

    this.state.detail.forEach(item => {
      if (item._id === this.state.drop._id) {
        item.category = category;
      }
      e.preventDefault();
    });
    this.updatetask(this.state.drop._id, category);
    console.log("detail", this.state.detail);
  };
  allowdrop = e => {
    console.log("AllowDrop", e);
    e.preventDefault();
  };
  render() {
    console.log("detatatat", this.state.detail);
    const { show, task, category, dueDate, detail } = this.state;
    return (
      <>
        <div className="header">
          <span style={{ fontFamily: "Times New Roman", marginLeft: "170px" }}>
            Task Manager
          </span>
          <Button type="button" className="addtask" onClick={this.handleShow}>
            + Add Task
          </Button>
          <Modal show={show} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Add Title</Modal.Title>
            </Modal.Header>
            <form onSubmit={this.submitHandler}>
              <Modal.Body>
                Task{" "}
                <input
                  class="form-control"
                  type="text"
                  placeholder="Enter the Task"
                  name="task"
                  value={task}
                  onChange={this.changeHandler}
                ></input>
              </Modal.Body>
              <Modal.Body>
                Due Date{" "}
                <input
                  class="form-control"
                  type="date"
                  name="dueDate"
                  value={dueDate}
                  onChange={this.changeHandler}
                ></input>
              </Modal.Body>
              <Modal.Body>
                Category
                <select
                  id="inputState"
                  class="form-control"
                  name="category"
                  value={category}
                  onChange={this.changeHandler}
                >
                  <option selected>Choose...</option>
                  <option>Urgent</option>
                  <option>Important</option>
                  <option>Others</option>
                </select>{" "}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.handleClose}>
                  Close
                </Button>
                <Button variant="primary" type="submit">
                  Add
                </Button>
              </Modal.Footer>
            </form>
          </Modal>
          <div className="container-fluid back">
            <span class="badge badge-pill badge-light">Categories</span>
            <div className="row">
              <div
                className="col-md-4 first"
                id="Urgent"
                onDrop={e => this.drop(e, "Urgent")}
                onDragOver={this.allowdrop}
              >
                {this.props.children}
                <h3>Urgent</h3>
                {detail
                  .filter(item => item.category === "Urgent")
                  .map(item => (
                    <div
                      className="card"
                      id={item._id}
                      draggable="true"
                      onDragStart={e => this.drag(e, item)}
                      onDragOver={this.noAllowDrop}
                    >
                      {this.props.children}
                      <div className="card-body">
                        <h5 className="card-title">{item.task}</h5>
                        <h6 className="card-subtitle mb-2 text-muted">
                          {item.dueDate}
                        </h6>
                      </div>
                      <span className="createdate">
                        &nbsp;<i class="fa fa-clock-o"></i> &nbsp;Task Added on
                        :{item.creationDate}{" "}
                      </span>
                    </div>
                  ))}
              </div>
              <div
                className="col-md-4 first"
                id="Important"
                onDrop={e => this.drop(e, "Important")}
                onDragOver={this.allowdrop}
              >
                {this.props.children}
                <h3>Important</h3>
                {detail
                  .filter(item => item.category === "Important")
                  .map(item => (
                    <div
                      className="card"
                      id={item._id}
                      draggable="true"
                      onDragStart={e => this.drag(e, item)}
                      onDragOver={this.noAllowDrop}
                    >
                      <div className="card-body">
                        <h5 className="card-title">{item.task}</h5>
                        <h6 className="card-subtitle mb-2 text-muted">
                          {item.dueDate}
                        </h6>
                      </div>
                      <i class="far fa-clock"></i>
                      <span className="createdate">
                        &nbsp;<i class="fa fa-clock-o"></i> &nbsp;Task Added on
                        :{item.creationDate}{" "}
                      </span>
                    </div>
                  ))}
              </div>
              <div
                className="col-md-4 first"
                id="Others"
                onDrop={e => this.drop(e, "Others")}
                onDragOver={this.allowdrop}
              >
                {this.props.children}
                <h3>Others</h3>
                {detail
                  .filter(item => item.category === "Others")
                  .map(item => (
                    <div
                      className="card"
                      id={item._id}
                      draggable="true"
                      onDragStart={e => this.drag(e, item)}
                      onDragOver={this.noAllowDrop}
                    >
                      <div className="card-body">
                        <h5 className="card-title">{item.task}</h5>
                        <h6 className="card-subtitle mb-2 text-muted">
                          {item.dueDate}
                        </h6>
                      </div>
                      <span className="createdate">
                        &nbsp;<i class="fa fa-clock-o"></i> &nbsp;Task Added on
                        :{item.creationDate}{" "}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
            <hr></hr>
          </div>
        </div>
      </>
    );
  }
}
Header.proTypes = {
  id: PropTypes.string,
  children: PropTypes.node
};
export default Header;
