import React from "react";
import "./Header.css";
import { Button, Modal } from "react-bootstrap";
import swal from "sweetalert";
import axios from "axios";

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
  componentDidMount() {
    this.getdetail();
  }
  getdetail() {
    axios
      .get("http://localhost:4070/app/task")
      .then(response => {
        this.setState({
          detail: response.data.data
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
  updatetask(_id, category, detail = null) {
    let body = { _id, category };
    if (detail)
      body.SnoChange = detail
        .filter(item => item.category === category)
        .map(item => {
          return {
            _id: item._id,
            Sno: item.Sno
          };
        });
    axios
      .post("http://localhost:4070/app/task/update", body)
      .then(response => {})
      .catch(err => {
        console.log(err);
      });
  }
  handleShow = () => {
    this.setState({
      setShow: true,
      show: true
    });
  };
  handleClose = (e = true) => {
    if (e) swal("No Task Added !");
    this.setState({
      show: false,
      setShow: false,
      task: "",
      category: "",
      dueDate: " "

      
      
    });
  };

  changeHandler = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  submitHandler = e => {
    this.getdetail();
    this.updatetask();
    e.preventDefault();

    axios
      .post("http://localhost:4070/app/task", this.state)
      .then(response => {
        this.setState({
          detail: [...this.state.detail, response.data]
        });
        this.handleClose(false);
      })
      .catch(err => {
        console.log(err);
      });
    this.setState({
      task: "",
      dueDate: "",
      category: ""
    });
  };

  drag = (e, item) => {
    this.setState({
      drop: item
    });
  };

  drop = (e, category, Sno, item) => {
    this.state.detail.forEach(item => {
      if (item._id === this.state.drop._id) {
        item.category = category;
      }

      if (
        Sno &&
        Object.keys(this.state.drop).length &&
        this.state.drop.Sno === item.Sno
      ) {
        item.Sno = 0;
      }

      e.preventDefault();
    });
    this.state.detail.forEach(item => {
      if (Sno && item.Sno !== 0 && item.Sno >= Sno) {
        item.Sno += 1;
      }
    });
    let NewT = this.state.detail.find(item => item.Sno === 0);
    if (NewT) {
      NewT.Sno = Sno;
    }
    this.setState({
      detail: this.state.detail.sort((a, b) => {
        return a.Sno - b.Sno;
      })
    });
    this.updatetask(this.state.drop._id, category, this.state.detail);
    e.stopPropagation();
  };
  allowdrop = e => {
    e.preventDefault();
  };

  taskDelete = _id => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this data !",
      icon: "warning",
      buttons: true,
      dangerMode: true
    }).then(willDelete => {
      if (willDelete) {
        axios
          .delete("http://localhost:4070/app/task/delete", { data: { _id } })
          .then(response => {
            this.setState({
              detail: this.state.detail.filter(item => item._id !== _id)
            });
            swal("Task Removed Successfully!", {
              icon: "success"
            });
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        swal("Your task is safe!");
      }
    });
  };
  render() {
    const { show, task, category, dueDate, detail } = this.state;
    console.log("detail", detail);
    return (
      <>
        <div className="container-fluid ">
          <div className="row header">
            <div className="col-md-12 ">
              <span style={{ fontSize: "60px" }}>
                <b> Task Manager</b>
              </span>
            </div>
          </div>
          <Modal show={show} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Add Title</Modal.Title>
            </Modal.Header>
            <form onSubmit={this.submitHandler}>
              <Modal.Body>
                Task{" "}
                <input
                  className="form-control"
                  type="text"
                  placeholder="Enter the Task"
                  name="task"
                  value={task}
                  onChange={this.changeHandler}
                  required
                ></input>
              </Modal.Body>
              <Modal.Body>
                Due Date{" "}
                <input
                  className="form-control"
                  type="date"
                  name="dueDate"
                  value={dueDate}
                  onChange={this.changeHandler}
                  required
                ></input>
              </Modal.Body>
              <Modal.Body>
                Category
                <select
                  id="inputState"
                  className="form-control"
                  name="category"
                  value={category}
                  onChange={this.changeHandler}
                  required
                >
                  <option value>Choose...</option>
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

          <div className="row Categories">
            <div className="col-md-12">
              <span className="badge badge-pill badge-light">Categories</span>
            </div>
          </div>
          <div className="row back">
            <div
              className="col-md-4 first"
              id="Urgent"
              onDrop={e => this.drop(e, "Urgent")}
              onDragOver={this.allowdrop}
            >
              <h3>Urgent</h3>

              {detail
                .filter(item => item.category === "Urgent")
                .map(item => (
                  <div
                    className="card"
                    id={item._id}
                    draggable="true"
                    onDrop={e => this.drop(e, "Urgent", item.Sno, item)}
                    onDragStart={e => this.drag(e, item)}
                  >
                    <i
                      className="fa fa-trash-o"
                      onClick={() => this.taskDelete(item._id)}
                    ></i>
                    <div className="card-body" style={{ display: "contents" }}>
                      <h5 className="card-title">Task :&nbsp;{item.task}</h5>
                      <h6 className="card-subtitle mb-2 text-muted">
                        Due Date :&nbsp; {item.dueDate}
                      </h6>
                    </div>
                    <span className="createdate">
                      &nbsp;<i className="fa fa-clock-o"></i> &nbsp;Task Added
                      on :{item.creationDate}{" "}
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
              <h3>Important</h3>
              {detail
                .filter(item => item.category === "Important")
                .map(item => (
                  <div
                    className="card"
                    id={item._id}
                    draggable="true"
                    onDrop={e => this.drop(e, "Important", item.Sno, item)}
                    onDragStart={e => this.drag(e, item)}
                  >
                    <i
                      className="fa fa-trash-o delete"
                      onClick={() => this.taskDelete(item._id)}
                    ></i>
                    <div className="card-body" style={{ display: "contents" }}>
                      <h5 className="card-title">Task :&nbsp;{item.task}</h5>
                      <h6 className="card-subtitle mb-2 text-muted">
                        Due Date :&nbsp; {item.dueDate}
                      </h6>
                    </div>
                    <i className="far fa-clock"></i>
                    <span className="createdate">
                      &nbsp;<i className="fa fa-clock-o"></i> &nbsp;Task Added
                      on :{item.creationDate}{" "}
                    </span>
                  </div>
                ))}
            </div>
            <div
              className="col-md-4 first "
              id="Others"
              onDrop={e => this.drop(e, "Others")}
              onDragOver={this.allowdrop}
            >
              <h3>Others</h3>
              {detail
                .filter(item => item.category === "Others")
                .map(item => (
                  <div
                    className="card"
                    id={item._id}
                    draggable="true"
                    onDrop={e => this.drop(e, "Others", item.Sno, item)}
                    onDragStart={e => this.drag(e, item)}
                  >
                    <i
                      className="fa fa-trash-o"
                      onClick={() => this.taskDelete(item._id)}
                    ></i>
                    <div className="card-body" style={{ display: "contents" }}>
                      <h5 className="card-title">Task :&nbsp;{item.task}</h5>
                      <h6 className="card-subtitle mb-2 text-muted">
                        Due Date :&nbsp; {item.dueDate}
                      </h6>
                    </div>
                    <span className="createdate">
                      &nbsp;<i className="fa fa-clock-o"></i> &nbsp;Task Added
                      on :{item.creationDate}{" "}
                    </span>
                  </div>
                ))}
            </div>

            <hr></hr>
            <Button
              type="button"
              className="addtask mybutton"
              onClick={this.handleShow}
            >
              <i className="fa fa-plus" aria-hidden="true"></i>&nbsp;
            </Button>
          </div>
        </div>
      </>
    );
  }
}
export default Header;
